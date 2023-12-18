import { userProps } from '@/interface/data'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Edit({ idReceiver }: { idReceiver: userProps }) {

    const [click, setClick] = useState(true)
    return (
        <div className="  bg-gray-100 p-6 m-16  w-[436px] h-[1054px]     flex justify-start items-start gap-5  rounded-[30px] border  border-sky-500">
            <div className="w-full h-[547.06px] flex-col justify-center items-center gap-[26px] inline-flex">
                <Link  className="flex-col justify-start items-center gap-3.5 flex " href={`/users/${idReceiver.username}.${idReceiver.id}`}>
                    <img className="w-[136px] h-[136px] rounded-full border-4 border-green-600" src={idReceiver.foto_user} />
                    <div className="flex-col justify-start items-center gap-1 flex">
                        <div className="text-zinc-900 text-[32px] font-bold font-['Satoshi']">{idReceiver.username}</div>
                        <div className="text-neutral-600 text-base font-normal font-['Satoshi'] leading-[18px]">{idReceiver.email}</div>
                    </div>
                </Link>
                <div className="w-[323px] h-[0px] border border-zinc-200"></div>
                <div className="w-[323px] justify-between items-center inline-flex">
                    <div className="text-zinc-900 text-base font-bold font-['Satoshi']">banned</div>
                    <button onClick={() => setClick(false)} type='button' className="w-10 h-6 relative bg-blue-400 rounded-[30px]">
                        <div className={`w-5 h-5 ${click ? ('left-[18px]') : 'left-0'} top-[2px] absolute bg-white rounded-[30px]`} />
                    </button>
                </div>
                <div className="w-[323px] h-[0px] border border-zinc-200"></div>
                <div className="flex-col justify-start items-start gap-5 flex">

                    <div className=" bg-bhlack flex-col justify-start items-start gap-3.5 flex">
                        <div className="w-[323px] justify-between items-center inline-flex">
                            <div className="justify-start items-center gap-1.5 flex">
                                <div className="w-6 h-6 relative" />
                                <div className="text-neutral-500 text-base font-normal font-['Satoshi']">level</div>
                            </div>
                            <div className="w-6 h-6 relative origin-top-left -rotate-90" />
                        </div>
                        <div className="w-[323px] justify-between items-center inline-flex">
                            <div className="justify-start items-center gap-1.5 flex">
                                <div className="w-6 h-6 relative" />
                                <div className="text-neutral-500 text-base font-normal font-['Satoshi']">200 win</div>
                            </div>
                            <div className="w-6 h-6 relative origin-top-left -rotate-90" />
                        </div>
                    </div>
                </div>
                <div className="w-full  flex-col justify-center items-center inline-flex">
                    <button className="justify-center items-center">
                        <div className="text-neutral-500 text-xl font-normal font-['Satoshi']">delete conversation</div>
                    </button>
                    <div className="w-6 h-6 relative origin-top-left -rotate-90" />
                    <button className="justify-center items-center">
                        <div className="text-neutral-500 text-xl font-normal font-['Satoshi']">visite profile</div>
                    </button>
                </div>
            </div>
        </div>
    )
}
