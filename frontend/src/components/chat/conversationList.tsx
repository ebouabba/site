import React, { useState } from 'react'
import DirectConversationList from './direct/directConversationList'
import ChannelsList from './channels/channelsList'
import { AppProps, userProps } from '@/interface/data';


export default function ConversationList({amis, setIdReceiver, setButton, currentUser, users, setConv }: { amis: userProps[],setIdReceiver: (value: userProps) => void, setButton: (value: boolean) => void, currentUser: userProps, users: userProps[], setConv: (value: number) => void }) {

    const [click, setClick] = useState(true)

    return (
        <div className="  bg-gray-100 p-6 m-16  w-[536px] h-[1054px]     flex-col justify-start items-start gap-5 inline-flex rounded-[30px] border  border-sky-500">

            <div className="self-stretch  px-6 h-[60px] flex  justify-center items-center gap-3">
                <button onClick={() => setClick(true)} className={`w-[120px] px-20 py-3 ${click ? ' bg-blue-400' : 'bg-white'} rounded-[52px] justify-center items-center inline-flex duration-1000 hover:bg-blue-400 border border-sky-500`}>
                    <div className="justify-start items-center gap-2 flex">
                        <div className="text-black">Direct</div>
                    </div>
                </button>
                <button onClick={() => setClick(false)} className={`w-[119px] px-20 py-3 ${!click ? ' bg-blue-400' : 'bg-white'} rounded-[52px] justify-center items-center inline-flex duration-1000 hover:bg-blue-400 border border-sky-500`}>
                    <div className="justify-start  items-center gap-2 flex">
                        <div className="text-black">Channels</div>
                    </div>
                </button>
            </div>
            <div className=''>
                {click ? (
                    setButton(false),
                    
                    <DirectConversationList setIdReceiver={setIdReceiver} users={users} amis={amis} currentUser={currentUser} />
                ) : (
                    setButton(true),
                    <ChannelsList currentUser={currentUser} setConv={setConv} />
                )}
            </div>
        </div>
    )
}
