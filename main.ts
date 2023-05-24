// import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
// import ProgressBar from "https://deno.land/x/progress@v1.3.8/mod.ts";
import { NodeSound } from "npm:node-sound@0.0.8";
const player = NodeSound.getDefaultPlayer();
import { parse } from "https://deno.land/std/flags/mod.ts";
import { updateBars } from "./progress.ts";
const { args } = Deno;
const parsedArgs = parse(args);
const kv = await Deno.openKv();
const newArgs: Args = {
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

function main() {
  // const availableExercises = await kv.get(["exercises"]);
  // let selectedExercises: string[] = [];
  // if (availableExercises) {
  //   console.log(availableExercises);
  //   selectedExercises = await Checkbox.prompt({
  //     message: "Select two exercises",
  //     options: availableExercises.value,
  //     minOptions: 2,
  //     maxOptions: 2,
  //   });
  //   console.log(selectedExercises);
  // }
  // newTimer(newArgs.sessions);
  // console.log({ parsedArgs });
}

function newTimer(sessions: number): void {
  Deno.addSignalListener("SIGINT", () => {
    showCursor();
    Deno.exit();
  });
  if (sessions === 0) {
    showCursor();
  } else {
    if (sessions < newArgs.sessions || !isFocus) {
      showCursor();
      const cont = confirm(
        `\nStart next ${isFocus ? "focus" : "break"} session?`,
      );
      if (!cont) {
        showCursor();
        Deno.exit();
      }
    }
    const timerLength = isFocus ? newArgs.focus : newArgs.break;
    const endTime = new Date().getTime() + timerLength * 60 * 1000;
    const totalTime = timerLength * 60 * 1000;
    const updateInterval = setInterval(async () => {
      const now = new Date().getTime();
      const distance = Math.round((endTime - now) / 1000) * 1000;
      if (distance >= 0) {
        await updateBars(totalTime, totalTime - distance, distance);
      }
      if (distance === 0) {
        player.play("sound.wav");

        clearInterval(updateInterval);
        if (!isFocus) {
          sessions--;
        }
        isFocus = !isFocus;
        newTimer(sessions);
      }
    }, 1000);
  }
}

function showCursor() {
  const encoder = new TextEncoder();
  Deno.stdout.write(encoder.encode("\x1B[?25h"));
}
const res = await kv.get(["exercises"]);
console.log(res);
main();
