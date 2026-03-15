import { IBuyer, TPayment, IFormErrors } from '../../types';

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';
 // private _errors: IFormErrors = {};

  // сохранение вида оплаты
  setPayment(payment: TPayment): void {
    this.payment = payment;
 //   this.validate(); // проверяем валидацию после изменения
  }

  // сохранение адреса
  setAddress(address: string): void {
    this.address = address;
   // this.validate(); // проверяем валидацию после изменения
  }

  // сохранение телефона
  setPhone(phone: string): void {
    this.phone = phone;
   // this.validate(); // проверяем валидацию после изменения
  }

  // сохранение email
  setEmail(email: string): void {
    this.email = email;
   // this.validate(); // проверяем валидацию после изменения
  }

  // получение всех данных покупателя
  getBuyerData(): IBuyer {
    // Проверяем, что все данные заполнены
        if (!this.payment) {
            throw new Error('Способ оплаты не выбран');
        }
    return {
      payment: this.payment!,
      address: this.address,
      phone: this.phone,
      email: this.email
    };
  }

  // очистка данных покупателя
  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
  //  this._errors = {};
  }

  // валидация данных. Возвращает объект с ошибками валидации
  validate(): IFormErrors {
    const errors: IFormErrors = {};

    // Проверяем payment
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    // Проверяем address
    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    // Проверяем email
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    // Проверяем phone
    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

   // this._errors = errors;
    return errors;
  }

}