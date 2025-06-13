import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

let db, playerRef;
let playerId = Math.random().toString(36).substring(2, 9); // ID unique
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

  player.id = playerId;
  playerRef = ref(db, "players/" + playerId);

  // Écoute tous les joueurs
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

export function syncPlayerData(player) {
  if (!db || !playerRef) return;
  set(playerRef, {
    x: player.x,
    y: player.y,
    name: player.name || "Player"
  });
}

export function getOtherPlayers() {
  return playersData;
}