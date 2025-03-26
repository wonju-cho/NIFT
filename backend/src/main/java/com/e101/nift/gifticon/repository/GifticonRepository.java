package com.e101.nift.gifticon.repository;

import com.e101.nift.gifticon.entity.Gifticon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GifticonRepository extends JpaRepository<Gifticon, Long> {
    Optional<Gifticon> findById(Long gifticonId);
}
