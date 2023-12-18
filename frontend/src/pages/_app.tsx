import '@/styles/globals.css'
import '@/styles/game.css'
import type { AppProps } from 'next/app'
import SideMenu from '@/components/layout/sideMenu';
import Navbar from '@/components/layout/navbar';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks';
import Image from 'next/image';
import { Open_Sans } from 'next/font/google'
import { userData, userProps } from '@/interface/data';
// import ThemeContext from '@/hooks/themeContext';
// import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { createContext, } from 'react'
import { getBack } from '@/hooks/appContexts';
import { fetchData } from '@/hooks/appContexts';
import { string } from 'zod';
import { useRouter } from 'next/router';
const font = Open_Sans({ subsets: ['latin'] })
// import {useConta}
export interface CardInvitation {
  currentUser: userProps;
  opponent: userProps;
  handerRefuseButton: () => void;
  handerAcceptButton: () => void;
  hideRequest: boolean;
  myIdFromOpponent: Number
}

export const CardInvitation = ({ currentUser, opponent, handerRefuseButton, hideRequest, myIdFromOpponent, handerAcceptButton }: CardInvitation) => {
  const [hide, setHide] = useState(false)
  return (<>
    {
      myIdFromOpponent === Number(currentUser.id) ?
        (
          <div className={` z-40 absolute w-full h-screen -top-10  flex justify-center items-center`}>
            <div className=' w-[30%] h-[30%] bg-white rounded-3xl shadow-sm shadow-black flex flex-col justify-around items-center'>
              <div className="flex flex-col justify-around items-center border-b-2 border-blue-600  space-y-3">
                <Image className='rounded-full w-24' height={200} width={200} alt={`image:${opponent.username}`} src={opponent.foto_user}></Image>
                <h1>{opponent.username}</h1>
              </div>
              <div className='flex justify-around items-center  w-full'>
                <button onClick={handerRefuseButton} className='m-2 border-2 border-black rounded-xl py-1 px-4 duration-500 ease-in-out hover:py-2 hover:px-5 hover:text-xl'>Refuse</button>
                <button onClick={handerAcceptButton} className='m-2 border-2 border-black rounded-xl py-1 px-4 bg-[#77A6F7] duration-500 ease-in-out hover:py-2 hover:px-5 hover:text-xl'>Accept</button>
              </div>
            </div>
          </div>
        ) : null
    }
  </>
  )
}

// '{ id: number; createdAt: string; updatedAt: string; email: string; hash: string; username: string; firstName: string; lastName: string; foto_user: string; isOnline: false; userId: number; flag: false; flag1: false; length: any; }'

