import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../shared/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  products = [];
  pSub: Subscription;
  rSub: Subscription;
  productName;

  constructor(
    private productServ: ProductService
  ) { }

  ngOnInit(): void {
    this.pSub = this.productServ.getAll().subscribe( products => {
      console.log(products);
      this.products = products;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.rSub) {
      this.rSub.unsubscribe();
    }
  }

  remove(id): void {
    this.rSub = this.productServ.remove(id).subscribe( () => {
      this.products = this.products.filter( product => product.id !== id);
    });
  }
}
