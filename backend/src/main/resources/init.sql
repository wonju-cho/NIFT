-- Drop and recreate the database
-- DROP DATABASE IF EXISTS nift;
-- CREATE DATABASE nift;
-- USE nift;

-- 1. brands
INSERT INTO brands (brand_id, brand_name) VALUES (1, '삼성전자');
INSERT INTO brands (brand_id, brand_name) VALUES (2, 'LG생활건강');
INSERT INTO brands (brand_id, brand_name) VALUES (3, '이디야커피');
INSERT INTO brands (brand_id, brand_name) VALUES (4, '스타벅스');
INSERT INTO brands (brand_id, brand_name) VALUES (5, '던킨도너츠');

-- 2. categories
INSERT INTO categories (category_id, category_name) VALUES (1, '음료');
INSERT INTO categories (category_id, category_name) VALUES (2, '디저트');
INSERT INTO categories (category_id, category_name) VALUES (3, '패스트푸드');
INSERT INTO categories (category_id, category_name) VALUES (4, '편의점');
INSERT INTO categories (category_id, category_name) VALUES (5, '기타');

-- 3. users
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age)
VALUES (1, 100001, '홍길동', '0xabc123', 'https://example.com/image1.png', 'male', '25');
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age)
VALUES (2, 100002, '김영희', '0xdef456', 'https://example.com/image2.png', 'female', '29');
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age)
VALUES (3, 100003, '이철수', '0xghi789', 'https://example.com/image3.png', 'male', '32');
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age)
VALUES (4, 100004, '박지민', '0xjkl012', 'https://example.com/image4.png', 'female', '21');
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age)
VALUES (5, 100005, '최유리', '0xmnx345', 'https://example.com/image5.png', 'female', '27');

-- 4. gifticons
INSERT INTO gifticons (gifticon_id, gifticon_title, description, price, image_url, category_id, brand_id)
VALUES (1, '아메리카노', '따뜻한 커피 한 잔', 4.5, 'https://example.com/gift1.png', 1, 4);
INSERT INTO gifticons (gifticon_id, gifticon_title, description, price, image_url, category_id, brand_id)
VALUES (2, '초코케이크', '달콤한 디저트', 5.0, 'https://example.com/gift2.png', 2, 3);
INSERT INTO gifticons (gifticon_id, gifticon_title, description, price, image_url, category_id, brand_id)
VALUES (3, '버거세트', '한 끼 식사로 충분', 7.5, 'https://example.com/gift3.png', 3, 5);
INSERT INTO gifticons (gifticon_id, gifticon_title, description, price, image_url, category_id, brand_id)
VALUES (4, '도시락', '편의점 도시락', 4.0, 'https://example.com/gift4.png', 4, 1);
INSERT INTO gifticons (gifticon_id, gifticon_title, description, price, image_url, category_id, brand_id)
VALUES (5, '기프트카드', '모든 곳에서 사용 가능', 10.0, 'https://example.com/gift5.png', 5, 2);

-- 5. articles
INSERT INTO articles (article_id, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon)
VALUES (1, '중고 기프티콘 팝니다', '거의 새 상품입니다.', 1, '2025-12-31 23:59:59', 'https://example.com/article1.png', 5, 3.9, '2025-03-25 10:00:00', 120, 1);
INSERT INTO articles (article_id, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon)
VALUES (2, '할인된 케이크', '달달하고 맛있어요!', 2, '2025-11-30 23:59:59', 'https://example.com/article2.png', 8, 4.5, '2025-03-25 10:10:00', 95, 2);
INSERT INTO articles (article_id, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon)
VALUES (3, '버거 좋아하시는 분?', '점심용으로 적당합니다.', 3, '2025-10-15 23:59:59', 'https://example.com/article3.png', 10, 6.0, '2025-03-25 10:20:00', 80, 3);
INSERT INTO articles (article_id, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon)
VALUES (4, '도시락 기프티콘', '편하게 쓰세요~', 4, '2025-09-30 23:59:59', 'https://example.com/article4.png', 3, 3.2, '2025-03-25 10:30:00', 60, 4);
INSERT INTO articles (article_id, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon)
VALUES (5, '기프트카드 팝니다', '자유롭게 사용 가능', 5, '2026-01-01 23:59:59', 'https://example.com/article5.png', 15, 8.8, '2025-03-25 10:40:00', 200, 5);

-- 6. likes
INSERT INTO likes (like_id, articles_id, user_id) VALUES (1, 1, 2);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (2, 2, 3);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (3, 3, 4);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (4, 4, 5);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (5, 5, 1);

-- 7. article_histories
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, articles_id)
VALUES (1, '2025-03-25 11:00:00', 1, 1, 1);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, articles_id)
VALUES (2, '2025-03-25 11:05:00', 2, 2, 2);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, articles_id)
VALUES (3, '2025-03-25 11:10:00', 1, 3, 3);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, articles_id)
VALUES (4, '2025-03-25 11:15:00', 3, 4, 4);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, articles_id)
VALUES (5, '2025-03-25 11:20:00', 2, 5, 5);

-- 8. gift_histories
INSERT INTO gift_histories (gift_history_id, created_at, mongo_id, from_user_id, to_user_id, gifticon_id)
VALUES (1, '2025-03-25 12:00:00', 'mongo001', 1, 2, 1);
INSERT INTO gift_histories (gift_history_id, created_at, mongo_id, from_user_id, to_user_id, gifticon_id)
VALUES (2, '2025-03-25 12:10:00', 'mongo002', 2, 3, 2);
INSERT INTO gift_histories (gift_history_id, created_at, mongo_id, from_user_id, to_user_id, gifticon_id)
VALUES (3, '2025-03-25 12:20:00', 'mongo003', 3, 4, 3);
INSERT INTO gift_histories (gift_history_id, created_at, mongo_id, from_user_id, to_user_id, gifticon_id)
VALUES (4, '2025-03-25 12:30:00', 'mongo004', 4, 5, 4);
INSERT INTO gift_histories (gift_history_id, created_at, mongo_id, from_user_id, to_user_id, gifticon_id)
VALUES (5, '2025-03-25 12:40:00', 'mongo005', 5, 1, 5);

-- 9. used_histories
INSERT INTO used_histories (used_history_id, created_at, user_id, gifticon_id)
VALUES (1, '2025-03-25 13:00:00', 1, 1);
INSERT INTO used_histories (used_history_id, created_at, user_id, gifticon_id)
VALUES (2, '2025-03-25 13:10:00', 2, 2);
INSERT INTO used_histories (used_history_id, created_at, user_id, gifticon_id)
VALUES (3, '2025-03-25 13:20:00', 3, 3);
INSERT INTO used_histories (used_history_id, created_at, user_id, gifticon_id)
VALUES (4, '2025-03-25 13:30:00', 4, 4);
INSERT INTO used_histories (used_history_id, created_at, user_id, gifticon_id)
VALUES (5, '2025-03-25 13:40:00', 5, 5);
