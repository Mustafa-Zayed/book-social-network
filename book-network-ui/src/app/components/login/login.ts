import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // authRequest = signal<AuthenticationRequest>({ email: '', password: '' });
  // errorMsg = signal<string[]>([]);
  // subscriptions: Array<Subscription> = [];

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    // await this.keycloakService.init();
    // await this.keycloakService.login();
  }

  /*login() {
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
  }*/
}
