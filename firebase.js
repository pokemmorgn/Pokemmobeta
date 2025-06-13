import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, remove, get, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.appspot.com",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let playerRef;
export let playersData = {};

export function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

  set(ref(db, "users/" + player.id), {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0
  });

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