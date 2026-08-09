-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: thedeuce
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `event_id` varchar(10) NOT NULL,
  `event_name` varchar(100) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_time` varchar(255) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'upcoming',
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('E0001','Mixed Doubles/Doubles','2026-07-01','16:00 - 18:00','Legian Beach Hotel','SCHEDULED'),('E0002','Mixed Doubles/Doubles','2026-07-01','16:00 - 18:00','Bali Creative Industry Centre','SCHEDULED'),('E0003','Singles','2026-07-01','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0004','Mixed Doubles/Doubles','2026-07-01','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0005','Mixed Doubles/Doubles','2026-07-01','16:00 - 18:00','Bali Creative Industry Centre','SCHEDULED'),('E0006','Singles','2026-07-02','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0007','Mixed Doubles/Doubles','2026-07-03','16:00 - 18:00','Bali Creative Industry Centre','SCHEDULED'),('E0008','Mixed Doubles/Doubles','2026-07-05','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0009','Singles','2026-07-09','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0010','Mixed Doubles/Doubles','2026-07-10','16:00 - 18:00','Bali Creative Industry Centre','SCHEDULED'),('E0011','Ladies Only Doubles','2026-07-11','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0012','Mixed Doubles/Doubles','2026-07-12','16:00 - 18:00','Oos Tennis','SCHEDULED'),('E0013','Singles','2026-07-14','16:00 - 18:00','Liga Tennis Sanur','SCHEDULED'),('E0014',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0015',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0016',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0017',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0018',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0019',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0020',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0021',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0022',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0023',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0024',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0025',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0026',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0027',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0028',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0029',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED'),('E0030',NULL,NULL,'16:00 - 18:00',NULL,'SCHEDULED');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `member_id` varchar(10) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `join_date` date DEFAULT NULL,
  `skill_level` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `lifetime_points` int(11) DEFAULT 0,
  `status_tier` varchar(30) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES ('M0001',1,'HUNG','2026-06-01','BEGINNER+','anandazhou09@gmail.com',232,'DIAMOND','+6285190094868'),('M0002',2,'VANESS','2026-06-01','BEGINNER','vanessafebry97@gmail.com',78,'DIAMOND','+6282220502003'),('M0003',3,'ADHYASTA','2026-06-01','BEGINNER','Idabagusadhya@gmail.com',79,'DIAMOND',NULL),('M0004',4,'NADIA','2026-06-01','BEGINNER','indahnadiaswarii@gmail.com',39,'DIAMOND',NULL),('M0005',5,'ABISEKA J','2026-06-01','BEGINNER','abiseka33@gmail.com',58,'DIAMOND',NULL),('M0006',6,'ECAK','2026-06-01','BEGINNER','sangayuecak@gmail.com',60,'DIAMOND',NULL),('M0007',7,'ALDI','2026-06-01','BEGINNER+',NULL,36,'DIAMOND',NULL),('M0008',8,'IVAN T','2026-06-01','BEGINNER+',NULL,0,'DIAMOND',NULL),('M0009',9,'REVATA','2026-06-01','BEGINNER+','revatasiriananda@gmail.com',85,'DIAMOND',NULL),('M0010',10,'AYUDITA','2026-06-01','BEGINNER+','kmgayudita35@gmail.com',16,'DIAMOND',NULL),('M0011',11,'NANDIYA','2026-06-01','L. BEGINNER','nandiyakarunadh@gmail.com',23,'DIAMOND',NULL),('M0012',12,'HENRY','2026-06-01','L. BEGINNER',NULL,11,'DIAMOND',NULL),('M0013',13,'RIAN Y','2026-06-24','BEGINNER+','yuliawanrian@gmail.com',92,'DIAMOND',NULL),('M0014',14,'OKA','2026-06-24','L. INTERMEDIATE','okamobi123@gmail.com',28,'DIAMOND',NULL),('M0015',15,'IWAN','2026-06-24','BEGINNER','aliridwankk@gmail.com',22,'DIAMOND',NULL),('M0016',16,'BAGUS G','2026-06-24','L. BEGINNER','gusgarlicka@gmail.com',49,'DIAMOND',NULL),('M0017',17,'YUDHA','2026-06-24','L. BEGINNER','Yudha.arthawijaya@gmail.com',27,'DIAMOND',NULL),('M0018',18,'BHASKARA','2026-06-25','BEGINNER+','bagusbhaskara14@gmail.com',28,'DIAMOND',NULL),('M0019',19,'GUS YANA','2026-06-25','BEGINNER+','wiradnyana99@gmail.com',50,'DIAMOND',NULL),('M0020',20,'SEKAR W','2026-06-25','BEGINNER','sekar.letlora@yahoo.com',36,'DIAMOND',NULL),('M0021',21,'MENTARI','2026-06-25','BEGINNER','lidyamentari31@gmail.com',100,'DIAMOND',NULL),('M0022',22,'WIRA','2026-06-28','BEGINNER+','kadekadhiwirayudha@gmail.com',30,'DIAMOND',NULL),('M0023',23,'TRISNA','2026-06-28','BEGINNER','itrisnajaya@outlook.com',14,'DIAMOND',NULL),('M0024',24,'RIRI','2026-06-28','BEGINNER','triyana.recovery@gmail.com',22,'DIAMOND',NULL),('M0025',25,'OKY','2026-06-28','L. BEGINNER','okypetter@gmail.com',32,'DIAMOND',NULL),('M0026',26,'AFIN','2026-06-30','BEGINNER+','rama.tannaya@gmail.com',34,'DIAMOND',NULL),('M0027',27,'DIANA','2026-06-30','BEGINNER+',NULL,16,'DIAMOND',NULL),('M0028',28,'RAKA S','2026-06-30','BEGINNER','rakaprasetya.lie@gmail.com',26,'DIAMOND',NULL),('M0029',29,'QUIK','2026-07-02','BEGINNER+','dedwisaptarahadi@gmail.com',35,'DIAMOND',NULL),('M0030',30,'STEPHEN','2026-07-02','BEGINNER','stephensutanto123@gmail.com',28,'DIAMOND',NULL),('M0031',31,'OLIVIA','2026-07-02','BEGINNER','oliviadean170@gmail.com',16,'DIAMOND',NULL),('M0032',32,'PIBBLEBULAT','2026-07-03','BEGINNER','putudiahdamayanti1406@gmail.com',114,'DIAMOND',NULL),('M0033',33,'WILSON','2026-07-03','BEGINNER+','agusnathayana@gmail.com',92,'DIAMOND',NULL),('M0034',34,'RISTYA','2026-07-03','BEGINNER','ristyanara@gmail.com',18,'DIAMOND',NULL),('M0035',35,'AHRI','2026-07-05','BEGINNER+','ahriansyahm@gmail.com',28,'DIAMOND',NULL),('M0036',36,'NAYA','2026-07-05','BEGINNER','nayaka2870@gmail.com',26,'DIAMOND',NULL),('M0037',37,'WULAN','2026-07-05','BEGINNER','wulantrisnap@gmail.com',38,'DIAMOND',NULL),('M0038',38,'TEGUH','2026-07-05','BEGINNER','ftk2704@gmail.com',11,'DIAMOND',NULL),('M0039',39,'UCIK','2026-07-09','BEGINNER+','kanjengyuichiro@gmail.com',35,'DIAMOND',NULL),('M0040',40,'DAIVA','2026-07-10','BEGINNER+','daivagunawan14@gmail.com',35,'DIAMOND',NULL),('M0041',41,'OKA (W)','2026-07-10','BEGINNER','okabhismaning@gmail.com',11,'DIAMOND',NULL),('M0042',42,'AFI','2026-07-11','BEGINNER','afi.intan@yahoo.com',35,'DIAMOND',NULL),('M0043',43,'DEVI','2026-07-11','BEGINNER','paramitaokadevi@gmail.com',22,'DIAMOND',NULL),('M0044',44,'SINTHA','2026-07-11','BEGINNER','sinthaagn63@gmail.com',12,'DIAMOND',NULL),('M0045',45,'BARA','2026-07-15','BEGINNER+',NULL,35,'DIAMOND',NULL),('M0046',46,'RIZAL','2026-07-15','BEGINNER',NULL,22,'DIAMOND',NULL);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_07_07_055641_add_google_id_to_users_table',1),(5,'2026_07_07_162633_add_avatar_to_users_table',2),(6,'2026_07_07_174725_add_time_to_events_table',3),(7,'2026_07_07_180157_add_status_to_events_table',4);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `point_config`
--

DROP TABLE IF EXISTS `point_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `point_config` (
  `finish` int(11) NOT NULL,
  `bonus` int(11) DEFAULT NULL,
  PRIMARY KEY (`finish`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_config`
--

LOCK TABLES `point_config` WRITE;
/*!40000 ALTER TABLE `point_config` DISABLE KEYS */;
INSERT INTO `point_config` VALUES (1,25),(2,18),(3,12),(4,8),(5,6),(6,4),(7,2),(8,1);
/*!40000 ALTER TABLE `point_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `results` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` varchar(10) NOT NULL,
  `result_date` date DEFAULT NULL,
  `member_id` varchar(10) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `finish` int(11) DEFAULT NULL,
  `placement_bonus` int(11) DEFAULT NULL,
  `attendance` int(11) DEFAULT NULL,
  `event_points` int(11) DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  KEY `event_id` (`event_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  CONSTRAINT `results_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,'E0001','2026-07-01','M0001','HUNG',2,18,10,28),(2,'E0001','2026-07-01','M0002','VANESS',6,4,10,14),(3,'E0001','2026-07-01','M0005','ABISEKA J',4,8,10,18),(4,'E0001','2026-07-01','M0007','ALDI',3,12,10,22),(5,'E0001','2026-07-01','M0009','REVATA',1,25,10,35),(6,'E0001','2026-07-01','M0010','AYUDITA',5,6,10,16),(7,'E0001','2026-07-01','M0011','NANDIYA',7,2,10,12),(8,'E0001','2026-07-01','M0012','HENRY',8,1,10,11),(9,'E0002','2026-07-01','M0001','HUNG',6,4,10,14),(10,'E0002','2026-07-01','M0005','ABISEKA J',4,8,10,18),(11,'E0002','2026-07-01','M0006','ECAK',5,6,10,16),(12,'E0002','2026-07-01','M0013','RIAN Y',1,25,10,35),(13,'E0002','2026-07-01','M0014','OKA',2,18,10,28),(14,'E0002','2026-07-01','M0015','IWAN',3,12,10,22),(15,'E0002','2026-07-01','M0016','BAGUS G',7,2,10,12),(16,'E0002','2026-07-01','M0017','YUDHA',8,1,10,11),(17,'E0003','2026-07-01','M0001','HUNG',1,25,10,35),(18,'E0003','2026-07-01','M0018','BHASKARA',2,18,10,28),(19,'E0003','2026-07-01','M0019','GUS YANA',3,12,10,22),(20,'E0003','2026-07-01','M0020','SEKAR W',4,8,10,18),(21,'E0003','2026-07-01','M0003','ADHYASTA',5,6,10,16),(22,'E0003','2026-07-01','M0021','MENTARI',6,4,10,14),(23,'E0004','2026-07-01','M0001','HUNG',1,25,10,35),(24,'E0004','2026-07-01','M0003','ADHYASTA',2,18,10,28),(25,'E0004','2026-07-01','M0004','NADIA',8,1,10,11),(26,'E0004','2026-07-01','M0002','VANESS',7,2,10,12),(27,'E0004','2026-07-01','M0025','OKY',5,6,10,16),(28,'E0004','2026-07-01','M0024','RIRI',3,12,10,22),(29,'E0004','2026-07-01','M0023','TRISNA',6,4,10,14),(30,'E0004','2026-07-01','M0022','WIRA',4,8,10,18),(31,'E0005','2026-07-01','M0001','HUNG',2,18,10,28),(32,'E0005','2026-07-01','M0009','REVATA',3,12,10,22),(33,'E0005','2026-07-01','M0013','RIAN Y',1,25,10,35),(34,'E0005','2026-07-01','M0026','AFIN',4,8,10,18),(35,'E0005','2026-07-01','M0027','DIANA',5,6,10,16),(36,'E0005','2026-07-01','M0028','RAKA S',6,4,10,14),(37,'E0005','2026-07-01','M0002','VANESS',8,1,10,11),(38,'E0005','2026-07-01','M0016','BAGUS G',7,2,10,12),(39,'E0006','2026-07-02','M0006','ECAK',6,4,10,14),(40,'E0006','2026-07-02','M0031','OLIVIA',5,6,10,16),(41,'E0006','2026-07-02','M0030','STEPHEN',2,18,10,28),(42,'E0006','2026-07-02','M0029','QUIK',1,25,10,35),(43,'E0006','2026-07-02','M0020','SEKAR W',4,8,10,18),(44,'E0006','2026-07-02','M0021','MENTARI',3,12,10,22),(45,'E0007','2026-07-03','M0003','ADHYASTA',1,25,10,35),(46,'E0007','2026-07-03','M0004','NADIA',6,4,10,14),(47,'E0007','2026-07-03','M0033','WILSON',3,12,10,22),(48,'E0007','2026-07-03','M0032','PIBBLEBULAT',2,18,10,28),(49,'E0007','2026-07-03','M0022','WIRA',7,2,10,12),(50,'E0007','2026-07-03','M0016','BAGUS G',8,1,10,11),(51,'E0007','2026-07-03','M0025','OKY',5,6,10,16),(52,'E0007','2026-07-03','M0034','RISTYA',4,8,10,18),(53,'E0008','2026-07-05','M0001','HUNG',4,8,10,18),(54,'E0008','2026-07-05','M0002','VANESS',5,6,10,16),(55,'E0008','2026-07-05','M0038','TEGUH',8,1,10,11),(56,'E0008','2026-07-05','M0037','WULAN',3,12,10,22),(57,'E0008','2026-07-05','M0036','NAYA',7,2,10,12),(58,'E0008','2026-07-05','M0035','AHRI',2,18,10,28),(59,'E0008','2026-07-05','M0033','WILSON',1,25,10,35),(60,'E0008','2026-07-05','M0032','PIBBLEBULAT',6,4,10,14),(61,'E0009','2026-07-09','M0039','UCIK',1,25,10,35),(62,'E0009','2026-07-09','M0032','PIBBLEBULAT',3,12,10,22),(63,'E0009','2026-07-09','M0017','YUDHA',5,6,10,16),(64,'E0009','2026-07-09','M0016','BAGUS G',6,4,10,14),(65,'E0009','2026-07-09','M0019','GUS YANA',2,18,10,28),(66,'E0009','2026-07-09','M0021','MENTARI',4,8,10,18),(67,'E0010','2026-07-10','M0001','HUNG',4,8,10,18),(68,'E0010','2026-07-10','M0007','ALDI',6,4,10,14),(69,'E0010','2026-07-10','M0009','REVATA',2,18,10,28),(70,'E0010','2026-07-10','M0013','RIAN Y',3,12,10,22),(71,'E0010','2026-07-10','M0026','AFIN',5,6,10,16),(72,'E0010','2026-07-10','M0041','OKA (W)',8,1,10,11),(73,'E0010','2026-07-10','M0040','DAIVA',1,25,10,35),(74,'E0010','2026-07-10','M0028','RAKA S',7,2,10,12),(75,'E0011','2026-07-11','M0004','NADIA',6,4,10,14),(76,'E0011','2026-07-11','M0006','ECAK',4,8,10,18),(77,'E0011','2026-07-11','M0021','MENTARI',2,18,10,28),(78,'E0011','2026-07-11','M0032','PIBBLEBULAT',5,6,10,16),(79,'E0011','2026-07-11','M0011','NANDIYA',8,1,10,11),(80,'E0011','2026-07-11','M0042','AFI',1,25,10,35),(81,'E0011','2026-07-11','M0043','DEVI',3,12,10,22),(82,'E0011','2026-07-11','M0044','SINTHA',7,2,10,12),(83,'E0012','2026-07-12','M0001','HUNG',2,18,10,28),(84,'E0012','2026-07-12','M0002','VANESS',8,1,10,11),(85,'E0012','2026-07-12','M0005','ABISEKA J',3,12,10,22),(86,'E0012','2026-07-12','M0006','ECAK',7,2,10,12),(87,'E0012','2026-07-12','M0036','NAYA',6,4,10,14),(88,'E0012','2026-07-12','M0037','WULAN',5,6,10,16),(89,'E0012','2026-07-12','M0032','PIBBLEBULAT',4,8,10,18),(90,'E0012','2026-07-12','M0033','WILSON',1,25,10,35),(91,'E0013','2026-07-14','M0001','HUNG',2,18,10,28),(92,'E0013','2026-07-14','M0002','VANESS',6,4,10,14),(93,'E0013','2026-07-14','M0032','PIBBLEBULAT',5,6,10,16),(94,'E0013','2026-07-14','M0021','MENTARI',4,8,10,18),(95,'E0013','2026-07-14','M0045','BARA',1,25,10,35),(96,'E0013','2026-07-14','M0046','RIZAL',3,12,10,22);
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('2jfPYW7Ge936wDjMwAzTFsbaefOtA1c3Ol90uHoR',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJLRXRmcFdiVEhIWGVFSjFmQUpiV1I3MlRQWGNqcVBxUTRCV3pQbzd2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784045048),('8FOIbUrynEmK92fauGqGpC9L1IfxZhk492sTrSOd',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJQUnpsVGpUS3ZsWWJ5TFhUMVhsdTJkWmJYemxHOGc3Q0xhblRzRnV2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784045048),('jcZL9dY1q2O68I7xYKvipj4X5ZkIq3FKnjSXwuwm',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15','eyJfdG9rZW4iOiJKMVRpazdLUVJ4QzVvenFSdm9BRW9iSTh5NW5vRlEwRlpIME1VTTVSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784045859),('N87hTpGxlQj3p6XCliPRKgapFsriDlnbMboi6UVl',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJVN3pDNXI2R3FrbnlaZWtxcTVxRjdPanJYSms2VHJNRHlXdjk0WHhKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784045048),('UkjuP8AhqJkmbCEmbgvCT37MMIDvZnY270u4h2Qo',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiJqc3NTclM1SGtzODkyeHo0SGF3d296U1NnWWRjSzFGTGRvUElrejFuIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784048136);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'HUNG','anandazhou09@gmail.com',NULL,NULL,NULL,'$2y$12$rWFsPq7elQNXGyho.cZJBefch6zKU2iir5CQ4N8Rh4jtBnSl8xo4G',NULL,'2026-07-14 08:55:22','2026-07-14 08:55:22'),(2,'VANESS','vanessafebry97@gmail.com',NULL,NULL,NULL,'$2y$12$Qe427XWphLjyJX84rB20ruCa8eRFm7hQzJgX05RaW6.3YR./HGfBu',NULL,'2026-07-14 08:55:22','2026-07-14 08:55:22'),(3,'ADHYASTA','Idabagusadhya@gmail.com',NULL,NULL,NULL,'$2y$12$TkLT2Whwg7FtNtcpT848ye.ykJGEM.KizaDCubaWl8TQZJO4H1g/y',NULL,'2026-07-14 08:55:22','2026-07-14 08:55:22'),(4,'NADIA','indahnadiaswarii@gmail.com',NULL,NULL,NULL,'$2y$12$w9m6qWbvjQeMalVnXUlXlu0ZzmF/8fflyUYJ21SGBCmhjsSOfY6ze',NULL,'2026-07-14 08:55:23','2026-07-14 08:55:23'),(5,'ABISEKA J','abiseka33@gmail.com',NULL,NULL,NULL,'$2y$12$34YcZ/ZU6VN.NPGpsMPwq.hPDkerVssRCEq2JxB7coKusMHwk.R5S',NULL,'2026-07-14 08:55:23','2026-07-14 08:55:23'),(6,'ECAK','sangayuecak@gmail.com',NULL,NULL,NULL,'$2y$12$OanMfJ7KaQHchcFrQZOnX.Ikin725tJN1i.h55UF6jeptEudDNzQG',NULL,'2026-07-14 08:55:23','2026-07-14 08:55:23'),(7,'ALDI','aldi@example.com',NULL,NULL,NULL,'$2y$12$Q/f2fgK2lyWUTxG6Su5k8e6ch/TLJnp2obf4bhLXysuSh8y.LU1GK',NULL,'2026-07-14 08:55:24','2026-07-14 08:55:24'),(8,'IVAN T','ivant@example.com',NULL,NULL,NULL,'$2y$12$y5VBlAvqb3E39fh014SxsuR8.7c6QmqLYLzmgAD4eqkxvUWQVKoU.',NULL,'2026-07-14 08:55:24','2026-07-14 08:55:24'),(9,'REVATA','revatasiriananda@gmail.com',NULL,NULL,NULL,'$2y$12$rESt.MOhMPEox5VZz6BGh.hUeo8kbM0eOnfz.2ubvgswX4RKmMKea',NULL,'2026-07-14 08:55:24','2026-07-14 08:55:24'),(10,'AYUDITA','kmgayudita35@gmail.com',NULL,NULL,NULL,'$2y$12$22sWTnY93D0Z9DwffTM6Ie5k9BR9sEuTU/iKGv06ffZwnoHFXfFBq',NULL,'2026-07-14 08:55:24','2026-07-14 08:55:24'),(11,'NANDIYA','nandiyakarunadh@gmail.com',NULL,NULL,NULL,'$2y$12$k5p2LKPNIpzk8WiAg4xs1OZJ1ttEGEZg7iKjlJjRnuHeaBKTML99m',NULL,'2026-07-14 08:55:25','2026-07-14 08:55:25'),(12,'HENRY','henry@example.com',NULL,NULL,NULL,'$2y$12$8FiynI/LvRVyqCO2aHuLrurC/sWxVRSGhoDBnw0a3KZ9SvZY4VMg6',NULL,'2026-07-14 08:55:25','2026-07-14 08:55:25'),(13,'RIAN Y','yuliawanrian@gmail.com',NULL,NULL,NULL,'$2y$12$163KkeMbNQU/vbNKNJg1m.V53fpDb9zRr.VDqBE7thewrDD.bcBz2',NULL,'2026-07-14 08:55:25','2026-07-14 08:55:25'),(14,'OKA','okamobi123@gmail.com',NULL,NULL,NULL,'$2y$12$PD2mPRRRtYw5IhC6KgyQUOWpOpEtm1qEzjEOGwzewLIUeZjXDoBnK',NULL,'2026-07-14 08:55:25','2026-07-14 08:55:25'),(15,'IWAN','aliridwankk@gmail.com',NULL,NULL,NULL,'$2y$12$4y/Y0vXquH21dsGG4nSZ0OFFS6bMcrI7iLbbRAFheNd/S2J2qtgGm',NULL,'2026-07-14 08:55:26','2026-07-14 08:55:26'),(16,'BAGUS G','gusgarlicka@gmail.com',NULL,NULL,NULL,'$2y$12$MA0ODm/RqwFyt0H27my59eYi.mdErwygO/keg81rJsIXuwikNIgI2',NULL,'2026-07-14 08:55:26','2026-07-14 08:55:26'),(17,'YUDHA','Yudha.arthawijaya@gmail.com',NULL,NULL,NULL,'$2y$12$K.fnS39Z6Uvd4RNzkgraiuXRPHG0GwuNvxb4OQ3XVoPD8gtsemV6m',NULL,'2026-07-14 08:55:26','2026-07-14 08:55:26'),(18,'BHASKARA','bagusbhaskara14@gmail.com',NULL,NULL,NULL,'$2y$12$v0O6IOYpHCrUSXMlCZ6fuOnaH2m6W74DKczlqjSvaNfCwYT4rh7nS',NULL,'2026-07-14 08:55:26','2026-07-14 08:55:26'),(19,'GUS YANA','wiradnyana99@gmail.com',NULL,NULL,NULL,'$2y$12$LuepGnaLRXTWge7ux5P9jug1DnmbV6l0QrLHHQNrE/rj6kclGGBN2',NULL,'2026-07-14 08:55:27','2026-07-14 08:55:27'),(20,'SEKAR W','sekar.letlora@yahoo.com',NULL,NULL,NULL,'$2y$12$3F1zrIPjBunzKUB7sAm1aufiPR9QUfF4xE8/p0a.1MSUG7tjqIpey',NULL,'2026-07-14 08:55:27','2026-07-14 08:55:27'),(21,'MENTARI','lidyamentari31@gmail.com',NULL,NULL,NULL,'$2y$12$Gv.dSMgWMSVLS6suujUGN.1hGayqJfO7OVb8MWhDCQ5vgyiZ0Cmem',NULL,'2026-07-14 08:55:27','2026-07-14 08:55:27'),(22,'WIRA','kadekadhiwirayudha@gmail.com',NULL,NULL,NULL,'$2y$12$8YkkajJ0s.mhZOifliG6Vul3NYWSrHYbOgMOW0DAA1fUIrGQ4jz7C',NULL,'2026-07-14 08:55:28','2026-07-14 08:55:28'),(23,'TRISNA','itrisnajaya@outlook.com',NULL,NULL,NULL,'$2y$12$qfmSo.4f7FAWysUho650tutdaKrFMsEbpb0kRnMzwT5Q14VOn7mYG',NULL,'2026-07-14 08:55:28','2026-07-14 08:55:28'),(24,'RIRI','triyana.recovery@gmail.com',NULL,NULL,NULL,'$2y$12$BntJHGXI/w262HVtDOjOWeZBI4A3IEDXTXgKx/9GRIMP4EvLlM2nm',NULL,'2026-07-14 08:55:28','2026-07-14 08:55:28'),(25,'OKY','okypetter@gmail.com',NULL,NULL,NULL,'$2y$12$yJdfoy3pP/i1jMsnQ4sIlOhEG7bHQB4eav9x0YUvpFF3JGugff55K',NULL,'2026-07-14 08:55:29','2026-07-14 08:55:29'),(26,'AFIN','rama.tannaya@gmail.com',NULL,NULL,NULL,'$2y$12$tMUt9bM7iLB.8DdMUQZ.FuGMzS6gxuTX8P/3kergYMKXvwS/I6eyG',NULL,'2026-07-14 08:55:29','2026-07-14 08:55:29'),(27,'DIANA','diana@example.com',NULL,NULL,NULL,'$2y$12$l5aFfikcJo2I/62vn98BsO02Aj4eyY1DQrTw7/X1AFMwc6P65bStu',NULL,'2026-07-14 08:55:29','2026-07-14 08:55:29'),(28,'RAKA S','rakaprasetya.lie@gmail.com',NULL,NULL,NULL,'$2y$12$HqqYbJhddCyzIEjO70gmBuPrKovuZMm2xXdaL.8ZaStn301HgdzOO',NULL,'2026-07-14 08:55:29','2026-07-14 08:55:29'),(29,'QUIK','dedwisaptarahadi@gmail.com',NULL,NULL,NULL,'$2y$12$v7y60kgcetSEb6H2o6imruFOTc6WpIbdsYv9IbFcfCcUOAmuhb4by',NULL,'2026-07-14 08:55:30','2026-07-14 08:55:30'),(30,'STEPHEN','stephensutanto123@gmail.com',NULL,NULL,NULL,'$2y$12$rPvY20usbzNQArircOmUWut3fCYb7vLG/LZycwFVnriIoq.v2qEtu',NULL,'2026-07-14 08:55:30','2026-07-14 08:55:30'),(31,'OLIVIA','oliviadean170@gmail.com',NULL,NULL,NULL,'$2y$12$yihNJw61y1tAAclY8qhKKetUBabQaf4dVEe68djsxY2o79dFCKt5C',NULL,'2026-07-14 08:55:30','2026-07-14 08:55:30'),(32,'PIBBLEBULAT','putudiahdamayanti1406@gmail.com',NULL,NULL,NULL,'$2y$12$8wB0uoWxROqHY5P/JTBuLuLd3za9gflkxq.R.cAuGeSjM3e2xF6ra',NULL,'2026-07-14 08:55:31','2026-07-14 08:55:31'),(33,'WILSON','agusnathayana@gmail.com',NULL,NULL,NULL,'$2y$12$Ao5AqZ53QBDjLUmXLAYfeeXb.aG9C87bX773R1Ww8KDoz9wGzdDvG',NULL,'2026-07-14 08:55:31','2026-07-14 08:55:31'),(34,'RISTYA','ristyanara@gmail.com',NULL,NULL,NULL,'$2y$12$fiTaO2uur.VYD/EsQ/K/0eX2Uru4Duw2Yub0jRDYKklZ79JCKeu66',NULL,'2026-07-14 08:55:31','2026-07-14 08:55:31'),(35,'AHRI','ahriansyahm@gmail.com',NULL,NULL,NULL,'$2y$12$b0qjccnKXEQyeZ8EvIFOhuyKrDOSMWFBnIuWxlqZxmyRNvhy.88hC',NULL,'2026-07-14 08:55:31','2026-07-14 08:55:31'),(36,'NAYA','nayaka2870@gmail.com',NULL,NULL,NULL,'$2y$12$lw58ozglx6YWmX3aUYDHeOH1BPMwwdfqxa6L.V/SkVfl.RwHdAG1q',NULL,'2026-07-14 08:55:32','2026-07-14 08:55:32'),(37,'WULAN','wulantrisnap@gmail.com',NULL,NULL,NULL,'$2y$12$CGZe2ovZ2F1V3kbTvU93G.MfUrjlRj4SvlmS.GfgtJBfeFQ3Ymr4y',NULL,'2026-07-14 08:55:32','2026-07-14 08:55:32'),(38,'TEGUH','ftk2704@gmail.com',NULL,NULL,NULL,'$2y$12$xGot59G63gvZr8Y47d8j9udH9debmUqdVbMyGayw8r1XuutNd0iwy',NULL,'2026-07-14 08:55:32','2026-07-14 08:55:32'),(39,'UCIK','kanjengyuichiro@gmail.com',NULL,NULL,NULL,'$2y$12$yOGYSP/i5Vo4cVJueRDGRuNSmlTnh0InfOaPaqJ4k/azXbgBItDiK',NULL,'2026-07-14 08:55:32','2026-07-14 08:55:32'),(40,'DAIVA','daivagunawan14@gmail.com',NULL,NULL,NULL,'$2y$12$yzdN3woek2EcbfzeAoG9SOSa8pPDkt64tqTExdQy/A.8ZSk9g4DOe',NULL,'2026-07-14 08:55:33','2026-07-14 08:55:33'),(41,'OKA (W)','okabhismaning@gmail.com',NULL,NULL,NULL,'$2y$12$R.B0Ogy.i594L4SEZlIhhuiUYTFbPWNYXiKQqMIMwxR/I0SdXs.ky',NULL,'2026-07-14 08:55:33','2026-07-14 08:55:33'),(42,'AFI','afi.intan@yahoo.com',NULL,NULL,NULL,'$2y$12$fXXWe2SVVag7xgiMQu81IOzyaybTMhgzLfUWPOoq3C.s4.0/peDCu',NULL,'2026-07-14 08:55:33','2026-07-14 08:55:33'),(43,'DEVI','paramitaokadevi@gmail.com',NULL,NULL,NULL,'$2y$12$TGRISBkGzrLxlFUKtqySxuscIj2BukW5T8qZytJjsmzx3hq73sBMq',NULL,'2026-07-14 08:55:34','2026-07-14 08:55:34'),(44,'SINTHA','sinthaagn63@gmail.com',NULL,NULL,NULL,'$2y$12$Jy0G0cgBhAS.ECzQvabqreD9cNKfC157n/OmCw9/hKT9fxx7WRabu',NULL,'2026-07-14 08:55:34','2026-07-14 08:55:34'),(45,'BARA','bara@example.com',NULL,NULL,NULL,'$2y$12$C7rTL.X.Ba//pVRLoqGxmO/8WbkJS5kj/MGZVMiFinVE4YARsuYNq',NULL,'2026-07-14 08:55:34','2026-07-14 08:55:34'),(46,'RIZAL','rizal@example.com',NULL,NULL,NULL,'$2y$12$p.IA4vhJRB.o01AAz55qN.2m1I.LYIem9Z23KJmQAUsdQE8cAx/0W',NULL,'2026-07-14 08:55:34','2026-07-14 08:55:34');
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

-- Dump completed on 2026-07-15  0:56:10
