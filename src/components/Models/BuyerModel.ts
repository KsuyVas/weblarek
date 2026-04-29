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
        this.events.emit('buyer:paymentChanged', { payment });
        this.emitValidation();
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:addressChanged', { address });
        this.emitValidation();
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:phoneChanged', { phone });
        this.emitValidation();
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:emailChanged', { email });
        this.emitValidation();
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
        this.events.emit('buyer:cleared');
        this.emitValidation();
    }

    private emitValidation(): void {
        this.events.emit('buyer:validationChanged', { errors: this.getValidationErrors() });
    }

    getValidationErrors(): TFormErrors {
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

    isOrderStepValid(): boolean {
        const errors = this.getValidationErrors();
        return !errors.payment && !errors.address;
    }

    isContactsStepValid(): boolean {
        const errors = this.getValidationErrors();
        return !errors.email && !errors.phone;
    }
}