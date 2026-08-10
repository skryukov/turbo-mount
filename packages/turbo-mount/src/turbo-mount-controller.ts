import { Controller } from "@hotwired/stimulus";
import { ApplicationWithTurboMount } from "./turbo-mount";

export class TurboMountController extends Controller {
  static values = {
    props: Object,
    component: String,
  };
  static targets = ["mount"];

  private skipPropsChangeCallback = false;
  private inTurboRender = false;
  private stimulusControllerConnected = false;

  declare propsValue: object;
  declare componentValue: string;
  declare readonly hasMountTarget: boolean;
  declare readonly mountTarget: Element;

  _umountComponentCallback?: () => void;

  initialize() {
    // During a Turbo Drive navigation, nodes are removed from the DOM, and `disconnect()` is called
    // on them. If the element had `data-turbo-permanent`, then that exact node is reinserted into
    // the new DOM and `connect()` is called.
    //
    // By deferring tearing down the component until after `turbo:render` finishes, we can determine
    // if the component is actually gone from the DOM, or if it was just removed and reinserted.
    //
    // If this Stimulus controller is disconnected outside of a Turbo render (such as the node
    // just being removed from the DOM with JavaScript), we want to unmount immediately.
    document.addEventListener("turbo:before-render", () => {
      this.inTurboRender = true;
    });

    document.addEventListener("turbo:render", () => {
      this.inTurboRender = false;

      if (!this.stimulusControllerConnected) {
        this.umountComponent();
      }
    });
  }

  connect() {
    this.stimulusControllerConnected = true;

    this._umountComponentCallback ||= this.mountComponent(
      this.mountElement,
      this.resolvedComponent,
      this.componentProps,
    );
  }

  disconnect() {
    this.stimulusControllerConnected = false;

    if (!this.inTurboRender) {
      this.umountComponent();
    }
  }

  propsValueChanged() {
    // Prevent re-mounting the component if the props are being set by the component itself
    if (this.skipPropsChangeCallback) {
      this.skipPropsChangeCallback = false;
      return;
    }

    this.umountComponent();
    this._umountComponentCallback ||= this.mountComponent(
      this.mountElement,
      this.resolvedComponent,
      this.componentProps,
    );
  }

  get componentProps() {
    return this.propsValue;
  }

  get mountElement() {
    return this.hasMountTarget ? this.mountTarget : this.element;
  }

  get resolvedComponent() {
    return this.resolveMounted(this.componentValue).component;
  }

  get resolvedPlugin() {
    return this.resolveMounted(this.componentValue).plugin;
  }

  umountComponent() {
    this._umountComponentCallback?.();
    this._umountComponentCallback = undefined;
  }

  mountComponent(el: Element, Component: unknown, props: object) {
    return this.resolvedPlugin.mountComponent({ el, Component, props });
  }

  resolveMounted(component: string) {
    const app = this.application as ApplicationWithTurboMount;
    return app.turboMount.resolve(component);
  }

  setComponentProps(props: object) {
    this.skipPropsChangeCallback = true;
    this.propsValue = props;
  }
}
