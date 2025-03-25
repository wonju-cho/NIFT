package com.e101.nift.use.entity;

import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "used_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class usedHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usedHistoryId;
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;
    
    @ManyToOne
    @JoinColumn(name = "gifticon_id", nullable = false)
    private Gifticon gifticon;
}