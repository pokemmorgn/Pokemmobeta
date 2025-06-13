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
        // Message d'attente d'action utilisateur
        const instruction = this.add.text(400, 300, 'Appuie ou clique pour lancer le jeu', {
            font: "bold 32px Arial",
            fill: "#000",
            backgroundColor: "#fff"
        }).setOrigin(0.5);

        // Attend un clic/tap utilisateur pour afficher le jeu
        this.input.once('pointerdown', () => {
            console.log("Interaction utilisateur détectée !");
            instruction.destroy();
            this.cameras.main.setBackgroundColor('#ff69b4');
            this.add.text(400, 300, 'CANVAS OK', {
                font: "bold 48px Arial",
                fill: "#fff",
                backgroundColor: "#222"
            }).setOrigin(0.5);
            this.add.rectangle(400, 450, 200, 200, 0x3498db).setOrigin(0.5);
        });
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
    backgroundColor: "#b9eaff",
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