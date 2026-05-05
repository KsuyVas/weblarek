import { Card } from './Card';
import { IProduct } from '../../types';

export interface ICardBasketActions {
    onDeleteClick?: (event: MouseEvent) => void;
}

export interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
        this._deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        if (actions?.onDeleteClick) {
            this._deleteButton.addEventListener('click', actions.onDeleteClick);
        }
    }
    
    set index(value: number) {
        this._index.textContent = String(value);
    }
    
}