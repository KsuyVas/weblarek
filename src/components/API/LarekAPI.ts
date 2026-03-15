import {
  IProduct,
  IOrder,
  IOrderResult,
  IProductList,
  IApi,
} from "../../types";
//import { Api } from '../base/Api'; // ВАЖНО: с фигурными скобками!

export class LarekAPI {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение списка товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<IProductList>("/product");

    // Возвращаем массив товаров
    return response.items;
  }

  // Отправка заказа на сервер
  async orderProduct(order: IOrder): Promise<IOrderResult> {
    const response = await this.api.post<IOrderResult>("/order", order);

    return response;
  }
}
