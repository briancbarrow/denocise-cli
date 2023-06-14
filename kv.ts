const kv = await Deno.openKv("kv.sqlite3");

await kv.set(
  ["exercises"],
  [
    "Pushups",
    "Bodyweight Squats",
    "Pullups/Chinups",
    "Bird Dogs",
    "Modified Curl-Ups",
    "Side Plank",
    "Goblet Squats",
    "Dips",
    "Plank",
    "Dumbbell Curls",
    "Dumbbell Chest Fly (floor)",
    "Glute Bridge",
    "Reverse Hyper",
    "Overhead Tricep Press",
  ]
);
// console.log("kv", kv);
// const res = await kv.get(["exercises"]);
// const iter = await kv.list({ prefix: ["Bird Dogs"] });
// await kv.set(["Bird Dogs", "5/26/2023"], [4, 4, 4]);
// console.log("iter", iter);
// // const users: any = [];
// for await (const amt of iter) {
//   console.log(amt);
// }
// const res = await kv.delete(["Pushups", "5/24/2023"]);
// console.log("res", res);
