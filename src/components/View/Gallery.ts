import { Component } from '../base/Component';

export class Gallery extends Component<{}> {
    protected _container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._container = container;
    }
    
    set items(items: HTMLElement[]) {
        this._container.innerHTML = '';
        items.forEach(item => {
            this._container.appendChild(item);
        });
    }
    
    addItem(item: HTMLElement): void {
        this._container.appendChild(item);
    }
    
    clear(): void {
        this._container.innerHTML = '';
    }
    
    render(_data?: object): HTMLElement {
        return this._container;
    }
}