import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { ToastrService } from 'ngx-toastr';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { Notification } from './notification';
import { NotificationService } from '../../../services/services/notification.service';
import { firstValueFrom } from 'rxjs';

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
  private notificationService = inject(NotificationService);

  async ngOnInit(): Promise<void> {
    const userId = this.keycloakService.keycloak.tokenParsed?.sub;

    if (!userId) {
      return;
    }

    await this.loadUnreadNotifications();
    await this.connectWebSocket(userId);
  }

  private async loadUnreadNotifications(): Promise<void> {
    try {
      const unreadNotifications = await firstValueFrom(
        this.notificationService.findUnreadNotifications(),
      );
      this.notifications.set(unreadNotifications);
      this.unreadNotificationsCount = unreadNotifications.length;
    } catch {
      console.error('Failed to load unread notifications');
    }
  }

  private async connectWebSocket(userId: string): Promise<void> {
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
            this.handleIncomingNotification(notification, true);
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

  private handleIncomingNotification(notification: Notification, showToast: boolean): void {
    const alreadyExists = this.notifications().some((n) => n.id === notification.id);
    if (alreadyExists) {
      return;
    }

    this.notifications.update((notifications) => [notification, ...notifications]);

    if (!notification.read) {
      this.unreadNotificationsCount++;
    }

    if (showToast) {
      this.showNotificationToast(notification);
    }
  }

  private showNotificationToast(notification: Notification): void {
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
  }

  ngOnDestroy() {
    if (this.socketClient !== null) {
      this.socketClient.deactivate();
      this.socketClient = null;
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  async markNotificationsAsRead(): Promise<void> {
    if (this.unreadNotificationsCount === 0) {
      return;
    }

    try {
      await firstValueFrom(this.notificationService.markAllAsRead());
      this.unreadNotificationsCount = 0;
      this.notifications.update((notifications) =>
        notifications.map((notification) => ({ ...notification, read: true })),
      );
    } catch {
      console.error('Failed to mark notifications as read');
    }
  }

  async logout() {
    await this.keycloakService.logout();
  }

  get loggedInUser() {
    return (
      `${this.keycloakService.profile?.firstName} ${this.keycloakService.profile?.lastName}` || null
    );
  }

  async accountManagement() {
    await this.keycloakService.accountManagement();
  }
}
