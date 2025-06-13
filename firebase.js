import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, remove, onDisconnect, get
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// ✅ Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.appspot.com",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963"
};

// ✅ Initialisation avec la bonne région
const app = initializeApp(firebaseConfig);
const db = getDatabase(app, "https://pokemmo-d0275-default-rtdb.europe-west1.firebasedatabase.app");

let playerRef;
export let playersData = {};

// 🚀 Initialisation avec ID et pseudo persistants
export function authAndInit(player, callback) {
  // 1. Récupère ID local
  let savedId = localStorage.getItem("playerId");
  if (!savedId) {
    savedId = "id_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("playerId", savedId);
  }
  player.id = savedId;

  // 2. Récupère pseudo local
  let savedName = localStorage.getItem("playerName");
  while (!savedName) {
    const input = prompt("Ton pseudo ?");
    if (input && input.trim().length >= 2) {
      savedName = input.trim();
      localStorage.setItem("playerName", savedName);
    }
  }
  player.name = savedName;

  // 3. Charge la position enregistrée
  const userRef = ref(db, "users/" + player.id);
  get(userRef).then(snapshot => {
    const data = snapshot.val();
    if (data && typeof data.x === "number" && typeof data.y === "number") {
      player.x = data.x;
      player.y = data.y;
    }

    initFirebase(player);
    if (callback) callback();
  });
}

function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

  // Données persistantes (avec position)
  set(ref(db, "users/" + player.id), {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0,
    x: player.x,
    y: player.y
  });

  // Données temps réel
  set(playerRef, {
    name: player.name,
    x: player.x,
    y: player.y
  });

  onValue(ref(db, "players"), (snapshot) => {
    playersData = {};
    snapshot.forEach(child => {
      if (child.key !== player.id) {
        playersData[child.key] = child.val();
      }
    });
  });
}

export function syncPlayerData(player) {
  if (playerRef) {
    // Update temps réel
    set(playerRef, {
      name: player.name,
      x: player.x,
      y: player.y
    });

    // Update données persistantes (position sauvegardée)
    set(ref(db, "users/" + player.id), {
      name: player.name,
      skin: player.skin || "default",
      gold: player.gold || 0,
      x: player.x,
      y: player.y
    });
  }
}

export function getOtherPlayers() {
  return Object.entries(playersData).map(([id, p]) => ({ id, ...p }));
}
