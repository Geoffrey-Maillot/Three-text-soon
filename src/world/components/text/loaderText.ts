import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const load3dText = async () => {
  const loader = new FontLoader();

  const font = await loader.loadAsync(
    '/fonts/helvetiker_regular.typeface.json'
  );
  return font;
};

export { load3dText };
