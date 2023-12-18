import { useEffect, useRef, useState, RefObject } from 'react'
import PlayWithComputer from '../../components/game/computer'
import { AppProps, userData, userProps } from '@/interface/data';
import ListOfFriends from '@/components/game/listOfFriends';
import { useRouter } from 'next/router';
import PlayOnline from '@/components/game/online';
import Link from 'next/link';
import Image from 'next/image'
import OnlineCard from '@/components/game/cards/onlineCard';
import ComputerCard from '@/components/game/cards/computerCard';
import MatchingCard from '@/components/game/cards/matchingCard';
import { GameCards } from '@/components/game/gameCard';
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks';

const Index = ({ onlineUsersss, socket }: AppProps) => {
    const router = useRouter()
    const [room, setroom] = useState<any>('');
    const [listOfFriends, setlistOfFriends] = useState<boolean>(false);
    const [selectPlayer, setselectPlayer] = useState('')
    const [opponent, setOpponent] = useState('')

    const [rejectRequest, setrejectRequest] = useState(false)
    const [cantPlayOnline, setCantPlayOnline] = useState(false)

    const [amis, setAmis] = useState<any>([])
    const [users, setUsers] = useState<Array<any>>([]);
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    fetchCurrentUser({ setCurrentUser })
    fetchAllUsers({ setUsers, currentUser })
    fetchAllAmis({ setAmis, currentUser })

    const handelButtonRejectRequest = () => {
        setrejectRequest(false)
        router.push("/game")
    }


    const [gameStart, setGameStart] = useState(true);
    return (
        <div className="Gamebackground w-full h-screen  flex  justify-center">
            {/* <div className="  w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50] h-[600px] mt-[140px  rounded-2xl "> */}
            <div className="relative bg-whie z-10 overflow-hidden w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40   p-2 md:p-4">

                {gameStart ? (
                    <div className={'relative w-full h-full -[600p]   rounded-2xl  '}>

                        <div className=" Circles absolute w-[50%] z-10 h-[50%]  -left-32 -top-10 rounded-full" />
                        <div className=" Circles absolute  opacity-50 rotate-180 w-[400px] z-10 h-[400px]  -right-5 md:-right-20 -bottom-10 rounded-full" />
                        <Image
                            className='rounded-xl z-20  shadow-2xl  '
                            src="/game/click-to-start-3.gif"
                            alt="My Image"
                            layout="fill"
                            objectFit="cover"
                        />
                        <div className="ClickToStartGame absolute text-3xl z-20  bottom-32 inset-x-0  flex justify-center items-center ">
                            <button
                                onClick={() => { setGameStart(false) }}
                                className=" ">Click To Start</button>
                        </div>

                    </div>) : null
                }
                {
                    !gameStart && selectPlayer == '' && !listOfFriends && (
                        <GameCards currentUser={currentUser} socket={socket} setselectPlayer={setselectPlayer} />
                    )
                }
                {
                    (cantPlayOnline) ? (
                        <div className='w-full h-full  flex justify-center items-center z-50 absolute'>
                            <div className=' shadow-2xl w-[300px] h-[200px] bg-white flex flex-col justify-around item-center  rounded-3xl'>
                                <div className="flex justify-around item-center ">
                                    <h1 className=''>You can't Play now</h1>
                                </div>
                                <div className="flex justify-around item-center">
                                    <button onClick={() => setCantPlayOnline((prev) => !prev)} className='bg-[#77A6F7] px-5  py-1 rounded-xl'>OK</button>
                                </div>
                            </div>
                        </div>) : null
                }
            </div >

        </div>
    )
}

export default Index

// import React from 'react'

// const index = () => {
//     return (
//         <div>index</div>
//     )
// }

// export default index