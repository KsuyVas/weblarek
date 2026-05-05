import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
    private _items: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this._items.push(item);
            // Только одно событие — факт изменения корзины
            this.events.emit('basket:changed');
        }
    }

    removeItem(itemId: string): void {
        const removedItem = this._items.find(item => item.id === itemId);
        this._items = this._items.filter((item) => item.id !== itemId);
        if (removedItem) {
            // Только одно событие — факт изменения корзины
            this.events.emit('basket:changed');
        }
    }

    clear(): void {
        this._items = [];
        // Только одно событие — факт изменения корзины
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(itemId: string): boolean {
        return this._items.some((item) => item.id === itemId);
    }

    getItemIds(): string[] {
        return this._items.map((item) => item.id);
    }
}