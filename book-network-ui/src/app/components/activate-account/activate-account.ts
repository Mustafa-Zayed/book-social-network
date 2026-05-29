import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { skipUntil, Subscription } from 'rxjs';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-activate-account',
  imports: [CodeInputModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.scss',
})
export class ActivateAccount {
  message = signal<string>('');
  isOkay = signal<boolean>(true);
  submitted = signal<boolean>(false);

  subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  private confirmAccount(token: string) {
    const subscription = this.authService
      .confirm({
        token,
      })
      .subscribe({
        next: () => {
          this.message.set(
            'Your account has been successfully activated.\nNow you can proceed to login',
          );
          this.submitted.set(true);
          this.isOkay.set(true);
        },
        error: () => {
          this.message.set('Token has been expired or invalid');
          this.submitted.set(true);
          this.isOkay.set(false);
        },
      });
    this.subscriptions.push(subscription);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  protected readonly skipUntil = skipUntil;

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
