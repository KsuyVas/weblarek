import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T extends object> extends Component<T> {
    protected _form: HTMLFormElement;
    protected _errorsElement: HTMLElement;
    protected _submitButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this._form = container;
        this._errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.container.addEventListener('submit', (e) => {
        });
    }
    
    // Общий сеттер для валидности кнопки
    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }
    
    // Общий сеттер для текста ошибки
    set errors(value: string) {
        if (this._errorsElement) {
            this._errorsElement.textContent = value;
        }
    }
    
    // Очистка формы (переопределяется в дочерних классах)
    clear(): void {
        this.valid = false;
        this.errors = '';
    }
}