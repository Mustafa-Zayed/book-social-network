import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationService } from '../../services/services/authentication.service';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authRequest = signal<AuthenticationRequest>({ email: '', password: '' });
  errorMsg = signal<string[]>([]);
  subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
  ) {}

  login() {
    this.errorMsg.set([]);
    const subscription = this.authService
      .authenticate({
        body: this.authRequest(),
      })
      .subscribe({
        next: (res) => {
          this.tokenService.token = res.token as string;
          this.router.navigate(['books']);
        },
        error: (err) => {
          console.log(err);
          if (err.error.validationErrors) {
            this.errorMsg.set(err.error.validationErrors);
          } else {
            this.errorMsg.set([err.error.error]);
          }
        },
      });
    this.subscriptions.push(subscription);
  }

  register() {
    this.router.navigate(['register']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
