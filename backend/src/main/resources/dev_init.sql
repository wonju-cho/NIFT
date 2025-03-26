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
INSERT INTO users (user_id, kakao_id, nick_name, wallet_address, profile_image, gender, age, role) VALUES
                                                                                                       (1, 100001, '도원이', '0xAbC123...', 'https://example.com/profile1.png', 'male', '20', 0),
                                                                                                       (2, 100002, '지혜짱', '0xDef456...', 'https://example.com/profile2.png', 'female', '23', 1),
                                                                                                       (3, 100003, '승호형', '0x789abc...', 'https://example.com/profile3.png', 'male', '27', 0),
                                                                                                       (4, 100004, '혜민쓰', '0x321fed...', 'https://example.com/profile4.png', 'female', '25', 2),
                                                                                                       (5, 100005, '현수', '0xa1b2c3...', 'https://example.com/profile5.png', 'male', '21', 1),
                                                                                                       (6, 100006, '기훈이', '0xb3c4d5...', 'https://example.com/profile6.png', 'male', '22', 0),
                                                                                                       (7, 100007, '혜진님', '0xc5d6e7...', 'https://example.com/profile7.png', 'female', '24', 2),
                                                                                                       (8, 100008, '성현이', '0xd7e8f9...', 'https://example.com/profile8.png', 'male', '26', 1),
                                                                                                       (9, 100009, '유림짱', '0xe9f0a1...', 'https://example.com/profile9.png', 'female', '23', 0),
                                                                                                       (10, 100010, '정우대장', '0xf1a2b3...', 'https://example.com/profile10.png', 'male', '29', 2);

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
INSERT INTO articles (article_id, serial_num, title, description, user_id, expiration_date, image_url, count_likes, current_price, created_at, view_cnt, gifticon) VALUES
                                                                                                                                                                       (1, 20250325001, '기프티콘 팝니다 - 스타벅스 아메리카노', '따뜻한 아메리카노 필요하신 분!', 1, '2025-12-31 23:59:59', 'https://example.com/starbucks1.png', 5, 4.2, '2025-03-25 13:00:00', 120, 1),
                                                                                                                                                                       (2, 20250325002, '할인된 파리바게뜨 케이크', '유통기한 넉넉해요!', 2, '2025-12-15 23:59:59', 'https://example.com/cake1.png', 8, 6.5, '2025-03-25 13:05:00', 87, 2),
                                                                                                                                                                       (3, 20250325003, '던킨도너츠 도넛팩', '6개 묶음 세트입니다.', 3, '2025-11-30 23:59:59', 'https://example.com/dunkin1.png', 3, 5.0, '2025-03-25 13:10:00', 60, 3),
                                                                                                                                                                       (4, 20250325004, 'GS25 도시락 기프티콘', '점심 해결하세요!', 4, '2025-10-20 23:59:59', 'https://example.com/gs25lunch.png', 2, 4.0, '2025-03-25 13:15:00', 42, 4),
                                                                                                                                                                       (5, 20250325005, '배스킨라빈스 싱글콘', '무난한 맛 선택 가능 🍦', 5, '2025-09-30 23:59:59', 'https://example.com/brsingle.png', 6, 3.1, '2025-03-25 13:20:00', 53, 5),
                                                                                                                                                                       (6, 20250325006, '버거킹 와퍼세트', '콜라 포함된 세트!', 1, '2025-12-10 23:59:59', 'https://example.com/whopper.png', 11, 6.9, '2025-03-25 13:25:00', 98, 1),
                                                                                                                                                                       (7, 20250325007, 'BHC 치킨반반 기프티콘', '순살 구성입니다.', 2, '2025-11-01 23:59:59', 'https://example.com/bhc1.png', 9, 17.8, '2025-03-25 13:30:00', 140, 2),
                                                                                                                                                                       (8, 20250325008, '이디야 라떼 기프티콘', '따뜻한 커피 한 잔 어떠세요?', 3, '2025-10-05 23:59:59', 'https://example.com/ediya.png', 4, 3.6, '2025-03-25 13:35:00', 41, 3),
                                                                                                                                                                       (9, 20250325009, '투썸 조각케이크', '디저트 타임용으로 딱입니다!', 4, '2025-09-20 23:59:59', 'https://example.com/twosomecake.png', 7, 5.8, '2025-03-25 13:40:00', 65, 4),
                                                                                                                                                                       (10, 20250325010, 'CU 편의점 아이스크림', '쿨하게 즐겨요 🍨', 5, '2025-08-31 23:59:59', 'https://example.com/cuice.png', 1, 2.5, '2025-03-25 13:45:00', 23, 5);

-- 6. likes
INSERT INTO likes (like_id, articles_id, user_id) VALUES (1, 1, 2);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (2, 2, 3);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (3, 3, 4);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (4, 4, 5);
INSERT INTO likes (like_id, articles_id, user_id) VALUES (5, 5, 1);

-- 7. article_histories
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, article_id)
VALUES (1, '2025-03-25 11:00:00', 1, 1, 1);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, article_id)
VALUES (2, '2025-03-25 11:05:00', 2, 2, 2);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, article_id)
VALUES (3, '2025-03-25 11:10:00', 1, 3, 3);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, article_id)
VALUES (4, '2025-03-25 11:15:00', 3, 4, 4);
INSERT INTO article_histories (article_history_id, created_at, history_type, user_id, article_id)
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
