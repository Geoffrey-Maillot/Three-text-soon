import {
  MeshMatcapMaterial,
  MeshMatcapMaterialParameters,
  SRGBColorSpace,
} from 'three';
import { loadTexture } from '../../utils/textureLoader';

const createMatcapMaterial = async (params?: MeshMatcapMaterialParameters) => {
  const texture = await loadTexture('/src/assets/textures/matcaps/8.png');
  texture.colorSpace = SRGBColorSpace;

  const material = new MeshMatcapMaterial({ matcap: texture, ...params });

  return material;
};

export { createMatcapMaterial };
