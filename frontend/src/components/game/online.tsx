import React, { useEffect, useRef, useState, RefObject, useMemo, use } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { userData, userProps } from "@/interface/data";
import { Socket } from "socket.io-client";
import { Ball, Canvas, Player } from "./class";

import Image from "next/image";
import { GameInfoProps, startGameProps } from "./computer";
interface InfoGameprops {
    selectPlayer: string;
    setselectPlayer: (selectPlayer: string) => void;
    ballTheme: string
    canvasTheme: string
    socketApp: Socket
}

const updateGameLoop = (MyCanvas: Canvas, mousePosition: { x: number; y: number }, ball: Ball, player: Player, computer: Player, selectPlayer: string, HoAreYou: any, GameInfo: GameInfoProps) => {

    GameInfo.CANVAS_WIDTH = MyCanvas.width;
    GameInfo.CANVAS_HIEGHT = MyCanvas.height;

    if (mousePosition.x > -10 && (mousePosition.x + computer.height < MyCanvas.height + 10))
        computer.y = mousePosition.x;

    if (mousePosition.y > -10 && (mousePosition.y + player.height < MyCanvas.height + 10))
        player.y = mousePosition.y;


    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ball.setBorder();
    player.setBorder();
    computer.setBorder();
    if (ball.bottom + 2 > MyCanvas.height || ball.top - 2 < 0)
        ball.velocityY *= -1;
    let selectPlayerCollision = ball.x < MyCanvas.width / 2 ? player : computer;
    if (ball.checkCollision(selectPlayerCollision))
        MyCanvas.moveBallWenCollision(ball, selectPlayerCollision);
};


const renderGameOverScreen = (MyCanvas: Canvas, ball: Ball, player: Player, computer: Player) => {
    MyCanvas.ClearCanvas();
    MyCanvas.drawRect(player);
    MyCanvas.drawRect(computer);
    MyCanvas.drawMedianLine({ w: 2, h: 10, step: 20, color: MyCanvas.gameInfo.MEDIANLINE });
    MyCanvas.drawTheBall(ball);
    // MyCanvas.drawText(String(player.score), 300, 60, "black");
    // MyCanvas.drawText(String(computer.score), 700, 60, "black");
};

interface startGameOnlineProps extends startGameProps {
    HoAreYou: any
}

function startGame({ myCanvasRef, mousePosition, ball, player, computer, selectPlayer, HoAreYou, GameInfo }: startGameOnlineProps) {
    if (!myCanvasRef.current) return;
    const MyCanvas = new Canvas(myCanvasRef.current, GameInfo);
    computer.x = MyCanvas.width - 10
    if (computer.status == 'Resume' || player.status == 'Resume')
        return
    updateGameLoop(MyCanvas, mousePosition, ball, player, computer, selectPlayer, HoAreYou, GameInfo);
    renderGameOverScreen(MyCanvas, ball, player, computer);
}

