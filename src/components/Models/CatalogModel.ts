import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
    private _items: IProduct[] = [];
    private _selectedItem: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        // Только одно событие — факт изменения каталога
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find((item) => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this._selectedItem = item;
        // Только одно событие — факт изменения выбранного товара
        this.events.emit('catalog:selectedChanged');
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }
}