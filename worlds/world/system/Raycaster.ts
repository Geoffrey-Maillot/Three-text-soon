import {
  Box3,
  Box3Helper,
  Camera,
  Intersection,
  Object3D,
  Scene,
  Raycaster as ThreeRaycaster,
  Vector2,
} from 'three';
import { ClassNotInitializedError } from '../../../src/class/ClassNotInitializedError';

/**
 * Interface for raycasting options
 * @interface RaycastOptions
 */
interface RaycastOptions {
  /** Type of event to listen for: 'hover', 'click' or 'both' */
  type: 'hover' | 'click' | 'both';
  /** Priority level for handling intersections (higher numbers take precedence) */
  priority: number;
  /** Whether the raycast handler is currently enabled */
  enabled: boolean;
}

interface RaycastHandler {
  handler: (intersection: Intersection | null) => void;
  options: RaycastOptions;
}

interface RaycastObject {
  handlers: RaycastHandler[];
  boundingBox?: Box3;
}

/**
 * Handles raycasting operations for 3D objects in a scene
 * @class Raycast
 */
class Raycast {
  private objectsMap: Map<Object3D, RaycastObject> = new Map();
  private readonly raycaster: ThreeRaycaster;
  public readonly pointer: Vector2;
  private hoveredObject: Object3D | null = null;
  private readonly throttledMouseMove: (e: MouseEvent) => void;

  /**
   * Creates a new Raycast instance
   * @param {Camera} _camera - Three.js camera used for raycasting
   */
  constructor(private _camera: Camera) {
    this.raycaster = new ThreeRaycaster();
    this.pointer = new Vector2();

    this.throttledMouseMove = this.throttle(
      (e: MouseEvent) => this.onMouseMove(e),
      16
    );

    window.addEventListener('mousemove', this.throttledMouseMove, {
      passive: true,
    });
    window.addEventListener('click', this.onClick.bind(this), {
      passive: true,
    });
  }

  private throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Adds one or multiple objects to be tracked by the raycaster
   * @param {Object3D | Object3D[]} object - Three.js object(s) to track
   * @param {Function} handler - Callback function triggered on intersection
   * @param {Partial<RaycastOptions>} options - Configuration options
   */
  addObject(
    object: Object3D | Object3D[],
    handler: (intersection: Intersection | null) => void,
    options: Partial<RaycastOptions> = {}
  ) {
    const defaultOptions: RaycastOptions = {
      type: 'hover',
      priority: 0,
      enabled: true,
      ...options,
    };

    const addHandlerToObject = (obj: Object3D) => {
      const existingObject = this.objectsMap.get(obj);
      const newHandler: RaycastHandler = {
        handler,
        options: defaultOptions,
      };

      if (existingObject) {
        existingObject.handlers.push(newHandler);
      } else {
        const boundingBox = new Box3().setFromObject(obj);
        this.objectsMap.set(obj, {
          handlers: [newHandler],
          boundingBox,
        });
      }
    };

    if (Array.isArray(object)) {
      object.forEach(addHandlerToObject);
    } else {
      addHandlerToObject(object);
    }
  }

  /**
   * Removes one or multiple objects from being tracked by the raycaster
   * @param {Object3D | Object3D[]} object - Three.js object(s) to remove
   */
  removeObject(object: Object3D | Object3D[]) {
    if (Array.isArray(object)) {
      object.forEach((obj) => {
        if (this.hoveredObject === obj) {
          const raycastObject = this.objectsMap.get(obj);
          if (raycastObject) {
            raycastObject.handlers.forEach(({ handler }) => handler(null));
          }
          this.hoveredObject = null;
        }
        this.objectsMap.delete(obj);
      });
    } else {
      if (this.hoveredObject === object) {
        const raycastObject = this.objectsMap.get(object);
        if (raycastObject) {
          raycastObject.handlers.forEach(({ handler }) => handler(null));
        }
        this.hoveredObject = null;
      }
      this.objectsMap.delete(object);
    }
  }

