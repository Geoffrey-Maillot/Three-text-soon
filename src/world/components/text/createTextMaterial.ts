import { SRGBColorSpace, TextureLoader } from 'three';

const createTextMaterial = () => async () => {
  const textureLoader = new TextureLoader();
  const matCapTexture = await textureLoader.loadAsync(
    '/textures/matcaps/8.png'
  );
  matCapTexture.colorSpace = SRGBColorSpace;
};

export { createTextMaterial };
