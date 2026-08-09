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
INSERT INTO `events` VALUES ('E0001','Mixed Doubles/Doubles','2026-06-18',NULL,'Legian Beach Hotel','SCHEDULED'),('E0002','Mixed Doubles/Doubles','2026-06-24',NULL,'Bali Creative Industry Centre','SCHEDULED'),('E0003','Singles','2026-06-25',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0004','Mixed Doubles/Doubles','2026-06-28',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0005','Mixed Doubles/Doubles','2026-06-30',NULL,'Bali Creative Industry Centre','SCHEDULED'),('E0006','Singles','2026-07-02',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0007','Mixed Doubles/Doubles','2026-07-03',NULL,'Bali Creative Industry Centre','SCHEDULED'),('E0008','Mixed Doubles/Doubles','2026-07-05',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0009','Singles','2026-07-09',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0010','Mixed Doubles/Doubles','2026-07-10',NULL,'Bali Creative Industry Centre','SCHEDULED'),('E0011','Ladies Only Doubles','2026-07-11',NULL,'Liga Tennis Sanur','SCHEDULED'),('E0012','Mixed Doubles/Doubles','2026-07-12',NULL,'Oos Tennis','SCHEDULED'),('E0013',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0014',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0015',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0016',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0017',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0018',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0019',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0020',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0021',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0022',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0023',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0024',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0025',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0026',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0027',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0028',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0029',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0030',NULL,NULL,NULL,NULL,'SCHEDULED'),('E0031','rrrr','2000-12-12','19.00-12.00','hyhy','upcoming'),('E0032','awkoakwo','2026-07-14','19.00-20.00','sanur','ended');
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
INSERT INTO `members` VALUES ('M0001',1,'HUNG','2026-06-01','BEGINNER+','anandazhou09@gmail.com',204,'DIAMOND','+6285190094868'),('M0002',2,'VANESS','2026-06-01','BEGINNER','vanessafebry97@gmail.com',64,'DIAMOND','+6282220502003'),('M0003',3,'ADHYASTA','2026-06-01','BEGINNER','Idabagusadhya@gmail.com',79,'DIAMOND',NULL),('M0004',4,'NADIA','2026-06-01','BEGINNER','indahnadiaswarii@gmail.com',39,'DIAMOND',NULL),('M0005',5,'ABISEKA J','2026-06-01','BEGINNER','abiseka33@gmail.com',58,'DIAMOND',NULL),('M0006',6,'ECAK','2026-06-01','BEGINNER','sangayuecak@gmail.com',60,'DIAMOND',NULL),('M0007',7,'ALDI','2026-06-01','BEGINNER+',NULL,36,'DIAMOND',NULL),('M0008',8,'IVAN T','2026-06-01','BEGINNER+',NULL,0,'DIAMOND',NULL),('M0009',9,'REVATA','2026-06-01','BEGINNER+','revatasiriananda@gmail.com',85,'DIAMOND',NULL),('M0010',10,'AYUDITA','2026-06-01','BEGINNER+','kmgayudita35@gmail.com',16,'DIAMOND',NULL),('M0011',11,'NANDIYA','2026-06-01','L. BEGINNER','nandiyakarunadh@gmail.com',23,'DIAMOND',NULL),('M0012',12,'HENRY','2026-06-01','L. BEGINNER',NULL,11,'DIAMOND',NULL),('M0013',13,'RIAN Y','2026-06-24','BEGINNER+','yuliawanrian@gmail.com',92,'DIAMOND',NULL),('M0014',14,'OKA','2026-06-24','L. INTERMEDIATE','okamobi123@gmail.com',28,'DIAMOND',NULL),('M0015',15,'IWAN','2026-06-24','BEGINNER','aliridwankk@gmail.com',22,'DIAMOND',NULL),('M0016',16,'BAGUS G','2026-06-24','L. BEGINNER','gusgarlicka@gmail.com',49,'DIAMOND',NULL),('M0017',17,'YUDHA','2026-06-24','L. BEGINNER','Yudha.arthawijaya@gmail.com',27,'DIAMOND',NULL),('M0018',18,'BHASKARA','2026-06-25','BEGINNER+','bagusbhaskara14@gmail.com',28,'DIAMOND',NULL),('M0019',19,'GUS YANA','2026-06-25','BEGINNER+','wiradnyana99@gmail.com',50,'DIAMOND',NULL),('M0020',20,'SEKAR W','2026-06-25','BEGINNER','sekar.letlora@yahoo.com',36,'DIAMOND',NULL),('M0021',21,'MENTARI','2026-06-25','BEGINNER','lidyamentari31@gmail.com',82,'DIAMOND',NULL),('M0022',22,'WIRA','2026-06-28','BEGINNER+','kadekadhiwirayudha@gmail.com',30,'DIAMOND',NULL),('M0023',23,'TRISNA','2026-06-28','BEGINNER','itrisnajaya@outlook.com',14,'DIAMOND',NULL),('M0024',24,'RIRI','2026-06-28','BEGINNER','triyana.recovery@gmail.com',22,'DIAMOND',NULL),('M0025',25,'OKY','2026-06-28','L. BEGINNER','okypetter@gmail.com',32,'DIAMOND',NULL),('M0026',26,'AFIN','2026-06-30','BEGINNER+','rama.tannaya@gmail.com',34,'DIAMOND',NULL),('M0027',27,'DIANA','2026-06-30','BEGINNER+',NULL,16,'DIAMOND',NULL),('M0028',28,'RAKA S','2026-06-30','BEGINNER','rakaprasetya.lie@gmail.com',26,'DIAMOND',NULL),('M0029',29,'QUIK','2026-07-02','BEGINNER+','dedwisaptarahadi@gmail.com',35,'DIAMOND',NULL),('M0030',30,'STEPHEN','2026-07-02','BEGINNER','stephensutanto123@gmail.com',28,'DIAMOND',NULL),('M0031',31,'OLIVIA','2026-07-02','BEGINNER','oliviadean170@gmail.com',16,'DIAMOND',NULL),('M0032',32,'PIBBLEBULAT','2026-07-03','BEGINNER',NULL,98,'DIAMOND',NULL),('M0033',33,'WILSON','2026-07-03','BEGINNER+',NULL,92,'DIAMOND',NULL),('M0034',34,'RISTYA','2026-07-03','BEGINNER',NULL,18,'DIAMOND',NULL),('M0035',35,'AHRI','2026-07-05','BEGINNER+',NULL,28,'DIAMOND',NULL),('M0036',36,'NAYA','2026-07-05','BEGINNER',NULL,26,'DIAMOND',NULL),('M0037',37,'WULAN','2026-07-05','BEGINNER',NULL,38,'DIAMOND',NULL),('M0038',38,'TEGUH','2026-07-05','BEGINNER',NULL,11,'DIAMOND',NULL),('M0039',39,'UCIK','2026-07-09','BEGINNER+',NULL,35,'DIAMOND',NULL),('M0040',40,'DAIVA','2026-07-10','BEGINNER+',NULL,35,'DIAMOND',NULL),('M0041',41,'OKA (W)','2026-07-10','BEGINNER',NULL,11,'DIAMOND',NULL),('M0042',42,'AFI','2026-07-11','BEGINNER',NULL,35,'DIAMOND',NULL),('M0043',43,'DEVI','2026-07-11','BEGINNER',NULL,22,'DIAMOND',NULL),('M0044',44,'SHINTA','2026-07-11','BEGINNER',NULL,12,'DIAMOND',NULL),('M0045',45,'Setiawan','2026-07-13',NULL,'setiawan18221@gmail.com',35,'UNRANKED',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,'E0001','2026-06-18','M0001','HUNG',2,18,10,28),(2,'E0001','2026-06-18','M0002','VANESS',6,4,10,14),(3,'E0001','2026-06-18','M0005','ABISEKA J',4,8,10,18),(4,'E0001','2026-06-18','M0007','ALDI',3,12,10,22),(5,'E0001','2026-06-18','M0009','REVATA',1,25,10,35),(6,'E0001','2026-06-18','M0010','AYUDITA',5,6,10,16),(7,'E0001','2026-06-18','M0011','NANDIYA',7,2,10,12),(8,'E0001','2026-06-18','M0012','HENRY',8,1,10,11),(9,'E0002','2026-06-24','M0001','HUNG',6,4,10,14),(10,'E0002','2026-06-24','M0005','ABISEKA J',4,8,10,18),(11,'E0002','2026-06-24','M0006','ECAK',5,6,10,16),(12,'E0002','2026-06-24','M0013','RIAN Y',1,25,10,35),(13,'E0002','2026-06-24','M0014','OKA',2,18,10,28),(14,'E0002','2026-06-24','M0015','IWAN',3,12,10,22),(15,'E0002','2026-06-24','M0016','BAGUS G',7,2,10,12),(16,'E0002','2026-06-24','M0017','YUDHA',8,1,10,11),(17,'E0003','2026-06-25','M0001','HUNG',1,25,10,35),(18,'E0003','2026-06-25','M0018','BHASKARA',2,18,10,28),(19,'E0003','2026-06-25','M0019','GUS YANA',3,12,10,22),(20,'E0003','2026-06-25','M0020','SEKAR W',4,8,10,18),(21,'E0003','2026-06-25','M0003','ADHYASTA',5,6,10,16),(22,'E0003','2026-06-25','M0021','MENTARI',6,4,10,14),(23,'E0004','2026-06-28','M0001','HUNG',1,25,10,35),(24,'E0004','2026-06-28','M0003','ADHYASTA',2,18,10,28),(25,'E0004','2026-06-28','M0004','NADIA',8,1,10,11),(26,'E0004','2026-06-28','M0002','VANESS',7,2,10,12),(27,'E0004','2026-06-28','M0025','OKY',5,6,10,16),(28,'E0004','2026-06-28','M0024','RIRI',3,12,10,22),(29,'E0004','2026-06-28','M0023','TRISNA',6,4,10,14),(30,'E0004','2026-06-28','M0022','WIRA',4,8,10,18),(31,'E0005','2026-06-30','M0001','HUNG',2,18,10,28),(32,'E0005','2026-06-30','M0009','REVATA',3,12,10,22),(33,'E0005','2026-06-30','M0013','RIAN Y',1,25,10,35),(34,'E0005','2026-06-30','M0026','AFIN',4,8,10,18),(35,'E0005','2026-06-30','M0027','DIANA',5,6,10,16),(36,'E0005','2026-06-30','M0028','RAKA S',6,4,10,14),(37,'E0005','2026-06-30','M0002','VANESS',8,1,10,11),(38,'E0005','2026-06-30','M0016','BAGUS G',7,2,10,12),(39,'E0006','2026-07-02','M0006','ECAK',6,4,10,14),(40,'E0006','2026-07-02','M0031','OLIVIA',5,6,10,16),(41,'E0006','2026-07-02','M0030','STEPHEN',2,18,10,28),(42,'E0006','2026-07-02','M0029','QUIK',1,25,10,35),(43,'E0006','2026-07-02','M0020','SEKAR W',4,8,10,18),(44,'E0006','2026-07-02','M0021','MENTARI',3,12,10,22),(45,'E0007','2026-07-03','M0003','ADHYASTA',1,25,10,35),(46,'E0007','2026-07-03','M0004','NADIA',6,4,10,14),(47,'E0007','2026-07-03','M0033','WILSON',3,12,10,22),(48,'E0007','2026-07-03','M0032','PIBBLEBULAT',2,18,10,28),(49,'E0007','2026-07-03','M0022','WIRA',7,2,10,12),(50,'E0007','2026-07-03','M0016','BAGUS G',8,1,10,11),(51,'E0007','2026-07-03','M0025','OKY',5,6,10,16),(52,'E0007','2026-07-03','M0034','RISTYA',4,8,10,18),(53,'E0008','2026-07-05','M0001','HUNG',4,8,10,18),(54,'E0008','2026-07-05','M0002','VANESS',5,6,10,16),(55,'E0008','2026-07-05','M0038','TEGUH',8,1,10,11),(56,'E0008','2026-07-05','M0037','WULAN',3,12,10,22),(57,'E0008','2026-07-05','M0036','NAYA',7,2,10,12),(58,'E0008','2026-07-05','M0035','AHRI',2,18,10,28),(59,'E0008','2026-07-05','M0033','WILSON',1,25,10,35),(60,'E0008','2026-07-05','M0032','PIBBLEBULAT',6,4,10,14),(61,'E0009','2026-07-09','M0039','UCIK',1,25,10,35),(62,'E0009','2026-07-09','M0032','PIBBLEBULAT',3,12,10,22),(63,'E0009','2026-07-09','M0017','YUDHA',5,6,10,16),(64,'E0009','2026-07-09','M0016','BAGUS G',6,4,10,14),(65,'E0009','2026-07-09','M0019','GUS YANA',2,18,10,28),(66,'E0009','2026-07-09','M0021','MENTARI',4,8,10,18),(67,'E0010','2026-07-10','M0001','HUNG',4,8,10,18),(68,'E0010','2026-07-10','M0007','ALDI',6,4,10,14),(69,'E0010','2026-07-10','M0009','REVATA',2,18,10,28),(70,'E0010','2026-07-10','M0013','RIAN Y',3,12,10,22),(71,'E0010','2026-07-10','M0026','AFIN',5,6,10,16),(72,'E0010','2026-07-10','M0041','OKA (W)',8,1,10,11),(73,'E0010','2026-07-10','M0040','DAIVA',1,25,10,35),(74,'E0010','2026-07-10','M0028','RAKA S',7,2,10,12),(75,'E0011','2026-07-11','M0004','NADIA',6,4,10,14),(76,'E0011','2026-07-11','M0006','ECAK',4,8,10,18),(77,'E0011','2026-07-11','M0021','MENTARI',2,18,10,28),(78,'E0011','2026-07-11','M0032','PIBBLEBULAT',5,6,10,16),(79,'E0011','2026-07-11','M0011','NANDIYA',8,1,10,11),(80,'E0011','2026-07-11','M0042','AFI',1,25,10,35),(81,'E0011','2026-07-11','M0043','DEVI',3,12,10,22),(82,'E0011','2026-07-11','M0044','SHINTA',7,2,10,12),(83,'E0012','2026-07-12','M0001','HUNG',2,18,10,28),(84,'E0012','2026-07-12','M0002','VANESS',8,1,10,11),(85,'E0012','2026-07-12','M0005','ABISEKA J',3,12,10,22),(86,'E0012','2026-07-12','M0006','ECAK',7,2,10,12),(87,'E0012','2026-07-12','M0036','NAYA',6,4,10,14),(88,'E0012','2026-07-12','M0037','WULAN',5,6,10,16),(89,'E0012','2026-07-12','M0032','PIBBLEBULAT',4,8,10,18),(90,'E0012','2026-07-12','M0033','WILSON',1,25,10,35),(91,'E0032','2026-07-14','M0045','Setiawan',1,0,1,35);
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
INSERT INTO `sessions` VALUES ('caJPJzu7NdVjE0bVPwAruhXkNLiBI6ao677tuMnU',45,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','eyJfdG9rZW4iOiI4dklCSk82YW9VMUpYVWl4TThHelV1bERrMnBxaHZxdGZNYWRSc3hEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9ldmVudHMiLCJyb3V0ZSI6ImV2ZW50cy5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjo0NX0=',1783934371),('qP2NsU5Nz19VD0Duh9wfA4UYazm0JmsMm3QvGgDi',45,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15','eyJfdG9rZW4iOiJoVmhlWng1RkxqbjFIZWIwMGp1a3BwdEYzWmZad3ExVFJtb05CeFlHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjQ1fQ==',1783935770);
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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'HUNG','anandazhou09@gmail.com',NULL,NULL,NULL,'$2y$12$8JnMfbDEp2yts/LGk.iYt.CUaUULRYUSSUV8vQJJXPisypbvPRWH2',NULL,'2026-07-12 08:52:10','2026-07-12 08:52:10'),(2,'VANESS','vanessafebry97@gmail.com',NULL,NULL,NULL,'$2y$12$TkPxUB5lgshfVc4vunHwUetDTJNmccd/VsCUcgtE1jHKiXZrfRZ56',NULL,'2026-07-12 08:52:10','2026-07-12 08:52:10'),(3,'ADHYASTA','Idabagusadhya@gmail.com',NULL,NULL,NULL,'$2y$12$Nry6Fh/.i8D/TB7dQsBbw.hBaOWVTlW/o7Z6NF5IJhp21Yr10NKbC',NULL,'2026-07-12 08:52:10','2026-07-12 08:52:10'),(4,'NADIA','indahnadiaswarii@gmail.com',NULL,NULL,NULL,'$2y$12$QAsnprX4GbNmK4YY3P/pzOfyYCY9vmsXBesHr7h6qv60bwwLpyAUi',NULL,'2026-07-12 08:52:11','2026-07-12 08:52:11'),(5,'ABISEKA J','abiseka33@gmail.com',NULL,NULL,NULL,'$2y$12$nQFUU7b/pqD.o4QgY8q.a.MW/VILD1d0FWCFxnx5p/S7gUHPaDmfq',NULL,'2026-07-12 08:52:11','2026-07-12 08:52:11'),(6,'ECAK','sangayuecak@gmail.com',NULL,NULL,NULL,'$2y$12$WxsRqgnQGsoXePTId4l1UO4q491bHBgeWpinWGfOag8p1u0ILP9Ya',NULL,'2026-07-12 08:52:11','2026-07-12 08:52:11'),(7,'ALDI','aldi@example.com',NULL,NULL,NULL,'$2y$12$WCWVwmHJ.oqGkcEADvF5kubo7V6HaAC5I/cvGuLxwqhr/Rga5iu7K',NULL,'2026-07-12 08:52:12','2026-07-12 08:52:12'),(8,'IVAN T','ivant@example.com',NULL,NULL,NULL,'$2y$12$3LJcpMjogKhIzJvsXm8ISuzJTHYCnkrOPHjb1//0fXi22LDKFFKNm',NULL,'2026-07-12 08:52:12','2026-07-12 08:52:12'),(9,'REVATA','revatasiriananda@gmail.com',NULL,NULL,NULL,'$2y$12$kLZWDIvNZX38mhVNUh8xmuJzknGq9uckJPfD4SwV7Hnsiy/Q5gbg6',NULL,'2026-07-12 08:52:12','2026-07-12 08:52:12'),(10,'AYUDITA','kmgayudita35@gmail.com',NULL,NULL,NULL,'$2y$12$LwzoUqqndx9rvVAl5QcXlOofihtWE9WBBFKjYktHvgZABGnvGXRFy',NULL,'2026-07-12 08:52:12','2026-07-12 08:52:12'),(11,'NANDIYA','nandiyakarunadh@gmail.com',NULL,NULL,NULL,'$2y$12$qJfjz9UsgF.SNUjCk6CXU.s95FwAnN08d.vGK7kBCQMBYhI0cIY3C',NULL,'2026-07-12 08:52:13','2026-07-12 08:52:13'),(12,'HENRY','henry@example.com',NULL,NULL,NULL,'$2y$12$RsKrxRJfFu92lReRq6dxiO94NUGWW1osPOlUH/pFSEZ4QSBmczxa6',NULL,'2026-07-12 08:52:13','2026-07-12 08:52:13'),(13,'RIAN Y','yuliawanrian@gmail.com',NULL,NULL,NULL,'$2y$12$zL5snCpRwyiNAC/cIID3cuW3OckbB7psSWfyepWf/DSsiKOl9UEwS',NULL,'2026-07-12 08:52:13','2026-07-12 08:52:13'),(14,'OKA','okamobi123@gmail.com',NULL,NULL,NULL,'$2y$12$RN8cbW6esCYHd.ygQjEXzuuaWJyPrHfBXU7P8zDgimvi8YIOSVwOK',NULL,'2026-07-12 08:52:13','2026-07-12 08:52:13'),(15,'IWAN','aliridwankk@gmail.com',NULL,NULL,NULL,'$2y$12$J4qRyP4Dpg6KtCf5qeab3OgwFU2a6c1O.yEqKJc5W.fzCbNIJwGQ.',NULL,'2026-07-12 08:52:14','2026-07-12 08:52:14'),(16,'BAGUS G','gusgarlicka@gmail.com',NULL,NULL,NULL,'$2y$12$XqFEelcVL2VPdO0HVF8YMOmtuxKWkD/b6zwQyQGsOmexzU/V2FJSG',NULL,'2026-07-12 08:52:14','2026-07-12 08:52:14'),(17,'YUDHA','Yudha.arthawijaya@gmail.com',NULL,NULL,NULL,'$2y$12$ZL5eEtdER3Y.lFl0V6hwH.uMvt3a2ylciJsOL8Yr/tOaQquc3hnY6',NULL,'2026-07-12 08:52:14','2026-07-12 08:52:14'),(18,'BHASKARA','bagusbhaskara14@gmail.com',NULL,NULL,NULL,'$2y$12$hGcm82A4tc7ihmXw7lK2GekSuX1HAXtRhDJ/FHNoI7UpPepY/hmCO',NULL,'2026-07-12 08:52:14','2026-07-12 08:52:14'),(19,'GUS YANA','wiradnyana99@gmail.com',NULL,NULL,NULL,'$2y$12$4JGc/KoyC83kQDplHf7mveqeejHsH9lMyorml7zL/GUziUPbPsmqG',NULL,'2026-07-12 08:52:15','2026-07-12 08:52:15'),(20,'SEKAR W','sekar.letlora@yahoo.com',NULL,NULL,NULL,'$2y$12$lbmMxSvvnEvCTGoM06qRSuMHD7lR9qPbscNo7kNa8CZ66ZTYkTF9G',NULL,'2026-07-12 08:52:15','2026-07-12 08:52:15'),(21,'MENTARI','lidyamentari31@gmail.com',NULL,NULL,NULL,'$2y$12$7tiK2dYxaYoYbp/Im/1GNuzE5dkyzTpT9.k9s/lLKJCo75Js00n5m',NULL,'2026-07-12 08:52:15','2026-07-12 08:52:15'),(22,'WIRA','kadekadhiwirayudha@gmail.com',NULL,NULL,NULL,'$2y$12$ujsO1gs3MV4q013OsyafpuSSVN0pwMY2XQYG3jqbjW9DUas3Gyp2K',NULL,'2026-07-12 08:52:16','2026-07-12 08:52:16'),(23,'TRISNA','itrisnajaya@outlook.com',NULL,NULL,NULL,'$2y$12$MWuaLsg5KEzfBZUdD1gn3.cKhI0v0ksSqDZTse50PkhLyW.0B8jRS',NULL,'2026-07-12 08:52:16','2026-07-12 08:52:16'),(24,'RIRI','triyana.recovery@gmail.com',NULL,NULL,NULL,'$2y$12$kz4VN58w.uqIape.2mcPl.vkuNswJ2vO3fHNBMXuLMv2f02p5YmvO',NULL,'2026-07-12 08:52:16','2026-07-12 08:52:16'),(25,'OKY','okypetter@gmail.com',NULL,NULL,NULL,'$2y$12$Q0nICyQyG5l3MKkXCKt.vOXJxFBH5HpUQK2jGu76W.AEBnuud8TZm',NULL,'2026-07-12 08:52:16','2026-07-12 08:52:16'),(26,'AFIN','rama.tannaya@gmail.com',NULL,NULL,NULL,'$2y$12$YKtBAExvPIw7ekJabQgyZeDQP.DpUjfUUVM5YwTcTKvvMKIaar7B6',NULL,'2026-07-12 08:52:17','2026-07-12 08:52:17'),(27,'DIANA','diana@example.com',NULL,NULL,NULL,'$2y$12$sjfPtw2X0zdGlSfBWzJT3O.jtuF3cs0OiLyBSSSRVbpRHzpuxxla6',NULL,'2026-07-12 08:52:17','2026-07-12 08:52:17'),(28,'RAKA S','rakaprasetya.lie@gmail.com',NULL,NULL,NULL,'$2y$12$US0S1.iSpx.lwItUWTsWYeYzpPMuQrtkZbbii6A/KqM8L/xonomo6',NULL,'2026-07-12 08:52:17','2026-07-12 08:52:17'),(29,'QUIK','dedwisaptarahadi@gmail.com',NULL,NULL,NULL,'$2y$12$cX./UOJ8yEH0fo73lDmQ2.He0V4xxRLYS4R0U.v/Dbo4Q6einKhJK',NULL,'2026-07-12 08:52:17','2026-07-12 08:52:17'),(30,'STEPHEN','stephensutanto123@gmail.com',NULL,NULL,NULL,'$2y$12$ijdkrMP7fdGh0OirHj4Ece5Nib8ATxyCcqIG/7a5dYos4JYvBS/vO',NULL,'2026-07-12 08:52:18','2026-07-12 08:52:18'),(31,'OLIVIA','oliviadean170@gmail.com',NULL,NULL,NULL,'$2y$12$NDqnIVVws/YzujV3izqxkujZCYCBrUZI/w788Li9HTA4e4iZIAt4e',NULL,'2026-07-12 08:52:18','2026-07-12 08:52:18'),(32,'PIBBLEBULAT','pibblebulat@example.com',NULL,NULL,NULL,'$2y$12$YXFEvh/ohe1W1YznLMFW/upwhIA4WK3MGpGO9Xjb9cyfdpRk.CaJS',NULL,'2026-07-12 08:52:18','2026-07-12 08:52:18'),(33,'WILSON','wilson@example.com',NULL,NULL,NULL,'$2y$12$SvB8N0O5Fkgk2nir4UbBieVx9xK5aq8HgYJPZPDuQOLobzVvnSXyq',NULL,'2026-07-12 08:52:18','2026-07-12 08:52:18'),(34,'RISTYA','ristya@example.com',NULL,NULL,NULL,'$2y$12$3bpEr7tqc/vec6SXE6SQ9.KzJdEOGKDhRBq3fdOgYkMWRm7WN6rKW',NULL,'2026-07-12 08:52:19','2026-07-12 08:52:19'),(35,'AHRI','ahri@example.com',NULL,NULL,NULL,'$2y$12$ZH0CdBJiwPu1r3BCHSUne..8AMEkq3/wM.5isU15ok88BCjKvHdeu',NULL,'2026-07-12 08:52:19','2026-07-12 08:52:19'),(36,'NAYA','naya@example.com',NULL,NULL,NULL,'$2y$12$LaJyCFSCQ6MGtzCJxyNuPOLYyAU4ChGtaereaSbeLjZHN/qHGL.MO',NULL,'2026-07-12 08:52:19','2026-07-12 08:52:19'),(37,'WULAN','wulan@example.com',NULL,NULL,NULL,'$2y$12$M/ushqJLc0wjRE/C4VL70ukWUSeiS3uoZu9dutmgBlCntUa4n3bXu',NULL,'2026-07-12 08:52:19','2026-07-12 08:52:19'),(38,'TEGUH','teguh@example.com',NULL,NULL,NULL,'$2y$12$kXKVavstrLBGfKDJc3RmK.hMNF3BgxLmx6In/TZpYTts2wxcWk8zy',NULL,'2026-07-12 08:52:20','2026-07-12 08:52:20'),(39,'UCIK','ucik@example.com',NULL,NULL,NULL,'$2y$12$Xd0ZezEAy5V9vUJwSmwAxOw3qot8YLyNKB1kwZPQ4XiqKVtPyEA9C',NULL,'2026-07-12 08:52:20','2026-07-12 08:52:20'),(40,'DAIVA','daiva@example.com',NULL,NULL,NULL,'$2y$12$/WdDVE9UyJ6jC5AvC8AiOu7JnlJToGW9NPGBTyj/8D.zekPBKAE0a',NULL,'2026-07-12 08:52:20','2026-07-12 08:52:20'),(41,'OKA (W)','oka(w)@example.com',NULL,NULL,NULL,'$2y$12$tmuY9KcN8fx8u334hppvSeyy35lVlDrm6v6mr1g1loD/8vfO252za',NULL,'2026-07-12 08:52:21','2026-07-12 08:52:21'),(42,'AFI','afi@example.com',NULL,NULL,NULL,'$2y$12$QJruz3A1rB72TwjNXTauIOli7DcZxxrI3mrguISkogupTJ1SAt.OG',NULL,'2026-07-12 08:52:21','2026-07-12 08:52:21'),(43,'DEVI','devi@example.com',NULL,NULL,NULL,'$2y$12$cMoA87FokXcCN7VE8UmS2eu9PB6Fjbv7ST25nYbjDjWMjzvPpgrCy',NULL,'2026-07-12 08:52:21','2026-07-12 08:52:21'),(44,'SHINTA','shinta@example.com',NULL,NULL,NULL,'$2y$12$8GrYseTSBRQYAEuid4yYQ.ZEw9bvLT9zocmC6dDZcxnAmtsLIet3u',NULL,'2026-07-12 08:52:21','2026-07-12 08:52:21'),(45,'Setiawan','setiawan18221@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocI64tOJNwS0u0BRRafurVftoBfo7zqoU-7kLlcyV9ypIKwxZZQC=s96-c','113492456826004285794',NULL,'$2y$12$QRbSYaifZoH7G6NLKg21xuLmPd9FM0sIYqo566bEHOUki6SJLv7qi','arPtJIF7bxBNJoO8bpHIvyOr34SOwe5gMTEO1DfIbdslQu5XK9k7EVcoO7yv','2026-07-12 23:13:55','2026-07-13 00:04:50');
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

-- Dump completed on 2026-07-13 18:06:05
