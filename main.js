class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Ajoute ici le chargement de ton tileset et map plus tard
        // Exemple: this.load.image('nature', 'assets/tileset_nature.png');
        // Exemple: this.load.tilemapTiledJSON('map', 'assets/FirstVillage.tmj');
    }

    create() {
        // Affiche un carré "joueur"
        this.player = this.add.rectangle(400, 300, 32, 32, 0xff0000);
        this.physics.add.existing(this.player);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 160;
        const body = this.player.body;
        body.setVelocity(0);

        if (this.cursors.left.isDown) body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) body.setVelocityX(speed);
        if (this.cursors.up.isDown) body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) body.setVelocityY(speed);
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

new Phaser.Game(config);