import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
    protected _modalContainer: HTMLElement;
    protected _content: HTMLElement;
    protected _closeButton: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._modalContainer = container;
        this._content = container.querySelector('.modal__content') as HTMLElement;
        this._closeButton = container.querySelector('.modal__close') as HTMLElement;
        
        this._closeButton.addEventListener('click', () => this.close());
        
        // Закрытие по клику на оверлей
        this._modalContainer.addEventListener('click', (e) => {
            if (e.target === this._modalContainer) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    protected get isOpen(): boolean {
        return this._modalContainer.classList.contains('modal_active');
    }
    
    open(): void {
        this._modalContainer.classList.add('modal_active');
        document.body.classList.add('modal-open');
        this.events.emit('modal:open');
    }
    
    close(): void {
        this._modalContainer.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }
    
    set content(value: HTMLElement) {
        this._content.innerHTML = '';
        this._content.appendChild(value);
    }
    
    render(data?: object): HTMLElement {
        if (data) {
            // Если переданы данные, можно использовать для установки контента
        }
        return this._modalContainer;
    }
}