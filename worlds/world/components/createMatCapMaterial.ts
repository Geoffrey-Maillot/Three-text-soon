import {
  MeshMatcapMaterial,
  MeshMatcapMaterialParameters,
  SRGBColorSpace,
} from 'three';
import matcapTexture from '../../../src/assets/textures/matcaps/10.png';
import { loadTexture } from '../../../src/utils/textureLoader';

const createMatcapMaterial = async (params?: MeshMatcapMaterialParameters) => {
  const texture = await loadTexture(matcapTexture);
  texture.colorSpace = SRGBColorSpace;

  const material = new MeshMatcapMaterial({ matcap: texture, ...params });

  return material;
};

export { createMatcapMaterial };
