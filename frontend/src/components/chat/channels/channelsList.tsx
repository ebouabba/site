import React, { useEffect, useState } from 'react'
import Createchannels from './createChannels'
import { userProps } from '@/interface/data'
import { channelProps } from '@/interface/data'

export default function ChannelsConversationList({ currentUser, setConv }: { currentUser: userProps, setConv: (value: number) => void }) {

  const [click, setClick] = useState(false)
  const [channel, setChannel] = useState<channelProps[]>([]);

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch(`http://localhost:3333/chat/allChannelByUserId/${currentUser.id}`)
          const content = await response.json();
          setChannel(Array.from(content))
        } catch (error) {

        }
      }
    )();
  }, [currentUser.id]);

  return (
    <div className=" w-[456px] h-[870px] px-6 py-5 bug-white boruder-zinc-200 flex-col justify-start items-start gap-6 inline-flex">
      <div className="w-[50%] bg-blue-400  justify-center items-center">
        <div className="w-[185px] justify-center items-center gap-2 flex">
          <div className="w-5 h-5 relative" />
          <button onClick={() => setClick(true)} className=" text-white  mft-3   px-5 py-3 bg-blue-400 rounded-[52px] justify-center w-96 items-center  duration-300 hover:scale-105">
            <div className=" justify-center items-center gap-2 flex">
              <h1 className="">Start New Chat</h1>
            </div>
          </button>
        </div>
      </div>
      <div className="flex-col bg-white 0  w-[300px]  overflow-y-scroll drop-shadow shadow-md rounded-md justify-center items-center scrollbar-hide">

        <div className="">
          {
            click ? (
              <Createchannels currentUser={currentUser} />
            ) : null
          }
        </div>
        <div className="flex-auto space-y-5">
          {channel.map((item) => (
            <>
              <button key={item.id} className=' bg-white self-stretch hover:bg-blue-500 hover:rounded-md justify-between items-center inline-flex' onClick={() => setConv(item.id)}>

                <div className=" bg-bglack self-stretch justify-between items-center inline-flex">
                  <div className="h-[58px] justify-start items-center gap-2.5 flex">
                    <img className="w-[58px] h-[58px] rounded-full" src='https://cdn2.vectorstock.com/i/1000x1000/50/66/group-icon-in-modern-design-style-for-web-site-vector-26505066.jpg' />
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                      <div className="text-zinc-900 text-base font-bold font-['Fahkwang']">{item.name}</div>
                      <div className="self-stretch text-neutral-600 text-sm font-normal font-['Fahkwang'] leading-[18px]">Hi bro cv?</div>
                    </div>
                  </div>
                  <div className="self-stretch flex-col justify-between items-end inline-flex">
                    <div className="text-gray-500 text-sm font-normal font-['Damion']">20s</div>
                    <div className="w-6 h-6 relative" />
                  </div>
                </div>
              </button>
              <div className="self-stretch h-[0px] border border-zinc-200"></div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
