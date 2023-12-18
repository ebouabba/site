// import React, { useEffect, useRef, useState, RefObject } from "react";
// import { Player, Canvas, Ball, GameInfo } from "./class";
// import { InfoGameFromClientProps } from "@/interface/model";

// //lerp

// function LinearInterpolation(pos1: number, pos2: number, t: number) {
//   return pos1 + (pos2 - pos1) * t;
// }

// const updateGameLoop = (MyCanvas: Canvas, mousePosition: { x: number; y: number }, ball: Ball, player: Player, computer: Player, selectPlayer: string, HoAreYou: any) => {

//   GameInfo.CANVAS_WIDTH = MyCanvas.width;
//   GameInfo.CANVAS_HIEGHT = MyCanvas.height;
//   if (selectPlayer === "computer") {
//     const newY = LinearInterpolation(computer.y, ball.y - computer.height / 2, GameInfo.LEVEL);
//     if (newY > -10 && (newY + computer.height < MyCanvas.height + 10))
//       computer.y = newY;
//   }
//   else {
//     if (mousePosition.x > -10 && (mousePosition.x + computer.height < MyCanvas.height + 10))
//       computer.y = mousePosition.x;
//   }

//   if (mousePosition.y > -10 && (mousePosition.y + player.height < MyCanvas.height + 10))
//     player.y = mousePosition.y;
//   // console.log(HoAreYou.current)
//   if (HoAreYou.current == 1)
//     return

//   ball.x += ball.velocityX;
//   ball.y += ball.velocityY;
//   ball.setBorder();
//   player.setBorder();
//   computer.setBorder();
//   if (ball.bottom + 2 > MyCanvas.height || ball.top - 2 < 0)
//     ball.velocityY *= -1;

//   let selectPlayerCollision = ball.x < MyCanvas.width / 2 ? player : computer;
//   if (ball.checkCollision(selectPlayerCollision))
//     MyCanvas.moveBall(ball, selectPlayerCollision);
// };

// const renderGameOverScreen = (
//   MyCanvas: Canvas,
//   ball: Ball,
//   player: Player,
//   computer: Player
// ) => {
//   MyCanvas.ClearCanvas();
//   MyCanvas.drawRect(player);
//   MyCanvas.drawRect(computer);
//   MyCanvas.drawMedianLine({ w: 2, h: 10, step: 20, color: "#FFFFFF" });
//   MyCanvas.drawCircle(ball);

//   MyCanvas.drawText(String(player.score), 300, 60, "white");
//   MyCanvas.drawText(String(computer.score), 700, 60, "white");
// };
// export interface startGameProps {
//   myCanvasRef: React.RefObject<HTMLCanvasElement>;
//   mousePosition: { x: number; y: number };
//   ball: Ball;
//   player: Player;
//   computer: Player;
//   selectPlayer: string;
//   HoAreYou: any
// }
// export function startGame({ myCanvasRef, mousePosition, ball, player, computer, selectPlayer, HoAreYou }: startGameProps) {
//   if (!myCanvasRef.current) return;
//   const MyCanvas = new Canvas(myCanvasRef.current);
//   computer.x = MyCanvas.width - 10
//   if (computer.status == 'Resume' || player.status == 'Resume')
//     return
//   updateGameLoop(MyCanvas, mousePosition, ball, player, computer, selectPlayer, HoAreYou);
//   renderGameOverScreen(MyCanvas, ball, player, computer);
// }

// // initializeGame
// // drawCanvas
// // movePaddle
// // moveBall
// // checkCollision
// // resetGame
// // startGame
// // stopGame
// // updateScore
// // renderScore
// // checkWinCondition
// // endGame
// // handleUserInput
// // updateGameLoop
// // renderGameOverScreen
// // restartGame
// // pauseGame
// // resumeGame
// // adjustDifficulty
// // renderInstructions
