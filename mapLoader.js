export default class MapLoader {
  constructor(scene) {
    this.scene = scene;
    this.map = null;
    this.tilesets = [];
    this.layers = {};
  }

  preload(mapKey, mapPath, tilesets) {
    this.scene.load.tilemapTiledJSON(mapKey, mapPath);
    tilesets.forEach(ts => {
      this.scene.load.image(ts.key, ts.path);
    });
  }

  create(mapKey, tilesetInfos, layerNames = [], collisionLayerNames = []) {
    this.map = this.scene.make.tilemap({ key: mapKey });

    this.tilesets = tilesetInfos.map(tsInfo =>
      this.map.addTilesetImage(tsInfo.nameInTiled, tsInfo.key)
    );

    layerNames.forEach(layerName => {
      this.layers[layerName] = this.map.createLayer(layerName, this.tilesets, 0, 0);
    });

    collisionLayerNames.forEach(layerName => {
      if (this.layers[layerName]) {
        this.layers[layerName].setCollisionByProperty({ collides: true });
      }
    });

    return this.layers;
  }

  getLayer(name) {
    return this.layers[name];
  }
}