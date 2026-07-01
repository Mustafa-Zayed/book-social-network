import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { ToastrService } from 'ngx-toastr';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { Notification } from './notification';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  socketClient: Client | null = null;
  unreadNotificationsCount = 0;
  subscriptions: StompSubscription[] = [];

  notifications = signal<Notification[]>([]);

  private keycloakService = inject(KeycloakService);
  private toastService = inject(ToastrService);

  async ngOnInit(): Promise<void> {
    const userId = this.keycloakService.keycloak.tokenParsed?.sub;

    if (userId) {
      (globalThis as typeof globalThis & { global?: typeof globalThis }).global = globalThis;
      const { default: SockJS } = await import('sockjs-client');

      this.socketClient = new Client({
        connectHeaders: {
          Authorization: 'Bearer ' + this.keycloakService.keycloak.token,
        },
        webSocketFactory: () => new SockJS('http://localhost:8088/api/v1/ws') as WebSocket,
        reconnectDelay: 5000,
        onConnect: () => {
          const subscription = this.socketClient?.subscribe(
            `/user/${userId}/notifications`,
            (message) => {
              const notification = JSON.parse(message.body) as Notification;

              this.notifications.update((notifications) => [notification, ...notifications]);
              switch (notification.status) {
                case 'BORROWED':
                  this.toastService.info(notification.message, notification.bookTitle);
                  break;
                case 'RETURNED':
                  this.toastService.warning(notification.message, notification.bookTitle);
                  break;
                case 'RETURN_APPROVED':
                  this.toastService.success(notification.message, notification.bookTitle);
                  break;
              }
              this.unreadNotificationsCount++;
            },
          );
          if (subscription) {
            this.subscriptions.push(subscription);
          }
        },
        onStompError: () => {
          console.error('Error while connecting to webSocket');
        },
      });

      this.socketClient.activate();
    }
  }

  ngOnDestroy() {
    if (this.socketClient !== null) {
      this.socketClient.deactivate();
      this.socketClient = null;
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  async logout() {
    await this.keycloakService.logout();
  }

  get loggedInUser() {
    return (
      `${this.keycloakService.profile?.firstName} ${this.keycloakService.profile?.lastName}` || null
    );
    // return this.keycloakService.keycloak.tokenParsed?.['given_name'];
  }

  async accountManagement() {
    await this.keycloakService.accountManagement();
  }
}
