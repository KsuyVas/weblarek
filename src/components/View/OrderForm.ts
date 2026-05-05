import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Component<IOrderFormData> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    protected _errorsElement: HTMLElement;
    protected _submitButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._paymentButtons = container.querySelectorAll('.order__buttons button');
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        this._errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('.order__button') as HTMLButtonElement;
        
        // Только генерация событий, без изменения внешнего вида
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.getAttribute('name') as 'card' | 'cash';
                this.events.emit('order.paymentChange', { payment: paymentType });
            });
        });
        
        this._addressInput.addEventListener('input', () => {
            this.events.emit('order.addressChange', { address: this._addressInput.value });
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order.submit');
        });
    }
    
    // Сеттеры для обновления отображения (вызываются презентером после изменения модели)
    set payment(value: 'card' | 'cash' | null) {
        this._paymentButtons.forEach(button => {
            const buttonType = button.getAttribute('name');
            if (value === buttonType) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }
    
    set address(value: string) {
        this._addressInput.value = value;
    }
    
    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }
    
    set errors(value: string) {
        if (this._errorsElement) {
            this._errorsElement.textContent = value;
        }
    }
}