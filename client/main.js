const SERVER_URL = "ws://localhost:2567";  // Change si en prod
const ROOM_NAME = "world";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update,
  },
  backgroundColor: "#aaddff",
};

const game = new Phaser.Game(config);
let client;
let room;
let players = {};
let playerId;

function preload() {
  this.load.image("player", "https://i.imgur.com/1Xw1hBM.png");
}

function create() {
  client = new Colyseus.Client(SERVER_URL);
  client.joinOrCreate(ROOM_NAME).then((r) => {
    room = r;
    playerId = room.sessionId;

    // Créer les sprites joueurs
    room.state.players.forEach((player, sessionId) => {
      addPlayerSprite(this, sessionId, player);
    });

    // Ajouter nouveaux joueurs
    room.state.players.onAdd = (player, sessionId) => {
      addPlayerSprite(this, sessionId, player);
    };

    // Supprimer joueurs partis
    room.state.players.onRemove = (player, sessionId) => {
      if (players[sessionId]) {
        players[sessionId].destroy();
        delete players[sessionId];
      }
    };

    // Mettre à jour position joueurs
    room.state.players.onChange = (player, sessionId) => {
      if (players[sessionId]) {
        players[sessionId].x = player.x;
        players[sessionId].y = player.y;
      }
    };

    // Contrôle clic/touch pour déplacer le joueur
    this.input.on("pointerdown", (pointer) => {
      moveTo(pointer.worldX, pointer.worldY);
    });
  });
}

function addPlayerSprite(scene, sessionId, player) {
  let tint = sessionId === playerId ? 0xffaaaa : 0xaaaaff;
  let sprite = scene.add.sprite(player.x, player.y, "player");
  sprite.setTint(tint);
  players[sessionId] = sprite;
}

function moveTo(x, y) {
  if (room && playerId) {
    room.send("move", { x, y });
  }
}

function update() {}
