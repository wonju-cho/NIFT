USE nift;

INSERT INTO categories (categoryName) VALUES  
('카페'),  
('베이커리/도넛/떡'),  
('아이스크림/빙수'),  
('치킨/피자'),  
('패스트푸드'),  
('편의점/마트');

INSERT INTO brands (brandName) VALUES 
('스타벅스'), ('투썸플레이스'), ('파리바게트'), ('던킨'), ('배스킨라빈스'), ('설빙'),
('BBQ'), ('교촌치킨'), ('BHC'), ('도미노피자'), ('미스터피자'),
('롯데리아'), ('맥도날드'), ('버거킹'), ('맘스터치'),
('GS25'), ('CU'), ('이마트');

INSERT INTO users (kakaoId, nickName, walletAddress, profileImage) VALUES
(101, '도원', '0xabc123', 'https://example.com/profiles/dowon.jpg'),
(102, '유주', '0xdef456', 'https://example.com/profiles/yuju.jpg'),
(3960413492, '영민', 'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg'),
(104, '원주', '0xjkl987', 'https://example.com/profiles/wonju.jpg'),
(105, '희진', '0xlmn654', 'https://example.com/profiles/heejin.jpg'),
(106, '미서', '0xopq321', 'https://example.com/profiles/miseo.jpg');

