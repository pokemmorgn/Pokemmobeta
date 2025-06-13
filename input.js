window.keys = {};
export let targetX = null;
export let targetY = null;

window.addEventListener('keydown', e => {
  window.keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', e => {
  window.keys[e.key.toLowerCase()] = false;
});

// Gère le clic ou glissement doigt
window.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
});

window.addEventListener('touchstart', e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  targetX = touch.clientX - rect.left;
  targetY = touch.clientY - rect.top;
});
window.addEventListener('touchmove', e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  targetX = touch.clientX - rect.left;
  targetY = touch.clientY - rect.top;
});