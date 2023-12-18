import React, { useEffect, useState } from 'react'
import { AppProps, userProps } from '@/interface/data';



export default function DirectConversationList({ setIdReceiver, users, amis, currentUser }: { setIdReceiver: (value: userProps) => void, users: userProps[] ,amis: userProps[], currentUser: userProps }) {


    const [click, setClick] = useState(false)

    interface listConversationDirect {
        updateAt: string,
        id: string,
        username: string,
        foto_user: string,
    }


    const [conversationList, setConversationList] = useState<Array<listConversationDirect>>([])

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`http://localhost:3333/chat/getConversationListDirect/${currentUser.id}/direct`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setConversationList(Array.from(content))
                    }
                } catch (error) {

                }
            }
        )();
    }, [currentUser, conversationList]);


    return (
        <div className=' w-full h-full bgf-black flex justify-center items-center flex-col'>
            {
                !click ? (
                    <button onClick={() => setClick(true)} className=" text-white  mft-3   px-5 py-3 bg-blue-400 rounded-[52px] justify-center w-96 items-center  duration-300 hover:scale-105">
                        <div className=" justify-center items-center gap-2 flex">
                            <h1 className="">Start New Chat</h1>
                        </div>
                    </button>
                ) : null
            }

            <div className=''>
                {
                    click ? (
                        <div className="   flex  flex-col items-center justify-center shadow-xl drop-shadow-xl   rounded-[30px]">
                            <div className="border border-t-CusColor_dark">

                                <div className=" bfg-slate-600 w-full  mt mr-[40px]">
                                    <button onClick={() => setClick(false)} className="w-[38px] h-[38px]  rounded-full">
                                        <img className=' ' src='https://cdn-icons-png.flaticon.com/512/66/66847.png'></img>
                                    </button>
                                </div>
                                <div className=" border bordnjer-sky-400">
                                    {amis.map((item: userProps) => (
                                        <button onClick={() => setIdReceiver(item)} className="h-[90px] mt-6 w-[480px] px-[15px] bg-white justify-between items-center inline-flex  hover:shadow-lg   hover:shadow-sky-500 duration-1000  transition shadow-md roundfed-[52px] ">
                                            <div className="h-[70px] justify-start items-center gap-2.5 flex">
                                                <img className="w-[58px] h-[58px] rounded-full" src={item.foto_user} />
                                                <div className=" flex-col justify-start items-start gap-0.5 inline-flex my-[20px]">
                                                    <h4 className="text-zinc-900 text-lg">{item.username}</h4>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (

                        <div className="  borhder bogjrder-sky-500  flex  flex-col items-center justify-center">
                            {conversationList.map((item: any) => (
                                <button onClick={() => setIdReceiver(item)} className="h-[90px] mt-6 w-[480px] px-[15px] bg-white justify-between items-center inline-flex  hover:shadow-lg   border border-sky-500  hover:bg-sky-100 duration-1000  transition shahydow-md rounded-[20px] ">
                                    <div className="h-[70px] justify-start items-center gap-2.5 flex">
                                        <img className="w-[58px] h-[58px] rounded-full" src={item.foto_user} />
                                        <div className=" flex-col justify-start items-start gap-0.5 inline-flex my-[20px]">
                                            <h4 className="">{item.username}</h4>
                                            <p className="self-stretch h-[37px] text-neutral-600 text-sm leading-[18px]">Good point. Typography is another ?</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col self-stretch my-[7px]">
                                        <div className=" p-1 mb-1">15h</div>
                                        <div className=" text-CusColor_light bg-sky-500 p-1 mb-1 rounded-[100px]">2</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    )
}
