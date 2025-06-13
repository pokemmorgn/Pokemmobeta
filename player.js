import { targetX, targetY, keys, cancelTarget } from './input.js';

export const player = {
  id: localStorage.getItem("playerId") || crypto.randomUUID(),
  x: 300,
  y: 300,
  size: 30,
  color: 'red',
  name: prompt("Ton pseudo ?") || "Joueur",
  skin: "default",
  gold: 0,
  speed: 2
};

localStorage.setItem("playerId", player.id);

export function updatePlayer() {
  const speed = player.speed;
  let usedKeyboard = false;

  if (keys['arrowup'] || keys['w']) {
    player.y -= speed;
    usedKeyboard = true;
  }
  if (keys['arrowdown'] || keys['s']) {
    player.y += speed;
    usedKeyboard = true;
  }
  if (keys['arrowleft'] || keys['a']) {
    player.x -= speed;
    usedKeyboard = true;
  }
  if (keys['arrowright'] || keys['d']) {
    player.x += speed;
    usedKeyboard = true;
  }

  if (usedKeyboard) cancelTarget();

  if (targetX !== null && targetY !== null) {
    const dx = targetX - (player.x + player.size / 2);
    const dy = targetY - (player.y + player.size / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      player.x += (dx / dist) * speed;
      player.y += (dy / dist) * speed;
    }
  }
}