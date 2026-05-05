import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);
        
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }
    
    set category(value: string) {
        this._category.textContent = value;
        
        // Удаляем все существующие классы категории
        const classes = this._category.className.split(' ');
        classes.forEach(className => {
            if (className.startsWith('card__category_')) {
                this._category.classList.remove(className);
            }
        });
        
        // Добавляем новый класс из categoryMap
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this._category.classList.add(modifier);
        }
    }
    
    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent || 'Товар');
    }
    
}