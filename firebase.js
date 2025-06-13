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

// ✅ Initialisation Firebase avec bonne région
const app = initializeApp(firebaseConfig);
const db = getDatabase(app, "https://pokemmo-d0275-default-rtdb.europe-west1.firebasedatabase.app");

let playerRef;
export let playersData = {};

// ✅ Authentifie via ID local + récupère nom et position
export function authAndInit(player, callback) {
  let id = localStorage.getItem("playerId");
  if (!id) {
    id = "player_" + Math.floor(Math.random() * 1000000);
    localStorage.setItem("playerId", id);
  }
  player.id = id;

  const userRef = ref(db, "users/" + player.id);

  get(userRef).then(snapshot => {
    const data = snapshot.val();

    if (data && data.name) {
      player.name = data.name;
      player.x = data.x ?? 100;
      player.y = data.y ?? 100;
    } else {
      let name = "";
      while (!name || name.trim().length < 2) {
        name = prompt("Ton pseudo ?");
      }
      player.name = name.trim();
      player.x = 100;
      player.y = 100;

      set(userRef, {
        name: player.name,
        skin: player.skin || "default",
        gold: player.gold || 0,
        x: player.x,
        y: player.y
      });
    }

    initFirebase(player);
    if (callback) callback();
  });
}

function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

  // Sauvegarde position en temps réel
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
    set(playerRef, {
      name: player.name,
      x: player.x,
      y: player.y
    });
  }

  // Enregistre aussi dans "users" pour persistance
  set(ref(db, "users/" + player.id), {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0,
    x: player.x,
    y: player.y
  });
}

export function getOtherPlayers() {
  return Object.entries(playersData).map(([id, p]) => ({ id, ...p }));
}