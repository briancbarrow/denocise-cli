// import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
// import ProgressBar from "https://deno.land/x/progress@v1.3.8/mod.ts";
import {
  Checkbox,
  Number,
} from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
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
const getExercises = await kv.get(["exercises"]);
const availableExercises = getExercises.value;
let selectedExercises: string[] = [];
if (availableExercises) {
  selectedExercises = await Checkbox.prompt({
    message: "Select two exercises",
    options: availableExercises,
    minOptions: 2,
    maxOptions: 2,
  });
}
type Args = {
  focus: number;
  break: number;
  "long-break": number;
  sessions: number;
};

await new Command()
  .name("denocise")
  .version("0.1.0")
  .description("Deno Pomodoro Timer with Exercises")
  .option("-f, --focus <minutes:number>", "Focus session length in minutes", {
    default: 25,
  })
  .option("-b, --break <minutes:number>", "Break session length in minutes", {
    default: 5,
  })
  .option(
    "-lb, --long-break <minutes:number>",
    "Long break session length in minutes",
    { default: 15 },
  )
  .option("-s, --sessions <number:number>", "Number of sessions", {
    default: 4,
  })
  .action((options, ...args) => {
    newTimer(options.sessions);
  })
  .parse();

// async function main() {

//   newTimer(newArgs.sessions);
//   // console.log({ parsedArgs });
// }

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
          for (const exercise of selectedExercises) {
            showCursor();
            const exerciseAmt = await Number.prompt(
              `\n How many ${exercise} did you do?`,
            );
            let exerciseAmts: number[] = [];
            const getAmt = await kv.get([
              exercise,
              new Date().toLocaleDateString(),
            ]);
            if (getAmt.value) {
              console.log("value", getAmt.value);
              exerciseAmts = getAmt.value;
              exerciseAmts.push(exerciseAmt);
            } else {
              exerciseAmts.push(exerciseAmt);
            }
            const setAmt = await kv.set(
              [exercise, new Date().toLocaleDateString()],
              exerciseAmts,
            );
            console.log(setAmt);
          }
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
// const res = await kv.get(["exercises"]);
// console.log(res);
// main();
