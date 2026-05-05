import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface HeaderData {
    counter: number;
}

export class Header extends Component<HeaderData> {
    protected _basketButton: HTMLButtonElement;
    protected _counterElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this._counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
        
        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }
    
    set counter(value: number) {
        this._counterElement.textContent = String(value);
    }
    
}