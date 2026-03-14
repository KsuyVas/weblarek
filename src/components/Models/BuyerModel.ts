import { IBuyer, TPayment, IFormErrors } from '../../types';

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';
  private _errors: IFormErrors = {};

  // сохранение вида оплаты
  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.validate(); // проверяем валидацию после изменения
  }

  // сохранение адреса
  setAddress(address: string): void {
    this._address = address;
    this.validate(); // проверяем валидацию после изменения
  }

  // сохранение телефона
  setPhone(phone: string): void {
    this._phone = phone;
    this.validate(); // проверяем валидацию после изменения
  }

  // сохранение email
  setEmail(email: string): void {
    this._email = email;
    this.validate(); // проверяем валидацию после изменения
  }

  // получение всех данных покупателя
  getBuyerData(): IBuyer {
    return {
      payment: this._payment!,
      address: this._address,
      phone: this._phone,
      email: this._email
    };
  }

  // очистка данных покупателя
  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
    this._errors = {};
  }

  // валидация данных. Возвращает объект с ошибками валидации
  validate(): IFormErrors {
    const errors: IFormErrors = {};

    // Проверяем payment (первый шаг)
    if (!this._payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    // Проверяем address (первый шаг)
    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    // Проверяем email (второй шаг)
    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }

    // Проверяем phone (второй шаг)
    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    this._errors = errors;
    return errors;
  }

  // Проверка валидности первого шага (payment и address)
  isFirstStepValid(): boolean {
    this.validate();
    return !this._errors.payment && !this._errors.address;
  }

  // Проверка валидности второго шага (email и phone)
  isSecondStepValid(): boolean {
    this.validate();
    return !this._errors.email && !this._errors.phone;
  }

  // Получение ошибок
  getErrors(): IFormErrors {
    return { ...this._errors };
  }
}