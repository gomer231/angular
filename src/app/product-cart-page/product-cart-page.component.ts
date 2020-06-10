import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {OrderService} from '../shared/order.service';

@Component({
  selector: 'app-product-cart-page',
  templateUrl: './product-cart-page.component.html',
  styleUrls: ['./product-cart-page.component.css']
})
export class ProductCartPageComponent implements OnInit {

  cartProducts = [];
  totalPrice = 0;

  form: FormGroup;
  submitted = false;

  constructor(
    private productServ: ProductService,
    private formBuilder: FormBuilder,
    private orderServ: OrderService
  ) { }

  ngOnInit(): void {
    this.cartProducts = this.productServ.cartProducts;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cartProducts.length; i++) {
      this.totalPrice += +this.cartProducts[i].price
    }

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      payment: ['Cash']
    });
  }

  submit(): boolean {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const order = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      address: this.form.value.address,
      payment: this.form.value.payment,
      orders: this.cartProducts,
      price: this.totalPrice,
      date: new Date()
    };
    console.log(this.form);
    this.orderServ.create(order).subscribe( res => {
      this.form.reset();
      this.submitted = false;
    } );
  }

  delete(product): void {
    this.totalPrice -= +product.price;
    this.cartProducts.splice(this.cartProducts.indexOf(product), 1);
  }
}
