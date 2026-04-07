import { Card } from './Card';
import { IProduct } from '../../types';

export interface ICardBasketActions {
    onDeleteClick?: (event: MouseEvent) => void;
}

export class CardBasket extends Card<IProduct> {
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
    
    render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
        if (data?.index !== undefined) {
            this.index = data.index;
        }
        return super.render(data);
    }
}