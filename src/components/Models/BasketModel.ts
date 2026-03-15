import { IProduct } from "../../types";

export class BasketModel {
  private _items: IProduct[] = [];

  // получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // добавление товара, который был получен в параметре, в массив корзины
  addItem(item: IProduct): void {
    // Проверяем, нет ли уже такого товара в корзине
    if (!this.contains(item.id)) {
      this._items.push(item);
    }
  }

  // удаление товара, полученного в параметре из массива корзины
  removeItem(itemId: string): void {
    this._items = this._items.filter((item) => item.id !== itemId);
  }

  // очистка корзины
  clear(): void {
    this._items = [];
  }

  // получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      // Если цена null (бесценный товар), то не добавляем к сумме
      return total + (item.price || 0);
    }, 0);
  }

  // получение количества товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // проверка наличия товара в корзине по его id
  contains(itemId: string): boolean {
    return this._items.some((item) => item.id === itemId);
  }

  // получение массива id товаров в корзине
  getItemIds(): string[] {
    return this._items.map((item) => item.id);
  }
}
