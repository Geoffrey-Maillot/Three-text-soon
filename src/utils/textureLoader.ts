import { TextureLoader, Texture } from 'three';
import { loadingManager } from './loadindManager';

/**
 * Creates a singleton instance of the TextureLoader
 * @param {LoadingManager} loadingManager - The loading manager instance
 * @returns {TextureLoader} The singleton TextureLoader instance
 */
const textureLoader = new TextureLoader(loadingManager);

/**
 * Cache to store already loaded textures
 * @type {Map<string, Texture>}
 */
const textureCache = new Map<string, Texture>();

const loadTexture = async (path: string): Promise<Texture> => {
  /**
   * Checks if the texture is already in the cache
   * @param {string} path - The path to the texture file
   * @returns {Texture} The cached texture or a newly loaded texture
   */
  if (textureCache.has(path)) {
    return textureCache.get(path)!;
  }

  /**
   * Loads a new texture from the given path
   * @param {string} path - The path to the texture file
   * @returns {Texture} The loaded texture
   */
  const texture = await textureLoader.loadAsync(path);

  /**
   * Stores the loaded texture in the cache
   * @param {string} path - The path to the texture file
   * @param {Texture} texture - The loaded texture
   */
  textureCache.set(path, texture);

  return texture;
};

export { loadTexture };
