-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: cpas_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `courseCode` varchar(255) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `totalCredits` int DEFAULT NULL,
  `creditsBreakdown` varchar(255) DEFAULT NULL,
  `semester` int NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `isPlaceholderSlot` tinyint NOT NULL DEFAULT '0',
  `choiceGroupId` varchar(255) DEFAULT NULL,
  `prerequisites` text,
  PRIMARY KEY (`courseCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('กช321-1','เศรษฐกิจพอเพียงและการพัฒนาที่ยั่งยืน',3,'2-2-5',1,'general_education',0,NULL,''),('คพ111-1','วิทยาการคอมพิวเตอร์ 1',3,'2-3-5',1,'major_required',0,NULL,''),('คพ112-1','วิทยาการคอมพิวเตอร์ 2',3,'2-3-5',2,'major_required',0,NULL,'คพ111-1'),('คพ117-1','หลักการเขียนโปรแกรมเชิงวัตถุ',3,'2-3-5',1,'major_required',0,NULL,''),('คพ121-1','ตรรกศาสตร์เชิงดิจิทัลและอุปกรณ์อัจฉริยะ',3,'2-3-5',2,'major_required',0,NULL,''),('คพ151-1','คณิตศาสตร์ดิสครีต',3,'3-0-6',2,'major_required',0,NULL,''),('คพ213-2','การวิเคราะห์และออกแบบอัลกอริทึม 3 (2-3-5) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,'คพ112-1,คพ151-1'),('คพ221-2','โครงสร้างข้อมูล 3 (2-3-5) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,'คพ112-1'),('คพ222-2','การเขียนโปรแกรมมัลติมีเดีย',3,'2-3-5',4,'major_required',0,NULL,'คพ117-1'),('คพ231-1','ระบบคอมพิวเตอร์และภาษาแอสเซมบลี',1,'0-3-1',3,'major_required',0,NULL,''),('คพ232-1','สถาปัตยกรรมคอมพิวเตอร์',3,'2-3-5',4,'major_required',0,NULL,'คพ121-1'),('คพ241-1','ระบบฐานข้อมูล 3 (2-3-5) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,'คพ112-1'),('คพ252-1','คณิตศาสตร์สำหรับวิทยาการคอมพิวเตอร์',3,'3-0-6',4,'major_required',0,NULL,'คศ101-3'),('คพ313-3','การพัฒนาโปรแกรมประยุกต์บนเว็บ',3,'2-3-5',5,'major_required',0,NULL,'คพ241-1'),('คพ320-1','ระบบปฏิบัติการ',3,'2-3-5',5,'major_required',0,NULL,'คพ232-1'),('คพ330-1','การสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์',3,'2-3-5',6,'major_required',0,NULL,'คพ232-1'),('คพ341-2','วิทยาการข้อมูล',3,'2-3-5',5,'major_required',0,NULL,'คพ241-1'),('คพ343-3','การวิเคราะห์และออกแบบเชิงวัตถุ',3,'2-3-5',5,'major_required',0,NULL,'คพ221-2'),('คพ344-2','การพัฒนาระบบซอฟต์แวร์เชิงวัตถุ',3,'2-3-5',6,'major_required',0,NULL,'คพ343-3'),('คพ347-1','วิศวกรรมซอฟต์แวร์',3,'2-3-5',6,'major_required',0,NULL,'คพ343-3'),('คพ391-2','การบริหารโครงการคอมพิวเตอร์',1,'1-0-2',6,'major_required',0,NULL,''),('คพ392-1','การเป็นผู้ประกอบการทางด้านคอมพิวเตอร์และนวัตกรรม',3,'2-3-5',6,'major_required',0,NULL,''),('คพ492-2','สัมมนาวิชาการทางวิทยาการคอมพิวเตอร์',1,'0-2-1',7,'major_required',0,NULL,'คพ347-1'),('คม100-1','เคมีทั่วไป',3,'2-3-5',2,'major_required',0,NULL,''),('คศ101-3','แคลคูลัส 1 3 (3-0-6) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('ชว100-2','ชีววิทยาทั่วไป',3,'2-3-5',2,'major_required',0,NULL,''),('ผษ101-2','เกษตรเพื่อชีวิต',3,'3-0-6',1,'general_education',0,NULL,''),('พง100-1','พลังงานสำหรับชีวิตประจำวัน 3 (3-0-6) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('ฟส105-1','ฟิสิกส์ทั่วไป 1',3,'2-3-5',2,'major_required',0,NULL,''),('ลส001-1','วิชาเลือกเสรี',3,'3-0-0',7,'free_elective',1,NULL,''),('ลส002-1','วิชาเลือกเสรี',3,'3-0-0',7,'free_elective',1,NULL,''),('วท101-1','วิทยาศาสตร์เพื่อชีวิต 3 (2-2-5) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('วท102-1','การพัฒนาวิทยาศาสตร์และเทคโนโลยี 3 (2-2-5) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('วท497-1','สหกิจศึกษา',9,'0-270-0',8,'major_elective',0,'year4-term2-capstone','คพ347-1'),('วท498-1','การเรียนรู้อิสระ',9,'0-270-0',8,'major_elective',0,'year4-term2-capstone',''),('วท499-1','การศึกษา หรือการฝึกงาน หรือฝึกอบรมต่างประเทศ',9,'0-270-0',8,'major_elective',0,'year4-term2-capstone',''),('วอ101-1','วิศวกรรมเบื้องต้นในชีวิตประจำวัน 3 (3-0-6) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('วอ102-1','นานาสาระเกี่ยวกับอาหารและยา 3 (3-0-6) วิชาเอกบังคับ',NULL,'3',3,'major_required',0,NULL,''),('ศท011-1','มนุษย์กับความงามทางศิลปะ',3,'3-0-6',4,'general_education',0,NULL,''),('ศท012-2','จิตวิทยากับพฤติกรรมมนุษย์',3,'3-0-6',4,'general_education',0,NULL,''),('ศท013-2','สุขภาพเพื่อการดำรงชีวิต',3,'2-2-5',4,'general_education',0,NULL,''),('ศท014-2','การสืบค้นสารนิเทศเพื่อการศึกษา 3 (2-2-5) หมวดศึกษาทั่วไป (GE)',NULL,'3',3,'general_education',0,NULL,''),('ศท021-1','สังคมศาสตร์ในชีวิตประจำวัน',3,'3-0-6',1,'general_education',0,NULL,''),('ศท022-2','อารยธรรมโลก',3,'3-0-6',1,'general_education',0,NULL,''),('ศท031-2','การใช้ภาษาไทย',3,'2-2-5',1,'general_education',0,NULL,''),('ศท104-2','มนุษย์และสิ่งแวดล้อม',3,'3-0-6',1,'general_education',0,NULL,''),('ศท141-1','ภาษาอังกฤษพื้นฐาน 1',3,'2-2-5',1,'general_education',0,NULL,''),('ศท142-1','ภาษาอังกฤษพื้นฐาน 2',3,'2-2-5',2,'general_education',0,NULL,'ศท141-1'),('ศท180-1','ศิลปะกับความคิดสร้างสรรค์',3,'1-4-4',4,'general_education',0,NULL,''),('ศท241-4','ภาษาอังกฤษเชิงวิทยาศาสตร์และเทคโนโลยี 1 3 (2-2-5) หมวดศึกษาทั่วไป (GE)',NULL,'3',3,'general_education',0,NULL,'ศท142-1'),('ศท242-4','ภาษาอังกฤษเชิงวิทยาศาสตร์และเทคโนโลยี 2',3,'2-2-5',4,'general_education',0,NULL,'ศท241-4'),('ศท302-2','สังคมและวัฒนธรรมไทย',3,'3-0-6',1,'general_education',0,NULL,''),('ศท304-3','ศาสตร์และศิลป์แห่งปัญญาชน',3,'2-2-5',4,'general_education',0,NULL,''),('ศท305-2','ประวัติศาสตร์และพัฒนาการของล้านนา',3,'3-0-6',4,'general_education',0,NULL,''),('ศศ101-1','เศรษฐศาสตร์เพื่อชีวิตประจำวันและการประกอบการ',3,'3-0-6',1,'general_education',0,NULL,''),('สถ301-1','หลักสถิติ',3,'3-0-6',4,'major_required',0,NULL,''),('อล001-1','วิชาเอกเลือก',3,'3-0-0',5,'major_elective',1,NULL,''),('อล002-2','วิชาเอกเลือก',3,'3-0-0',6,'major_elective',1,NULL,''),('อล003-3','วิชาเอกเลือก',3,'3-0-0',6,'major_elective',1,NULL,''),('อล004-4','วิชาเอกเลือก',3,'3-0-0',7,'major_elective',1,NULL,'');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_courses`
--

DROP TABLE IF EXISTS `failed_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_courses` (
  `id` varchar(36) NOT NULL,
  `isResolved` tinyint NOT NULL DEFAULT '0',
  `studentId` varchar(36) DEFAULT NULL,
  `courseCourseCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_016be27f7113158411a7ce961d6` (`studentId`),
  KEY `FK_ebf35bd43abc1b9b398ba2da70c` (`courseCourseCode`),
  CONSTRAINT `FK_016be27f7113158411a7ce961d6` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_ebf35bd43abc1b9b398ba2da70c` FOREIGN KEY (`courseCourseCode`) REFERENCES `courses` (`courseCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_courses`
--

LOCK TABLES `failed_courses` WRITE;
/*!40000 ALTER TABLE `failed_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulation_records`
--

DROP TABLE IF EXISTS `simulation_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulation_records` (
  `id` varchar(36) NOT NULL,
  `failedCourses` json NOT NULL,
  `expectedGraduationSemester` int NOT NULL,
  `delaySemesters` int NOT NULL,
  `isDismissed` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `studentId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7d1349a6ccce84b61e44c942e46` (`studentId`),
  CONSTRAINT `FK_7d1349a6ccce84b61e44c942e46` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulation_records`
--

LOCK TABLES `simulation_records` WRITE;
/*!40000 ALTER TABLE `simulation_records` DISABLE KEYS */;
INSERT INTO `simulation_records` VALUES ('e85689a3-6857-4813-8445-32ded8edbc8e','[\"คพ111-1\"]',20,12,1,'2026-07-16 21:54:29.291508','dc18a1f7-8155-11f1-85d3-3603c83bda11');
/*!40000 ALTER TABLE `simulation_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_plan_courses`
--

DROP TABLE IF EXISTS `study_plan_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_plan_courses` (
  `studyPlansId` varchar(36) NOT NULL,
  `coursesCourseCode` varchar(255) NOT NULL,
  PRIMARY KEY (`studyPlansId`,`coursesCourseCode`),
  KEY `IDX_355b8bd288e14f57dab8d071c7` (`studyPlansId`),
  KEY `IDX_c31da57cac3ef1efa2bfee2e3f` (`coursesCourseCode`),
  CONSTRAINT `FK_355b8bd288e14f57dab8d071c75` FOREIGN KEY (`studyPlansId`) REFERENCES `study_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_c31da57cac3ef1efa2bfee2e3f0` FOREIGN KEY (`coursesCourseCode`) REFERENCES `courses` (`courseCode`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_plan_courses`
--

LOCK TABLES `study_plan_courses` WRITE;
/*!40000 ALTER TABLE `study_plan_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_plan_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_plans`
--

DROP TABLE IF EXISTS `study_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_plans` (
  `id` varchar(36) NOT NULL,
  `academicYear` int NOT NULL,
  `semester` int NOT NULL,
  `studentId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ee8bd87b327c092ca1da1e35a5b` (`studentId`),
  CONSTRAINT `FK_ee8bd87b327c092ca1da1e35a5b` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_plans`
--

LOCK TABLES `study_plans` WRITE;
/*!40000 ALTER TABLE `study_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` enum('student','advisor') NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `advisorId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  KEY `FK_ff5a36e41fab31ce0da5a8fa821` (`advisorId`),
  CONSTRAINT `FK_ff5a36e41fab31ce0da5a8fa821` FOREIGN KEY (`advisorId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2eceecbd-99bc-412e-98f6-bb2c8c73fbc8','mju363','$2b$10$/CIrp5RNryZKHrAD8TGN4O/9wraGilFAbphk8uEYsraPFpTtV0XpK','student','ภาณุศักดิ์ จงอักษร',NULL),('9b73a4ad-d91e-4bcb-8b58-b7219c5e9a96','6704101364','$2b$10$7f8kLXW7aVwIP9zqVMeWDOFAtwgEf8TjZt.27rwnWOZ3SFTS6SA3u','student','ภาณุศักดิ์ จงอักษร',NULL),('dc18a1f7-8155-11f1-85d3-3603c83bda11','mju364','$2b$10$vVQ/egTePFYM1fNhhhv8ROyrGqEkkyQt3Xk8MQu6w5ccATAyxTA.W','student','Test Student MJU',NULL);
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

-- Dump completed on 2026-07-17 19:14:47
