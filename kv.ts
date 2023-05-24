const kv = await Deno.openKv();

// await kv.set(["exercises"], [
//   "Pushups",
//   "Bodyweight Squats",
//   "Pullups/Chinups",
//   "Bird Dogs",
//   "Modified Curl-Ups",
//   "Side Plank",
//   "Goblet Squats",
//   "Dips",
//   "Plank",
//   "Dumbbell Curls",
//   "Dumbbell Chest Fly (floor)",
//   "Glute Bridge",
// ]);

const res = await kv.get(["Pushups", "5/24/2023"]);
// const iter = await kv.list({ prefix: ["Pushups"] });
// // const users: any = [];
// for await (const amt of iter) {
//   console.log(amt);
// }
// const res = await kv.delete(["Pushups", "5/24/2023"]);
console.log("res", res);
