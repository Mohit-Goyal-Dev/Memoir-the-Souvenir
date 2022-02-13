import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  userAuthenticated = false;
  private authListnerSub: Subscription;
  ngOnInit() {
    this.userAuthenticated = this.authService.getUserAuthStatus();
    this.authListnerSub = this.authService
      .getAuthStatusListner()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
      });
  }
  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }
  onLogout() {
    this.authService.logoutUser();
  }
}
