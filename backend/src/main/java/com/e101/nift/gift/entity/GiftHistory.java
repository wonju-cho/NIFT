package com.e101.nift.gift.entity;

import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "gift_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GiftHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long giftHistoryId;

    private LocalDateTime createdAt;
    private String mongoId;

    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUserId;

    @ManyToOne
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUserId;

    @ManyToOne
    @JoinColumn(name = "gifticon_id", nullable = false)
    private Gifticon gifticon;
}
