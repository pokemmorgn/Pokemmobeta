import Player from './player.js';
import InputManager from './inputManager.js';
import MapLoader from './mapLoader.js';
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
  width: 280,
  height: 256,
  backgroundColor: '#87CEEB',
  parent: 'game-container',
  pixelArt: true,           // IMPORTANT pour pixel art net
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    }
  },
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
let mapLoader;

function preload() {
  mapLoader = new MapLoader(this);

  mapLoader.preload('firstVillage', 'FirstVillage.tmj', [
    { key: 'tileset2', path: 'ddi8611-3d98db15-4361-42c8-b528-e66a60238775.png' }
  ]);
}

async function create() {
  inputManager = new InputManager(this);

  const layers = mapLoader.create('firstVillage', [
    { nameInTiled: 'Terrain', key: 'tileset2' }
  ], ['Ground', 'NatureBis', 'Nature', 'Assets'], ['Ground']);

  const collisionLayer = mapLoader.getLayer('Ground');

  signInAnonymously(auth)
    .then(() => console.log("Connexion anonyme réussie"))
    .catch(err => console.error("Erreur connexion anonyme :", err));

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId = user.uid;
      console.log("Utilisateur connecté, UID:", userId);

      const savedData = await loadMyData();

      if (savedData && savedData.x !== undefined && savedData.y !== undefined && savedData.pseudo) {
        player = new Player(this, savedData.x, savedData.y, inputManager, 0xff0000, savedData.pseudo);
        console.log("Données chargées :", savedData);
      } else {
        player = new Player(this, 140, 128, inputManager, 0xff0000, "Invité"); // position centrée pour 280x256
        console.log("Pas de données sauvegardées, position & pseudo par défaut");
      }

      this.physics.add.existing(player.sprite);
      player.sprite.body.setCollideWorldBounds(true);

      this.physics.add.collider(player.sprite, collisionLayer);

      // Caméra zoomée 1x (inchangé)
      this.cameras.main.setBounds(0, 0, mapLoader.map.widthInPixels, mapLoader.map.heightInPixels);
      this.cameras.main.startFollow(player.sprite, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);

      // Ajout pour éviter les tremblements
      this.cameras.main.roundPixels = true;

      startPlayersListener(this);
      updateMyData(player.pos.x, player.pos.y, player.nameText.text);

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
    updateMyData(player.pos.x, player.pos.y, player.nameText.text);
  }

  // NE PAS forcer le centrage de la caméra ici pour éviter les tremblements
}

async function loadMyData() {
  if (!userId) return null;
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `players/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
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