package com.mustafaz.book.notification;

import com.mustafaz.book.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("notifications")
@RequiredArgsConstructor
@Tag(name = "Notification")
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> findUnreadNotifications(Authentication connectedUser) {
        return ResponseEntity.ok(service.findUnreadNotifications(connectedUser));
    }

    @GetMapping
    public ResponseEntity<PageResponse<Notification>> findAllNotifications(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.findAllNotifications(page, size, connectedUser));
    }

    @PatchMapping("/{notification-id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable("notification-id") Integer notificationId,
            Authentication connectedUser
    ) {
        service.markAsRead(notificationId, connectedUser);
        return ResponseEntity.accepted().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication connectedUser) {
        service.markAllAsRead(connectedUser);
        return ResponseEntity.accepted().build();
    }
}
