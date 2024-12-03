import { FontData, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { loadingManager } from './loadindManager';

/**
 * Creates a new FontLoader instance with the singleton loadingManager
 * @param {LoadingManager} loadingManager - The singleton loading manager instance
 * @returns {FontLoader} The FontLoader instance
 */
const loader = new FontLoader(loadingManager);
const load3dText = async (fontData: FontData) => {
  const font = await loader.parse(fontData);

  return font;
};

export { load3dText };
