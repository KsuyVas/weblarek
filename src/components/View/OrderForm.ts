import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    protected _selectedPayment: 'card' | 'cash' | null = null;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._paymentButtons = container.querySelectorAll('.order__buttons button');
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        
        // Устанавливаем обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.getAttribute('name') as 'card' | 'cash';
                this.payment = paymentType;
                this.onInputChange('payment', paymentType);
            });
        });
        
        // Обработчик изменения адреса
        this._addressInput.addEventListener('input', () => {
            this.onInputChange('address', this._addressInput.value);
        });
    }
    
    protected getFormName(): string {
        return 'order';
    }
    
    protected getData(): IOrderFormData {
        return {
            payment: this._selectedPayment,
            address: this._addressInput.value
        };
    }
    
    set payment(value: 'card' | 'cash' | null) {
        this._selectedPayment = value;
        // Обновляем визуальное состояние кнопок
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
    
    clear(): void {
        this.payment = null;
        this.address = '';
        super.clear();
    }
    
    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data) {
            if (data.payment !== undefined) this.payment = data.payment;
            if (data.address !== undefined) this.address = data.address;
        }
        return super.render(data);
    }
}