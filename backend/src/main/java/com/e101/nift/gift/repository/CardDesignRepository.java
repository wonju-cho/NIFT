package com.e101.nift.gift.repository;

import com.e101.nift.gift.entity.CardDesign;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CardDesignRepository extends MongoRepository<CardDesign, String> {


}