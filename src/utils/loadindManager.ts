import { LoadingManager } from 'three';

/**
 * Creates a singleton instance of the LoadingManager
 * @returns {LoadingManager} The singleton LoadingManager instance
 */
const loadingManager = new LoadingManager();

loadingManager.onLoad = () => console.log('loading done');
loadingManager.onProgress = (url, loaded, total) =>
  console.log(`Loading: ${url} /  ${loaded} / ${total}`);
loadingManager.onError = (url) => console.log(`Error loading ${url}`);

export { loadingManager };
