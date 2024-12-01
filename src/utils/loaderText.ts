import { FontData, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { loadingManager } from './loadindManager';

const loader = new FontLoader(loadingManager);
const load3dText = async (fontData: FontData) => {
  const font = await loader.parse(fontData);

  return font;
};

export { load3dText };
