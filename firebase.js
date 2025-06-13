import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, remove, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

const auth = getAuth(app);
let playerRef;
export let playersData = {};

export function authAndInit(player, callback) {
  signInAnonymously(auth).catch(console.error);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      player.id = user.uid;

      // ✅ Clé unique liée à l'utilisateur
      const nameKey = "playerName_" + player.id;
      let savedName = localStorage.getItem(nameKey);

      while (!savedName) {
        const input = prompt("Ton pseudo ?");
        if (input && input.trim().length >= 2) {
          savedName = input.trim();
          localStorage.setItem(nameKey, savedName);
        }
      }

      player.name = savedName;

      initFirebase(player);
      if (callback) callback();
    }
  });
}

function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

  // Données persistantes (utilisateur)
  set(ref(db, "users/" + player.id), {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0
  });

  // Données temps réel (position)
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
}

export function getOtherPlayers() {
  return Object.entries(playersData).map(([id, p]) => ({ id, ...p }));
}