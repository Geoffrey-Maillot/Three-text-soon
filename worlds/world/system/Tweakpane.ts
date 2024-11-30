import { FolderApi, Pane as originalPane } from 'tweakpane';

/**
 * Debug class for handling Tweakpane debug interface
 * @class Debug
 */
class Pane extends originalPane {
  /** Main Tweakpane instance */

  /** Map of folders in the debug pane */
  private folders: Map<string, FolderApi> = new Map();

  /**
   * Creates a new Debug instance
   * Initializes Tweakpane and sets visibility based on URL hash
   */
  constructor() {
    super({ title: 'Debug' });
    this.hidden = window.location.hash !== '#debug';
  }

  /**
   * Adds a folder or returns existing one if it already exists
   * @param {string | { title: string }} folder - Folder configuration
   * @returns {FolderApi} The folder instance
   */
  addFolder(folder: string | { title: string }): FolderApi {
    const title = typeof folder === 'string' ? folder : folder.title;
    const existingFolder = this.children.find(
      (child): child is FolderApi =>
        child instanceof FolderApi && child.title === title
    );

    if (existingFolder) {
      return existingFolder;
    }

    return super.addFolder(typeof folder === 'string' ? { title } : folder);
  }
}

// Singleton instance
const pane = new Pane();

export { pane };
