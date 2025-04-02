-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: nift
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article_histories`
--

DROP TABLE IF EXISTS `article_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_histories` (
  `article_history_id` bigint NOT NULL AUTO_INCREMENT,
  `article_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `history_type` smallint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `tx_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`article_history_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_histories`
--

LOCK TABLES `article_histories` WRITE;
/*!40000 ALTER TABLE `article_histories` DISABLE KEYS */;
INSERT INTO `article_histories` VALUES (1,1,'2025-03-25 11:00:00.000000',1,2,NULL),(2,2,'2025-03-25 11:05:00.000000',1,1,NULL),(3,3,'2025-03-25 11:10:00.000000',1,3,NULL),(4,4,'2025-03-25 11:15:00.000000',3,4,NULL),(5,5,'2025-03-25 11:20:00.000000',2,5,NULL),(6,6,'2024-03-26 11:00:00.000000',1,3,NULL),(7,7,'2023-03-26 09:00:00.000000',1,4,NULL),(8,8,'2025-03-24 09:00:00.000000',1,5,NULL),(9,9,'2025-03-23 09:00:00.000000',1,2,NULL),(11,11,'2025-03-20 09:00:00.000000',1,4,NULL),(12,12,'2025-03-19 09:00:00.000000',1,5,NULL),(13,13,'2025-03-18 09:00:00.000000',1,2,NULL),(47,16,'2025-04-01 10:26:00.074872',3,6,NULL);
/*!40000 ALTER TABLE `article_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `article_id` bigint NOT NULL AUTO_INCREMENT,
  `serial_num` bigint DEFAULT NULL,
  `count_likes` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `current_price` float DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `expiration_date` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `view_cnt` int DEFAULT NULL,
  `gifticon_id` bigint NOT NULL,
  `state` enum('DELETED','EXPIRED','IN_PROGRESS','ON_SALE','SOLD') NOT NULL,
  `is_sold` tinyint(1) DEFAULT '0',
  `locked_at` datetime(6) DEFAULT NULL,
  `tx_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `FK2xdd6dthaywkdwsnal2rc3bmr` (`gifticon_id`),
  CONSTRAINT `FK2xdd6dthaywkdwsnal2rc3bmr` FOREIGN KEY (`gifticon_id`) REFERENCES `gifticons` (`gifticon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,NULL,5,'2025-03-25 10:00:00.000000',3.9,'12','2025-12-31 23:59:59.000000','https://sitem.ssgcdn.com/86/57/48/item/1000534485786_i1_750.jpg','15',1,120,1,'ON_SALE',0,NULL,NULL),(2,NULL,9,'2025-03-25 10:10:00.000000',4.5,'달달하고 맛있어요!','2025-11-30 23:59:59.000000','https://sitem.ssgcdn.com/93/69/80/item/1000556806993_i1_750.jpg','14',1,95,2,'ON_SALE',0,NULL,NULL),(3,NULL,10,'2025-03-25 10:20:00.000000',6,'점심용으로 적당합니다.','2025-10-15 23:59:59.000000','https://sitem.ssgcdn.com/86/57/48/item/1000534485786_i1_750.jpg','13',3,80,3,'ON_SALE',0,NULL,NULL),(4,NULL,3,'2025-03-25 10:30:00.000000',3.2,'편하게 쓰세요~','2025-09-30 23:59:59.000000','https://sitem.ssgcdn.com/69/86/21/item/0000008218669_i1_750.jpg','12',4,60,4,'ON_SALE',0,NULL,NULL),(5,NULL,16,'2025-03-25 10:40:00.000000',8.8,'11','2026-01-01 23:59:59.000000','https://sitem.ssgcdn.com/58/67/47/item/1000337476758_i1_750.jpg','11',5,200,5,'ON_SALE',0,NULL,NULL),(7,NULL,17,'2025-03-25 10:40:00.000000',8.8,'9','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','9',1,200,5,'ON_SALE',0,NULL,NULL),(8,NULL,15,'2025-03-25 10:40:00.000000',8.8,'8','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','8',1,200,5,'ON_SALE',0,NULL,NULL),(9,NULL,15,'2025-03-25 10:40:00.000000',8.8,'7','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','7',1,200,5,'ON_SALE',0,NULL,NULL),(10,NULL,15,'2025-03-25 10:40:00.000000',8.8,'6','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','중고거래선물테스트',2,200,5,'ON_SALE',0,NULL,NULL),(11,NULL,15,'2025-03-25 10:40:00.000000',8.8,'5','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','5',1,200,5,'ON_SALE',0,NULL,NULL),(12,NULL,15,'2025-03-25 10:40:00.000000',8.8,'4','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','4',1,200,5,'ON_SALE',0,NULL,NULL),(13,NULL,15,'2025-03-25 10:40:00.000000',8.8,'3','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','3',1,200,5,'ON_SALE',0,NULL,NULL),(14,NULL,15,'2025-03-25 10:40:00.000000',8.8,'2','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','2',1,200,5,'ON_SALE',0,NULL,NULL),(15,NULL,15,'2025-03-25 10:40:00.000000',8.8,'1','2026-01-01 23:59:59.000000','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg','1',2,200,5,'ON_SALE',0,NULL,NULL),(16,NULL,1,'2025-03-27 10:40:00.000000',1.53,'테스트','2026-01-01 23:59:59.000000','https://sitem.ssgcdn.com/11/78/03/item/1000291037811_i1_750.jpg','테스트',1,0,1,'SOLD',1,NULL,NULL);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` bigint NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'삼성전자'),(2,'LG생활건강'),(3,'이디야커피'),(4,'스타벅스'),(5,'던킨도너츠');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'음료'),(2,'디저트'),(3,'패스트푸드'),(4,'편의점'),(5,'기타');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_histories`
