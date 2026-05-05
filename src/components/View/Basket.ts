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
        // Очищаем и добавляем новые элементы без создания дополнительной разметки
        this._list.replaceChildren(...items);
    }
    
    set totalPrice(value: number) {
        this._totalPrice.textContent = `${value} синапсов`;
    }
    
    set buttonDisabled(value: boolean) {
        this._orderButton.disabled = value;
    }
    
}