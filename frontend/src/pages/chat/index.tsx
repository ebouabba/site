import Conversation from "@/components/chat/conversation";
import ConversationList from "@/components/chat/conversationList";
import Edit from "@/components/chat/edit";
import { AppProps, messageProps, userProps } from '@/interface/data';
import { useEffect, useState } from "react";
import { Socket } from "socket.io";
import { io } from "socket.io-client";

export default function index({ users,amis }: AppProps) {
  const userData = { id: 0, createdAt: "", updatedAt: "", email: "", hash: "", username: "", firstName: "", lastName: "", foto_user: "", isOnline: false, userId: 0, flag: false, flag1: false, room: '' }
  const [currentUser, setCurrentUser] = useState<userProps>(userData);
  const [idRoom, setIdRoom] = useState(0);
  const [idReceiver, setIdReceiver] = useState<userProps>(userData);
  const [button, setButton] = useState(false);
  const [chatSocket, setChatSocket] = useState<any>();
  const [messsage, setMessage] = useState<messageProps>()

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch('http://localhost:3333/auth/user', {
            credentials: 'include',
          });
          const content = await response.json();
          setCurrentUser(content)
        } catch (error) {

        }
      }
    )();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3333/ChatGateway', {
      query: {
        userId: currentUser.id,
      }
    });
    setChatSocket(socket)
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return (
    <div className='flex justify-center items-center'>
      <ConversationList amis={amis} setIdReceiver={setIdReceiver} setButton={setButton} currentUser={currentUser} users={users} setConv={setIdRoom} />
      <Conversation chatSocket={chatSocket} idReceiver={idReceiver} button={button} idRoom={idRoom} currentUser={currentUser} />
      <Edit idReceiver={idReceiver} />
    </div>
  )
}