import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
        
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
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
    
    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.category) this.category = data.category;
            if (data.image) this.image = data.image;
        }
        return super.render(data);
    }
}