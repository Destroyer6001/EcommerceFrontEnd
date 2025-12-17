import { Routes } from '@angular/router';
import {Register} from './components/register/register';
import {Login} from './components/login/login';
import {Home} from './components/home/home';
import {Categorylist} from './components/categorylist/categorylist';
import {AdminList} from './components/admin-list/admin-list';
import {ProductList} from './components/product-list/product-list';
import {InventoryAdjustmentList} from './components/inventory-adjustment-list/inventory-adjustment-list';
import {OrdersList} from './components/orders-list/orders-list';
import {StatictsList} from './components/staticts-list/staticts-list';
import {ProductListCar} from './components/product-list-car/product-list-car';
import {authGuard} from './guards/auth-guard';
import {adminGuard} from  './guards/admin-guard';



export const routes: Routes = [
  {path: '', component: Login},
  {path: 'register', component: Register},
  {path: 'home', component: Home, canActivate: [authGuard], children: [
      {path: 'adminList', component: AdminList, canActivate: [adminGuard]},
      {path: 'categoryList', component: Categorylist, canActivate: [adminGuard]},
      {path: 'productList', component: ProductList, canActivate: [adminGuard]},
      {path: 'inventoryAdjustment/:id', component: InventoryAdjustmentList, canActivate: [adminGuard] },
      {path: 'ordersList', component: OrdersList},
      {path: 'statictsList', component: StatictsList, canActivate: [adminGuard] },
      {path: 'productsListCar', component: ProductListCar},
    ]},
];
