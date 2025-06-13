class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        console.log("GameScene: constructeur appelé");
    }

    preload() {
        console.log("GameScene: preload");
    }

    create() {
        console.log("GameScene: create");
        // Change la couleur de fond du canvas Phaser (rose flashy)
        this.cameras.main.setBackgroundColor('#ff69b4');

        // GROS texte bien visible au centre
        this.add.text(400, 300, 'CANVAS OK', {
            font: "bold 48px Arial",
            fill: "#fff",
            backgroundColor: "#222"
        }).setOrigin(0.5);

        // GROS carré bleu bien visible
        this.add.rectangle(400, 450, 200, 200, 0x3498db).setOrigin(0.5);
    }

    update() {
        if (!this._updateLog) {
            console.log("GameScene: update actif !");
            this._updateLog = true;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#b9eaff", // Valeur par défaut, sera écrasée par setBackgroundColor
    parent: null,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [GameScene]
};

console.log("Création du jeu Phaser...");
new Phaser.Game(config);
console.log("Phaser lancé !");