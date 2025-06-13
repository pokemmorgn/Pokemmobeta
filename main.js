import { setupCanvas, drawGame } from './draw.js';
import { updatePlayer, player } from './player.js';
import { handleInput } from './input.js';
import { authAndInit, syncPlayerData, getOtherPlayers } from './firebase.js';

setupCanvas();
const canvas = document.getElementById("gameCanvas");
handleInput(canvas);

authAndInit(player, () => {
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  updatePlayer();
  syncPlayerData(player);
  const others = getOtherPlayers();
  drawGame(player, others);
  requestAnimationFrame(gameLoop);
}