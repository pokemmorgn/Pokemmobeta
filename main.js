import Player from './player.js';
import InputManager from './inputManager.js';
import { db, auth } from './firebaseConfig.js';
import {
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  ref,
  set,
  onValue,
  serverTimestamp,
  get,
  child
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
  parent: 'game-container',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let inputManager;
let userId;
let playersData = {};

// Générateur pseudo aléatoire simple
function getRandomPseudo() {
  const adjectives = ["Rapide", "Sage", "Fou", "Brave", "Furtif", "Fort"];
  const animals = ["Renard", "Loup", "Ours", "Faucon", "Tigre", "Lynx"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}${Math.floor(Math.random() * 1000)}`;
}

let myPseudo = getRandomPseudo();

function preload() {}

async function create() {
  inputManager = new InputManager(this);

  signInAnonymously(auth)
    .then(() => console.log("Connexion anonyme réussie"))
    .catch((error) => console.error("Erreur connexion anonyme :", error));

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId = user.uid;
      console.log("Utilisateur connecté, UID:", userId);

      const savedData = await loadMyData();

      if (savedData && savedData.x !== undefined && savedData.y !== undefined && savedData.pseudo) {
        myPseudo = savedData.pseudo;
        player = new Player(this, savedData.x, savedData.y, inputManager, 0xff0000, myPseudo);
        console.log("Données chargées :", savedData);
      } else {
        player = new Player(this, 400, 300, inputManager, 0xff0000, myPseudo);
        console.log("Pas de données sauvegardées, position & pseudo par défaut");
      }

      startPlayersListener(this);
      updateMyData(player.pos.x, player.pos.y, myPseudo);

      window.addEventListener('beforeunload', () => {
        removePlayerFromDB();
      });
    }
  });
}

function update(time, delta) {
  if (!userId || !player) return;

  const moved = player.update(delta);

  if (moved) {
    updateMyData(player.pos.x, player.pos.y, myPseudo);
  }
}

async function loadMyData() {
  if (!userId) return null;
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `players/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lecture données Firebase:", error);
    return null;
  }
}

function updateMyData(x, y, pseudo) {
  if (!userId) return;
  set(ref(db, `players/${userId}`), {
    x,
    y,
    pseudo,
    lastUpdate: serverTimestamp()
  });
}

function removePlayerFromDB() {
  if (!userId) return;
  set(ref(db, `players/${userId}`), null);
}

function startPlayersListener(scene) {
  const playersRef = ref(db, 'players');

  onValue(playersRef, (snapshot) => {
    const players = snapshot.val() || {};

    if (!userId) return;

    const now = Date.now();

    for (let id in players) {
      if (id === userId) continue;

      const data = players[id];
      const isActive = data.lastUpdate && (now - data.lastUpdate <= 30000);

      if (!playersData[id]) {
        const sprite = scene.add.rectangle(data.x, data.y, 40, 40, 0x0000ff).setOrigin(0.5);
        const nameText = scene.add.text(data.x, data.y - 30, data.pseudo || "???", {
          font: "16px Arial",
          fill: "#000000",
          stroke: "#ffffff",
          strokeThickness: 2,
          align: "center"
        }).setOrigin(0.5);

        playersData[id] = { sprite, nameText };
      }

      playersData[id].sprite.x = data.x;
      playersData[id].sprite.y = data.y;
      playersData[id].nameText.x = data.x;
      playersData[id].nameText.y = data.y - 30;
      playersData[id].nameText.setText(data.pseudo || "???");

      playersData[id].sprite.visible = isActive;
      playersData[id].nameText.visible = isActive;
    }
  });
}