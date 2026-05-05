import { IBuyer, TPayment, TFormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = "";
    private phone: string = "";
    private email: string = "";
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:changed');
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed');
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed');
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.events.emit('buyer:changed');
    }

    validate(): TFormErrors {
        const errors: TFormErrors = {};

        if (!this.payment) {
            errors.payment = "Не выбран вид оплаты";
        }

        if (!this.address || this.address.trim() === "") {
            errors.address = "Укажите адрес доставки";
        }

        if (!this.email || this.email.trim() === "") {
            errors.email = "Укажите email";
        }

        if (!this.phone || this.phone.trim() === "") {
            errors.phone = "Укажите телефон";
        }

        return errors;
    }
}