import { Routes } from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {adminGuard} from  './guards/admin-guard';



export const routes: Routes = [
  {path: '', loadComponent: () => import('./components/login/login').then(m => m.Login)},
  {path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register)},
  {path: 'home', loadComponent: () => import('./components/home/home').then(c => c.Home), canMatch: [authGuard], children: [
      {path: 'adminList', loadComponent: () => import('./components/admin-list/admin-list').then(c => c.AdminList), canMatch: [adminGuard]},
      {path: 'categoryList', loadComponent: () => import('./components/categorylist/categorylist').then(c => c.Categorylist), canMatch: [adminGuard]},
      {path: 'productList', loadComponent: () => import('./components/product-list/product-list').then(c => c.ProductList), canMatch: [adminGuard]},
      {path: 'inventoryAdjustment/:id', loadComponent: () => import('./components/inventory-adjustment-list/inventory-adjustment-list').then(c => c.InventoryAdjustmentList), canMatch: [adminGuard] },
      {path: 'ordersList', loadComponent: () => import('./components/orders-list/orders-list').then(c => c.OrdersList) },
      {path: 'statictsList', loadComponent: () => import('./components/staticts-list/staticts-list').then(c => c.StatictsList), canMatch: [adminGuard] },
      {path: 'deliveryList', loadComponent: () => import('./components/delivery-list/delivery-list').then(c => c.DeliveryList), canMatch: [adminGuard] },
      {path: 'shipmentsList/:id', loadComponent: () => import('./components/shipments-list/shipments-list').then(c => c.ShipmentsList), canMatch: [adminGuard] },
      {path: 'payslipsList/:id', loadComponent: () => import('./components/payslips-list/payslips-list').then(c => c.PayslipsList), canMatch: [adminGuard] },
      {path: 'productsListCar', loadComponent: () => import('./components/product-list-car/product-list-car').then(c => c.ProductListCar)},
    ]},
];
