import { Font } from 'three/examples/jsm/Addons.js';
import {
  TextGeometry,
  TextGeometryParameters,
} from 'three/examples/jsm/geometries/TextGeometry.js';

const paramsDefault: Omit<TextGeometryParameters, 'font'> = {
  size: 0.5,
  height: 0.2, // A la place de depth
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 5,
};

const createTextMaterial = (
  font: Font,
  text: string,
  params?: Omit<TextGeometryParameters, 'font'>
) => {
  const geometry = new TextGeometry(text, {
    font,
    ...paramsDefault,
    ...params,
  });

  return geometry;
};

export { createTextMaterial };
