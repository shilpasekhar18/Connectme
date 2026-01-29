-- MariaDB dump 10.19-11.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: connectme
-- ------------------------------------------------------
-- Server version	11.3.2-MariaDB

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES
(1,'admin','admin','admin@connectme.com'),
(8,'krishnapriya','krishnapriya@123','krishnapriyau@connectme.com'),
(9,'liyana','liyana@123','liyanasiyad@connectme.com'),
(10,'shilpa','shilpa@123','shilpashekar@connectme.com'),
(11,'krishna','krishna@123','krishnaj@connectme.com');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `employee` int(11) NOT NULL,
  `employer` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `employer_name` varchar(255) DEFAULT NULL,
  `employer_phone` varchar(20) DEFAULT NULL,
  `employer_address` varchar(255) DEFAULT NULL,
  `cancel_status` int(11) DEFAULT 0,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `employee` (`employee`),
  KEY `fk_booking_services` (`sid`),
  KEY `fk_booking_accounts` (`employer`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`employee`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_booking_accounts` FOREIGN KEY (`employer`) REFERENCES `accounts` (`id`),
  CONSTRAINT `fk_booking_services` FOREIGN KEY (`sid`) REFERENCES `services` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES
(59,122,8,7,'Krishnapriya U','8569856985','Kottayam',0,'2024-05-06'),
(60,113,8,1,'Krishnapriya U','8569856985','Kottayam',0,'2024-05-06'),
(61,110,9,1,'Liyana Siyad','6325696586','Idukki',0,'2024-05-06'),
(62,119,9,5,'Liyana Siyad','6325696586','Idukki',0,'2024-05-07'),
(63,122,9,7,'Liyana Siyad','6325696586','Idukki',0,'2024-05-07'),
(64,120,10,8,'Shilpa Shekar','6526121384','Kumarakom',0,'2024-05-06'),
(65,111,10,3,'Shilpa Shekar','6526121384','Kumarakom',0,'2024-05-06'),
(66,113,11,1,'Krishna J','7592261516','Alappuzha',0,'2024-05-07'),
(67,115,11,2,'Krishna J','7592261516','Alappuzha',0,'2024-05-06');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `wage` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_services` (`sid`),
  CONSTRAINT `fk_employee_services` FOREIGN KEY (`sid`) REFERENCES `services` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES
(110,'Krishnapriya U','8569856985','krishnapriyau@connectme.com',10000,'/cert/userid_8_sid_1_babycare.png',1,'Provides care for infants and young children. ',18,20,8,'Kottayam'),
(111,'Krishnapriya U','8569856985','krishnapriyau@connectme.com',5000,'/cert/userid_8_sid_3_electrician.jpg',3,'Specializes in installing and maintaining electrical systems.',5,20,8,'Kottayam'),
(112,'Krishnapriya U','8569856985','krishnapriyau@connectme.com',20000,'/cert/userid_8_sid_14_pestcontrol.jpg',14,'Provides indoor pest control services for homes and offices.',20,20,8,'Kottayam'),
(113,'Liyana Siyad','6325696586','liyanasiyad@connectme.com',9000,'/cert/userid_9_sid_1_babycare.png',1,'Provides care for infants and young children.',18,20,9,'Idukki'),
(115,'Liyana Siyad','6325696586','liyanasiyad@connectme.com',5000,'/cert/userid_9_sid_2_plumbing.jpg',2,'Specializes in installing and maintaining plumbing systems.',12,20,9,'Idukki'),
(116,'Liyana Siyad','6325696586','liyanasiyad@connectme.com',1000,'/cert/userid_9_sid_6_delivery.png',6,'Provides delivery services for various goods.',12,20,9,'Idukki'),
(117,'Shilpa Shekar','6526121384','shilpashekar@connectme.com',5000,'/cert/userid_10_sid_10_painting.png',10,'Provides indoor painting services for homes and offices.',20,19,10,'Kumarakom'),
(118,'Shilpa Shekar','6526121384','shilpashekar@connectme.com',500,'/cert/userid_10_sid_4_delivery.png',4,'Provides delivery services for various goods.',12,19,10,'Kumarakom'),
(119,'Shilpa Shekar','6526121384','shilpashekar@connectme.com',6000,'/cert/userid_10_sid_5_fencing.jpg',5,'Specializes in installing and repairing fences.',10,19,10,'Kumarakom'),
(120,'Krishna J','7592261516','krishnaj@connectme.com',5000,'/cert/userid_11_sid_8_housecleaning.jpg',8,'Offers indoor cleaning services for homes and offices.',20,19,11,'Alappuzha'),
(121,'Krishna J','7592261516','krishnaj@connectme.com',6000,'/cert/userid_11_sid_3_electrician.jpg',3,'Specializes in installing and maintaining electrical systems.',20,19,11,'Alappuzha'),
(122,'Krishna J','7592261516','krishnaj@connectme.com',5000,'/cert/userid_11_sid_7_gardeningcertificate.jpg',7,'Provides gardening services for outdoor spaces.',20,19,11,'Alappuzha');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stype` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES
(1,'Indoor'),
(2,'Outdoor');
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `sname` varchar(255) NOT NULL,
  `oid` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `oid` (`oid`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`oid`) REFERENCES `options` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'Babycare',1,'Provides care for infants and young children.'),
(2,'Plumber',1,'Specializes in installing and maintaining plumbing systems.'),
(3,'Electrician',1,'Specializes in installing and maintaining electrical systems.'),
(4,'Delivery',1,'Provides delivery services for various goods.'),
(5,'Fencing',2,'Specializes in installing and repairing fences.'),
(6,'Delivery',2,'Provides delivery services for various goods.'),
(7,'Gardening',2,'Provides gardening services for outdoor spaces.'),
(8,'House Cleaning',1,'Offers indoor cleaning services for homes and offices.'),
(9,'Roofing',2,'Specializes in installing and repairing roofs for buildings.'),
(10,'Painting',1,'Provides indoor painting services for homes and offices.'),
(11,'Landscaping',2,'Specializes in outdoor landscaping and beautification.'),
(12,'Carpet Cleaning',1,'Offers indoor carpet cleaning services for homes and offices.'),
(13,'Window Cleaning',1,'Offers indoor window cleaning services for homes and offices.'),
(14,'Pest Control',1,'Provides indoor pest control services for homes and offices.'),
(15,'Lawn Care',2,'Offers lawn care services for outdoor spaces.'),
(16,'HVAC Maintenance',1,'Provides indoor HVAC maintenance services for homes and offices.'),
(17,'Deck Construction',2,'Specializes in building outdoor decks and patios.'),
(18,'Appliance Repair',1,'Offers indoor appliance repair services for homes and offices.');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-06 22:08:01
