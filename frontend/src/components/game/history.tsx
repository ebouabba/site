import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { AppProps, userProps } from '@/interface/data'
import { getTheDateAndTheTime } from './listOfFriends'
function findUserbyId(users: Array<userProps>, userId: Number) {
    const user = users.find((item) => {
        return item.id == userId
    })
    return user
}
const History = ({ currentUser, users }: { users: Array<userProps>, currentUser: userProps }) => {
    const [matchs, setMatchs] = useState<Array<any>>([])
    useEffect(() => {
        (
            async () => {
                setMatchs([])
                try {
                    const response = await fetch(`http://localhost:3333/game/history/${currentUser.id}`, {
                        credentials: 'include',
                    });
                    if (response.status == 200) {
                        const content = await response.json()
                        if (content != undefined) {
                            const _matchs: Array<any> = []
                            Array.from(content).reverse().map((item: any) => {

                                const usr = findUserbyId(users, item.opponentId)
                                if (usr)
                                    _matchs.push({
                                        createdAt: item.createdAt,
                                        myGools: item.myGools,
                                        opponentGools: item.opponentGools,
                                        opponent: usr,
                                    })
                            })

                            setMatchs(_matchs)
                        }
                    }
                } catch (error) {

                }
            }
        )();
    }, [currentUser])

    return (
        <div className='w-full h-full'>
            <div className=' bg-redd-200  w-full  bg-bldue-200 rounded-xl flex flex-col items-center justify-center space-y-5' >
                <div className=" relative bg-rded-200 w-full h-10 flex justify-center items-center">
                    <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                    <div className="w-[200px]  text-yellow-300 uppercase text-center text-3xl">
                        Historique
                    </div>
                    <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                    {/* <button onClick={() => handelClearHistorique(user.id)} hidden={(matchs.length ? false : true)} className=" absolute  right-1 px-5 py-1  bg-blue-400  hover:bg-blue-300 rounded-lg top-7">Clear</button> */}
                </div>
                {
                    (matchs.length) ? matchs.map((match: any) => (
                        <div key={match.id} className="w-[96%] ms:w-[80%] h-14  rounded-xl flex flex-col justify-center item-center">

                            <div className="bg-blue-800 mx-[20%] text-sm text rounded-t-3xl h-10 mt-2 text-white flex justify-center items-center">
                                {getTheDateAndTheTime(match.createdAt)}
                            </div>

                            <div className="bg-blue-500 w-full flex justify-center items-start h-16 rounded-md">
                                <div className=" w-[40%] h-full flex justify-between items-center">
                                    <div className=" relative h-full w-12">
                                        <Image className='w-12 rounded-md'
                                            src={match.opponent.foto_user} fill objectFit='cover' alt={'player Image'}>
                                        </Image>
                                    </div>
                                    <h1 className='pr-4 md:pr-10  uppercase text-white font-bold text-sm lg:text-xl'>{match.opponent.username}</h1>
                                </div>
                                <div className="bg-blue-800 w-[20%] h-12 flex flex-col justify-end item">
                                    <div className='bg-reds-400 flex justify-around items-center -space-x-14 text-xl font-bold text-white'>
                                        <span>{match.opponentGools}</span>
                                        <span>-</span>
                                        <span>{match.myGools}</span>
                                    </div>
                                    <div className="w-15 h-3 bg-yellow-300  rounded-t-[8px] ">
                                    </div>
                                </div>
                                <div className=" w-[40%] h-full flex justify-between items-center">
                                    <h1 className='pl-4 md:pl-10  uppercase text-white font-bold text-sm lg:text-xl'>{currentUser.username}</h1>
                                    <div className=" relative h-full w-12">
                                        <Image className='w-12 rounded-md'
                                            src={currentUser.foto_user} fill objectFit='cover' alt={'player Image'}>
                                        </Image>
                                    </div>
                                </div>
                                {/* <div className=" w-[40%] h-full flex justify-between items-center bg-red-300">
                                    <h1 className='pl-10  uppercase text-white font-bold text-sm lg:text-xl '>{currentUser.username}</h1>
                                    <div className=" relative h-full w-12">
                                        <Image className='w-12 rounded-md'
                                            src={currentUser.foto_user} fill objectFit='cover' alt={'player Image'}>
                                        </Image>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                    )) : null
                }
            </div>
        </div>
    )
}

export default History