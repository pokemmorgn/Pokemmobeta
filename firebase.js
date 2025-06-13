import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase, ref, set, get, onValue, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6xA7QiWQP99RGT8xa03IYYXFgko3cPXU",
  authDomain: "pokemmo-d0275.firebaseapp.com",
  projectId: "pokemmo-d0275",
  storageBucket: "pokemmo-d0275.appspot.com",
  messagingSenderId: "154574930778",
  appId: "1:154574930778:web:698ff50a31a49e2b482963"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app, "https://pokemmo-d0275-default-rtdb.europe-west1.firebasedatabase.app");
const auth = getAuth(app);

let playerRef;
export let playersData = {};

export function authAndInit(player, callback) {
  // Essaie de récupérer l’uid et le pseudo sauvegardés
  const savedUid = localStorage.getItem('uid');
  const savedName = localStorage.getItem('name');

  if (savedUid && savedName) {
    // On a déjà un utilisateur sauvegardé, on l’utilise
    player.id = savedUid;
    player.name = savedName;
    initFirebase(player);
    if (callback) callback();
  } else {
    // Sinon, on s’authentifie anonymement
    signInAnonymously(auth).catch(console.error);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        player.id = user.uid;

        const userRef = ref(db, "users/" + player.id);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          player.name = userData.name;
          player.skin = userData.skin || "default";
          player.gold = userData.gold || 0;
        } else {
          const input = prompt("Ton pseudo ?");
          player.name = input?.trim() || "Anonyme";

          await set(userRef, {
            name: player.name,
            skin: "default",
            gold: 0
          });
        }

        // Sauvegarde dans localStorage
        localStorage.setItem('uid', player.id);
        localStorage.setItem('name', player.name);

        initFirebase(player);
        if (callback) callback();
      }
    });
  }
}

// Enregistrement des positions en temps réel
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

// Mise à jour en temps réel
export function syncPlayerData(player) {
  if (playerRef) {
    set(playerRef, {
      name: player.name,
      x: player.x,
      y: player.y
    });
  }
}

// Autres joueurs
export function getOtherPlayers() {
  return Object.entries(playersData).map(([id, p]) => ({ id, ...p }));
}