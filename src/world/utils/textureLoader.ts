import { TextureLoader, LoadingManager } from 'three';

const createTextureLoader = () => {
  const loadingManager = new LoadingManager();
  const textureLoader = new TextureLoader(loadingManager);
  return textureLoader;
};

export { createTextureLoader };
