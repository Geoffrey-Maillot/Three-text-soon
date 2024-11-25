import { LoadingManager } from 'three';

const loadingManager = new LoadingManager();

loadingManager.onLoad = () => console.log('loading done');
loadingManager.onProgress = (url, loaded, total) =>
  console.log(`Loading: ${url} /  ${loaded} / ${total}`);
loadingManager.onError = (url) => console.log(`Error loading ${url}`);

export { loadingManager };
