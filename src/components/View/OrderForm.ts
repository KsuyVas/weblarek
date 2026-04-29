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
                this.setPaymentVisual(paymentType);
                this.onInputChange('payment', paymentType);
            });
        });
        
        this._addressInput.addEventListener('input', () => {
            this.onInputChange('address', this._addressInput.value);
        });
    }
    
    private setPaymentVisual(value: 'card' | 'cash'): void {
        this._paymentButtons.forEach(button => {
            const buttonType = button.getAttribute('name');
            if (value === buttonType) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }
    
    protected getFormName(): string {
        return 'order';
    }
    
    protected getData(): IOrderFormData {
        return {
            payment: this.getSelectedPayment(),
            address: this._addressInput.value
        };
    }
    
    private getSelectedPayment(): 'card' | 'cash' | null {
        let selected: 'card' | 'cash' | null = null;
        this._paymentButtons.forEach(button => {
            if (button.classList.contains('button_alt-active')) {
                selected = button.getAttribute('name') as 'card' | 'cash';
            }
        });
        return selected;
    }
    
    set payment(value: 'card' | 'cash' | null) {
        if (value) {
            this.setPaymentVisual(value);
        }
    }
    
    set address(value: string) {
        this._addressInput.value = value;
    }
    
    clear(): void {
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.address = '';
        super.clear();
    }
    
    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data) {
            if (data.payment) this.payment = data.payment;
            if (data.address !== undefined) this.address = data.address;
        }
        return super.render(data);
    }
}