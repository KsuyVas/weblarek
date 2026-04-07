import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T extends object> extends Component<T> {
    protected _form: HTMLFormElement;
    protected _errors: HTMLElement;
    protected _submitButton: HTMLButtonElement;
    protected _inputs: HTMLInputElement[];
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._form = container;
        this._errors = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this._inputs = Array.from(container.querySelectorAll('input'));
        
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${this.getFormName()}.submit`, this.getData());
        });
    }
    
    // Абстрактные методы — должны быть реализованы в дочерних классах
    protected abstract getFormName(): string;
    protected abstract getData(): T;
    
    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }
    
    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
        }
    }
    
    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.getFormName()}.${String(field)}Change`, { [field]: value } as object);
    }
    
    clear(): void {
        this._inputs.forEach(input => {
            input.value = '';
        });
        this.errors = '';
        this.valid = false;
    }
    
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            // В дочерних классах можно переопределить для установки данных
        }
        return this.container;
    }
}