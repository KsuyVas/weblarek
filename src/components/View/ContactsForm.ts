import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Component<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _errorsElement: HTMLElement;
    protected _submitButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        this._errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        
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