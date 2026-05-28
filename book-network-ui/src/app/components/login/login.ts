import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationService } from '../../services/services/authentication.service';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authRequest = signal<AuthenticationRequest>({ email: '', password: '' });
  errorMsg = signal<string[]>([]);

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
  ) {}

  login() {
    this.errorMsg.set([]);
    this.authService
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
  }

  register() {
    this.router.navigate(['register']);
  }
}
