import { IProduct } from "../../types";

export class CatalogModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  // сохраняет массив товаров полученного в параметрах метода
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  // получение массива товаров из модели
  getItems(): IProduct[] {
    return this._items;
  }

  // получение одного товара по его id
  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // сохранение товара для подробного отображения
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
  }

  // получение товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
