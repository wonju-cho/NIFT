package com.e101.nift.product.service;

import com.e101.nift.product.entity.Like;
import com.e101.nift.product.entity.Product;
import com.e101.nift.product.repository.LikeRepository;
import com.e101.nift.product.repository.ProductRepository;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.request.ProductLikeDTO;
import com.e101.nift.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService{

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public void addLike(Long userId, Long productId){
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Product product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Optional<Like> existingLike = likeRepository.findByUserAndProduct(user, product);
        if (existingLike.isPresent()){
            // 이미 좋아요가 존재하면 삭제 (좋아요 취소)
            likeRepository.delete(existingLike.get());
            product.setCountLikes(product.getCountLikes() - 1);
        } else {
            // 좋아요 추가
            Like like = new Like();
            like.setUser(user);
            like.setProduct(product);
            likeRepository.save(like);
            product.setCountLikes(product.getCountLikes() + 1);
        }
        productRepository.save(product); // 좋아요 개수 업데이트
    }

    @Transactional
    @Override
    public void removeLike(Long userId, Long productId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Product product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Optional<Like> existingLike = likeRepository.findByUserAndProduct(user, product);
        if (existingLike.isEmpty()) {
            throw new IllegalStateException("좋아요가 존재하지 않습니다.");
        }

        // 좋아요 삭제
        likeRepository.delete(existingLike.get());
        product.setCountLikes(product.getCountLikes() - 1);
        productRepository.save(product); // 좋아요 개수 업데이트
    }

    @Override
    public Page<ProductLikeDTO> getLikedProducts(Long userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Page<Like> likes = likeRepository.findByUser(user, pageable);
        return likes.map(like -> new ProductLikeDTO(
                like.getProduct().getTitle(),
                like.getProduct().getCountLikes(),
                like.getProduct().getImageUrl(),
                like.getProduct().getCurrentPrice()
        ));
    }
}
