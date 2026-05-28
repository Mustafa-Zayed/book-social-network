import { Component, signal } from '@angular/core';
import { RegistrationRequest } from '../../services/models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerRequest = signal<RegistrationRequest>({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
  });
  errorMsg = signal<Array<string>>([]);

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg.set([]);
    this.authService
      .register({
        body: this.registerRequest(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.errorMsg.set(err.error.validationErrors);
        },
      });
  }
}
