// import { play } from "https://deno.land/x/audio@0.2.0/mod.ts";
import { NodeSound } from "npm:node-sound@0.0.8";
const player = NodeSound.getDefaultPlayer();
player.play("sound.wav");
