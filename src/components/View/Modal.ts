import { Component } from '../base/Component';

export class Modal extends Component<{}> {
    protected _modalContainer: HTMLElement;
    protected _content: HTMLElement;
    protected _closeButton: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._modalContainer = container;
        this._content = container.querySelector('.modal__content') as HTMLElement;
        this._closeButton = container.querySelector('.modal__close') as HTMLElement;
        
        this._closeButton.addEventListener('click', () => this.close());
        
        this._modalContainer.addEventListener('click', (e) => {
            if (e.target === this._modalContainer) {
                this.close();
            }
        });
    }
    
    open(): void {
        this._modalContainer.classList.add('modal_active');
    }
    
    close(): void {
        this._modalContainer.classList.remove('modal_active');
        this._content.innerHTML = '';
    }
    
    set content(value: HTMLElement) {
        this._content.innerHTML = '';
        this._content.appendChild(value);
    }
}