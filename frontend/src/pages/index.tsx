

import Image from 'next/image'


import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AppProps, userProps } from '@/interface/data';
import History from '@/components/game/history';
import Leaderboard from '@/components/game/leaderboard';




function Index({ onlineUsersss, currentUser, users, amis }: AppProps) {

  return (
    <menu className="w-full    Dashboard   mt-14 flex  flex-col   md:flex-row gap-5  p-5  ">
      <div className=" w-full md:w-[45%]  h-full rounded-xl flex flex-col gap-5 ">
        <div className="w-full h-[100px] md:h-[20%] bg-slate-300 rounded-xl">
          user online
        </div>
        <div className="fleex   w-full  h-[80%]   bg-[#f7f7f7 bge-green-200  shadow-md rounded-xl  p-" >
          <Leaderboard currentUser={currentUser} />
        </div>
      </div>
      <div className=" w-full md:w-[55%]  h-[800px] md:h-full rounded-xl flex flex-col gap-5   mb-10">
        <div className="h-[50%] w-full flex gap-5">
          <div className="w-[40%] h-full bg-red-400 rounded-xl">
            <div className="">won:{currentUser.level}</div>
            <div className="">lost:{currentUser.lost}</div>
            <div className="">level:{currentUser.level}</div>
          </div>
          {/* <Image src={'/game/grad/grad-1.svg'} fill alt='1'></Image> */}
          <div className="w-[60%] h-full   flex">
            <div className="w-[50%] h-full   flex flex-col justify-between ">
              <div className="  w-full h-[30%] bg-white rounded-xl flex justify-center items-center">
                <div className="w-[100px] h-[100px] bg-black rounded-full"></div>
              </div>
              <div className="w-full h-[30%] bg-white rounded-xl"></div>
              <div className="w-full h-[30%] bg-white rounded-xl"></div>
            </div>
            <div className="w-[50%] h-full  flex flex-col  justify-around  -space-y-10">
              <div className="w-full h-[30%] bg-white rounded-xl"></div>
              <div className="w-full h-[30%] bg-white rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="hideScroll overflow-auto h-[50%] w-full bg-blue-400 rounded-xl ">
          <History currentUser={currentUser} users={users}></History>
        </div>
      </div>
    </menu>
  )
}

export default Index;


