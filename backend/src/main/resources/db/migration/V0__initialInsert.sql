--
-- Dumping data for table `article_histories`
--

INSERT INTO `article_histories` VALUES (1,1,'2025-03-25 11:00:00.000000',1,2,NULL),(2,2,'2025-03-25 11:05:00.000000',1,1,NULL),(3,3,'2025-03-25 11:10:00.000000',1,3,NULL),(4,4,'2025-03-25 11:15:00.000000',3,4,NULL),(5,5,'2025-03-25 11:20:00.000000',2,5,NULL),(6,6,'2024-03-26 11:00:00.000000',1,3,NULL),(7,7,'2023-03-26 09:00:00.000000',1,4,NULL),(8,8,'2025-03-24 09:00:00.000000',1,5,NULL),(9,9,'2025-03-23 09:00:00.000000',1,2,NULL),(11,11,'2025-03-20 09:00:00.000000',1,4,NULL),(12,12,'2025-03-19 09:00:00.000000',1,5,NULL),(13,13,'2025-03-18 09:00:00.000000',1,2,NULL),(47,16,'2025-04-01 10:26:00.074872',3,6,NULL);

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` VALUES (1,NULL,5,'2025-03-25 10:00:00.000000',3.9,'12','2025-12-31 23:59:59.000000','https://sitem.ssgcdn.com/86/57/48/item/1000534485786_i1_750.jpg','15',1,120,1,'ON_SALE',0,NULL,NULL),(2,NULL,9,'2025-03-25 10:10:00.000000',4.5,'달달하고 맛있어요!','2025-11-30 23:59:59.000000','https://sitem.ssgcdn.com/93/69/80/item/1000556806993_i1_750.jpg','14',1,95,2,'ON_SALE',0,NULL,NULL),(3,NULL,10,'2025-03-25 10:20:00.000000',6,'점심용으로 적당합니다.','2025-10-15 23:59:59.000000','https://sitem.ssgcdn.com/86/57/48/item/1000534485786_i1_750.jpg','13',3,80,3,'ON_SALE',0,NULL,NULL),(4,NULL,3,'2025-03-25 10:30:00.000000',3.2,'편하게 쓰세요~','2025-09-30 23:59:59.000000','https://sitem.ssgcdn.com/69/86/21/item/0000008218669_i1_750.jpg','12',4,60,4,'ON_SALE',0,NULL,NULL),(5,NULL,16,'2025-03-25 10:40:00.000000',8.8,'11','2026-01-01 23:59:59.000000','https://sitem.ssgcdn.com/58/67/47/item/1000337476758_i1_750.jpg','11',5,200,5,'ON_SALE',0,NULL,NULL),(7,NULL,17,'2025-03-25 10:40:00.000000',8.8,'9','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','9',1,200,5,'ON_SALE',0,NULL,NULL),(8,NULL,15,'2025-03-25 10:40:00.000000',8.8,'8','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','8',1,200,5,'ON_SALE',0,NULL,NULL),(9,NULL,15,'2025-03-25 10:40:00.000000',8.8,'7','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','7',1,200,5,'ON_SALE',0,NULL,NULL),(10,NULL,15,'2025-03-25 10:40:00.000000',8.8,'6','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','중고거래선물테스트',2,200,5,'ON_SALE',0,NULL,NULL),(11,NULL,15,'2025-03-25 10:40:00.000000',8.8,'5','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','5',1,200,5,'ON_SALE',0,NULL,NULL),(12,NULL,15,'2025-03-25 10:40:00.000000',8.8,'4','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','4',1,200,5,'ON_SALE',0,NULL,NULL),(13,NULL,15,'2025-03-25 10:40:00.000000',8.8,'3','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','3',1,200,5,'ON_SALE',0,NULL,NULL),(14,NULL,15,'2025-03-25 10:40:00.000000',8.8,'2','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','2',1,200,5,'ON_SALE',0,NULL,NULL),(15,NULL,15,'2025-03-25 10:40:00.000000',8.8,'1','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','1',2,200,5,'ON_SALE',0,NULL,NULL),(16,NULL,1,'2025-03-27 10:40:00.000000',1.53,'테스트','2026-01-01 23:59:59.000000','https://sitem.ssgcdn.com/11/78/03/item/1000291037811_i1_750.jpg','테스트',1,0,1,'SOLD',1,NULL,NULL);

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` VALUES (1,'삼성전자'),(2,'LG생활건강'),(3,'이디야커피'),(4,'스타벅스'),(5,'던킨도너츠');

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` VALUES (1,'음료'),(2,'디저트'),(3,'패스트푸드'),(4,'편의점'),(5,'기타');

--
-- Dumping data for table `gift_histories`
--

INSERT INTO `gift_histories` VALUES (1,'2025-03-31 16:24:09.997518','67ea4319ea86c07d00d4471c',1,1,NULL,_binary '\0',3977733962),(2,'2025-04-01 10:26:00.088507','67eb40a7b1e41f305b469243',6,1,NULL,_binary '\0',3977722266);

--
-- Dumping data for table `gifticons`
--

INSERT INTO `gifticons` VALUES (1,'따뜻한 커피 한 잔','아메리카노','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg',4.5,4,1,NULL),(2,'달콤한 디저트','초코케이크','https://sitem.ssgcdn.com/93/31/82/item/1000640823193_i1_336.jpg',5,3,2,NULL),(3,'한 끼 식사로 충분','버거세트','https://example.com/gift3.png',7.5,5,3,NULL),(4,'편의점 도시락','도시락','https://example.com/gift4.png',4,1,4,NULL),(5,'모든 곳에서 사용 가능','기프트카드','https://example.com/gift5.png',10,2,5,NULL);

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` VALUES (22,2,1),(6,5,1),(21,7,1),(20,16,1),(1,1,2),(2,2,3),(3,3,4),(4,4,5),(19,5,6),(18,7,6);

--
-- Dumping data for table `sync_status`
--

INSERT INTO `sync_status` VALUES (1,6700111,'REAL_TIME','2025-04-02 11:13:11.035412');

--
-- Dumping data for table `used_histories`
--

INSERT INTO `used_histories` VALUES (1,'2025-03-25 13:00:00.000000',1,1,NULL,NULL),(2,'2025-03-25 13:10:00.000000',2,2,NULL,NULL),(3,'2025-03-25 13:20:00.000000',3,3,NULL,NULL),(4,'2025-03-25 13:30:00.000000',4,4,NULL,NULL),(5,'2025-03-25 13:40:00.000000',5,5,NULL,NULL);

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES (1,'20~29','female',3976389070,'영민','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',0,'0xa7B9A191107081f780E534502C1B2288cFB7cC03'),(2,'29','female',100002,'김영희','https://example.com/image2.png',0,'0xdef456'),(3,'32','male',100003,'이철수','https://example.com/image3.png',0,'0xghi789'),(4,'21','female',100004,'박지민','https://example.com/image4.png',0,'0xjkl012'),(5,'27','female',100005,'최유리','https://example.com/image5.png',0,'0xmnx345'),(6,'20~29','female',4006498484,'조원주','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',0,'0xa7B9A191107081f780E534502C1B2288cFB7cC03');

