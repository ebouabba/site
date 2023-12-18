import { useState, useEffect } from 'react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import OnlineCard from './cards/onlineCard';
import ComputerCard from './cards/computerCard';
import MatchingCard from './cards/matchingCard';
import { GameCardsProps, userProps } from '@/interface/data';



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

// { onlineUsersss, currentUser, users, amis, socket }: AppProps
export const GameCards = ({ currentUser, socket, setselectPlayer }: GameCardsProps) => {
    return (

        <div className=" relative w-full h-full ">
            {/* <div className="relative z-10 bg-CusColor_light overflow-hidden w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40 flex   p-2 md:p-4"> */}
            {/* <div className=" relative w-full   md:w-[100%] lg:w-[100%] xl:w-[100]  h-[700px] lex justify-center items-center rounded-xl"> */}
            <Swiper
                className='w-full h-full flex justify-center items-center'
                modules={[Navigation, Pagination, A11y]}
                slidesPerView={1}
            >
                <SwiperSlide >
                    <OnlineCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' >
                    <MatchingCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' >
                    <ComputerCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
                {/* <SwiperSlide className='w-full h-full g-CusColor_primary ' >
                        </SwiperSlide> */}
                {/* <div className="absolute z-30 left-3 md:left-5 xl:left-10 inset-y-0  flex justify-between">
                    <ButtonSlideNavToLeft />
                </div>
                <div className="absolute z-30  right-3 md:right-5 xl:right-10 inset-y-0   flex justify-between">
                    <ButtonSlideNavToRight />
                </div> */}
            </Swiper >
            {/* <Image className=' absolute top-0 z-1 rounded-xl' src={'/game/backgroundCards-3.jpg'} fill alt='bground' /> */}

        </div >

    );
};