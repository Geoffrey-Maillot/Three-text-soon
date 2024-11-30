import { World } from '../world/World';

/**
 * UI class handles all user interface interactions
 * including color changes and fullscreen functionality
 */
class UI {
  private world: World;
  private buttonsChangeColorsElements: HTMLDivElement[];
  private canvasContainer: HTMLDivElement;

  /**
   * Creates an instance of UI
   * @param world - Instance of World class to handle 3D scene
   */
  constructor(world: World) {
    this.world = world;
    // Get canvas container element
    this.canvasContainer = document.querySelector(
      '#canvas-container'
    ) as HTMLDivElement;

    // Get all color buttons
    this.buttonsChangeColorsElements = Array.from(
      document.querySelectorAll('[data-color]')
    );

    // Add click listeners to color buttons
    this.buttonsChangeColorsElements.forEach((button) => {
      button.addEventListener('click', (evt) => {
        const { color } = (evt.target as HTMLDivElement).dataset;
        this.changeColor(color);
      });
    });

    // Add double click listener for fullscreen toggle
    this.canvasContainer.addEventListener('dblclick', () => {
      this.fullScreen(this.canvasContainer);
    });
  }

  /**
   * Changes background color of the 3D scene
   * @param color - Color value from data attribute
   * @private
   */
  private changeColor(color: string | undefined) {
    if (!color) return;
    this.world.transitionBackgroundColor(color);
  }

  /**
   * Toggles fullscreen mode for the canvas container
   * Handles both standard and webkit fullscreen APIs
   * @param canvas - HTML element to be displayed in fullscreen
   */
  fullScreen(canvas: HTMLElement) {
    const fullscreenElement =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    // If not in fullscreen, enter fullscreen
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if ((canvas as any).webkitRequestFullscreen) {
        (canvas as any).webkitRequestFullscreen();
      }
    }
    // If in fullscreen, exit fullscreen
    else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }
}

export { UI };
