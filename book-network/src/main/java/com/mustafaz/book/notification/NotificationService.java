package com.mustafaz.book.notification;

import com.mustafaz.book.common.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserNotificationRepository repository;
    private final NotificationMapper mapper;

    @Transactional
    public void sendNotification(String userId, Notification notification) {
        UserNotification saved = repository.save(mapper.toEntity(userId, notification));
        Notification payload = mapper.toNotification(saved);

        log.info("Sending WS notification to {} with payload {}", userId, payload);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notifications",
                payload
        );
    }

    public List<Notification> findUnreadNotifications(Authentication connectedUser) {
        return repository.findByRecipientIdAndReadFalseOrderByCreatedDateDesc(connectedUser.getName())
                .stream()
                .map(mapper::toNotification)
                .toList();
    }

    public PageResponse<Notification> findAllNotifications(
            int page,
            int size,
            Authentication connectedUser
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserNotification> notifications = repository.findByRecipientIdOrderByCreatedDateDesc(
                connectedUser.getName(),
                pageable
        );
        List<Notification> content = notifications.stream()
                .map(mapper::toNotification)
                .toList();

        return new PageResponse<>(
                content,
                notifications.getNumber(),
                notifications.getSize(),
                notifications.getTotalElements(),
                notifications.getTotalPages(),
                notifications.isFirst(),
                notifications.isLast()
        );
    }

    @Transactional
    public void markAsRead(Integer notificationId, Authentication connectedUser) {
        UserNotification notification = repository.findByIdAndRecipientId(notificationId, connectedUser.getName())
                .orElseThrow(() -> new EntityNotFoundException("No notification found with ID:: " + notificationId));

        notification.setRead(true);
        repository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Authentication connectedUser) {
        List<UserNotification> unreadNotifications = repository.findByRecipientIdAndReadFalseOrderByCreatedDateDesc(
                connectedUser.getName()
        );
        unreadNotifications.forEach(notification -> notification.setRead(true));
        repository.saveAll(unreadNotifications);
    }
}
