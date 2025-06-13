import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, onDisconnect, get, child
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

let db, playerRef, userRef;
let playerId = localStorage.getItem("playerId");
if (!playerId) {
  playerId = Math.random().toString(36).substring(2, 9);
  localStorage.setItem("playerId", playerId);
}

let playersData = {};

export function initFirebase(player) {
  const firebaseConfig = {
    apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
    authDomain: "pokemmo-d0275.firebaseapp.com",
    projectId: "pokemmo-d0275",
    storageBucket: "pokemmo-d0275.appspot.com",
    messagingSenderId: "154574930778",
    appId: "1:154574930778:web:698ff50a31a49e2b482963"
  };

  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  // Charger données persistantes
  userRef = ref(db, "users/" + playerId);
  get(userRef).then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      player.name = data.name || "Joueur";
      player.skin = data.skin || "default";
      player.gold = data.gold || 0;
    } else {
      player.name = prompt("Ton pseudo ?") || "Joueur";
      player.skin = "default";
      player.gold = 0;
      saveUserData(player);
    }
  });

  player.id = playerId;
  playerRef = ref(db, "players/" + playerId);
  onDisconnect(playerRef).remove();

  onValue(ref(db, "players"), snapshot => {
    const all = snapshot.val() || {};
    playersData = {};
    for (const id in all) {
      if (id !== playerId) {
        playersData[id] = all[id];
      }
    }
  });
}

export function saveUserData(player) {
  if (!db || !userRef) return;
  set(userRef, {
    name: player.name,
    skin: player.skin,
    gold: player.gold
  });
}

export function syncPlayerData(player) {
  if (!db || !playerRef) return;
  set(playerRef, {
    x: player.x,
    y: player.y,
    name: player.name
  });
}

export function getOtherPlayers() {
  return playersData;
}