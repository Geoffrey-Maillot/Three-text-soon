import { TextureLoader, Texture } from 'three';
import { loadingManager } from './loadindManager';

// Singleton pour le TextureLoader
const textureLoader = new TextureLoader(loadingManager);

// Cache pour stocker les textures déjà chargées
const textureCache = new Map<string, Texture>();

const loadTexture = async (path: string): Promise<Texture> => {
  // Vérifier si la texture est déjà dans le cache
  if (textureCache.has(path)) {
    return textureCache.get(path)!;
  }

  // Charger la nouvelle texture
  const texture = await textureLoader.loadAsync(path);

  // Stocker dans le cache
  textureCache.set(path, texture);

  return texture;
};

export { loadTexture };
