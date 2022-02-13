import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSubscription: Subscription;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListner()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .createUser(form.value.inpEmail, form.value.inpPassword)
      .subscribe(
        (res: any) => {
          this.authService.userLogin(res.result.email, res.result.password);
          this.router.navigate['/login'];
        },
        (error) => {
          console.log('Sign-Up Failed!');
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
