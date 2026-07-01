import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api-configuration';
import { Notification, PageResponseNotification } from '../../components/book/menu/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfiguration);

  findUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.config.rootUrl}/notifications/unread`);
  }

  findAllNotifications(page = 0, size = 10): Observable<PageResponseNotification> {
    return this.http.get<PageResponseNotification>(`${this.config.rootUrl}/notifications`, {
      params: { page, size },
    });
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.config.rootUrl}/notifications/${notificationId}/read`,
      null,
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.config.rootUrl}/notifications/read-all`, null);
  }
}
