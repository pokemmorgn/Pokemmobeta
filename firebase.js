import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Config
const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.appspot.com",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963"
};

// ✅ Initialisation
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

      // 🔁 Récupère pseudo et position locale
      const saved = localStorage.getItem("playerData");
      if (saved) {
        const { name, x, y } = JSON.parse(saved);
        player.name = name;
        player.x = x;
        player.y = y;
      } else {
        // Demande le pseudo une seule fois
        let name = "";
        while (!name || name.length < 2) {
          name = prompt("Ton pseudo ?").trim();
        }
        player.name = name;
        localStorage.setItem("playerData", JSON.stringify({
          name: player.name,
          x: player.x,
          y: player.y
        }));
      }

      initFirebase(player);
      if (callback) callback();
    }
  });
}

function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

  // ✅ Infos persistantes (ne les écrase qu’à la 1ère co)
  set(ref(db, "users/" + player.id), {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0
  });

  // ✅ Position temps réel
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
    // Sauvegarde localement aussi
    localStorage.setItem("playerData", JSON.stringify({
      name: player.name,
      x: player.x,
      y: player.y
    }));

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