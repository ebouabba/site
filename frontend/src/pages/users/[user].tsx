
import Friends from '@/components/user/Friend';
import Rank from '@/components/user/Rank';
import { fetchAllAmis, fetchCurrentUser } from '@/hooks/userHooks';
import { AppProps, userProps } from '@/interface/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import path from 'path';
import { send } from 'process';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usefetchDataContext } from '@/hooks/usefetchDataContext';
import { NullLiteral } from 'typescript';

interface LevelBarpros {
    value: number
}
function LevelBar({ value }: LevelBarpros) {

    const progressWidth = `${value}%`;

    return (
        <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80  rounded-lg" >
            <div className="bg-[#0ea5e9] h-5 rounded-lg " style={{ width: progressWidth }}>
                {/* <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {`${value}%`} */}
                {/* </span> */}
            </div>
        </div >
    );
}

const YourComponent = ({ currentFileName }: any) => {
    const [flag, setFlag] = useState(true)
    const [flag1, setFlag1] = useState(true)
    const [flag2, setFlag2] = useState(true)
    const [check_user, setCheck_user] = useState(true)
    const [username, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [foto_user, setFoto_user] = useState("");
    const [check, setCheck] = useState(2);
    const [check_blocked1, setCheck_bloked1] = useState(true);
    const [check_blocked2, setCheck_bloked2] = useState(true);
    const [check1, setCheck1] = useState(0);
    const [check2, setCheck2] = useState(0);
    const [blocked, setblocked] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false)
    const [isfriend, setisfriend] = useState(false)
    // const [id, setid] = useState(0)
    const [query, setQuery] = useState('')
    const [amis, setAmis] = useState<Array<userProps>>([])
    const [amis_id, setAmisid] = useState<Array<userProps>>([])
    const [delete_request, setdelete_request] = useState<any>([])

    const [received, setreceived] = useState<Array<any>>([]);
    const [sendr, setsendr] = useState<Array<any>>([]);
    const [received_blocked, setreceived_blocked] = useState<Array<any>>([]);
    const [sendr_blocked, setsendr_blocked] = useState<Array<any>>([]);
    const router = useRouter()
    const parts = currentFileName.split('.');
    const numberPart: number = Number(parts[1]);
    const usernamePart: string = parts[0];
    const [number, setNumber] = useState(0);
    const { refreshData, setRefreshData } = usefetchDataContext()
    const [id, setid] = useState(0);

    useEffect(() => {
        (
            async () => {
                const response = await fetch('http://localhost:3333/auth/user', {
                    credentials: 'include',
                });
                const content = await response.json();

                setid(content.id);
                // setUsername(content.username);

                // console.log(content.id);
            }
        )();
    });

    useEffect(() => {


        if (numberPart === id) {
            router.push("/profile")

        }
        setCheck(2)
    }, [id, numberPart]);


    const toggleDropdown = () => {
        // setisfriend(!isfriend);


        setIsOpen(false);
    };
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`http://localhost:3333/friends/accepted-friends/${numberPart}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();

                    setAmisid(Array.from(content));
                } catch (error) {

                }


            }
        )();
    }, [query, numberPart, isfriend, check, check1, check2]);
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`http://localhost:3333/friends/accepted-friends/${id}`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setAmis(Array.from(content));
                    }
                } catch (error) {

                }

            }
        )();
    }, [query, numberPart, isfriend, check, check_blocked1, check_blocked2, check1, check2]);



    useEffect(() => {
        (
            async () => {
                setCheck1(0);
                setCheck2(0);
                setIsOpen(false)
            }
        )();
    }, [query, numberPart, send, received]);



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
        else if (check2 == 1) {
            setCheck2(0);
            setCheck1(0);
        }

    };


    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`http://localhost:3333/users/one/${usernamePart}/${numberPart}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.status == 200) {

                        setUsername(content.username)
                        setEmail(content.email)
                        setFoto_user(content.foto_user)
                        // setrequestt(cont)
                        return;
                    }
                    else
                        setCheck_user(false);
                } catch (error) {

                }
            }
        )();
    });
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/${id}/received-blocked`, {
                    credentials: 'include',
                });
                const counte = await response.json();
                if (response.status == 200) {
                    setreceived_blocked(counte)
                    return;
                }
            }
        )();
    }, [id, numberPart, isOpen, isOpen1, currentFileName]);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/${id}/received-requests`, {
                    credentials: 'include',
                });
                const counte = await response.json();
                if (response.status == 200) {
                    setreceived(counte)
                    return;
                }
            }
        )();
    }, [id, numberPart, isOpen, check_blocked1, check_blocked2, currentFileName]);
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`http://localhost:3333/friends/${numberPart}/send-requests`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.status == 200) {
                        setFlag2(content);
                        // setrequestt(cont)
                        return;
                    }
                } catch (error) {

                }
            }
        )();
    }, [sendr, received, id, numberPart, isOpen]);
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/${numberPart}/send-requests`, {
                    credentials: 'include',
                });
                const counte = await response.json();
                if (response.status == 200) {
                    setFlag2(counte);
                    // setrequestt(cont)
                    return;
                }
            }
        )();
    }, [sendr, received, id, numberPart, check_blocked1, check_blocked2, isOpen]);
    // useEffect(() => {
    //     (
    //         async () => {
    //             setCheck(0);
    //         }
    //     )();
    // }, [numberPart]);
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/${id}/send-blocked`, {
                    credentials: 'include',
                });
                const counte = await response.json();
                if (response.status == 200) {
                    setsendr_blocked(counte)
                    return;
                }
            }
        )();
    }, [id, numberPart, received, check, check1, isOpen, isOpen1, check2, currentFileName]);
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/${id}/send-requests`, {
                    credentials: 'include',
                });
                const counte = await response.json();
                if (response.status == 200) {
                    setsendr(counte)
                    return;
                }
            }
        )();
    }, [id, numberPart, received, check, check1, isOpen, check2, currentFileName]);
    const sendRequestForaccpet = async () => {
        try {

            const response = await fetch(`http://localhost:3333/friends/accept-friend-request/${numberPart}/${id}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Friend request sent successfully.');
                setisfriend(!isfriend);
                setRefreshData((pr) => !pr)

            } else {
                setIsOpen(false);
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const blockedfriend = async () => {
        try {

            const response = await fetch(`http://localhost:3333/friends/blocked-friend-request/${id}/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                // setIsOpen1(true);
                router.push("/")
                console.log('Friend blocked sent successfully.');
            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    }
    const sendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3333/friends/send-request/${numberPart}/${id}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsOpen(true);
                setRefreshData((pr) => !pr)

                console.log('Friend request sent successfully.');
            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const cancelRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3333/friends/delete-friend-request/${numberPart}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setIsOpen(false);
                setRefreshData((pr) => !pr)
                console.log('delete-friend-request sent successfully.');
            } else {
                console.error('Failed to delete-friend-request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:3333/friends/accepted-friends/${id}`, {
                    credentials: 'include',
                });
                const content = await response.json();
                setAmis(content);
            }
        )();
    }, [query, id, check, check1, check2, numberPart, currentFileName]);
    const Unblockedfriend = async () => {
        try {
            const response = await fetch(`http://localhost:3333/friends/delete-friend-request/${numberPart}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            console.log(isOpen1);

            if (response.ok) {
                router.push("/")
                // console.log(isOpen1)
                // setIsOpen(true);
                console.log('Friend Unblocked sent successfully.');
            } else {
                console.log(isOpen1);


                console.error('Failed to Unblock friend request.');
            }

        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        setFlag(true)
        setFlag1(true)

    }, [numberPart, currentFileName])

    useEffect(() => {
        if (Array.isArray(amis)) {
            amis.filter((usr: any) => {
                if (usr.id == numberPart)
                    setFlag(false)
            })
        } else { }

        // useEffect(() => {
        if (Array.isArray(received_blocked)) {
            received_blocked.map((user: any) => {
                // Your mapping logic here
                if (user.sender.id == numberPart) {

                    console.log("check_blocked1")
                    setCheck_bloked1(false)
                }
            });
        } else { }
        if (Array.isArray(sendr_blocked)) {
            sendr_blocked.map((user: any) => {
                console.log("check_blocked2")
                // Your mapping logic here
                if (user.receiver.id == numberPart) {
                    setCheck_bloked2(false)
                }
            });
        } else {
            // Handle the case when 'received' is not an array (e.g., show an error message)
        }
        if (Array.isArray(received)) {
            received.map((user: any) => {
                // Your mapping logic here
                if (user.sender.id == numberPart) {

                    setFlag1(false)
                }
            });
        } else { }
        if (Array.isArray(sendr)) {
            sendr.map((user: any) => {
                // Your mapping logic here
                if (user.receiver.id == numberPart) {


                    setIsOpen(true)
                }
            });
        } else {
            // Handle the case when 'received' is not an array (e.g., show an error message)
        }
        // setFlag2(true)
    }, [sendr, numberPart, isfriend, received, currentFileName, sendr_blocked, received_blocked, amis, amis_id, setFlag1, flag2, delete_request])
    console.log(check)

    return (
        <div className='flex flex-col'>
            <div className=''>

                {
                    (!check_blocked1 || !check_blocked2) ?
                        (
                            (
                                (!check_blocked1) ?
                                    (
                                        <div className=' flex z-10  h-screen w-screen  justify-center items-center '>

                                            <div className='flex  justify-center flex-col  h-80  w-[500px]  ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-white bg-black '>
                                                <p className=' text-xl  '> @{username} ?</p>
                                                <span className=' text-sm mt-4'> You  cannot reach this user </span>
                                                <Link className=' flex justify-center items-center text-black mt-8 w-56 h-10 rounded-2xl  border-2 bg-white  border-blue-500 hover:scale-110 duration-300' href={'/'}>Canecel</Link>

                                            </div>
                                        </div>
                                    ) :

                                    <div className=' flex z-10  h-screen w-screen  justify-center items-center '>

                                        <div className='flex  justify-center flex-col  h-80  w-[500px]  ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-white bg-black '>
                                            <p className=' text-xl  -mt-10'> Unblock @{username} ?</p>
                                            <span className=' text-sm mt-6'> They will  be able to follow you and view your Tweets </span>

                                            <Link className=' flex justify-center items-center text-black  bg-white  w-56  rounded-2xl h-10 mt-8 border-2  border-blue-500 hover:scale-110 duration-300' href={'/Listblocked'}>Unblock</Link>

                                            <Link className=' flex justify-center items-center text-white mt-6 w-56 h-10 rounded-2xl  border-2  border-blue-500 hover:scale-110 duration-300' href={'/'}>Canecel</Link>

                                        </div >
                                    </div >

                            )
                        ) :
                        (check_user) ?
                            (<div className={`flex    ${blocked == 1 ? 'blur-sm' : null}  flex-wrap  justify-center min-h-screen   ml-12 min-w-screen    items-center   p-6 `}>
                                <div className='  flex-none   z-20  w-[408px] mt-[120px] mb-10  h-[100%]  shadow-xl  shadow-[#728edb] justify-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[40px] p-6  text-white'>
                                    <div className="text-center">
                                        <span>Profile {username}</span>
                                        <div className="mt-6">
                                            <img
                                                src={foto_user}
                                                alt="Your Image Alt Text"
                                                className=" w-52 h-52   border-2 border-[#E3E8EC]  drop-shadow shadow-md shadow-black rounded-[40px] inline-block" // Adjust the width as needed
                                            />
                                        </div>
                                        <div className='mt-6'>
                                            <h1 className="text-xl font-bold uppercase">{username}</h1>
                                            <span className="text-sm  font-serif italic flex justify-center mt-3">{Email}</span>
                                        </div>
                                        <div className="mt-8 ml-6">
                                            <LevelBar value={60} />
                                            <p className=' mt-4 text-white shadow-sm shadow-black  ml-28  w-28 font-serif italic uppercase'>level 8-86%</p>
                                        </div>
                                        <div className='mt-6'>
                                            <div className="text-base font-bold flex justify-around items-center text-[#2c4d82]">
                                                {

                                                    (!flag) ?
                                                        (
                                                            <div className="text-base font-bold flex items-center  space-x-2  text-[#2c4d82]">
                                                                <div className=" py-2 px-5 bg-[#dbeafe]  flex  items-center  space-x-1  border rounded-full hover:scale-110 duration-300">
                                                                    <svg width="20" height="20" fill="black" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clip-rule="evenodd" fill="none" fill-rule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" stroke-miterlimit="10" stroke-width="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                    <span className='normal-case'>Friends</span>
                                                                </div>
                                                                <Link href='/game' content='play' className="py-2 px-7 bg-[#dbeafe] border rounded-full hover:scale-110 duration-300" >Message</Link>
                                                                <Link href='/game' content='play' className="py-2 px-7 bg-[#dbeafe]  border rounded-full hover:scale-110 duration-300" >play</Link>


                                                            </div>
                                                        ) :
                                                        (!flag1) ?
                                                            (
                                                                (!isfriend) ?
                                                                    (
                                                                        <div className="text-base font-bold flex items-center  space-x-2  text-[#2c4d82]">
                                                                            <div className=" py-2 px-4 bg-[#dbeafe]  flex  items-center  border rounded-full hover:scale-110 duration-300">
                                                                                <svg width="20" height="20" fill="black" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clip-rule="evenodd" fill="none" fill-rule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" stroke-miterlimit="10" stroke-width="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                                <button className="py-0 px-4 bg-[#dbeafe] border rounded-full " onClick={sendRequestForaccpet} >Confrim</button>
                                                                            </div>
                                                                            <button className="py-2 px-7 bg-[#dbeafe] border rounded-full  hover:scale-110 duration-300 " onClick={sendRequestForaccpet}>Delete request</button>

                                                                        </div>) :
                                                                    (<div className="text-base font-bold flex items-center  space-x-2  text-[#2c4d82]">
                                                                        <div className=" py-2 px-5 bg-[#dbeafe]  flex  items-center  space-x-1  border rounded-full hover:scale-110 duration-300">
                                                                            <svg width="20" height="20" fill="black" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clip-rule="evenodd" fill="none" fill-rule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" stroke-miterlimit="10" stroke-width="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                            <span className='normal-case'>Friends</span>
                                                                        </div>
                                                                        <Link href='/game' content='play' className="py-2 px-7 bg-[#dbeafe] border rounded-full hover:scale-110 duration-300" >Message</Link>
                                                                        <Link href='/game' content='play' className="py-2 px-7 bg-[#dbeafe]  border rounded-full hover:scale-110 duration-300" >play</Link>
                                                                    </div>)
                                                            ) :

                                                            (

                                                                (
                                                                    (!isOpen) ?
                                                                        (
                                                                            <div className=' bg-blacdk w-96 space-x-10  flex-row '>
                                                                                <button className="py-[8px] px-6 bg-white border rounded-full " onClick={sendRequest} >Add friend</button>
                                                                                <Link href='/game' content='play' className="py-[9px] px-7 bg-white border rounded-full hover:scale-110 duration-300" >Message</Link>
                                                                            </div>
                                                                        ) :
                                                                        (
                                                                            <div className=' bg-blacdk w-96 space-x-10  flex-row '>

                                                                                <button className="py-[10px] px-2 bg-white border rounded-full text-sm " onClick={cancelRequest} >Canacel requset</button>
                                                                                <Link href='/game' content='play' className="py-[9px] px-7 bg-white border rounded-full hover:scale-110 duration-300" >Message</Link>
                                                                            </div>
                                                                        )
                                                                )
                                                            )

                                                }

                                            </div>
                                            {/* <div className=' flex-1 ml-[600px]   bg-white w-48 h-48 text-black '>dd

                                    </div> */}
                                            <div className=" hidden md:flex justify-center items-center  ">

                                                <div className='mt-6np'>

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
                                        </div>
                                        {/* onClick={blockedfriend} */}

                                        <div className="mt-8" onClick={() => setblocked(1)} >
                                            <button className="bg-[#dbeafe]   transition-all active:scale-100 rounded-xl  text-[#2c4d82] py-2 px-32 hover:scale-105 ">Blocked</button>
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
                                        check === 2 && <Rank amis_id={amis_id} amis={amis_id} id={numberPart} />
                                    }
                                    {
                                        check === 1 && <Friends amis_id={amis_id} amis={amis} currentUser={id} />

                                    }


                                </div>)
                                }

                            </div>
                            ) : (<div className=' bg-white min-h-screen  min-w-screen flex justify-center items-center '> makinx dffffffffffffffffffffffffff </div>)
                }
            </div >
            <div>
                {

                    blocked == 1 && (<div className="flex   items-center -mt-[1300px] sm:-mt-[1500px] xl:-mt-[1000px] mdl-12 justify-center min-h-screen sm:bg-bldack  md:bg-gdray-700 md:-mt-[1500px]  xl:bg-dblue-600 min-w-screen  z-20  bg-sslate-400">

                        <div className=" bg-white md:w-[400px] md:h:72   flex flex-col  justify-strt items-center  sm:w-[400px] sm:h-72  h-72 w-96  drop-shadow shadow-lg shaddow-black  rounded-lg -mst-[1000px] md:-mst-[700px] z-20 text-blue-600 ml-10 md:mdl-[600px]">
                            <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm Blocked </div>
                            <div className=' w-96 hd-2 border-2 mt-5' > </div>
                            <div className='text-blue-500 text-sm mt-8  ml-16  w-full fonts-black' >Are you sure you  want to blocked this user ?</div>
                            <div className=' w-96 h-16 fbg-black mt-16 flex flex-row justify-center items-center space-x-6 '>
                                <button onClick={() => setblocked(0)} className=' bg-white w-20  border-2 border-blue-600 h-10 rounded-lg'>
                                    <div>Cansle</div>
                                </button>
                                <button onClick={blockedfriend} className=' bg-blue-500 text-white w-20  h-10  border-2 border-blue-600 rounded-lg'>
                                    <div>Ok</div>
                                </button>

                            </div>
                        </div>
                    </div>)
                }

            </div>

        </div >
    );
};



export async function getServerSideProps(context: any) {
    // const currentFileName = path.basename(__filename);
    const currentFileName = context.query.user;

    return {
        props: {
            currentFileName,
        },
    };
}

export default YourComponent;