  private updatePointer(e: MouseEvent) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this._camera);
  }

  private onMouseMove(e: MouseEvent) {
    this.updatePointer(e);
    const intersections = this.getIntersections('hover');

    if (intersections.length === 0) {
      if (this.hoveredObject) {
        const previousObject = this.objectsMap.get(this.hoveredObject);
        if (previousObject) {
          previousObject.handlers
            .filter(
              (h) => h.options.type === 'hover' || h.options.type === 'both'
            )
            .forEach(({ handler }) => handler(null));
        }
        this.hoveredObject = null;
      }
      return;
    }

    const [object, intersection, raycastObject] = intersections[0];

    if (this.hoveredObject !== object) {
      if (this.hoveredObject) {
        const previousObject = this.objectsMap.get(this.hoveredObject);
        if (previousObject) {
          previousObject.handlers
            .filter(
              (h) => h.options.type === 'hover' || h.options.type === 'both'
            )
            .forEach(({ handler }) => handler(null));
        }
      }
      this.hoveredObject = object;
    }

    raycastObject.handlers
      .filter((h) => h.options.type === 'hover' || h.options.type === 'both')
      .forEach(({ handler }) => handler(intersection));
  }

  private onClick(e: MouseEvent) {
    this.updatePointer(e);
    const intersections = this.getIntersections('click');

    if (intersections.length > 0) {
      const [_, intersection, raycastObject] = intersections[0];
      raycastObject.handlers
        .filter((h) => h.options.type === 'click' || h.options.type === 'both')
        .forEach(({ handler }) => handler(intersection));
    }
  }

  private getIntersections(
    eventType: 'hover' | 'click'
  ): Array<[Object3D, Intersection, RaycastObject]> {
    const intersections: Array<[Object3D, Intersection, RaycastObject]> = [];

    for (const [object, raycastObj] of this.objectsMap) {
      if (
        !object.visible ||
        !raycastObj.handlers.some(
          (h) =>
            h.options.enabled &&
            (h.options.type === eventType || h.options.type === 'both')
        )
      ) {
        continue;
      }

      if (
        raycastObj.boundingBox &&
        !this.raycaster.ray.intersectsBox(raycastObj.boundingBox)
      ) {
        continue;
      }

      const objectIntersections = this.raycaster.intersectObject(object, false);
      if (objectIntersections.length > 0) {
        intersections.push([object, objectIntersections[0], raycastObj]);
      }
    }

    if (intersections.length > 1) {
      intersections.sort((a, b) => {
        const priorityA = Math.max(
          ...a[2].handlers.map((h) => h.options.priority || 0)
        );
        const priorityB = Math.max(
          ...b[2].handlers.map((h) => h.options.priority || 0)
        );
        return priorityB - priorityA;
      });
    }

    return intersections;
  }

  /**
   * Updates the bounding boxes for all tracked objects
   * Should be called after object transformations
   */
  updateBoundingBoxes() {
    for (const [object, raycastObj] of this.objectsMap) {
      raycastObj.boundingBox?.setFromObject(object);
    }
  }

  /**
   * Enables visual debugging of bounding boxes
   * @param {Scene} scene - Three.js scene to add debug helpers to
   */
  enableDebug(scene: Scene) {
    this.objectsMap.forEach((raycastObj) => {
      if (raycastObj.boundingBox) {
        const helper = new Box3Helper(raycastObj.boundingBox);
        scene.add(helper);
      }
    });
  }

  /**
   * Cleans up event listeners and internal state
   */
  dispose() {
    window.removeEventListener('mousemove', this.throttledMouseMove);
    window.removeEventListener('click', this.onClick.bind(this));
    this.objectsMap.clear();
    this.hoveredObject = null;
  }
}

// Singleton
let raycastInstance: Raycast | null = null;

/**
 * Creates a singleton instance of the Raycast system
 * @param {Object} dependencies - Required dependencies
 * @param {Camera} dependencies.camera - Three.js camera instance
 * @returns {Raycast} Singleton Raycast instance
 */
const createRaycast = (dependencies: { camera: Camera }): Raycast => {
  if (!raycastInstance) {
    raycastInstance = new Raycast(dependencies.camera);
  }
  return raycastInstance;
};

/**
 * Creates a proxy for the Raycast class to ensure it's properly initialized before accessing its properties
 * @type {Raycast}
 */
const raycast = new Proxy({} as Raycast, {
  get: (_, prop) => {
    if (!raycastInstance) {
      throw new ClassNotInitializedError('Raycast');
    }
    return raycastInstance[prop as keyof Raycast];
  },
});

export { createRaycast, raycast };
export type { Raycast, RaycastOptions };

/**
 * EXEMPLE
 */

/*
// Création
const raycast = createRaycast({ camera });

// Ajout d'un objet simple
raycast.addObject(mesh, (intersection) => {
  console.log('Intersection', intersection);
}, { type: 'hover' });

// Ajout de plusieurs objets
raycast.addObject([mesh1, mesh2], (intersection) => {
  console.log('Intersection groupe', intersection);
}, { type: 'both', priority: 1 });

// Mise à jour des bounding boxes après transformation
raycast.updateBoundingBoxes();

// Debug si nécessaire
raycast.enableDebug(scene);

// Nettoyage
raycast.dispose();
*/
