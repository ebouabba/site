'use client'
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import Friends from "./Friend";
import Rank from "./Rank";
import { fetchAllAmis, fetchCurrentUser } from "@/hooks/userHooks";
import { userProps } from "@/interface/data";

import Image from 'next/image'

interface LevelBarpros {
  value: number
}
function LevelBar({ value }: LevelBarpros) {
  const progressWidth = `${value}%`;



  return (
    <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80 rounded-lg">
      <div className="bg-[#0ea5e9] h-5 rounded-lg " style={{ width: progressWidth }}>
        {/* <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
          {`${value}%`} */}
        {/* </span> */}
      </div>
    </div>
  );
}

const UseProfile = () => {
  const [amis, setAmis] = useState<any>([])
  const [query, sequery] = useState("")

  const [isOpen, setIsOpen] = useState(false)

  const [check, setCheck] = useState(2);
  const [check1, setCheck1] = useState(0);
  const [check2, setCheck2] = useState(0);
  const [currentUser, setCurrentUser] = useState<Array<any>>([]);
  const [foto_user, setFoto_user] = useState("");
  const [id, setid] = useState(0);
  const [logout, setLogout] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:3333/auth/user', {
          credentials: 'include',
        });
        const content = await response.json();
        setCurrentUser(content);
      }
    )();
  }, []);

  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch('http://localhost:3333/auth/user', {
            credentials: 'include',
          });
          const content = await response.json();
          setFoto_user(content.foto_user);
          setid(content.id);
          setEmail(content.email);
          setUsername(content.username)
        } catch (error) {

        }
        // setUsername(content.username);

        // console.log(content.id);
      }
    )();
  });
  useEffect(() => {
    (
      async () => {
        setCheck1(0);
        setCheck2(0);
      }
    )();
  }, [id]);
  const freind_ranck = async (fd: number) => {
    setCheck(fd)
    if (check1 == 0) {
      setCheck1(1);
      setCheck2(0);

    }
    // else if (fd == 2 && check1 == 1)
    //     setCheck1(2);
    // else if (fd == 2 && check1 == 2)
    //     setCheck1(0);
    else if (check1 == 1) {

      setCheck2(0);
      setCheck1(0);
    }

  }
  const freind_ranck1 = async (fd: number) => {
    setCheck(fd)
    if (check2 == 0) {
      setCheck2(1);
      setCheck1(0);
    }
    // else if (fd == 2 && check1 == 1)
    //     setCheck1(2);
    // else if (fd == 2 && check1 == 2)
    //     setCheck1(0);
    else if (check2 == 1) {
      setCheck2(0);
      setCheck1(0);
    }

  };
  const handelLogOutUser = async () => {
    try {
      const response = await fetch(`http://localhost:3333/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }
  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch(`http://localhost:3333/friends/accepted-friends/${id}`, {
            credentials: 'include',
          });
          const content = await response.json();
          setAmis(content);
        } catch (error) {
        }
      }
    )();
  }, [query, id]);

  return (

    <div className=" flex flex-col">

      <div className={`flex flex-wrap  ${logout == 1 ? 'blur-sm' : null}  justify-center min-h-screen  min-w-screen    items-center p-6 `}>
        <div className='  flex-none   z-20  w-[408px] mt-[120px] mb-10  h-[100%]  shadow-xl  shadow-[#728edb] justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[40px] p-6  text-white'>
          <div className="text-center">
            <span className="text-white">My Profile</span>
            <div className="mt-6">
              <img
                src={foto_user}
                alt="Your Image Alt Text"
                className=" w-52 h-52   border-2 border-[#E3E8EC]  drop-shadow shadow-md shadow-black rounded-[40px] inline-block" // Adjust the width as needed
              />
            </div>
            <div className='mt-6'>
              <h1 className="text-xl font-bold">{username}</h1>
              <span className="text-sm  font-serif italic flex justify-center mt-3">{email}</span>
            </div>
            <div className="mt-8  flex justify-center flex-col items-center bgs-black mal-6">
              <LevelBar value={80} />
              <div className="  flex  justify-center items-center">
                <p className=' mt-4 text-white shadow-sm shadow-black   w-28 font-serif  uppercase'>level 8-86%</p>
              </div>
            </div>
            <div className=" hidden md:flex justify-center items-center  ">

              <div className='mt-6'>
                <Link className="text-base font-bold flex justify-center  items-center ml- text-blue-600" href={"/EditProfile"}><span className=" py-2 px-28 bg-white border  drop-shadow shadow-md shadow-black  rounded-xl hover:scale-110 duration-300">EditProfile</span>
                </Link>
                <h1 className="flex  mt-[40px] ">Recent Activities</h1>

                <img
                  src="https://w0.peakpx.com/wallpaper/616/177/HD-wallpaper-table-tennis-neon-icon-blue-background-neon-symbols-table-tennis-neon-icons-table-tennis-sign-sports-signs-table-tennis-icon-sports-icons.jpg"
                  alt="Your"
                  className="w-80 mt-6 h-60  rounded-[32px] inline-block"
                />
                {/* <button className="flex justify-center  items-center mt-6  bg-[#f4f5f8] transition-all active:scale-100 rounded-xl text-[#2c4d82] py-2 px-12 hover:scale-105 ">Login</button> */}
              </div>
            </div>
            <div className=" md:hidden flex justify-center items-center flex-col ml-3 mt-6 ">

              <Link className="text-base font-bold flex justify-center  items-center ml- text-blue-600" href={"/EditProfile"}><span className=" py-2 px-28 bg-white border  drop-shadow shadow-md shadow-black  rounded-xl hover:scale-110 duration-300">EditProfile</span>
              </Link>

              <div className='mt-2 msl-1'>
                {(check != 2) ? (<div>
                  <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[133px]  py-2 text-base font-bold   bg-white  border hover:text-white  drop-shadow shadow-md shadow-black hover:bg-[#3b82f6] rounded-xl  hover:scale-110 duration-300 text-blue-600">Rank</button>
                </div>) : null}
                {(check == 2) ? (<div>
                  <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[135px] py-2 text-base font-bold  bg-[#3b82f6]  hover:text-white hover:bg-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-white">Rank</button>
                </div>) : null}
                {(check != 1) ? (<div>
                  <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2 text-base font-bold   bg-white border  hover:text-white  hover:bg-[#3b82f6] drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-blue-600">Friends</button>
                </div>) : null}
                {(check == 1) ? (<div>
                  <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2  text-base font-bold   bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:bg-black hover:scale-110 duration-300 text-white">Friends</button>
                </div>) : null}

              </div>
            </div>
            <div className="mt-8 flex justify-center ml-2 items-center">
              <button  onClick={() => setLogout(1)} className="bg-white  shadow-sm shadow-black  transition-all active:scale-100 rounded-xl border text-blue-600 py-2  px-32 hover:bg:white hovxer:text-white hover:scale-105 duration-300 ">Logout</button>
            </div>
          </div>
        </div>
        <div className=" hidden md:flex">

          <div className=" flex flex-col    h-full w-64 items-center   drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] bg-[#f9fafb]  mt-[85px] min-h-[845px]   p-6">
            {(check != 2) ? (<div>
              <button onClick={() => freind_ranck1(2)} className=" mt-60 px-[108px] py-2 text-base font-bold   bg-white  border hover:text-white  hover:bg-[#3b82f6]  hover:scale-110 duration-300 text-blue-600">Rank</button>
            </div>) : null}
            {(check == 2) ? (<div>
              <button onClick={() => freind_ranck1(2)} className=" mt-60 px-[110px] py-2 text-base font-bold  bg-[#3b82f6]  hover:text-white hover:bg-blue-600  hover:scale-110 duration-300 text-white">Rank</button>
            </div>) : null}
            {(check != 1) ? (<div>
              <button onClick={() => freind_ranck(1)} className=" mt-40 px-[99px] py-2 text-base font-bold   bg-white border  hover:text-white  hover:bg-[#3b82f6] hover:scale-110 duration-300 text-blue-600">Friends</button>
            </div>) : null}
            {(check == 1) ? (<div>
              <button onClick={() => freind_ranck(1)} className=" mt-40 px-[100px] py-2  text-base font-bold   bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600  hover:bg-black hover:scale-110 duration-300 text-white">Friends</button>
            </div>) : null}




          </div>

        </div>
        {(<div className=" flex   flex-col justify-center items-center md:opacity-150 bg xl:mt-[80px] sm:mt-6   rounded-md min-h-[845px]  sm:bg-blue-50  w-[550px] xl:w-[700px] h-16 xl:rounded-2xl xl:rounded-s-[1px] p-6" >
          {
            check === 2 && <Rank amis_id={amis} amis={amis} id={id} />
          }
          {
            check === 1 && <Friends amis_id={amis} amis={amis} currentUser={id} />
          }


        </div>)
        }
      </div>
      <div>
        {

          logout == 1 && (<div className="flex   items-center -mt-[1300px] sm:-mt-[1500px] xl:-mt-[1000px] mdl-12 justify-center min-h-screen sm:bg-bldack  md:bg-gdray-700 md:-mt-[1500px]  xl:bg-dblue-600 min-w-screen  z-20  bg-sslate-400">

            <div className=" bg-white md:w-[400px] md:h:72   flex flex-col  justify-strt items-center  sm:w-[400px] sm:h-72  h-72 w-96  drop-shadow shadow-lg shaddow-black  rounded-lg -mst-[1000px] md:-mst-[700px] z-20 text-blue-600 ml-10 md:mdl-[600px]">
              <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm logout </div>
              <div className=' w-96 hd-2 border-2 mt-5' > </div>
              <div className='text-blue-500 text-sm mt-8  ml-16  w-full fonts-black' >Are you sure you want to logout ?</div>
              <div className=' w-96 h-16 fbg-black mt-16 flex flex-row justify-center items-center space-x-6 '>
                <button onClick={() => setLogout(0)} className=' bg-white w-20  border-2 border-blue-600 h-10 rounded-lg'>
                  <div>Cansle</div>
                </button>
                <Link  href="/auth/login"   onClick={handelLogOutUser} className=' bg-blue-500 text-white w-20 flex justify-center items-center  h-10  border-2 border-blue-600 rounded-lg'>
                  OK
                </Link>

              </div>
            </div>
          </div>)
        }

      </div>
    </div>

  );
};

export default UseProfile;