import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductCar} from '../models/product-car';

@Injectable({
  providedIn: 'root',
})
export class ProductCarService {

  private readonly CART_KEY = 'shopping_cart';
  private carItems: ProductCar[] = [];
  private carSubject = new BehaviorSubject<ProductCar[]>([]);
  cart$ = this.carSubject.asObservable();

  constructor(){
    this.carItems = this.loadFromLocalStorage();
    this.carSubject.next([...this.carItems]);
  }

  addCard(product: ProductCar): void
  {
    const item = this.carItems.find((item) => item.id === product.id);

    if (item)
    {
      item.stock++;
    }
    else
    {
      product.stock = 1;
      this.carItems.push(product);
    }

    this.emitAndPersist();
  }

  updateItemCar(id: number, stock: number): void
  {
    const item = this.carItems.find(p => p.id === id);

    if (item)
    {
      item.stock = stock;
      this.emitAndPersist();
    }
  }

  deleteItemCar(id: number): void
  {
    this.carItems = this.carItems.filter(p => p.id !== id);
    this.emitAndPersist();
  }

  clearCar():void
  {
    this.carItems = [];
    this.carSubject.next([]);
    localStorage.removeItem(this.CART_KEY);
  }

  private emitAndPersist()
  {
    this.carSubject.next([...this.carItems]);
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.carItems));
  }

  private loadFromLocalStorage(): ProductCar[]
  {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }
}
