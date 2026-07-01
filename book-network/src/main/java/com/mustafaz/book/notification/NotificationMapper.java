package com.mustafaz.book.notification;

import org.springframework.stereotype.Service;

@Service
public class NotificationMapper {

    public UserNotification toEntity(String recipientId, Notification notification) {
        return UserNotification.builder()
                .recipientId(recipientId)
                .status(notification.getStatus())
                .message(notification.getMessage())
                .bookTitle(notification.getBookTitle())
                .read(false)
                .build();
    }

    public Notification toNotification(UserNotification entity) {
        return Notification.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .message(entity.getMessage())
                .bookTitle(entity.getBookTitle())
                .read(entity.isRead())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}
