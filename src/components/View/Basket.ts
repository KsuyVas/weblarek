import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface BasketData {
    items: HTMLElement[];
    totalPrice: number;
    buttonDisabled: boolean;
}

export class Basket extends Component<BasketData> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _orderButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._totalPrice = container.querySelector('.basket__price') as HTMLElement;
        this._orderButton = container.querySelector('.basket__button') as HTMLButtonElement;
        
        this._orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }
    
    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        } else {
            this._list.innerHTML = '';
            items.forEach(item => {
                this._list.appendChild(item);
            });
        }
    }
    
    set totalPrice(value: number) {
        this._totalPrice.textContent = `${value} синапсов`;
    }
    
    set buttonDisabled(value: boolean) {
        this._orderButton.disabled = value;
    }
    
    render(data?: Partial<BasketData>): HTMLElement {
        if (data) {
            if (data.items) this.items = data.items;
            if (data.totalPrice !== undefined) this.totalPrice = data.totalPrice;
            if (data.buttonDisabled !== undefined) this.buttonDisabled = data.buttonDisabled;
        }
        return this.container;
    }
}