// '{ id: number; createdAt: string; updatedAt: string; email: string; hash: string; username: string; firstName: string; lastName: string; foto_user: string; isOnline: false; userId: number; flag: false; flag1: false; length: any; }'
// const getBakc = createContext<string>('')

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isSideMenuVisible = !router.asPath.startsWith('/auth/login');
  const isSideMenuVisible2 = !router.asPath.startsWith('/register')
  const isSideMenuVisible3 = !router.asPath.startsWith('/auth/login')
  const isSideMenuVisible4 = !router.asPath.startsWith(`/enter-2fa/`)

  const [socket, setSocket] = useState<any>();
  const [hideRequest, sethideRequest] = useState<boolean>(true);

  const [myIdFromOpponent, setmyIdFromOpponent] = useState<number>(-2);
  const [room, setRoom] = useState('')
  const [opponent, setopponent] = useState<userProps>(userData);
  // const [opponent, setopponent] = useState<userProps>({ id: 0, createdAt: "", updatedAt: "", email: "", hash: "", username: "", firstName: "", lastName: "", foto_user: "", isOnline: false, userId: 0, flag: false, });
  const [rejectRequest, setrejectRequest] = useState(false)

  const [flag, setflag] = useState<boolean>(true)
  // const [pathOfGame, setpathOfGame] = useState<string>('')
  // const router = useRouter()


  const [onlineUsersss, setOnlineUsersss] = useState<Array<number>>([]);
  const [amis, setAmis] = useState<any>([])
  const [users, setUsers] = useState<Array<any>>([]);
  const [currentUser, setCurrentUser] = useState<userProps>(userData);
  fetchCurrentUser({ setCurrentUser })
  fetchAllUsers({ setUsers, currentUser })
  fetchAllAmis({ setAmis, currentUser })

  useEffect(() => {
    if (isSideMenuVisible3 && isSideMenuVisible2 && isSideMenuVisible4) {
      (
        async () => {
          const response = await fetch('http://localhost:3333/auth/user', {
            credentials: 'include',
          });
          if (response.status != 200 && response.status != 201) {
            router.push('/auth/login');
            return;
          }
        }
      )();
    }
  });

  useEffect(() => {
    try {
      const newSocket = io('http://localhost:3333/OnlineGateway', {
        query: {
          userId: currentUser.id,
          amis: amis,
        },

      });

      setSocket(newSocket);
      newSocket?.on("updateOnlineUsers", (amisOnline: any) => {
        setOnlineUsersss(amisOnline)
      });
      newSocket?.on("areYouReady", ({ OpponentId, currentPlayer, room }: { OpponentId: string, currentPlayer: userProps, room: string }) => {
        console.log("areYouReady")
        setRoom(room)
        setmyIdFromOpponent(Number(OpponentId))
        // setpathOfGame(pathOfGame);
        setopponent(currentPlayer);
        sethideRequest(true)
      });
      newSocket?.on("rejectRequest", () => {
        // console.log('hello---')
        setrejectRequest(true)
      })
      newSocket?.on("rejectAcceptRequesthidden", () => {
        sethideRequest((prev) => !prev)
        setmyIdFromOpponent(-2)
      })
      return () => {
        newSocket.disconnect();
      };
    }
    catch (error) {

    }
  }, [currentUser, amis]);

  const modifiedPageProps = {
    ...pageProps,
    onlineUsersss: onlineUsersss,
    currentUser: currentUser,
    users: users,
    amis: amis,
    socket: socket,
  };

  const handerRefuseButton = async () => {

    socket?.emit('rejectAcceptRequesthidden', { currentUser: currentUser });
    setRoom('')
    sethideRequest((prev) => !prev)
    setmyIdFromOpponent(-2)
    try {
      const responseDelete = await fetch(`http://localhost:3333/game/room/${currentUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log('id->:', opponent.id)
      const responseDelete2 = await fetch(`http://localhost:3333/game/room/${opponent.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {

    }
    setflag(true)
    socket.emit("rejectRequest", { currentUser, opponent });
  }

  const handerAcceptButton = async () => {
    socket?.emit('userjointToGame', { userId: currentUser.id })
    socket?.emit('rejectAcceptRequesthidden', { currentUser: currentUser });
    socket?.emit('deleteFromsearchForOpponent');
    setmyIdFromOpponent(-2)
    sethideRequest((prev) => !prev)
    console.log(room)
    const response = await fetch(`http://localhost:3333/game/room/${currentUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'room': room,
        'opponentId': Number(opponent.id),
      }),
      credentials: 'include',
    });
    if (response.ok)
      router.push('/game/online?settings=true')
  }
  const [path, setpath] = useState('')
  const [refreshData, setRefreshData] = useState<boolean>(false)
  const [oldPath, setOldPath] = useState('')
  useEffect(() => {
    if ((oldPath == '/game/online?search=true' && router.asPath != '/game/online?settings=true') || oldPath == '/game/online?settings=true')
      socket?.emit('withdrawalFromMatching')
    if (oldPath == '/game/online?settings=true' && router.asPath != '/game/online?play=true')
      socket?.emit('DeleteuserFromGame', { userId: currentUser.id })

    console.log('-----------------slkdfjafd')
    setOldPath(router.asPath)
    if (router.route != '/search')
      setpath(router.route)
  }, [router])

  return (
    <>
      <fetchData.Provider value={{ setRefreshData: setRefreshData, refreshData: refreshData }}>
        <getBack.Provider value={path}>
          <RejectRequestComp rejectRequest={rejectRequest} setrejectRequest={setrejectRequest} />
          <CardInvitation currentUser={currentUser} opponent={opponent} handerRefuseButton={handerRefuseButton}
            hideRequest={hideRequest} myIdFromOpponent={myIdFromOpponent} handerAcceptButton={handerAcceptButton} />
          <div className={`${font.className}   font-medium `}>
            {isSideMenuVisible && isSideMenuVisible2 && isSideMenuVisible4 &&
              <>
                <Navbar currentUser={currentUser} users={users} amis={amis} onlineUsersss={onlineUsersss} socket={socket} />
                <SideMenu currentUser={currentUser} users={users} amis={amis} onlineUsersss={onlineUsersss} socket={socket} />

              </>
            }
            <div className="home ">
              <Component  {...modifiedPageProps} />
            </div>
          </div>
        </getBack.Provider>
      </fetchData.Provider>
    </>
  )
}
const RejectRequestComp = ({ rejectRequest, setrejectRequest }: { rejectRequest: boolean, setrejectRequest: (rejectRequest: boolean) => void }) => {
  return (
    <>
      {
        (rejectRequest) ? (
          <div className='w-full h-full flex justify-center items-center z-50 absolute top-0  '>
            <div className=' shadow-2xl w-[300px] h-[200px] bg-white flex flex-col justify-around item-center  rounded-3xl'>
              <div className="flex justify-around item-center ">
                <h1 className=''>reject you Request</h1>
              </div>
              <div className="flex justify-around item-center">
                <button onClick={() => setrejectRequest(false)} className='bg-[#77A6F7] px-5  py-1 rounded-xl'>OK</button>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  )
}