import {Controller} from "@hotwired/stimulus"
import {ApplicationWithTurboMount} from "../turbo-mount";

export abstract class TurboMountController<T> extends Controller {
    static values = {
        props: Object,
        component: String
    }
    declare readonly propsValue: object;
    declare readonly componentValue: string;

    abstract framework: string;

    abstract mountComponent(el: Element, Component: T, props: object): Promise<() => void>;

    _umountComponentPromise?: Promise<() => void>;

    connect() {
        this._umountComponentPromise = this.mountComponent(this.mountElement, this.resolvedComponent, this.componentProps);
    }

    disconnect() {
        this.umountComponent();
    }

    propsValueChanged() {
        this.umountComponent();
        this._umountComponentPromise = this.mountComponent(this.mountElement, this.resolvedComponent, this.componentProps);
    }

    get componentProps() {
        return this.propsValue;
    }

    get mountElement() {
        return this.element;
    }

    get resolvedComponent() {
        return this.resolveComponent(this.componentValue);
    }

    umountComponent() {
        this._umountComponentPromise?.then(umount => umount());
        this._umountComponentPromise = undefined;
    }

    resolveComponent(component: string): T {
        const app = this.application as ApplicationWithTurboMount<T>
        return app.turboMount[this.framework].resolve(component);
    }
}


