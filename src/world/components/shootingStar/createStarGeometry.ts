import { BufferAttribute, BufferGeometry } from 'three';

const createStarGeometry = () => {
  const starGeometry = new BufferGeometry();

  const starPosition = new Float32Array(3);
  starPosition[0] = Math.random() * 20 - 10; // x
  starPosition[1] = Math.random() * 20 - 10; // y
  starPosition[2] = Math.random() * 20 - 10; // z

  starGeometry.setAttribute('position', new BufferAttribute(starPosition, 3));

  return starGeometry;
};

export { createStarGeometry };
