import { Color, Scene } from 'three';
import { pane } from '../system/Tweakpane';
import { animationManager } from '../../class/AnimationManager';

const folder = pane.addFolder('Scene');

const params = {
  background: {
    bleuMarine: '#1A1A40',
    grisAnthracite: '#2C2C2C',
    bleuNuit: '#0D1B2A',
    noir: '#000000',
    bleuFonce: '#1B263B',
  },
};

const timeline = animationManager.createAnimation('transitionBackgroundColor');

function transitionBackgroundColor(
  targetColorHex: string,
  duration: number = 1
) {
  const targetColor = new Color(targetColorHex);

  timeline.to(scene.background, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: duration,
  });
}

folder.addButton({ title: 'bleuMarine' }).on('click', () => {
  transitionBackgroundColor(params.background.bleuMarine);
});
folder.addButton({ title: 'grisAnthracite' }).on('click', () => {
  transitionBackgroundColor(params.background.grisAnthracite);
});
folder.addButton({ title: 'bleuNuit' }).on('click', () => {
  transitionBackgroundColor(params.background.bleuNuit);
});
folder.addButton({ title: 'noir' }).on('click', () => {
  transitionBackgroundColor(params.background.noir);
});
folder.addButton({ title: 'bleuFonce' }).on('click', () => {
  transitionBackgroundColor(params.background.bleuFonce);
});

const scene = new Scene();
scene.background = new Color(params.background.bleuMarine);

export { scene };
