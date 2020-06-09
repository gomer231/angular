import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../shared/product.service';
import {switchMap} from 'rxjs/operators';
import {Product} from '../../shared/interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  form: FormGroup;
  product: Product;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productServ: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( params => {
        return this.productServ.getById(params[`id`])
      })
    ).subscribe(product => {
      this.product = product;
      this.form = this.formBuilder.group({
        type: [this.product.type, Validators.required],
        title: [this.product.title, Validators.required],
        photo: [this.product.photo, Validators.required],
        info: [this.product.info, Validators.required],
        price: [this.product.price, Validators.required]
      });
    })
  }

  submit(): boolean {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this.productServ.update({
      ...this.product,
      type: this.form.value.type,
      title: this.form.value.title,
      photo: this.form.value.photo,
      info: this.form.value.info,
      price: this.form.value.price,
      date: new Date()
    }).subscribe( res => {
      this.form.reset();
      this.submitted = false;
      this.router.navigate(['/admin', 'dashboard']);
      console.log(res);
    } );
  }
}
