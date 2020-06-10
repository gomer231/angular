import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../shared/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product;

  constructor(
    private productServ: ProductService
  ) { }

  ngOnInit(): void {
  }

  addProduct(product): void {
    this.productServ.addProduct(product)
  }
}
