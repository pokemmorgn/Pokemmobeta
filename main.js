import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// === CONFIG FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.firebasestorage.app",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963",
  databaseURL: "https://pokemmo-d0275-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAP_WIDTH = 320;
const MAP_HEIGHT = 320;
const PLAYER_SIZE = 32;
const SPEED = 2;

let uid = null;
let keys = {};
let allPlayers = {};
let player = {
  x: 100,
  y: 100,
  color: "red",
  name: "",
};
let moveTarget = null;

// === AUTHENTIFICATION ===
signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    player.name = "Joueur_" + uid.slice(0, 4);
    const playerRef = ref(db, "players/" + uid);

    set(playerRef, {
      x: player.x,
      y: player.y,
      color: player.color,
      name: player.name,
      connected: true
    });

    onValue(ref(db, "players"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        allPlayers = data;
        if (data[uid]) {
          player.x = data[uid].x;
          player.y = data[uid].y;
        }
        draw();
      }
    });
  }
});

// === CLAVIER
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// === CLIC / DOIGT POUR MOUVEMENT VERS CIBLE
function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
}

canvas.addEventListener("mousedown", (e) => moveTarget = getPointerPos(e));
canvas.addEventListener("mousemove", (e) => {
  if (e.buttons === 1) moveTarget = getPointerPos(e);
});
canvas.addEventListener("touchstart", (e) => moveTarget = getPointerPos(e));
canvas.addEventListener("touchmove", (e) => moveTarget = getPointerPos(e));

// === DEPLACEMENT
function updateMovement() {
  let moved = false;

  // Clavier
  if (keys["z"] || keys["arrowup"])    { player.y -= SPEED; moved = true; }
  if (keys["s"] || keys["arrowdown"])  { player.y += SPEED; moved = true; }
  if (keys["q"] || keys["arrowleft"])  { player.x -= SPEED; moved = true; }
  if (keys["d"] || keys["arrowright"]) { player.x += SPEED; moved = true; }

  // Limites map
  player.x = Math.max(0, Math.min(MAP_WIDTH - PLAYER_SIZE, player.x));
  player.y = Math.max(0, Math.min(MAP_HEIGHT - PLAYER_SIZE, player.y));

  // Mouvement vers un point cliqué/touché
  if (!moved && moveTarget) {
    const dx = moveTarget.x - (player.x + PLAYER_SIZE / 2);
    const dy = moveTarget.y - (player.y + PLAYER_SIZE / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      player.x += (dx / dist) * SPEED;
      player.y += (dy / dist) * SPEED;
      moved = true;
    }
  }

  return moved;
}

// === FIREBASE SYNC
let lastSentX = player.x;
let lastSentY = player.y;

function syncFirebaseIfMoved() {
  const movedEnough = Math.abs(player.x - lastSentX) > 0.5 || Math.abs(player.y - lastSentY) > 0.5;
  if (movedEnough && uid) {
    lastSentX = player.x;
    lastSentY = player.y;
    set(ref(db, "players/" + uid), {
      x: player.x,
      y: player.y,
      color: player.color,
      name: player.name,
      connected: true
    });
  }
}

// === DESSIN
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in allPlayers) {
    const p = allPlayers[id];
    if (!p) continue;

    ctx.fillStyle = id === uid ? player.color : "blue";
    ctx.fillRect(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE);

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(p.name || "???", p.x + PLAYER_SIZE / 2, p.y - 4);
  }
}

// === BOUCLE
function loop() {
  const moved = updateMovement();
  if (moved) draw();
  syncFirebaseIfMoved();
  requestAnimationFrame(loop);
}

loop();