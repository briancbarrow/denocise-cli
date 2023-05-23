// export const enum ProgressIndicatorType {
//   BAR,
//   PERCENT,
//   DOTS,
// }

// export class ProgressIndicator {
//   private numUnits: number;
//   private nextUpdateTS: number = Date.now();
//   private enc: TextEncoder = new TextEncoder();
//   private type: ProgressIndicatorType;
//   private updateInterval: number = 100;
//   private dotsCounter: number = 0;
//   private updateFn;

//   constructor(numUnits: number = 0) {
//     this.updateFn = this.updateBars;
//   }

const encoder = new TextEncoder();

async function writeString(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export async function updateBars(
  total: number,
  completed: number = 0,
  distance: number
) {
  // console.log("updateBars");
  // const progChunkSize = Math.round(t / this.numUnits);
  const numProgBars = 60;
  const pctDone = completed / total;
  const pctProg = Math.ceil((completed / total) * numProgBars);
  const minutes = Math.floor(distance / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  await writeString("\r|");
  for (let i = 0; i < numProgBars; i++) {
    i <= pctProg ? await writeString("█") : await writeString("░");
  }
  await writeString("| ");
  await writeString(`${minutes}:${seconds}\x1b[?25l`);
}

// private async updatePct(t: number, c: number = 0) {
//   const pct = ((c / t) * 100).toFixed(0);
//   await this.writeString("\rCompleted " + pct + "%");
// }

// public async update(t: number, c: number = 0, d: number) {
//   const currTS = Date.now();
//   if (c < t && currTS < this.nextUpdateTS) return;
//   await this.updateFn(t, c, d);
//   this.nextUpdateTS = currTS + this.updateInterval;
// }
// }
