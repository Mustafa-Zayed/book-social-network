type NotificationStatus = 'BORROWED' | 'RETURNED' | 'RETURN_APPROVED';

export interface Notification {
  status: NotificationStatus;
  message: string;
  bookTitle: string;
}
