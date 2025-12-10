import {OrderProduct} from './order-product';

export interface Order {
  id:number,
  total:number,
  orderProducts:OrderProduct[]
}
