import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid';

import { AppProps, userData, userProps } from '@/interface/data'
import { Socket } from 'socket.io-client';
import { fetchCurrentUser } from '@/hooks/userHooks';
const Matching = ({ socket, setroom }: { socket: Socket, setroom: (room: string) => void }) => {
    const router = useRouter()
    const [num, setNum] = useState<number>(1)
    const [opponent, setOpponent] = useState<userProps>()
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    fetchCurrentUser({ setCurrentUser })
    useEffect(() => {

        console.log('h')
        socket?.emit("searchForOpponent", { currentUser: currentUser })
        socket?.on('searchForOpponent', (opponentt: userProps) => {
            setOpponent(opponentt)
            setNum((pr: number) => pr + 1)
            console.log('connecttio nn.................')
        })
        socket?.on('withdrawalFromMatching', (opponentt: userProps) => {
            setOpponent(undefined)
            console.log('--->m ochilads ')
            // setNum((pr: number) => pr + 1)
        })
    }, [currentUser, socket])

    const handelChallenge = async () => {
        try {
            const response = await fetch(`http://localhost:3333/users/getbyuserid/${opponent?.id}`, {
                credentials: 'include',
            });
            if (response.status == 200) {
                const content = await response.json();
                if (content.isOnline == false) {
                    console.log('hi')

                    const room: string = uuid();
                    setroom(room)
                    socket?.emit('userjointToGame', { userId: currentUser.id })

                    const responsePost = await fetch(`http://localhost:3333/game/room/${currentUser.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'room': room,
                            'opponentId': Number(opponent?.id)
                            // 'opponentId': Number(opponent?.id)
                        }),
                        credentials: 'include',
                    });
                    const responsePost2 = await fetch(`http://localhost:3333/game/room/${opponent?.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'room': room,
                            'opponentId': Number(currentUser.id)

                            // 'opponentId': currentUser.id
                        }),
                        credentials: 'include',
                    });

                    // socket?.emit("areYouReady", {
                    //     OpponentId: e.target.value, currentPlayer: currentUser, pathOfGame: `/game/online?settings=true`
                    // })
                    // setOpponent(e.target.value)
                    router.push(`/game/online?settings=true`);

                }
                // else {
                //     if (selectUser === -1)
                //         setselectUser(Number(e.target.value))
                //     else
                //         setselectUser(-1)
                // }
            }
        } catch (error) {
        }
    }

    return (

        <div className="Gamebackground w-full  h-screen flex justify-center  ">
            <div className="relative z-10 OnlineCard overflow-hidden w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40 p-2 md:p-4">

                {/* <div className="OnlineCard  relative  overflow-hidde w-[90%] sm:w-[80%] h-[70%]  rounded-xl"> */}
                <div className="   w-full h-[80%] flex  justify-center items-center space-x-20">
                    <div className="w-[100px] h-[100px]  relative ">
                        <Image className='rounded-md' src={currentUser.foto_user} alt='image user' fill sizes='()' />
                    </div>
                    <div className="w-[50px] h-[50px]  relative ">
                        <Image className='rounded-md' src={'/game/vs.png'} alt='image user' property='' fill sizes='()' />
                    </div>   <div className="w-[100px] h-[100px]  relative ">
                        <Image className='rounded-md' src={opponent ? opponent.foto_user : '/recent.png'} property='' alt='image user' fill sizes='()' />
                    </div>
                </div>
                <div className="w-full text-end  p-10 flex justify-end">
                    <button onClick={opponent ? handelChallenge : undefined}
                        className={`py-2 px-6 rounded-md ${opponent ? ' bg-white ' : ' bg-slate-500'}`}>
                        To Match
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Matching