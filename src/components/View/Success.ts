import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface SuccessData {
    total: number;
}

export class Success extends Component<SuccessData> {
    protected _total: HTMLElement;
    protected _closeButton: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._total = container.querySelector('.order-success__description') as HTMLElement;
        this._closeButton = container.querySelector('.order-success__close') as HTMLElement;
        
        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
    
    set total(value: number) {
        this._total.textContent = `Списано ${value} синапсов`;
    }
    
    render(data?: Partial<SuccessData>): HTMLElement {
        if (data?.total !== undefined) {
            this.total = data.total;
        }
        return this.container;
    }
}