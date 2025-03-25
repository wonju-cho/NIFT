package com.e101.nift.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    private Long kakaoId;
    private String nickName;
    private String walletAddress;
    private String profileImage;
    private String gender;
    private String age;
    private int role = 0; // 사용자 0, 매장 관리자 1, 전체 관리자 2

}