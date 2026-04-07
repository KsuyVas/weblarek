import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export class Card<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }
    
    set title(value: string) {
        this._title.textContent = value;
    }
    
    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }
    
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            if (data.title) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
        }
        return this.container;
    }
}