import router from 'next/router'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Navigation, Pagination, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { number } from 'zod';


export interface SettingsProps {
    selectPlayer: string
    ballTheme: string
    canvasTheme: string
    setballTheme: (ballTheme: string) => void
    setcanvasTheme: (canvasTheme: string) => void
    gameLevel: string
    setgameLevel: (gameLevel: string) => void
    setRouterPage: (routerPage: string) => void
    socket: Socket
}

const CanvasSwiper = ({ ballTheme, setcanvasTheme }: { ballTheme: string, setcanvasTheme: (canvasTheme: string) => void }) => {
    return (
        <div className="">
            <Swiper
                className='w-full h-full mt-4'
                slidesPerView={1}
            >
                <SwiperSlide >
                    {
                        ({ isActive }) => {
                            isActive ? setcanvasTheme('canva1') : null
                            return (
                                <div className={` relative w-full h-f bg-slate-5 p-4 flex justify-center items-center rounded-xl }`}>
                                    <div className=" w-full h-[70%] bg-[#f2f3f5] p-4 flex flex-col justify-center rounded-xl">
                                        <div className=" w-full h-[70px] ">
                                            <div className="h-full w-[12px] bg-[#fb7185]"></div>
                                        </div>
                                        <div className=" w-full h-[70px] flex justify-center items-center ">
                                            <div className="relative h-[40px] w-[40px] rounded-full">
                                                <Image alt='ball87' src={ballTheme} fill />
                                            </div>
                                        </div>
                                        <div className=" w-full h-[70px]  flex justify-end">
                                            <div className="h-full w-[12px] bg-[#35d399]"></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    }
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' virtualIndex={2}>
                    {
                        ({ isActive }) => {
                            isActive ? setcanvasTheme('canva2') : null
                            return (
                                <div className=" relative w-full h-f bg-slate-5 p-4 flex justify-center items-center rounded-xl">
                                    <div className=" w-full h-[70%] bg-[#1f1a1b] p-4 flex flex-col justify-center rounded-xl">
                                        <div className=" w-full h-[70px] ">
                                            <div className="h-full w-[12px] bg-[#f2f3f5]"></div>
                                        </div>
                                        <div className=" w-full h-[70px] flex justify-center items-center ">
                                            <div className="relative h-[40px] w-[40px] rounded-full">
                                                <Image alt='ball87' src={ballTheme} fill />
                                            </div>                                        </div>
                                        <div className=" w-full h-[70px]  flex justify-end">
                                            <div className="h-full w-[12px] bg-[#f2f3f5]"></div>
                                        </div>
                                    </div>
                                </div>)
                        }
                    }
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' virtualIndex={3}>
                    {
                        ({ isActive }) => {
                            isActive ? setcanvasTheme('canva3') : null
                            return (
                                <div className=" w-full h-f bg-slate-5 p-4 flex justify-center items-center rounded-xl">
                                    <div className=" w-full h-[70%] bg-[#548bf8] p-4 flex flex-col justify-center rounded-xl">
                                        <div className=" w-full h-[70px] ">
                                            <div className="h-full w-[12px] bg-[#070D37]"></div>
                                        </div>
                                        <div className=" w-full h-[70px] flex justify-center items-center ">
                                            <div className="relative h-[40px] w-[40px] rounded-full">
                                                <Image alt='ball87' src={ballTheme} fill />
                                            </div>                                        </div>
                                        <div className=" w-full h-[70px]  flex justify-end">
                                            <div className="h-full w-[12px] bg-[#070D37]"></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                </SwiperSlide>
                {/* <div className="absolute z-30 left-3 md:left-5 xl:left-10 inset-y-0  flex justify-between">
                <ButtonSlideNavToLeft />
            </div>
            <div className="absolute z-30  right-3 md:right-5 xl:right-10 inset-y-0   flex justify-between">
            <ButtonSlideNavToRight />
        </div> */}
            </Swiper >
        </div >
    )
}
import { Virtual } from 'swiper/modules';
import Link from 'next/link';
import { userData, userProps } from '@/interface/data';
import { Socket } from 'socket.io-client';
import { fetchCurrentUser, getCurrentUser } from '@/hooks/userHooks';

const BallSwiper = ({ setballTheme }: { setballTheme: (ballTheme: string) => void }) => {

    const balls: Array<string> = ['/game/ball-2.svg', '/game/ball-3.svg', '/game/ball-4.svg', '/game/ball-5.svg', '/game/ball-6.svg',]
    return (
        <Swiper
            className='w-full h-[50%] mt-4   p-4 rounded-xl'
            slidesPerView={1}
            spaceBetween={30}
        >
            {
                balls.map((ball: string) =>
                (
                    <SwiperSlide className=' p-2' >
                        {
                            ({ isActive }) => {
                                isActive ? setballTheme(ball) : null
                                return (
                                    <div className={`w-full h-full flex justify-center items-center rounded-xl  border-2 ${isActive ? ' border-black ' : null} `}>
                                        <div className=" relative  w-[70%] h-[80%] b-slate-500 ">
                                            <Image src={ball} fill alt='ball'></Image>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    </SwiperSlide>
                ))
            }
            {/* <div className="absolute z-30 left-3 md:left-5 xl:left-10 inset-y-0  flex justify-between">
                <ButtonSlideNavToLeft />
                </div>
                <div className="absolute z-30  right-3 md:right-5 xl:right-10 inset-y-0   flex justify-between">
                <ButtonSlideNavToRight />
            </div> */}
        </Swiper >
    )
}

const LevelSwiper = ({ setgameLevel }: { setgameLevel: (gameLevel: string) => void }) => {
    return (
        <Swiper
            className='w-full h-full mt-4'
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={1}
        >

            <SwiperSlide className='' >
                {

                    ({ isActive }) => {
                        isActive ? setgameLevel('easy') : null
                        return (
                            <div className=" w-full h-[80%] bg-slate-50 p-4 flex justify-center items-center rounded-xl">
                                Easy
                            </div>
                        )
                    }
                }
            </SwiperSlide>
            <SwiperSlide className='' >
                {

                    ({ isActive }) => {
                        isActive ? setgameLevel('medium') : null
                        return (
                            <div className=" w-full h-[80%] bg-slate-50 p-4 flex justify-center items-center rounded-xl">
                                Mediam
                            </div>
                        )
                    }
                }
            </SwiperSlide>
            <SwiperSlide className='' >
                {

                    ({ isActive }) => {
                        isActive ? setgameLevel('hard') : null
                        return (
                            <div className=" w-full h-[80%] bg-slate-50 p-4 flex justify-center items-center rounded-xl">
                                Hard
                            </div>
                        )
                    }
                }
            </SwiperSlide>
            {/* <div className="absolute z-30 left-3 md:left-5 xl:left-10 inset-y-0  flex justify-between">
                <ButtonSlideNavToLeft />
            </div>
            <div className="absolute z-30  right-3 md:right-5 xl:right-10 inset-y-0   flex justify-between">
                <ButtonSlideNavToRight />
            </div> */}
        </Swiper >
    )
}

const ButtonSlideNavToRight = () => {
    const swiper = useSwiper()
    return (

        <button
            className=' p-1 rounded-md rotate-180'
            onClick={() => swiper.slideNext()}
        >
            <Image src={'/game/left-arrow.png'} alt='next' width={30} height={30}></Image>

        </button>
    )
}
const ButtonSlideNavToLeft = () => {
    const swiper = useSwiper()
    return (
        <button
            className=' p-1 rounded-md '
            onClick={() => swiper.slidePrev()}
        >
            <Image src={'/game/left-arrow.png'} alt='next' width={30} height={30}></Image>

        </button>
    )
}

const Settings = ({ socket, selectPlayer, ballTheme, setballTheme, canvasTheme, setcanvasTheme, setRouterPage, gameLevel, setgameLevel }: SettingsProps) => {

    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [opponent, setopponent] = useState<userProps>(userData);
    fetchCurrentUser({ setCurrentUser })
    const [watingForOpponent, setwatingForOpponent] = useState(1)
    useEffect(() => {
        (
            async () => {
                const user = await getCurrentUser()
                socket?.emit('userInGame', { userId: user.id })
                socket?.on('userInGame', () => {
                    console.log('user is play')
                })
                if (selectPlayer == 'matching') {
                    socket?.emit('JoinMatch')
                    socket?.on('JoinMatch', () => {
                        console.log('joint match')
                        setwatingForOpponent((prv) => prv + 1)
                    })
                }
            }
        )();
    }, [socket])
    useEffect(() => {
        (
            async () => {
                try {

                    if (selectPlayer != 'computer') {

                        const response = await fetch('http://localhost:3333/auth/user', {
                            credentials: 'include',
                        });
                        if (response.ok) {
                            const content = await response.json()
                            if (content.room == "" || content.isOnline)
                                router.push('/game')
                            const response2 = await fetch(`http://localhost:3333/users/getbyuserid/${content.opponentId}`, {
                                credentials: 'include',
                            });
                            if (response2.ok) {

                                const data = await response2.json()
                                setopponent(data)
                            }
                        }
                    }
                } catch (error) {

                }
            }
        )();
    }, [])
    const [optionActive, setoptionActive] = useState(1);
    return (
        <>
            <div className="Gamebackground h-screen w-full    flex  justify-center  ">
                <div className="relative z-10 bg-CusColor_light overflow-hidden w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40 flex  justify-around items-center  p-2 md:p-4">
                    {/* <div className="bg-CusColor_light  z-10 relative  overflow-hidden w-full h-[70%] sm:h-full max-w-[1200px] flex  justify-betweenmd: justify-around items-center rounded-xl p-2 md:p-4"> */}
                    <div className="w-[24%] md:w-[30%]  max-w-[200px] h-full  rounded-xl space-y-6">
                        <div className=" relative w-full  py-2   bg-CusColor_gre rounded-xl">
                        </div>
                        <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 1 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                            onClick={() => setoptionActive(1)}
                        >
                            <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                <Image alt='arrow' src={'/game/canvas-desing.svg'} fill />
                            </div>
                            <div className=" md:text-xl text-blue-800  font-semibold">Stadium</div>
                        </button>
                        <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 2 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                            onClick={() => setoptionActive(2)}
                        >
                            <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                <Image alt='arrow' src={'/game/ball-2.svg'} fill />
                            </div>
                            <div className=" md:text-xl text-blue-800  font-semibold">Ball</div>
                        </button>
                        {
                            selectPlayer == 'computer' ? (

                                <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 3 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                                    onClick={() => setoptionActive(3)}
                                >
                                    <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                        <Image alt='arrow' src={'/game/game-level.svg'} fill />
                                    </div>
                                    <div className=" md:text-xl text-blue-800  font-semibold">Level</div>
                                </button>
                            ) : null
                        }
                    </div>
                    <div className=" w-[70%] md:w-[60%] h-full  bg-CusColor_grey rounded-xl fle justify-center items-center p-2">
                        <div className="relative w-full flex justify-betwee items-center py-2">
                            <div className="flex items-center justify-start w-[45%] h-[50px] space-x-1 ">
                                <div className=" relative w-[40px] h-[40px]">
                                    <Image src={currentUser.foto_user} objectFit='cover' fill alt='' className='rounded-full' />
                                </div>
                                <div className=" text-sm lg:text-base min-w-[100px]">{currentUser.username}</div>
                            </div>
                            <div className="  relative i w-[10%] h-[40px]">
                                <Image src={'/game/vs.png'} objectFit='cover' fill alt='' />
                            </div>
                            <div className="flex items-center justify-end w-[45%] h-[50px] space-x-1">
                                <div className="text-sm lg:text-base  text-end min-w-[100px]">{opponent.username}</div>
                                <div className=" relative w-[40px] h-[40px]">
                                    <Image src={opponent.foto_user} objectFit='cover' fill alt='' className='rounded-full' />
                                </div>
                            </div>
                        </div>
                        {
                            optionActive == 1 ? (
                                < CanvasSwiper ballTheme={ballTheme} setcanvasTheme={setcanvasTheme} />
                            ) : optionActive == 2 ? (
                                < BallSwiper setballTheme={setballTheme} />
                            ) : (
                                < LevelSwiper setgameLevel={setgameLevel} />
                            )
                        }
                    </div>
                    <div className=" absolute z-10 w-[93%] bottom-3 md:bottom-10 flex justify-between px-5 md:px-11  ">
                        <Link href={'/game'} className="BottonsSettings  rotate-180 px-10 py-2 rounded-lg">
                            <div className="rotate-180">
                                Leave
                            </div>
                        </Link>
                        <button onClick={() => {
                            if (watingForOpponent != 2 && selectPlayer == 'matching')
                                return
                            setRouterPage('play')
                            router.push(selectPlayer == 'computer' ? '/game/ai?play=true' : selectPlayer == 'computer' ? '/game/offline?play=true' : '/game/online?play=true')
                        }} className={`BottonsSettings  px-10 py-2  ${watingForOpponent != 2 && selectPlayer == 'matching' ? ' opacity-20 ' : '   opacity-100'} rounded-lg`}>
                            Next
                        </button>
                    </div>
                </div >

            </div >
            {/* </div > */}
        </>
    )
}

export default Settings
