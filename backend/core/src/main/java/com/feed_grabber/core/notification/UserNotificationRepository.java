package com.feed_grabber.core.notification;

import com.feed_grabber.core.notification.dto.NotificationResponseDto;
import com.feed_grabber.core.notification.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {
    @Query(
            value = "SELECT " +
                    "new com.feed_grabber.core.notification.dto.NotificationResponseDto(" +
                    "un.id, un.text, un.request.creationDate, res.id, q.id) " +
                    "from UserNotification un, Response res, User u, Questionnaire q " +
                    "WHERE " +
                    "un.request.id = res.request.id and " +
                    "q.id = res.request.questionnaire.id and " +
                    "res.user.id = u.id and " +
                    "u.id = :userId and " +
                    "res.notificationExists = true"

    )
    List<NotificationResponseDto> findAllActiveNotificationsByUser(UUID userId);
}