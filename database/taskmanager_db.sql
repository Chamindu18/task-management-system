-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: taskmanager_db
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `details` text,
  `entity_id` bigint DEFAULT NULL,
  `entity_name` varchar(500) DEFAULT NULL,
  `entity_type` varchar(255) NOT NULL,
  `error_message` varchar(500) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5bm1lt4f4eevt8lv2517soakd` (`user_id`),
  CONSTRAINT `FK5bm1lt4f4eevt8lv2517soakd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `description` varchar(500) DEFAULT NULL,
  `error_message` varchar(500) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `file_path` varchar(1000) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `filters` text,
  `format` varchar(255) NOT NULL,
  `from_date` datetime(6) DEFAULT NULL,
  `generated_at` datetime(6) NOT NULL,
  `include_charts` bit(1) DEFAULT NULL,
  `report_name` varchar(255) NOT NULL,
  `report_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `to_date` datetime(6) DEFAULT NULL,
  `total_records` int DEFAULT NULL,
  `generated_by_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK44jim15l42oy4gl80pmns1mw4` (`generated_by_user_id`),
  CONSTRAINT `FK44jim15l42oy4gl80pmns1mw4` FOREIGN KEY (`generated_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` enum('ADMIN','USER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `priority` enum('HIGH','LOW','MEDIUM') DEFAULT NULL,
  `status` enum('TODO','IN_PROGRESS','DONE') DEFAULT 'TODO',
  `title` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `creation_date` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6s1ob9k4ihi75xbxe2w0ylsdh` (`user_id`),
  CONSTRAINT `FK6s1ob9k4ihi75xbxe2w0ylsdh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (12,'first task testing','2026-02-04 18:30:00.000000','LOW','TODO','task 1',6,NULL,'2026-02-04 03:28:00.110947','2026-02-04 03:28:00.110947',NULL,NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bio` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email_notifications` bit(1) NOT NULL,
  `items_per_page` int NOT NULL,
  `language` varchar(10) DEFAULT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  `profile_public` bit(1) NOT NULL,
  `show_activity_status` bit(1) NOT NULL,
  `show_completed_tasks` bit(1) NOT NULL,
  `system_alerts` bit(1) NOT NULL,
  `task_comments` bit(1) NOT NULL,
  `task_reminders` bit(1) NOT NULL,
  `theme` varchar(50) DEFAULT NULL,
  `time_zone` varchar(50) DEFAULT NULL,
  `two_factor_enabled` bit(1) NOT NULL,
  `two_factor_method` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `weekly_reports` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4bos7satl9xeqd18frfeqg6tt` (`user_id`),
  CONSTRAINT `FK8v82nj88rmai0nyck19f873dw` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES (2,NULL,'2026-01-24 18:44:15.675951',_binary '',10,'en',NULL,NULL,_binary '\0',_binary '',_binary '',_binary '',_binary '',_binary '','light','UTC',_binary '\0',NULL,'2026-01-24 19:00:12.498588',_binary '\0',2),(4,NULL,'2026-02-01 16:11:53.059602',_binary '',10,'en',NULL,NULL,_binary '\0',_binary '',_binary '',_binary '',_binary '',_binary '','light','UTC',_binary '\0',NULL,'2026-02-01 16:11:53.059602',_binary '\0',6),(5,NULL,'2026-02-04 03:29:25.301191',_binary '',10,'en',NULL,NULL,_binary '\0',_binary '',_binary '',_binary '',_binary '',_binary '','light','UTC',_binary '\0',NULL,'2026-02-04 03:29:25.301191',_binary '\0',7);
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `role_id` bigint NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'2025-11-15 11:23:46.870124','admin@taskmanager.com','$2a$10$nF4JYMLH2r7a8wJhyLa3Huk4DyavbFSkbRyrJJSzIri5g.UA/Emw6','2025-11-15 11:23:46.870124','admin',1,NULL,NULL,NULL,NULL),(6,'2026-02-01 16:11:52.654083','chamindu553@gmail.com','$2a$10$BQkwCtk1sUFr9I0IrlEvhOeW//HtrhVbpIdB1qBWelnj5kjuPHpZq','2026-02-01 16:11:52.654083','chamindu',2,NULL,NULL,NULL,NULL),(7,'2026-02-04 03:29:25.102190','testuesr@gmail.com','$2a$10$yRflC1Pg6w.GTDS4EkBQdOv2a8vZKm8dSGSQu.spdacVmPBf5a7Pa','2026-02-04 03:29:25.102190','testuser',2,NULL,NULL,NULL,NULL);
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

-- Dump completed on 2026-02-04 10:00:10
