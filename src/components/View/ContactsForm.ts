import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        this._emailInput.addEventListener('input', () => {
            this.onInputChange('email', this._emailInput.value);
        });
        
        this._phoneInput.addEventListener('input', () => {
            this.onInputChange('phone', this._phoneInput.value);
        });
    }
    
    protected getFormName(): string {
        return 'contacts';
    }
    
    protected getData(): IContactsFormData {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }
    
    set email(value: string) {
        this._emailInput.value = value;
    }
    
    set phone(value: string) {
        this._phoneInput.value = value;
    }
    
    clear(): void {
        this.email = '';
        this.phone = '';
        super.clear();
    }
    
    render(data?: Partial<IContactsFormData>): HTMLElement {
        if (data) {
            if (data.email !== undefined) this.email = data.email;
            if (data.phone !== undefined) this.phone = data.phone;
        }
        return super.render(data);
    }
}