const PlayOnline = ({ selectPlayer, setselectPlayer, socketApp, ballTheme, canvasTheme }: InfoGameprops) => {

    const GameInfo = {
        FPS: 1000 / 100,
        PLAYER_COLOR: "white",
        PLAYER_HEIGHT: 100,
        PLAYER_WIDTH: 20,
        PLAYER_X: 0,
        PLAYER_Y: 450 / 2 - 100 / 2,
        COMPUTER_X: 900 - 20,
        COMPUTER_Y: 450 / 2 - 100 / 2,

        THE_BALL: ballTheme,
        BALL_START_SPEED: 2,
        ANGLE: Math.PI / 4,
        RADIUS_BALL: 15,
        LEVEL: 0.05,
        ACCELERATION: 1,
        VELOCIT: 1,
        SPEED: 1,
        RIGHT_PADDEL: canvasTheme == 'canva1' ? "#35d399" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        LEFT_PADDEL: canvasTheme == 'canva1' ? "#fb7185" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        CANVAS_COLOR: canvasTheme == 'canva1' ? "#f2f3f5" : canvasTheme == 'canva2' ? '#1f1a1b' : '#548bf8',
        MEDIANLINE: canvasTheme == 'canva1' ? "black" : canvasTheme == 'white' ? '#f2f3f5' : 'white',
        CANVAS_HIEGHT: 450,
        CANVAS_WIDTH: 900,
    };

    const player = new Player(GameInfo.PLAYER_X, GameInfo.PLAYER_Y, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.LEFT_PADDEL);
    const computer = new Player(GameInfo.COMPUTER_X, GameInfo.PLAYER_Y, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.RIGHT_PADDEL);
    const ball = new Ball(GameInfo.CANVAS_WIDTH / 2, GameInfo.CANVAS_HIEGHT / 2, GameInfo);
    const HoAreYou = useRef(0);
    const myCanvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setsocket] = useState<any>();
    const [numberPlayer, setnumberPlayer] = useState(0);
    const playagain = useRef(0)
    const [roomAvailable, setroomAvailable] = useState(true);
    const YouWonOrLostPlayAgain = useRef("");
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [opponent, setopponent] = useState<userProps>(userData);
    const router = useRouter();
    const playerLocation = useRef('left')

    const [gameStatus, setgameStatus] = useState({ player1Score: 0, player2Score: 0, yourStatus: '', yourPoints: 0 })

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch('http://localhost:3333/auth/user', {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        if (content.room == '' || content.isOnline == true)
                            router.push('/game')
                        const response2 = await fetch(`http://localhost:3333/users/getbyuserid/${content.opponentId}`, {
                            credentials: 'include',
                        });
                        const data = await response2.json()
                        setopponent(data)
                        setCurrentUser(content);
                    }
                } catch (error) {
                }
            }
        )();
    }, []);

    const [pointCard, setPointCard] = useState(false)
    let MyCanvas = useRef<Canvas>();
    let x = useRef(0)
    useEffect(() => {
        console.log("==========1")
        if (!myCanvasRef.current) return;
        MyCanvas.current = new Canvas(myCanvasRef.current, GameInfo)
        x.current++
        // setMyCanvas(s);
        console.log("==========2", x)
    }, [numberPlayer])

    useEffect(() => {
        console.log('room->', currentUser.room)

        const socketUrl = "http://localhost:3333/gameGateway";
        const newSocket = io(socketUrl, {
            query: {
                userId: currentUser.id,
            },
        });
        newSocket.emit("joinRoom", { room: currentUser.room, userId: currentUser.id, opponentId: opponent.id });
        newSocket.on('initGame', (game_) => {
            setnumberPlayer(2);
            const message = JSON.parse(game_);
            playerLocation.current = message.game.player1_Id == currentUser.id ? 'left' : message.game.player2_Id == currentUser.id ? 'right' : ''
        })

        newSocket.on('updateGame', (game_) => {
            const message = JSON.parse(game_);
            ball.x = message.game.Ball.ballX
            ball.y = message.game.Ball.ballY
            player.y = message.game.player1.y
            computer.y = message.game.player2.y
            // player.score = message.game.player1.score
            // computer.score = message.game.player2.score
            let status = ''
            let points = 0
            playerLocation.current == 'right' ?
                setgameStatus({
                    player1Score: message.game.player1.score,
                    player2Score: message.game.player2.score,
                    yourStatus: message.game.player2.status,
                    yourPoints: message.game.player2.points,
                }) :
                playerLocation.current == 'left' ?
                    setgameStatus({
                        player1Score: message.game.player1.score,
                        player2Score: message.game.player2.score,
                        yourStatus: message.game.player1.status,
                        yourPoints: message.game.player1.points,
                    }) : null
            if (MyCanvas.current)
                renderGameOverScreen(MyCanvas.current, ball, player, computer);
        });
        newSocket.on("playAgainIsDone", () => {
            setPointCard(false)
        })
        newSocket.on("ResumePause", (value: string) => {
            player.status = value
            computer.status = value
        })
        newSocket.on("leaveRoom", () => {
            setroomAvailable(false)
        })


        newSocket.on("documentHidden", (flag: boolean) => {
            const value = "Resume"
            player.status = value
            computer.status = value
        })
        newSocket.on("playAgain", (flag: boolean) => {
            playagain.current = playagain.current - 1
            console.log("you want playAgain")
        })
        setnumberPlayer(1);
        setsocket(newSocket);
        return () => {
            newSocket.disconnect();
            // newSocket.emit('joinRoom');
            // newSocket.off('joinRoom')
            // newSocket.off("updateGame")
        };

    }, [currentUser]);
    const handleMouseMove = (e: any) => {
        const rect = e.target.getBoundingClientRect();
        if (e.clientY - rect.top - GameInfo.PLAYER_HEIGHT / 2 > 0 && e.clientY - rect.top + GameInfo.PLAYER_HEIGHT / 2 < GameInfo.CANVAS_HIEGHT) {
            const posY = e.clientY - rect.top - (GameInfo.PLAYER_HEIGHT / 2)
            const posX = e.clientX
            socket.emit('MouseMove', { newPositionX: posX, newPositionY: posY, room: currentUser.room, userid: currentUser.id })
        }
    }

    const handelButtonGameStatus = () => {
        socket?.emit('ResumePause', { room: currentUser.room, userId: currentUser.id })
    }
    const handelButtonLeave = () => {
        router.push('/game');
    }
    const handelButtonYouWon = () => {
        router.push("/game")
    }
    const handelButtonYouLost = () => {
        router.push("/game")
    }
    const handelButtonPlayAgain = () => {
        socket?.emit('playAgain', { room: currentUser.room, userId: currentUser.id })
    }


    return (
        <div className="Gamebackground  w-full h-screen flex  justify-center   ">
            <div className=" relative w-full h-[800px] flex flex-col  justify-center items-center  mt-[70px]">
                {playerLocation.current == 'left' ?
                    (
                        <div className="w-[99%]  md:w-[70%] 2xl:w-[60%]  h-[100px] flex justify-between items-center ">
                            <div className="w-1/2 flex items-center space-x-1 md:space-x-2 text-2xl h-full">
                                <div className="relative  h-[60px] w-[60px] lg:h-[70px] lg:w-[70px]">
                                    <Image className=" rounded-full" src={currentUser.foto_user} fill alt={'user foto'} />
                                </div>
                                <div className="text-base lg:text-xl text-start">{currentUser.username}</div>
                                <div className="">
                                    {gameStatus.player1Score}
                                </div>
                            </div>
                            <button onClick={handelButtonGameStatus} className="relative w-[30px] h-[30px]">
                                <Image src={'/arrow-up.svg'} alt="pause" fill></Image>
                            </button>
                            <button onClick={handelButtonLeave} className="w-[70px] bg-whte rounded-lg border-2 border-black text-center m-1 text-xl">Leave</button>
                            <div className="w-1/2 flex items-center justify-end space-x-1 md:space-x-2 text-2xl h-full">
                                <div className="">
                                    {gameStatus.player2Score}
                                </div>
                                <div className="text-base lg:text-xl text-end">{opponent.username}</div>
                                <div className="relative h-[60px] w-[60px] lg:h-[70px] lg:w-[70px]">
                                    <Image className=" rounded-full" src={opponent.foto_user} fill alt={'user foto'} />
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <div className="w-[99%]  md:w-[70%] 2xl:w-[60%]  h-[100px] flex justify-between items-center ">
                            <div className="w-1/2 flex items-center space-x-1 md:space-x-2 text-2xl h-full">
                                <div className="relative  h-[60px] w-[60px] lg:h-[70px] lg:w-[70px]">
                                    <Image className=" rounded-full" src={opponent.foto_user} fill alt={'user foto'} />
                                </div>
                                <div className="text-base lg:text-xl text-start">{opponent.username}</div>
                                <div className="">
                                    {gameStatus.player1Score}
                                </div>
                            </div>
                            <button onClick={handelButtonGameStatus} className="relative w-[30px] h-[30px]">
                                <Image src={'/arrow-up.svg'} alt="pause" fill></Image>
                            </button>
                            <button onClick={handelButtonLeave} className="w-[70px] bg-whte rounded-lg border-2 border-black text-center m-1 text-xl">Leave</button>
                            <div className="w-1/2 flex items-center justify-end space-x-1 md:space-x-2 text-2xl h-full">
                                <div className="">
                                    {gameStatus.player2Score}
                                </div>
                                <div className="text-base lg:text-xl text-end">{currentUser.username}</div>
                                <div className="relative  h-[60px] w-[60px] lg:h-[70px] lg:w-[70px]">
                                    <Image className=" rounded-full" src={currentUser.foto_user} fill alt={'user foto'} />
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className=" relative w-full h-[600px] flex justify-center items-center ">

                    {numberPlayer == 1 ? (
                        <div className=" w-full h-[100%] flex items-center flex-col">
                            <div className="bg-red-400  ComputerCard  relative  overflow-hidden w-[99%] h-[70%]   md:h-[70%]  md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] rounded-md flex justify-center items-center">
                                <div className="">
                                    waiting for oponenet
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {numberPlayer == 2 ? (
                        <div className={`${!roomAvailable ? " hidden " : ""} w-full h-[100%] flex justify-center`}>
                            <canvas
                                className={`  border-2 rounded-sm md:rounded-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] `}
                                ref={myCanvasRef}
                                width={900}
                                height={450}
                                onMouseMove={handleMouseMove}
                            >
                            </canvas>
                        </div>
                    ) : null}
                    {
                        !roomAvailable && gameStatus.yourStatus == '' ? (<div className="w-[40%] h-[40%] bg-slate-200  rounded-3xl  absolute ">
                            <div className="flex flex-col items-center justify-center space-y-6 h-[50%]">
                                <h1 className="text-3xl ">You Won</h1>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-6 h-[50%]">
                                <button className="ease-in-out duration-500 bg-[#77A6F7] px-6 py-2 rounded-xl  outline outline-offset-2 outline-black hover:text-xl hover:px-8 hover:py-3 text-white font-bold"
                                    onClick={handelButtonYouWon}
                                >OK</button>
                            </div>
                        </div>) : null
                    }
                    {
                        gameStatus.yourStatus != '' ? (
                            <div className="absolute  w-full h-[100%] flex justify-center " >
                                <div className="border-2 rounded-sm md:rounded-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center ">
                                    {
                                        !pointCard ? (


                                            <div className="w-full h-full  flex justify-center items-center">
                                                <div className=" relative w-[100%] h-[100%] flex justify-center items-center ">
                                                    <Image className=" rounded-2xl  bg-black" width={500} height={0} alt="points" src={gameStatus.yourStatus == 'won' ? '/game/youwon.svg' : '/game/youlost.svg'} />
                                                    <div className=" absolute z-10 w-full h-full bg-red-20  flex flex-col justify-center items-center space-y-0">
                                                        <div className=" relative text-2xl  top-[22px]">
                                                            {
                                                                gameStatus.yourStatus == 'won' ? 'Your Won' : 'Your Lost'
                                                            }
                                                        </div>
                                                        <div className=" relative text-yellow-400 text-base 2xl:text-xl  top-[50px] -right-1">
                                                            +{gameStatus.yourPoints}
                                                        </div>
                                                        <button onClick={() => setPointCard((pre) => !pre)} className=" relative text-yellow-400  2xl:text-3xl  text-xl top-[120px]" >
                                                            Next
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-[70%] h-[70%] max-w-[500px] bg-slate-200  rounded-3xl  ">
                                                <div className="w-full bg-green-500 p-2 rounded-lg">
                                                    {!roomAvailable ? '1/2' : '2/2'}
                                                </div>
                                                <div className="flex flex-col items-center justify-center space-y-6 h-[50%]">
                                                    <h3 className="text-xl ">Play Again</h3>
                                                </div>
                                                <div className="flex  items-center justify-center space-x-6 h-[50%]">
                                                    <button className={`ease-in-out duration-500 ${!roomAvailable ? 'bg-green-300' : 'bg-green-400'} px-6 py-2 rounded-xl  outline outline-offset-2 outline-black hover:text-xl hover:px-8 hover:py-3 text-white font-bold`}
                                                        onClick={!roomAvailable ? undefined : handelButtonPlayAgain}
                                                    >OK</button>
                                                    <button className="ease-in-out duration-500 bg-red-400 px-6 py-2 rounded-xl  outline outline-offset-2 outline-black hover:text-xl hover:px-8 hover:py-3 text-white font-bold"
                                                        onClick={handelButtonYouLost}
                                                    >NO</button>
                                                </div>
                                                {YouWonOrLostPlayAgain.current}
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div >
    );
};

export default PlayOnline;
