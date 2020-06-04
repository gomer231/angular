import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      photo: ['', Validators.required],
      info: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const product = {
      type: this.form.value.type,
      title: this.form.value.title,
      photo: this.form.value.photo,
      info: this.form.value.info,
      price: this.form.value.price,
    };
    console.log(this.form);
  }
}
