export type NotificationStatus = 'BORROWED' | 'RETURNED' | 'RETURN_APPROVED';

export interface Notification {
  id: number;
  status: NotificationStatus;
  message: string;
  bookTitle: string;
  read: boolean;
  createdDate: string;
}

export interface PageResponseNotification {
  content: Notification[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
