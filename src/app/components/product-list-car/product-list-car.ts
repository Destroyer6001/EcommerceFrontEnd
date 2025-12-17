import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatCardModule}  from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {ProductService} from '../../services/product-service';
import {Categoryservice} from '../../services/categoryservice';
import {Category} from '../../models/category';
import {ProductDetails} from '../../models/product-details';
import {ProductCarService} from '../../services/product-car-service';
import {ProductsCar} from '../products-car/products-car';
import Swal from 'sweetalert2';
import {DecimalPipe} from '@angular/common';
import {ProductCar} from '../../models/product-car';

@Component({
  selector: 'app-product-list-car',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    DecimalPipe,
  ],
  standalone: true,
  templateUrl: './product-list-car.html',
  styleUrl: './product-list-car.css',
})
export class ProductListCar {
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;
  ListProduct: ProductDetails[] = [];
  ListProductAux: ProductDetails[] = [];
  ListCategories: Category[] = [];
  errorMessage: string = '';

  constructor(private _productService: ProductService, private _categoryService: Categoryservice, private _productCarService: ProductCarService) {
  }

  ngOnInit():void
  {
    this.getAllCategories();
    this.getAllProducts();
  }

  scrollCategories(direction:number)
  {
    const container = this.categoriesContainer.nativeElement;
    const scrollAmount = 200;

    if (direction == 1)
    {
      container.scrollLeft += scrollAmount;
    }
    else
    {
      container.scrollLeft -= scrollAmount;
    }
  }

  addCarShoop(product: ProductDetails): void
  {
      const productCar: ProductCar = {
        id: product.id,
        stock: product.stock,
        name: product.name,
        unitPrice: product.salePrice
      };

      this._productCarService.addCard(productCar);

      Swal.fire({
        icon: "success",
        title: 'Exito',
        text: 'Producto agregado con exito'
      })
  }

  onImageError(event: Event): void
  {
    (event.target as HTMLImageElement).src = 'https://url-shortener.me/LKI'
  }

  findProducts(event: Event):void
  {
    const search = (event.target as HTMLInputElement).value;

    if (search.length > 0)
    {
      this.ListProductAux = this.ListProduct.filter(aux => aux.name.toLowerCase().includes(search.toLowerCase()));
    }
    else
    {
      this.ListProductAux = this.ListProduct;
    }
  }

  getAllProducts(): void
  {
    this._productService.IndexProduct().subscribe({
      next: (resp) =>
      {
        this.ListProduct = resp;
        this.ListProductAux = resp;
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
      }
    });
  }

  selectCategory(category:Category):void
  {
    this.ListProductAux = this.ListProduct.filter(p => p.categoryName === category.name);
  }

  clearFilterCategory():void
  {
    this.ListProductAux = this.ListProduct;
  }

  getAllCategories(): void
  {
    this._categoryService.IndexCategory().subscribe({
      next: (resp) =>
      {
        this.ListCategories = resp;
      },
      error: (err) =>
      {
       this.errorMessage = err.message;
       Swal.fire({
         icon: 'error',
         title: 'Ha ocurrido un error',
         text: this.errorMessage,
       });
      }
    });
  }
}
