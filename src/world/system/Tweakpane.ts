import { Pane } from 'tweakpane';

class Debug {
  public pane: Pane;

  constructor() {
    this.pane = new Pane({ title: 'Debug' });
    this.pane.hidden = true;

    if (window.location.hash === '#debug') {
      this.pane.hidden = false;
    }
  }
}
// Singleton
const debug = new Debug();
const pane = debug.pane;

export { pane };