--

DROP TABLE IF EXISTS `gift_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_histories` (
  `gift_history_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `mongo_id` varchar(255) DEFAULT NULL,
  `from_user_id` bigint NOT NULL,
  `gifticon_id` bigint NOT NULL,
  `to_user_id` bigint DEFAULT NULL,
  `is_received` bit(1) NOT NULL,
  `to_user_kakao_id` bigint NOT NULL,
  PRIMARY KEY (`gift_history_id`),
  KEY `FKlh5kxskopvv7dge9c044rxo8v` (`from_user_id`),
  KEY `FKietp1fohujau45fflwy592h9r` (`gifticon_id`),
  KEY `FK6je51fcds5kihwj7pr6fca8pc` (`to_user_id`),
  CONSTRAINT `FK6je51fcds5kihwj7pr6fca8pc` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKietp1fohujau45fflwy592h9r` FOREIGN KEY (`gifticon_id`) REFERENCES `gifticons` (`gifticon_id`),
  CONSTRAINT `FKlh5kxskopvv7dge9c044rxo8v` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_histories`
--

LOCK TABLES `gift_histories` WRITE;
/*!40000 ALTER TABLE `gift_histories` DISABLE KEYS */;
INSERT INTO `gift_histories` VALUES (1,'2025-03-31 16:24:09.997518','67ea4319ea86c07d00d4471c',1,1,NULL,_binary '\0',3977733962),(2,'2025-04-01 10:26:00.088507','67eb40a7b1e41f305b469243',6,1,NULL,_binary '\0',3977722266);
/*!40000 ALTER TABLE `gift_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gifticons`
--

DROP TABLE IF EXISTS `gifticons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gifticons` (
  `gifticon_id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `gifticon_title` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `brand_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `metadata_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gifticon_id`),
  KEY `FKekt2ruxa781gr2587jtm5u1pc` (`brand_id`),
  KEY `FKk76h3h0newp9o9nf3qpj7yc1f` (`category_id`),
  CONSTRAINT `FKekt2ruxa781gr2587jtm5u1pc` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `FKk76h3h0newp9o9nf3qpj7yc1f` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gifticons`
--

LOCK TABLES `gifticons` WRITE;
/*!40000 ALTER TABLE `gifticons` DISABLE KEYS */;
INSERT INTO `gifticons` VALUES (1,'따뜻한 커피 한 잔','아메리카노','https://static.megamart.com/product/image/1326/13264314/13264314_1_960.jpg',4.5,4,1,NULL),(2,'달콤한 디저트','초코케이크','https://sitem.ssgcdn.com/93/31/82/item/1000640823193_i1_336.jpg',5,3,2,NULL),(3,'한 끼 식사로 충분','버거세트','https://example.com/gift3.png',7.5,5,3,NULL),(4,'편의점 도시락','도시락','https://example.com/gift4.png',4,1,4,NULL),(5,'모든 곳에서 사용 가능','기프트카드','https://example.com/gift5.png',10,2,5,NULL);
/*!40000 ALTER TABLE `gifticons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_id` bigint NOT NULL AUTO_INCREMENT,
  `articles_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `UKfo77u7peb1jckjll9yt9vw1tb` (`user_id`,`articles_id`),
  KEY `FK9l18kiqkb3fip1d6ejyq2nr2i` (`articles_id`),
  CONSTRAINT `FK9l18kiqkb3fip1d6ejyq2nr2i` FOREIGN KEY (`articles_id`) REFERENCES `articles` (`article_id`),
  CONSTRAINT `FKnvx9seeqqyy71bij291pwiwrg` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (22,2,1),(6,5,1),(21,7,1),(20,16,1),(1,1,2),(2,2,3),(3,3,4),(4,4,5),(19,5,6),(18,7,6);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_status`
--

DROP TABLE IF EXISTS `sync_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_status` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_synced_block` bigint DEFAULT NULL,
  `sync_type` enum('REAL_TIME') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_status`
--

LOCK TABLES `sync_status` WRITE;
/*!40000 ALTER TABLE `sync_status` DISABLE KEYS */;
INSERT INTO `sync_status` VALUES (1,6700111,'REAL_TIME','2025-04-02 11:13:11.035412');
/*!40000 ALTER TABLE `sync_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `used_histories`
--

DROP TABLE IF EXISTS `used_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `used_histories` (
  `used_history_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `gifticon_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `serial_num` bigint DEFAULT NULL,
  `tx_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`used_history_id`),
  KEY `FKsybhuou0wqgn3h13at52flflj` (`gifticon_id`),
  KEY `FK5pqjmqw4oio75gd4af8eyaiur` (`user_id`),
  CONSTRAINT `FK5pqjmqw4oio75gd4af8eyaiur` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsybhuou0wqgn3h13at52flflj` FOREIGN KEY (`gifticon_id`) REFERENCES `gifticons` (`gifticon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `used_histories`
--

LOCK TABLES `used_histories` WRITE;
/*!40000 ALTER TABLE `used_histories` DISABLE KEYS */;
INSERT INTO `used_histories` VALUES (1,'2025-03-25 13:00:00.000000',1,1,NULL,NULL),(2,'2025-03-25 13:10:00.000000',2,2,NULL,NULL),(3,'2025-03-25 13:20:00.000000',3,3,NULL,NULL),(4,'2025-03-25 13:30:00.000000',4,4,NULL,NULL),(5,'2025-03-25 13:40:00.000000',5,5,NULL,NULL);
/*!40000 ALTER TABLE `used_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `age` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `kakao_id` bigint DEFAULT NULL,
  `nick_name` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '0',
  `wallet_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKk4ycaj27putgcujmehwbsrmmc` (`kakao_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'20~29','female',3976389070,'영민','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',0,'0xa7B9A191107081f780E534502C1B2288cFB7cC03'),(2,'29','female',100002,'김영희','https://example.com/image2.png',0,'0xdef456'),(3,'32','male',100003,'이철수','https://example.com/image3.png',0,'0xghi789'),(4,'21','female',100004,'박지민','https://example.com/image4.png',0,'0xjkl012'),(5,'27','female',100005,'최유리','https://example.com/image5.png',0,'0xmnx345'),(6,'20~29','female',4006498484,'조원주','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',0,'0xa7B9A191107081f780E534502C1B2288cFB7cC03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-02 11:26:44
