package com.mustafaz.book.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Notification {
    private Integer id;
    private NotificationStatus status;
    private String message;
    private String bookTitle;
    private boolean read;
    private LocalDateTime createdDate;
}
