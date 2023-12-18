import React, { useEffect, useState } from 'react'
import { userProps, messageProps } from '@/interface/data'
import { Socket } from 'socket.io-client';

export default function Conversation({ chatSocket, idReceiver, button, idRoom, currentUser }: { chatSocket: Socket, idReceiver: userProps, button: boolean, idRoom: number, currentUser: userProps }) {
    const [messages, setMessages] = useState<messageProps[]>([]);
    const [content, setContent] = useState('');
    const [isend, setIsend] = useState(false);
    const [msg, setMsg] = useState('')

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`http://localhost:3333/chat/getConversationDirect/${currentUser.id}/${idReceiver.id}`,{
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setMessages(Array.from(content))
                } catch (error) {

                }
            }
        )();
        setContent('')
    }, [currentUser.id, idReceiver, isend, msg]);

    useEffect(() => {
        chatSocket?.on('message', (message) => {
            if (message) {
                setMsg(message);
                fetch(`http://localhost:3333/chat/directMessage/${currentUser.id}/${idReceiver.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "content": message,
                    }),
                    credentials: 'include',
                });
            }
        });
    }, [chatSocket])

    const handleClick = async (id: number) => {
        if (content) {

            await fetch(`http://localhost:3333/chat/directMessage/${id}/${idReceiver.id}`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "content": content,
                }),
                credentials: 'include',
            });
        }
        // const currentDate = new Date();

        // // Extract hours and minutes
        // const hours = String(currentDate.getHours()).padStart(2, '0');
        // const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        // // Format the time as "00:00"
        // const currentTime = `${hours}:${minutes}`;

        // // Print the result
        // console.log('Current time in the local time zone (24-hour clock):', currentTime);
        chatSocket.emit('message', { senderId: currentUser.id, ReceiverId: idReceiver.id, content: content });
        if (isend == false)
            setIsend(true)
        else if (isend == true)
            setIsend(false)
        setContent('')

    };

    const handltime = (time: string) => {
        const dateObject = new Date(time);
        const formattedTime = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return <div className="text-right text-gray-500 text-xs font-medium font-['Satoshi'] mt-2 ">{formattedTime}</div>
    }


    return (
        <div className="w-[1040px] h-[1054px]  relative bg-gray-100  border  border-sky-500 rounded-[30px] ">
            {

                idReceiver.id != 0 ? (
                    <>
                        <div className=' flex w-[990px] bg-white h-[80px] rounded-[30px] mx-[25px] my-[20px]  border  border-sky-500 '>
                            <button className="h-[70px]  gap-2.5 flex my-[11px] mx-[20px] hover:scale-105 duration-300" >
                                <img className="w-[58px] h-[58px] rounded-full" src={idReceiver.foto_user} />
                                <div className="my-[5px]">
                                    <p className="text-black  text-xl">{idReceiver.username}</p>
                                    <div className="justify-start items-center gap-1 inline-flex">
                                        <div className="w-3 h-3 relative bg-green-600 rounded-[20px] " />
                                        <div className="text-neutral-800 text-base font-normal font-['Satoshi'] leading-[18px]">Active Now</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="pl-5 pr-[295px] pt-5 pb-[11px] left-[15px] top-[939px] absolute inline-flex">
                            <input
                                className=" bg-white rounded-[30px]  w-[900px] items-center  justify-center placeholder:italic bloc  border border-sky-500  py-2 pl-9 pr-3 shadow-sm focus:outline-none    sm:text-sm"
                                type="text"
                                name='Type here'
                                value={content}
                                placeholder="Type here........"
                                onChange={(e) => setContent(e.target.value)}

                            />
                            <button
                                className=" h-[50px] w-[50px]"
                                onClick={() => handleClick(currentUser.id)}
                            ><img src='https://cdn-icons-png.flaticon.com/512/3682/3682321.png' className='h-[40px] w-[40px] ml-[25px]' /></button>
                        </div>
                        <div className=' overflow-y-scroll scrollbar-hide  bg-fblue-100 flex  flex-col-reverse -mt-4 p-4 w-full h-[850px] '>
                            {messages.map((item, index) => (
                                <>
                                    {
                                        (currentUser.id == item.senderId) ? (<div className='flex-col'>
                                            <div className="w-full h-auto flex flex-col space-x-4 items-end ">
                                                <div className=" mr-16 max-w-[440px] w-auto h-auto  bg-blue-400 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]  justify-center  p-5 items-center  text-xl  text-white">
                                                    {item.content}
                                                </div>
                                                <img className="w-12 h-12 -mt-10 rounded-full" src={currentUser.foto_user} />
                                            </div>
                                            <div className="w-full flex justify-end items-end">
                                                {handltime(item.createdAt)}
                                            </div>
                                        </div>) :
                                            (

                                                <div className='flex-col'>
                                                    <div className="w-full h-auto flex flex-col items-start">
                                                        <div className=" max-w-[440px] w-auto h-auto p-5 ml-16  bg-white rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] justify-center   items-center  text-xl ">
                                                            {item.content}
                                                        </div>
                                                        <img className="w-12 h-12  -mt-10  rounded-full" src={idReceiver.foto_user} />
                                                    </div>
                                                    <div className="w-full flex">
                                                        {handltime(item.createdAt)}
                                                    </div>
                                                </div>
                                            )
                                    }
                                </>
                            ))}
                        </div>
                    </>) : (
                    <div className='flex justify-center items-center'>No conversation select</div>
                )
            }
        </div >
    )
}
