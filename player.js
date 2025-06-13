import { targetX, targetY } from './input.js';

export const player = {
  id: null,
  x: 300,
  y: 300,
  size: 30,
  color: 'red',
  name: "Joueur",
  skin: "default",
  gold: 0,
  speed: 2
};

export function updatePlayer() {
  const speed = player.speed;
  let usedKeyboard = false;

  if (window.keys['arrowup'] || window.keys['w']) {
    player.y -= speed;
    usedKeyboard = true;
  }
  if (window.keys['arrowdown'] || window.keys['s']) {
    player.y += speed;
    usedKeyboard = true;
  }
  if (window.keys['arrowleft'] || window.keys['a']) {
    player.x -= speed;
    usedKeyboard = true;
  }
  if (window.keys['arrowright'] || window.keys['d']) {
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

function cancelTarget() {
  window.targetX = null;
  window.targetY = null;
}