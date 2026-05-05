import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T extends object> extends Component<T> {
    protected _form: HTMLFormElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this._form = container;
    }
    
    abstract set valid(value: boolean);
    abstract set errors(value: string);
}