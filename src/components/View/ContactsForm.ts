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
            this.events.emit('contacts.emailChange', { email: this._emailInput.value });
        });
        
        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts.phoneChange', { phone: this._phoneInput.value });
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts.submit');
        });
    }
    

    set email(value: string) {
        this._emailInput.value = value;
    }
    
    set phone(value: string) {
        this._phoneInput.value = value;
    }
    
    // clear() наследуется из Form, переопределяем для специфичной очистки
    clear(): void {
        this.email = '';
        this.phone = '';
        super.clear();
    }
}