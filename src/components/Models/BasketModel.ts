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
            this.events.emit('basket:changed', { items: this._items });
            this.events.emit('basket:countChanged', { count: this.getCount() });
            this.events.emit('basket:totalChanged', { total: this.getTotalPrice() });
        }
    }

    removeItem(itemId: string): void {
        const removedItem = this._items.find(item => item.id === itemId);
        this._items = this._items.filter((item) => item.id !== itemId);
        if (removedItem) {
            this.events.emit('basket:changed', { items: this._items });
            this.events.emit('basket:countChanged', { count: this.getCount() });
            this.events.emit('basket:totalChanged', { total: this.getTotalPrice() });
            this.events.emit('basket:itemRemoved', { id: itemId });
        }
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { items: this._items });
        this.events.emit('basket:countChanged', { count: this.getCount() });
        this.events.emit('basket:totalChanged', { total: this.getTotalPrice() });
        this.events.emit('basket:cleared');
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