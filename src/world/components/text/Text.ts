import { Group, Mesh } from 'three';
import { createTextGeometry } from './createTextGeometry';
import { createMatcapMaterial } from '../createMatCapMaterial';
import { load3dText } from '../../../utils/loaderText';
import { animationManager } from '../../../class/AnimationManager';
import { loop, Updatable } from '../../system/Loop';

const mainText = `Hi, my name is\nMaillot Geoffrey\nI'm a Three.js developer !`;
const soonText = `(soon...)`;
const amplitude = 0.3; // Amplitude du mouvement
const frequency = 0.5; // Fréquence du mouvement (vitesse)

class Text extends Group {
  private mainText: Mesh | null = null;
  private soonText: Mesh | null = null;

  constructor() {
    super();
  }

  public async init() {
    const mainTextMaterial = await createMatcapMaterial();
    const soonTextMaterial = await createMatcapMaterial({
      transparent: true,
      opacity: 0,
    });
    const font = await load3dText(
      '/src/assets/fonts/DynaPuff SemiCondensed Medium_Regular.json'
    );
    const mainTextGeometry = createTextGeometry(font, mainText);
    this.mainText = new Mesh(mainTextGeometry, mainTextMaterial);
    this.mainText.geometry.center();
    this.mainText.geometry.computeBoundingBox();

    const soonTextGeometry = createTextGeometry(font, soonText);
    this.soonText = new Mesh(soonTextGeometry, soonTextMaterial);
    this.soonText.geometry.center();
    this.soonText.geometry.computeBoundingBox();
    const xPositionBoxMainText = this.mainText.geometry.boundingBox?.max.x || 0;

    // Calcul de la largeur totale du soonText
    const soonTextWidth =
      (this.soonText.geometry.boundingBox?.max.x || 0) -
      (this.soonText.geometry.boundingBox?.min.x || 0);

    // Décalage
    const offset = 0.2;

    // Position x = position du texte principal + la moitié de la largeur du soonText
    const xPositionSoonText = offset + xPositionBoxMainText + soonTextWidth / 2;

    this.soonText.position.set(xPositionSoonText, 0, 0);

    this.add(this.mainText, this.soonText);

    this.createAnimateSoonText();
    loop.add(this.animeText);
  }

  private animeText: Updatable = (_: number, elapsedTime: number) => {
    this.rotation.x = Math.sin(elapsedTime * frequency) * amplitude;
    this.rotation.y = Math.cos(elapsedTime * frequency) * amplitude;
    this.rotation.z =
      Math.sin(elapsedTime * frequency * 0.5) * (amplitude * 0.5);
  };

  private createAnimateSoonText() {
    if (!this.soonText) return;

    const timeline = animationManager.createAnimation('animateSoonText');
    timeline
      .to(this.soonText?.material, {
        opacity: 1,
        delay: 5,
        duration: 0.2,
        ease: 'none',
      })
      .to(this.soonText.position, {
        y: -0.8,
        duration: 2,
        ease: 'bounce.out',
      });
    timeline.play();
  }
}

export { Text };
