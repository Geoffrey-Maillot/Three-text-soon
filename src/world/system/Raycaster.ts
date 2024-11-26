import {
  Box3,
  Box3Helper,
  Camera,
  Intersection,
  Mesh,
  Object3D,
  Scene,
  Raycaster as ThreeRaycaster,
  Vector2,
} from 'three';
import { ClassNotInitializedError } from '../../class/ClassNotInitializedError';

interface RaycastOptions {
  type: 'hover' | 'click' | 'both';
  priority: number;
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

class Raycast {
  private objectsMap: Map<Object3D, RaycastObject> = new Map();
  private readonly raycaster: ThreeRaycaster;
  public readonly pointer: Vector2;
  private hoveredObject: Object3D | null = null;
  private boundingSphereHelper?: Mesh;
  private readonly throttledMouseMove: (e: MouseEvent) => void;

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

  updateBoundingBoxes() {
    for (const [object, raycastObj] of this.objectsMap) {
      raycastObj.boundingBox?.setFromObject(object);
    }
  }

  enableDebug(scene: Scene) {
    this.objectsMap.forEach((raycastObj, object) => {
      if (raycastObj.boundingBox) {
        const helper = new Box3Helper(raycastObj.boundingBox);
        scene.add(helper);
      }
    });
  }

  dispose() {
    window.removeEventListener('mousemove', this.throttledMouseMove);
    window.removeEventListener('click', this.onClick.bind(this));
    this.objectsMap.clear();
    this.hoveredObject = null;
  }
}

// Singleton
let raycastInstance: Raycast | null = null;

const createRaycast = (dependencies: { camera: Camera }): Raycast => {
  if (!raycastInstance) {
    raycastInstance = new Raycast(dependencies.camera);
  }
  return raycastInstance;
};

// Export le proxy qui vérifie l'initialisation
const raycast = new Proxy({} as Raycast, {
  get: (target, prop) => {
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
