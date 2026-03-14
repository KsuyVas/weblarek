import { IProduct, IOrder, IOrderResult, IProductList } from '../../types';
import { Api } from '../base/Api'; // ВАЖНО: с фигурными скобками!

export class LarekAPI {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  // Получение списка товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    try {
      console.log('📡 Запрос к серверу: GET /product');
      const response = await this._api.get<IProductList>('/product');
      console.log('✅ Ответ от сервера (список товаров):', response);
      
      // Возвращаем массив товаров
      return response.items;
    } catch (error) {
      console.error('❌ Ошибка при получении товаров:', error);
      throw error;
    }
  }

  // Отправка заказа на сервер
  async orderProduct(order: IOrder): Promise<IOrderResult> {
    try {
      console.log('📡 Запрос к серверу: POST /order', order);
      const response = await this._api.post<IOrderResult>('/order', order);
      console.log('✅ Ответ от сервера (оформление заказа):', response);
      
      return response;
    } catch (error) {
      console.error('❌ Ошибка при оформлении заказа:', error);
      throw error;
    }
  }
}