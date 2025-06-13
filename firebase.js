import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, get, onValue, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.appspot.com",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app, "https://pokemmo-d0275-default-rtdb.europe-west1.firebasedatabase.app");
const auth = getAuth(app);

let playerRef;
export let playersData = {};

export function authAndInit(player, callback) {
  signInAnonymously(auth).catch(console.error);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      player.id = user.uid;
      const userRef = ref(db, "users/" + player.id);
      const snapshot = await get(userRef);

      if (snapshot.exists() && snapshot.val().name) {
        const userData = snapshot.val();
        console.log("Chargement userData:", userData);

        player.name = userData.name;
        player.skin = userData.skin || "default";
        player.gold = userData.gold || 0;

        // Récupérer la position, vérifie bien pour 0 aussi
        player.x = (userData.x !== undefined) ? userData.x : player.x;
        player.y = (userData.y !== undefined) ? userData.y : player.y;

        console.log(`Position chargée: x=${player.x}, y=${player.y}`);

      } else {
        const input = prompt("Ton pseudo ?");
        player.name = input?.trim() || "Anonyme";

        await set(userRef, {
          name: player.name,
          skin: "default",
          gold: 0,
          x: player.x,
          y: player.y
        });
        console.log("Nouvel utilisateur créé:", player.name);
      }

      initFirebase(player);
      if (callback) callback();
    }
  });
}

function initFirebase(player) {
  playerRef = ref(db, "players/" + player.id);
  onDisconnect(playerRef).remove();

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
  if (!player.id) return;

  // Mise à jour dans users/<uid>
  const userRef = ref(db, "users/" + player.id);
  set(userRef, {
    name: player.name,
    skin: player.skin || "default",
    gold: player.gold || 0,
    x: player.x,
    y: player.y
  }).then(() => {
    // console.log("Position sauvegardée dans users");
  }).catch(err => {
    console.error("Erreur sauvegarde users:", err);
  });

  // Mise à jour dans players/<uid>
  if (playerRef) {
    set(playerRef, {
      name: player.name,
      x: player.x,
      y: player.y
    }).catch(err => {
      console.error("Erreur sauvegarde players:", err);
    });
  }
}

export function getOtherPlayers() {
  return Object.entries(playersData).map(([id, p]) => ({ id, ...p }));
}