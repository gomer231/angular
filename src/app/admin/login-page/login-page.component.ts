import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if ( this.form.invalid ) {
      return;
    }
    this.submitted = true;

    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };

    this.auth.login(user).subscribe( res => {
      // tslint:disable-next-line:no-unused-expression
      this.form.reset;
      this.router.navigate(['/admin', 'dashboard']);
      console.log(res);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    });
  }

}
