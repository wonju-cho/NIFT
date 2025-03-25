package com.e101.nift.secondhand.entity;
import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "articles_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;
    
    @ManyToOne
    @JoinColumn(name = "articles_id", nullable = false)
    private Article article;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}