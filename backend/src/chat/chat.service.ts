import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {
    }

    async createChannel(body, idUser: number) {
        const room = await this.prisma.room.create({
            data: {
                name: body.name,
                description: body.description,
                type: body.type,
                password: body.password,
            },
        });
        await this.prisma.membership.create({
            data: {
                room: {
                    connect: {
                        id: room.id
                    }
                },
                user: {
                    connect: {
                        id: idUser
                    }
                },
                isOwner: true,
                isAdmin: true,
            }
        });
        await this.prisma.conversation.create({
            data: {
                type: 'channel',
                room: {
                    connect: {
                        id: room.id,
                    },
                },
            },
        });
    }

    async getAllChannelByUserId(idUser: number) {

        const room = await this.prisma.user.findUnique({
            where: {
                id: idUser
            },
            include: {
                memberships: {
                    select: {
                        room: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })
        const allRoom = room.memberships.map(membership => membership.room);
        return room;
    }

    async joinChannel(idUser: number, idRoom: number) {
        await this.prisma.membership.create({
            data: {
                room: {
                    connect: {
                        id: idRoom,
                    }
                },
                user: {
                    connect: {
                        id: idUser,
                    }
                },
                isOwner: false,
                isAdmin: false,
                isBanned: false,
            }
        });
    }

    async sendMessageToChannel(body, idRoom: number, idUser: number) {
        let Conversation = await this.prisma.conversation.findUnique({
            where: {
                type: 'channel',
                roomId: idRoom
            }
        });
        Conversation = await this.prisma.conversation.update({
            where: {
                id: Conversation.id
            },
            data: {
                participants: {
                    connect: {
                        id: idUser
                    }
                },
            }
        });
        await this.prisma.message.create({
            data: {
                content: body.content,
                sender: {
                    connect: {
                        id: idUser
                    }
                },
                chat: {
                    connect: {
                        id: Conversation.id
                    }
                }
            }
        });
    }

    async getallMessagesChannel(idUser: number, idRoom: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: idUser,
            },
            include: {
                conversations: {
                    where: {
                        roomId: idRoom
                    },
                    select: {
                        messages: true
                    },
                },
            }
        })
        return await user.conversations[0]?.messages
    }



    async sendDirectMessage(body, idSender: number, idReceiver: number) {
        let conversation = await this.prisma.conversation.findFirst({
            where: {
                type: 'direct',
                participants: {
                    every: {
                        id: {
                            in: [idSender, idReceiver]
                        },
                    },
                },
            },
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: {
                    type: 'direct',
                    participants: {
                        connect: [
                            {
                                id: idSender
                            },
                            {
                                id: idReceiver
                            },
                        ],
                    }
                }
            })
        }
        const msg = await this.prisma.message.create({
            data: {
                content: body.content,
                sender: {
                    connect: {
                        id: idSender
                    }
                },
                chat: {
                    connect: {
                        id: conversation.id
                    }
                }
            }
        })
        await this.prisma.conversation.update({
            where: {
                id: conversation.id
            },
            data: {
                updatedAt: msg.createdAt
            }
        })
    }

    async getConversationDirect(idSender: number, idReceiver: number) {
        let conversation = await this.prisma.conversation.findFirst({
            where: {
                type: 'direct',
                participants: {
                    every: {
                        id: {
                            in: [idSender, idReceiver]
                        },
                    },
                },
            },
            select: {
                messages: true
            }
        });
        if (!conversation)
            throw new NotFoundException('messages is empty')

        const sortedMessages = conversation.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return await conversation.messages;

    }


    async deleteConversationDirect(idSender: number, idReceiver: number) {
        let conversation = await this.prisma.conversation.findFirst({
            where: {
                type: 'direct',
                participants: {
                    every: {
                        id: {
                            in: [idSender, idReceiver]
                        },
                    },
                },
            },
            select: {
                id: true
            }
        });
        await this.prisma.conversation.delete({
            where: {
                id: conversation.id,
            }
        })
    }

    async getConversationListDirect(idUser: number, type: string) {
        let conversation = await this.prisma.conversation.findMany({

            where: {
                type: type,
                participants: {
                    some: {
                        id: idUser,
                    },
                },
            },
            select: {
                participants: {
                    select: {
                        id: true,
                        foto_user: true,
                        username: true,
                    }
                },
                updatedAt: true,
            }
        });

        const result = conversation.map((item) => {
            const updatedParticipants = item.participants.filter((participant) => participant.id !== idUser);

            return {
                updatedAt: item.updatedAt,
                id: updatedParticipants.length > 0 ? updatedParticipants[0].id : null,
                username: updatedParticipants.length > 0 ? updatedParticipants[0].username : null,
                foto_user: updatedParticipants.length > 0 ? updatedParticipants[0].foto_user : null,
            };
        });
        result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return await result
    }
}
