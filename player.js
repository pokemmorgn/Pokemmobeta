import { targetX, targetY } from './input.js';

export const player = {
  x: 300,
  y: 300,
  size: 30,
  color: 'red',
  speed: 2,
  name: "Psyduck" // ← Change ce nom si tu veux
};

export function updatePlayer() {
  const speed = player.speed;
  let usedKeyboard = false;

  // Déplacements clavier
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

  // Si on utilise le clavier, on annule la cible
  if (usedKeyboard) {
    cancelTarget();
  }

  // Déplacement vers la cible (clic / doigt)
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
  // Supprime la cible tactile ou souris
  targetX = null;
  targetY = null;
}