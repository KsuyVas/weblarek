export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Тип для способа оплаты
export type TPayment = "card" | "cash";

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Тип для ошибок валидации
export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс для заказа (расширяем интерфес покупателя)
export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

// Интерфейс для ответа от сервера
export interface IOrderResult {
  id: string;
  total: number;
}

// Интерфейс для ответа от сервера со списком товаров
export interface IProductList {
  items: IProduct[];
  total: number;
}

// Интерфейс для ошибки от сервера
export interface IApiError {
  error: string;
}
