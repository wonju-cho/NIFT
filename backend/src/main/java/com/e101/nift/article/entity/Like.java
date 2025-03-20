package com.e101.nift.article.entity;
import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "products_id"})
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
    @JoinColumn(name = "products_id", nullable = false)
    private Article article;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}