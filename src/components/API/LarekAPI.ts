import { IProduct, IOrder, IOrderResult, IProductList, IApi } from '../../types';
//import { Api } from '../base/Api'; // ВАЖНО: с фигурными скобками!

export class LarekAPI {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение списка товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    
   //   console.log('📡 Запрос к серверу: GET /product');
      const response = await this.api.get<IProductList>('/product');
    //  console.log('✅ Ответ от сервера (список товаров):', response);
      
      // Возвращаем массив товаров
      return response.items;

    }
  



  

  // Отправка заказа на сервер
  async orderProduct(order: IOrder): Promise<IOrderResult> {
  //  try {
     // console.log('📡 Запрос к серверу: POST /order', order);
      const response = await this.api.post<IOrderResult>('/order', order);
     // console.log('✅ Ответ от сервера (оформление заказа):', response);
      
      return response;
   // } catch (error) {
    //  console.error('❌ Ошибка при оформлении заказа:', error);
   //   throw error;
   // }
  }
}