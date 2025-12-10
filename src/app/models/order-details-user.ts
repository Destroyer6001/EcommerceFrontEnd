import {OrderProductsDetailsUser} from './order-products-details-user';

export interface OrderDetailsUser {
  id:number,
  username:string,
  orderDate:number,
  total:number,
  address: string,
  state:string,
  detailsUser: OrderProductsDetailsUser[]
}
