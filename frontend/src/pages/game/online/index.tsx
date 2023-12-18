import PlayWithComputer from '@/components/game/computer'
import ListOfFriends from '@/components/game/listOfFriends'
import Matching from '@/components/game/matching'
import PlayOnline from '@/components/game/online'
import Settings from '@/components/game/settings'
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks'
import { AppProps, userProps } from '@/interface/data'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";

const AiSetting = ({ onlineUsersss, socket }: AppProps) => {
    const router = useRouter()
    const [routerPage, setRouterPage] = useState('')
    const [ballTheme, setballTheme] = useState('/game/ball-2.svg')
    const [canvasTheme, setcanvasTheme] = useState('black')
    const [gameLevel, setgameLevel] = useState('esay')
    const [selectPlayer, setselectPlayer] = useState('online')
    const [listOfFriends, setlistOfFriends] = useState<boolean>(false);
    const [opponent, setOpponent] = useState('')
    const [us, setus] = useState(false)
    useEffect(() => {
        if (router.asPath == '/game/online?listoffriends=true') {
            setRouterPage('')

            setlistOfFriends(true)
        }
        else if (router.asPath == '/game/online?search=true') {
            setlistOfFriends(false)
            setRouterPage('search')
            setselectPlayer('matching')
        }
        else if (router.asPath == '/game/online?play=true') {
            setlistOfFriends(false)
            setRouterPage('play')
        }
        else if (router.asPath != '/game/online?play=true') {
            setlistOfFriends(false)
            setRouterPage('settings')
        }
    }, [router])
    const [room, setroom] = useState<any>('');

    const userData = { id: 0, createdAt: "", updatedAt: "", email: "", hash: "", username: "", firstName: "", lastName: "", foto_user: "", isOnline: false, userId: 0, flag: false, flag1: false, room: '' }
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    fetchCurrentUser({ setCurrentUser })
    const [amis, setAmis] = useState<any>([])
    const [users, setUsers] = useState<Array<any>>([]);
    fetchAllUsers({ setUsers, currentUser })
    fetchAllAmis({ setAmis, currentUser })




    useEffect(() => {
        const handleBeforeUnload = (e: any) => {

            const confirmationMessage = 'Are you sure you want to leave? Your changes may not be saved.';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    }, [router]);

    return (
        <>
            {
                routerPage == 'play' ? (
                    // <PlayWithComputer selectPlayer={selectPlayer} setselectPlayer={setselectPlayer} ballTheme={ballTheme}
                    //     canvasTheme={canvasTheme} gameLevel={gameLevel} />
                    < PlayOnline
                        selectPlayer={selectPlayer}
                        setselectPlayer={setselectPlayer}
                        ballTheme={ballTheme}
                        canvasTheme={canvasTheme}
                        socketApp={socket}

                    />
                ) : routerPage == 'settings' ? (
                    <Settings socket={socket}  ballTheme={ballTheme} setballTheme={setballTheme} canvasTheme={canvasTheme} setcanvasTheme={setcanvasTheme}
                        setRouterPage={setRouterPage} gameLevel={gameLevel} setgameLevel={setgameLevel} selectPlayer={selectPlayer} />
                ) : null
            }
            {
                listOfFriends ? (
                    <div className=" absolute w-full">
                        <ListOfFriends  onlineUsersss={onlineUsersss} socket={socket}  />
                    </div>
                ) : null
            }
            {
                routerPage == 'search' ? (
                    <Matching socket={socket} setroom={setroom} />
                ) : null
            }
        </>
    )
}

export default AiSetting
