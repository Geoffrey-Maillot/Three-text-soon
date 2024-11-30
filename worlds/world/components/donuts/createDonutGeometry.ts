import { TorusGeometry } from 'three';

const parameters = {
  radius: 0.1,
  tube: 0.05,
  radialSegments: 20,
  tubularSegments: 45,
};
const createDonutGeometry = () => {
  const donutGeometry = new TorusGeometry(...Object.values(parameters));

  return donutGeometry;
};

export { createDonutGeometry };
