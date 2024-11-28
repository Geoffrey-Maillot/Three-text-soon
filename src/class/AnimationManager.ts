import gsap from 'gsap';

/**
 * @class AnimationManager
 * @description Centralized manager for GSAP animations in the application.
 * Allows creating, tracking, controlling, and debugging all animations.
 * Implements the Singleton pattern to ensure a single instance.
 *
 * @example
 * const animationManager = getAnimationManager();
 * const timeline = animationManager.createAnimation('myAnimation');
 * timeline.to(element, { x: 100 });
 */
class AnimationManager {
  private animations: Map<string, gsap.core.Timeline> = new Map();
  private listeners: Map<string, ((animation: gsap.core.Timeline) => void)[]> =
    new Map();

  constructor() {}

  /**
   * Creates a new GSAP timeline with a specific name
   * @param {string} name - Unique identifier for the animation
   * @returns {gsap.core.Timeline} Newly created GSAP timeline
   * @throws {Error} If an animation with the same name already exists
   *
   * @example
   * const timeline = animationManager.createAnimation('introAnimation');
   */
  createAnimation(name: string): gsap.core.Timeline {
    const timeline = gsap.timeline();
    this.animations.set(name, timeline);

    // Notifier les listeners
    if (this.listeners.has(name)) {
      this.listeners.get(name)?.forEach((callback) => callback(timeline));
    }

    return timeline;
  }

  /**
   * Retrieves an existing animation by its name
   * @param {string} name - Name of the animation to retrieve
   * @returns {gsap.core.Timeline | undefined} Corresponding timeline or undefined if not found
   */
  getAnimation(name: string): gsap.core.Timeline | undefined {
    return this.animations.get(name);
  }

  /**
   * Stops and removes a specific animation
   * @param {string} name - Name of the animation to remove
   */
  killAnimation(name: string): void {
    const timeline = this.animations.get(name);
    if (timeline) {
      timeline.kill();
      this.animations.delete(name);
    }
  }

  /**
   * Stops and removes all ongoing animations
   */
  killAll(): void {
    this.animations.forEach((timeline) => timeline.kill());
    this.animations.clear();
  }

  /**
   * Pauses all ongoing animations
   */
  pauseAll(): void {
    this.animations.forEach((timeline) => timeline.pause());
  }

  /**
   * Resumes all paused animations
   */
  resumeAll(): void {
    this.animations.forEach((timeline) => timeline.resume());
  }

  /**
   * Retrieves the progress of a specific animation
   * @param {string} name - Name of the animation
   * @returns {number | undefined} Progress between 0 and 1, or undefined if the animation does not exist
   */
  getProgress(name: string): number | undefined {
    const timeline = this.animations.get(name);
    return timeline?.progress();
  }

  /**
   * Retrieves all active animations
   * @returns {Map<string, gsap.core.Timeline>} Map of animations with their names
   */
  getAllAnimations(): Map<string, gsap.core.Timeline> {
    return this.animations;
  }

  /**
   * Logs the state of all active animations to the console
   * Useful for debugging
   */
  debug(): void {
    console.log(
      'Active animations:',
      Array.from(this.animations.entries()).map(([name, timeline]) => ({
        name,
        progress: timeline.progress(),
        paused: timeline.paused(),
        duration: timeline.duration(),
      }))
    );
  }

  onAnimationCreated(
    name: string,
    callback: (animation: gsap.core.Timeline) => void
  ) {
    if (this.animations.has(name)) {
      callback(this.animations.get(name)!);
    } else {
      if (!this.listeners.has(name)) {
        this.listeners.set(name, []);
      }
      this.listeners.get(name)?.push(callback);
    }
  }
}

/**
 * Singleton instance of the AnimationManager
 */
const animationManager = new AnimationManager();

export { animationManager };
