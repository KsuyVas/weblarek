import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

// Интерфейс для данных карточки превью
export interface ICardPreviewData extends IProduct {
    buttonText?: string;
    disabled?: boolean;
}

export interface ICardPreviewActions {
    onButtonClick?: (event: MouseEvent) => void;
}

export class CardPreview extends Card<ICardPreviewData> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        
        if (actions?.onButtonClick) {
            this._button.addEventListener('click', actions.onButtonClick);
        }
    }
    
    set category(value: string) {
        this._category.textContent = value;
        
        const classes = this._category.className.split(' ');
        classes.forEach(className => {
            if (className.startsWith('card__category_')) {
                this._category.classList.remove(className);
            }
        });
        
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this._category.classList.add(modifier);
        }
    }
    
    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent || 'Товар');
    }
    
    set description(value: string) {
        this._description.textContent = value;
    }
    
    set buttonText(value: string) {
        this._button.textContent = value;
    }
    
    set disabled(value: boolean) {
        this._button.disabled = value;
    }
}