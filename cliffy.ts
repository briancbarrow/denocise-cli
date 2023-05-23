// import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
// import ProgressBar from "https://deno.land/x/progress@v1.3.8/mod.ts";
import { NodeSound } from "npm:node-sound@0.0.8";
const player = NodeSound.getDefaultPlayer();
import { parse } from "https://deno.land/std/flags/mod.ts";
import { updateBars } from "./progress.ts";
const { args } = Deno;
const parsedArgs = parse(args);
let newArgs: Args = {
  focus: parsedArgs.focus || parsedArgs.f || 25,
  break: parsedArgs.break || parsedArgs.b || 5,
  "long-break": parsedArgs["long-break"] || parsedArgs.lb || 15,
  sessions: parsedArgs.sessions || parsedArgs.s || 4,
};
let isFocus = true;
// globalThis.addEventListener("unload", () => {
//   console.log("unload");
//   const encoder = new TextEncoder();
//   Deno.stdout.write(encoder.encode("\x1B[?25h"));
//   Deno.stdout.write("HELLO THERE");
//   console.log("unload complete");
// });

type Args = {
  focus: number;
  break: number;
  "long-break": number;
  sessions: number;
};

async function main() {
  await newTimer(newArgs.sessions);
}

async function runTimer(options) {
  console.log("runTimer", options);
  let sessions = options.sessions;
  let isFocus = true;
  for (let i = 0; i < sessions; i++) {
    console.log("while loop", sessions);
    if (isFocus) {
      console.log("Focus session started");
      await startTimer(options.focus);
    } else {
      console.log("Break session started");
      await startTimer(options.break);
    }
    console.log("Session ended");
    isFocus = !isFocus;
    sessions--;
  }
  console.log("after while loop");
}

async function startTimer(timerLength: number) {
  // return new Promise((resolve, reject) => {
  console.log("Starting timer");
  const countdownTime = new Date().getTime() + timerLength * 60 * 1000;
  const total = timerLength * 60 * 1000;

  function timer() {
    let now = new Date().getTime();
    let distance = Math.round((countdownTime - now) / 1000) * 1000;
    if (distance >= 0) {
      updateBars(total, total - distance, distance);
      setInterval(function () {
        timer();
      }, 1000);
    }
  }
  console.log("Starting timer function");
  timer();
  console.log("Starting timer function complete");
  // });
}

function newTimer(sessions: number): void {
  Deno.addSignalListener("SIGINT", () => {
    showCursor();
    Deno.exit();
  });

  // console.log("newTimer");
  // get number of sessions and if focus or break

  // if sessions is 0, exit
  if (sessions === 0) {
    showCursor();
  } else {
    if (sessions < newArgs.sessions || !isFocus) {
      player.play("sound.wav");
      showCursor();
      const cont = confirm(
        `\nStart next ${isFocus ? "focus" : "break"} session?`
      );
      if (!cont) {
        showCursor();
        Deno.exit();
      }
    }
    // console.log("Starting new timer");
    const timerLength = isFocus ? newArgs.focus : newArgs.break;
    const endTime = new Date().getTime() + timerLength * 60 * 1000;
    const totalTime = timerLength * 60 * 1000;
    const updateInterval = setInterval(async () => {
      let now = new Date().getTime();
      let distance = Math.round((endTime - now) / 1000) * 1000;
      if (distance >= 0) {
        await updateBars(totalTime, totalTime - distance, distance);
      }
      if (distance === 0) {
        clearInterval(updateInterval);
        if (!isFocus) {
          sessions--;
        }
        isFocus = !isFocus;
        newTimer(sessions);
      }
    }, 1000);
  }

  // if sessions is not 0, start timer
  // if isFocus, start focus timer
  // if !isFocus, start break timer
  // when timer is complete, decrement sessions and flip isFocus
  // prompt user to start next timer
}

function showCursor() {
  const encoder = new TextEncoder();
  Deno.stdout.write(encoder.encode("\x1B[?25h"));
  // Deno.exit();
}

main();
