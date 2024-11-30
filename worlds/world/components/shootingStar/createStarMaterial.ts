import { PointsMaterial, PointsMaterialParameters } from 'three';

const createStarMaterial = (params: PointsMaterialParameters) => {
  const starMaterial = new PointsMaterial(params);

  return starMaterial;
};

export { createStarMaterial };
