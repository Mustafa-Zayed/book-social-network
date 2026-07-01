package com.mustafaz.book.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {

    List<UserNotification> findByRecipientIdAndReadFalseOrderByCreatedDateDesc(String recipientId);

    Page<UserNotification> findByRecipientIdOrderByCreatedDateDesc(String recipientId, Pageable pageable);

    Optional<UserNotification> findByIdAndRecipientId(Integer id, String recipientId);
}
