import { Color, Scene } from 'three';
import { pane } from '../system/Tweakpane';
import { animationManager } from '../../../src/class/AnimationManager';

const folder = pane.addFolder('Scene');

const backgroundColors: Record<string, string> = {
  bleuMarine: '#1A1A40',
  grisAnthracite: '#2C2C2C',
  bleuNuit: '#0D1B2A',
  noir: '#000000',
  bleuFonce: '#1B263B',
};

const timeline = animationManager.createAnimation('transitionBackgroundColor');

function transitionBackgroundColor(color: string, duration: number = 1) {
  const hexColor = backgroundColors[color];
  const targetColor = new Color(hexColor);

  timeline.to(scene.background, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: duration,
  });
}

folder.addButton({ title: 'bleuMarine' }).on('click', () => {
  transitionBackgroundColor('bleuMarine');
});
folder.addButton({ title: 'grisAnthracite' }).on('click', () => {
  transitionBackgroundColor('grisAnthracite');
});
folder.addButton({ title: 'bleuNuit' }).on('click', () => {
  transitionBackgroundColor('bleuNuit');
});
folder.addButton({ title: 'noir' }).on('click', () => {
  transitionBackgroundColor('noir');
});
folder.addButton({ title: 'bleuFonce' }).on('click', () => {
  transitionBackgroundColor('bleuFonce');
});

const scene = new Scene();
scene.background = new Color(backgroundColors.bleuMarine);

export { scene, transitionBackgroundColor };
