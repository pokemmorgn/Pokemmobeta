export let targetX = null;
export let targetY = null;
export let keys = {};

export function cancelTarget() {
  targetX = null;
  targetY = null;
}

export function setupInput(canvas) {
  window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
  window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    targetX = t.clientX - rect.left;
    targetY = t.clientY - rect.top;
  });
}