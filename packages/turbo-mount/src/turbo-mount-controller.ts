import { Controller } from "@hotwired/stimulus";
import { ApplicationWithTurboMount } from "./turbo-mount";

export class TurboMountController extends Controller {
  static values = {
    props: Object,
    component: String,
  };
  static targets = ["mount"];

  private skipPropsChangeCallback = false;

  declare propsValue: object;
  declare componentValue: string;
  declare readonly hasMountTarget: boolean;
  declare readonly mountTarget: Element;

  _umountComponentCallback?: () => void;

  connect() {
    this._umountComponentCallback ||= this.mountComponent(
      this.mountElement,
      this.resolvedComponent,
      this.componentProps,
    );
  }

  disconnect() {
    this.umountComponent();
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
    this._umountComponentCallback && this._umountComponentCallback();
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
