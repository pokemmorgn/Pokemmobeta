import { setupCanvas, drawGame } from './draw.js';
import { updatePlayer, player } from './player.js';
import { handleInput } from './input.js';
import { initFirebase, syncPlayerData, getOtherPlayers } from './firebase.js';

setupCanvas();
initFirebase(player);

function gameLoop() {
  handleInput();
  updatePlayer();
  syncPlayerData(player);
  const others = getOtherPlayers();
  drawGame(player, others);
  requestAnimationFrame(gameLoop);
}

gameLoop();