export default class InputManager {
  constructor(scene) {
    this.scene = scene;

    // Clavier
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keysWASD = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Tactile / souris
    this.pointerPos = null;
    scene.input.on('pointerdown', (pointer) => {
      this.pointerPos = { x: pointer.worldX, y: pointer.worldY };
    });
    scene.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.pointerPos = { x: pointer.worldX, y: pointer.worldY };
      }
    });
    scene.input.on('pointerup', () => {
      this.pointerPos = null;
    });
  }

  getKeyboardDirection() {
    let x = 0, y = 0;
    if (this.cursors.left.isDown || this.keysWASD.left.isDown) x -= 1;
    if (this.cursors.right.isDown || this.keysWASD.right.isDown) x += 1;
    if (this.cursors.up.isDown || this.keysWASD.up.isDown) y -= 1;
    if (this.cursors.down.isDown || this.keysWASD.down.isDown) y += 1;

    const length = Math.hypot(x, y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
  }

  getPointerPosition() {
    return this.pointerPos;
  }
}