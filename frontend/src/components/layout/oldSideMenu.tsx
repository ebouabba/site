
import { useRouter } from 'next/navigation'

import { Combobox, Transition } from '@headlessui/react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useState, ChangeEvent } from 'react'
import UserInfo from '../user/UserInfo'
import { io } from 'socket.io-client'
import { AppProps, BoxSearchrProps, userProps } from '@/interface/data'
import { CustomLinkSideMenuProps } from '../../interface/model'
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks'
import { idText } from 'typescript'





const BoxSearch = ({ searchUser, setSearchUser, onlineUsersss, id, users, amis }: BoxSearchrProps) => {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const handlingQuery = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }
    const empy: Array<userProps> = []
    let filterUser = empy;
    if (query.replace(/\s+/g, '')) {
        filterUser = users.filter((user: userProps) => {
            user.flag = true
            amis.filter((usr: userProps) => {
                if (usr.id == user.id)
                    user.flag = false
            })
            return user.username?.toLowerCase().includes(query.trimStart().trimEnd().replace(/\s+/g, ' ').toLowerCase())
        }
        )
    }
    const handelOnChange = (name: any) => {
        setSearchUser(name)
        router.replace(`/users/${name}`);
    }
    return (
        <>
            <form className='w-full' action="">
                <Combobox value={searchUser} onChange={handelOnChange} >
                    <div className='relative flex justify-center items-center  h-10 w-[100%]'>
                        <Combobox.Input
                            type="text"
                            className='absolute focus:outline-none bg-black w-[100%] py-2 text-white px-8 rounded-xl hover:text-black hover:bg-blue-100'
                            placeholder='typing..'
                            onChange={handlingQuery}
                            autoComplete='off'
                            value={query}
                        // displayValue={(item) => item}
                        >
                        </Combobox.Input>
                        <Image src='/search.svg' className='absolute left-2' alt='search' width={20} height={20}></Image>
                        <Combobox.Button className='absolute right-3'>
                            <Image src='/arrow-up.svg' className='w-[auto] ' alt='search' width={20} height={20}></Image>
                        </Combobox.Button>
                    </div>
                    <Combobox.Options className='absolute flex justify-center mt-5 w-[50%]'>
                        <div className={`text-center rounded-2xl m-2 shadow-slate-800 shadow-md font-light flex flex-col justify-center w-[100%] bg-red-200 overflow-hidden`}>
                            {
                                filterUser.map((item: any, index: number) => (

                                    index < 10 && (
                                        < Combobox.Option value={`${item.username}.${item.id}`} key={index}
                                            className={({ active }) => `flex justify-around  ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}
                                            onClick={() => setQuery(item.username)}
                                        >
                                            <div className={`w-[65px] h-[65px] pb-[3px] ${(!item.flag) ? onlineUsersss.includes(item.id) ? 'bg-green-400' : 'bg-red-400' : null} rounded-full flex justify-center items-center `}>
                                                <Image src={"/man.png"} alt='man profiel' width={60} height={40}></Image>
                                            </div>
                                            <CustomLinkSideMenu href='/' content={item.username} ></CustomLinkSideMenu>
                                            {

                                                (!item.flag) ?
                                                    (<CustomLinkSideMenu href='/game' moreStye="bg-yallow-700" content='play' ></CustomLinkSideMenu>) :
                                                    (<CustomLinkSideMenu href='/' content=' add friend' ></CustomLinkSideMenu>)
                                            }
                                        </Combobox.Option>
                                    )
                                ))
                            }
                        </div>
                    </Combobox.Options>
                </Combobox >
            </form >
        </>
    )
}

const CustomLinkSideMenu = ({ href, content, moreStye }: CustomLinkSideMenuProps) => {
    return (
        <div className={`rounded justify-between flex items-center ${moreStye}`}>
            <Link className='hover:bg-blue-500 hover:text-cyan-100 p-1 px-2 rounded-xl' href={String(href)}>
                {content}
            </Link>
        </div>
    )
}

const SideMenu = ({ onlineUsersss, currentUser, users, amis }: AppProps) => {
    const router = useRouter();



    const [searchUser, setSearchUser] = useState("")

    return (
        <>
            <div className=' px-5 py-2 w-full flex justify-between item-center '>
                <div className="w-[20%] hidden  sm:flex flex-row item-center justify-between ">
                    <CustomLinkSideMenu moreStye="" href="/" content="Home" />
                    <CustomLinkSideMenu moreStye="" href="/chat" content="Chat" />
                    <CustomLinkSideMenu moreStye="" href="/game" content="PongGame" />
                </div>
                <div className="flex item-center justify-center sm:w-[60%] w-[100%] py-4 ">
                    <BoxSearch searchUser={searchUser} setSearchUser={setSearchUser} id={currentUser.id} users={users} amis={amis} onlineUsersss={onlineUsersss} />
                </div>
                <div className="hidden w-[20%] pl-10 sm:flex justify-between item-center">
                    <CustomLinkSideMenu moreStye='' href="/" content="logOut" />
                    <CustomLinkSideMenu moreStye='' href="/" content="more" />
                </div>
                <UserInfo />
            </div>
        </>
    )
}

export default SideMenu;