INSERT INTO articles (title, description, category_id, brand_id, imageUrl, currentPrice, createdAt, expirationDate, viewCnt, countLikes) VALUES
-- 카페 (스타벅스, 투썸플레이스)
('아메리카노', '스타벅스 베스트셀러', 1, 1, 'https://static.megamart.com/article/image/1326/13264314/13264314_1_960.jpg', 4500, '2024-03-17 08:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 120, 10),
('카페라떼', '스타벅스 라떼', 1, 1, 'https://sitem.ssgcdn.com/11/78/03/item/1000291037811_i1_750.jpg', 5000, '2024-03-17 09:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 80, 8),

('아메리카노', '투썸플레이스 베스트셀러', 1, 2, 'https://sitem.ssgcdn.com/75/10/35/item/1000298351075_i1_750.jpg', 4000, '2024-03-17 10:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 60, 5),
('딸기라떼', '투썸플레이스 시즌 메뉴', 1, 2, 'https://mo.twosome.co.kr/upload/MOMG0030/202405/MOMG0030_20240531112332_FQBDwZrA?width=600&height=600', 5500, '2024-03-17 11:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 50, 4),

-- 베이커리/도넛/떡 (파리바게트, 던킨)
('소보로빵', '파리바게트 베스트셀러', 2, 3, 'https://sitem.ssgcdn.com/12/32/26/item/1000646263212_i1_1200.jpg', 3000, '2024-03-17 12:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 70, 6),
('크로와상', '바삭한 크로와상', 2, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nlxgjebeQx_dkH9DWSR5PrhLbkMe8NI18iuLQOp1I79LyqAAzO6qLTo&usqp=CAE&s', 4000, '2024-03-17 13:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 90, 9),

('도넛 6개 세트', '던킨 도넛 세트', 2, 4, 'https://sitem.ssgcdn.com/61/68/97/item/1000630976861_i1_1200.jpg', 12000, '2024-03-17 14:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 85, 7),
('도넛 12개 세트', '던킨 도넛 대용량', 2, 4, 'https://sitem.ssgcdn.com/49/07/54/item/1000597540749_i1_1200.jpg', 22000, '2024-03-17 15:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 95, 10),

-- 아이스크림/빙수 (배스킨라빈스, 설빙)
('아이스크림 싱글레귤러', '배스킨라빈스 싱글', 3, 5, 'https://sitem.ssgcdn.com/04/70/80/item/1000556807004_i1_750.jpg', 3200, '2024-03-17 16:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 11),
('아이스크림 파인트', '배스킨라빈스 파인트', 3, 5, 'https://sitem.ssgcdn.com/93/69/80/item/1000556806993_i1_750.jpg', 8900, '2024-03-17 17:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 110, 12),

('인절미 빙수', '설빙 대표 메뉴', 3, 6, 'https://sitem.ssgcdn.com/93/60/07/item/1000553076093_i1_750.jpg', 8500, '2024-03-17 18:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 95, 10),
('초코 빙수', '설빙 초코 빙수', 3, 6, 'https://sitem.ssgcdn.com/11/96/24/item/1000560249611_i1_750.jpg', 9500, '2024-03-17 19:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 105, 13),

-- 치킨/피자 (BBQ, 교촌치킨, BHC, 도미노피자, 미스터피자)
('황금올리브치킨', 'BBQ 대표 메뉴', 4, 7, 'https://sitem.ssgcdn.com/87/03/87/item/1000370870387_i1_750.jpg', 20000, '2024-03-17 08:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 150, 15),
('핫황금올리브', 'BBQ 매운 버전', 4, 7, 'https://sitem.ssgcdn.com/58/95/90/item/1000556909558_i1_750.jpg', 21000, '2024-03-17 09:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 140, 12),

('허니콤보', '교촌치킨 대표 메뉴', 4, 8, 'https://sitem.ssgcdn.com/08/65/34/item/1000543346508_i1_750.jpg', 21000, '2024-03-17 10:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 140, 12),
('레드콤보', '교촌치킨 매운맛', 4, 8, 'https://sitem.ssgcdn.com/01/63/34/item/1000543346301_i1_750.jpg', 21500, '2024-03-17 11:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 130, 11),

('뿌링클', 'BHC 대표 메뉴', 4, 9, 'https://sitem.ssgcdn.com/39/28/39/item/1000296392839_i1_750.jpg', 22000, '2024-03-17 12:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 130, 11),
('맛초킹', 'BHC 인기 메뉴', 4, 9, 'https://sitem.ssgcdn.com/05/95/65/item/1000574659505_i1_750.jpg', 22500, '2024-03-17 13:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 125, 10),

('포테이토피자', '도미노피자 스페셜', 4, 10, 'https://sitem.ssgcdn.com/36/66/76/item/1000530766636_i1_750.jpg', 25000, '2024-03-17 14:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 120, 10),
('슈퍼디럭스', '도미노피자 프리미엄', 4, 10, 'https://sitem.ssgcdn.com/19/56/39/item/1000063395619_i1_750.jpg', 27000, '2024-03-17 15:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 110, 9),

('치즈피자', '미스터피자 베이직', 4, 11, 'https://sitem.ssgcdn.com/34/21/96/item/1000539962134_i1_750.jpg', 23000, '2024-03-17 16:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 8),
('포테이토골드', '미스터피자 인기 메뉴', 4, 11, 'https://sitem.ssgcdn.com/37/22/60/item/1000533602237_i1_750.jpg', 24500, '2024-03-17 17:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 90, 7),

-- 패스트푸드 (롯데리아, 맥도날드, 버거킹, 맘스터치)
('불고기버거', '롯데리아 대표 메뉴', 5, 12, 'https://sitem.ssgcdn.com/54/86/98/item/1000551988654_i1_750.jpg', 4200, '2024-03-17 18:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 8),
('새우버거', '롯데리아 인기 메뉴', 5, 12, 'https://sitem.ssgcdn.com/64/79/51/item/1000550517964_i1_750.jpg', 4500, '2024-03-17 19:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 90, 7),

('빅맥', '맥도날드 대표 버거', 5, 13, 'https://sitem.ssgcdn.com/90/24/04/item/1000532042490_i1_750.jpg', 5400, '2024-03-17 20:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 95, 6),
('맥스파이시 상하이', '맥도날드 매운맛 버거', 5, 13, 'https://sitem.ssgcdn.com/85/24/04/item/1000532042485_i1_750.jpg', 5700, '2024-03-17 21:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 85, 5),

('와퍼', '버거킹 대표 버거', 5, 14, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxuijYwzg-229utHRcIZXYUGN46SxQtnh4g&s', 5900, '2024-03-17 22:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 110, 9),
('통새우와퍼', '버거킹 인기 메뉴', 5, 14, 'https://sitem.ssgcdn.com/07/43/54/item/1000518544307_i1_750.jpg', 6200, '2024-03-17 23:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 105, 8),

('싸이순살버거', '맘스터치 인기 메뉴', 5, 15, 'https://sitem.ssgcdn.com/86/57/48/item/1000534485786_i1_750.jpg', 4800, '2024-03-18 00:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 85, 6),
('인크레더블버거', '맘스터치 스페셜', 5, 15, 'https://img.danawa.com/prod_img/500000/813/641/img/10641813_1.jpg?_v=20240429133515', 5500, '2024-03-18 01:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 75, 5),

-- 편의점/마트 (GS25, CU, 이마트)
('삼각김밥 참치마요', 'GS25 인기 제품', 6, 16, 'https://sitem.ssgcdn.com/56/34/53/item/1000582533456_i1_750.jpg', 1200, '2024-03-18 02:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 140, 10),
('햄치즈 샌드위치', 'GS25 샌드위치', 6, 16, 'https://sitem.ssgcdn.com/70/83/85/item/1000061858370_i1_750.jpg', 2500, '2024-03-18 03:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 130, 9),

('컵라면 신라면', 'CU 베스트셀러', 6, 17, 'https://sitem.ssgcdn.com/58/67/47/item/1000337476758_i1_750.jpg', 1800, '2024-03-18 04:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 160, 12),
('초코우유', 'CU 인기 음료', 6, 17, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBwMkdDLdhItj5BLA0dqDVnpQB1GftrR09cg&s', 2000, '2024-03-18 05:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 150, 11),

('즉석밥 햇반', '이마트 인기 상품', 6, 18, 'https://sitem.ssgcdn.com/69/86/21/item/0000008218669_i1_750.jpg', 4500, '2024-03-18 06:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 180, 15),
('이마트 PB 감자칩', '이마트 자체 브랜드', 6, 18, 'https://sitem.ssgcdn.com/54/13/19/item/1000012191354_i1_750.jpg', 3000, '2024-03-18 07:00:00', DATE_ADD(NOW(), INTERVAL 30 DAY), 170, 13);

INSERT INTO likes (articles_id, user_id) VALUES
(1, 1), (1, 3), (1, 4), (1, 6),
(2, 2), (2, 3), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(4, 1), (4, 2), (4, 3), (4, 6),
(5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(6, 2), (6, 4), (6, 6),
(7, 1), (7, 2), (7, 4), (7, 5), (7, 6),
(8, 2), (8, 5),
(9, 2), (9, 4), (9, 5),
(10, 1), (10, 2), (10, 5),
(11, 1), (11, 3), (11, 6),
(12, 2), (12, 3), (12, 5), (12, 6),
(13, 1), (13, 2), (13, 3), (13, 4), (13, 5), (13, 6),
(14, 4), (14, 5), (14, 6),
(15, 2), (15, 5),
(16, 1), (16, 2), (16, 3), (16, 5),
(17, 1), (17, 2), (17, 4), (17, 5),
(18, 1), (18, 2), (18, 6),
(19, 2), (19, 3), (19, 4), (19, 5), (19, 6),
(20, 1), (20, 5),
(21, 2), (21, 3), (21, 4), (21, 5),
(22, 1), (22, 2), (22, 3), (22, 4),
(23, 1), (23, 2), (23, 6),
(24, 1), (24, 3), (24, 5), (24, 6),
(25, 2), (25, 5), (25, 6),
(26, 2), (26, 3), (26, 4), (26, 5), (26, 6),
(27, 1), (27, 2), (27, 3), (27, 4), (27, 5),
(28, 1), (28, 2), (28, 5), (28, 6),
(29, 2), (29, 5), (29, 6),
(30, 2), (30, 3), (30, 4), (30, 5), (30, 6),
(31, 4), (31, 5),
(32, 2),
(33, 1), (33, 3),
(34, 2), (34, 3), (34, 4), (34, 5),
(35, 1), (35, 5),
(36, 1), (36, 4), (36, 5), (36, 6);
