import { Component } from '@angular/core';
import {OrderServices} from '../../services/order-services';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { Chart } from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staticts-list',
  imports: [
    MatGridListModule,
    MatCardModule,
  ],
  templateUrl: './staticts-list.html',
  styleUrl: './staticts-list.css',
})
export class StatictsList {

  errorMessage: string = '';
  constructor(private _orderService: OrderServices) {
  }

  ngOnInit(): void
  {
    this.searchMaxSalesProducts();
    this.searchEarningsProduct();
    this.searchMaxSalesCategories();
    this.searchEarningsCategories();
    this.searchStatesOrders();
  }

  searchMaxSalesProducts():void
  {
    this._orderService.reportMaxSalesProduct().subscribe({
      next: (resp) =>
      {
        const labels = resp.map(item => item.name);
        const values = resp.map(item => item.total);

        new Chart("MaxSalesProduct", {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Ventas totales por producto",
              data: values,
              backgroundColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;
              }),
              borderColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
              }),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          'title': 'Ha ocurrido un error',
          'icon': 'error',
          text: this.errorMessage,
        });
      }
    });
  }

  searchEarningsProduct(): void
  {
    this._orderService.reportSalesProduct().subscribe({
      next: (resp) =>
      {
        const labels = resp.map(item => item.name);
        const values = resp.map(item => item.total);

        new Chart("EarningsProduct", {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Ganancias por producto",
              data: values,
              backgroundColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;
              }),
              borderColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
              }),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          title: 'Ha ocurrido un error',
          icon: 'error',
          text: this.errorMessage,
        });
      }
    });
  }

  searchMaxSalesCategories(): void
  {
    this._orderService.reportMaxSalesCategories().subscribe({
      next: (resp) =>
      {
        const labels = resp.map(item => item.name);
        const values = resp.map(item => item.total);

        new Chart("MaxSalesCategories", {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Ventas totales por categoria",
              data: values,
              backgroundColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;
              }),
              borderColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
              }),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
          icon: 'error',
        });
      }
    });
  }

  searchEarningsCategories(): void
  {
    this._orderService.reportSalesCategories().subscribe({
      next: (resp) =>
      {
        const labels = resp.map(item => item.name);
        const values = resp.map(item => item.total);

        new Chart("EarningsCategories", {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Ganacias por categoria",
              data: values,
              backgroundColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;
              }),
              borderColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
              }),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          title: 'Ha ocurrido un error',
          icon: 'error',
          text: this.errorMessage,
        });
      }
    });
  }

  searchStatesOrders(): void
  {
    this._orderService.reportStatesOrders().subscribe({
      next: (resp) =>
      {
        const labels = resp.map(item =>
        item.name == 'PENDING' ? 'Pendiente':
        item.name == 'COMPLETED' ? 'Completado':
        'Cancelado');

        console.log(labels);
        const values = resp.map(item => item.total);

        new Chart("StatesOrders", {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Estados de las ordenes",
              data: values,
              backgroundColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;
              }),
              borderColor: values.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
              }),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
          icon: 'error',
        });
      }
    });
  }
}
