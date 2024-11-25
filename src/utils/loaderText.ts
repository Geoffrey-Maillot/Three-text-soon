import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { loadingManager } from './loadindManager';

const loader = new FontLoader(loadingManager);

const load3dText = async (url: string) => {
  const font = await loader.loadAsync(url);

  return font;
};

export { load3dText };
