import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._paymentButtons = container.querySelectorAll('.order__buttons button');
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        
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
    
    // clear() наследуется из Form, переопределяем для специфичной очистки
    clear(): void {
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.address = '';
        super.clear();
    }
}