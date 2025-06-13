export default class Player {
  constructor(scene, x, y, inputManager, color = 0xff0000, pseudo = "Player") {
    this.scene = scene;
    this.sprite = scene.add.rectangle(x, y, 40, 40, color).setOrigin(0.5);

    this.nameText = scene.add.text(x, y - 30, pseudo, {
      font: "16px Arial",
      fill: "#000000",
      stroke: "#ffffff",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);

    this.speed = 200;
    this.inputManager = inputManager;

    this.targetPos = { x, y };
    this.pos = { x, y };
  }

  update(delta) {
    const deltaSeconds = delta / 1000;
    let moved = false;

    const dir = this.inputManager.getKeyboardDirection();

    if (dir.x !== 0 || dir.y !== 0) {
      this.targetPos.x += dir.x * this.speed * deltaSeconds;
      this.targetPos.y += dir.y * this.speed * deltaSeconds;
      moved = true;
    } else {
      const pointerPos = this.inputManager.getPointerPosition();
      if (pointerPos) {
        this.targetPos.x = pointerPos.x;
        this.targetPos.y = pointerPos.y;
        moved = true;
      }
    }

    const lerpFactor = 0.15;
    this.pos.x += (this.targetPos.x - this.pos.x) * lerpFactor;
    this.pos.y += (this.targetPos.y - this.pos.y) * lerpFactor;

    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;

    this.nameText.x = this.pos.x;
    this.nameText.y = this.pos.y - 30;

    const distSq = (this.targetPos.x - this.pos.x) ** 2 + (this.targetPos.y - this.pos.y) ** 2;
    return moved || distSq > 1;
  }

  setPosition(x, y) {
    this.targetPos.x = x;
    this.targetPos.y = y;
    this.pos.x = x;
    this.pos.y = y;
    this.sprite.x = x;
    this.sprite.y = y;
    this.nameText.x = x;
    this.nameText.y = y - 30;
  }

  setPseudo(pseudo) {
    this.nameText.setText(pseudo);
  }
}