-- -------------------------------------------------------------
-- TablePlus 5.5.2(512)
--
-- https://tableplus.com/
--
-- Database: ai4ee
-- Generation Time: 2023-12-09 16:53:40.6080
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` int NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `userTypeId` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(100) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `googleScholarUrl` varchar(200) DEFAULT NULL,
  `acmUrl` varchar(200) DEFAULT NULL,
  `openAlexUrl` varchar(200) DEFAULT NULL,
  `dblpUrl` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `university` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `memberID` varchar(45) DEFAULT NULL,
  `modifiedBy` varchar(45) DEFAULT NULL,
  `ieeeName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

INSERT INTO `members` (`id`, `firstName`, `lastName`, `userTypeId`, `email`, `phoneNumber`, `status`, `createdDate`, `modifiedDate`, `googleScholarUrl`, `acmUrl`, `openAlexUrl`, `dblpUrl`, `name`, `university`, `designation`, `password`, `memberID`, `modifiedBy`, `ieeeName`) VALUES
(1, 'Venu', 'Govindaraju', 2, 'govind@buffalo.edu', '7166451558', 'approved', '2023-11-20 08:13:11', '2023-11-20 08:13:11', 'https://scholar.google.com/citations?user=ruIgbscAAAAJ&hl', 'https://dl.acm.org/profile/81375600459', 'https://openalex.org/A5020354604', 'https://dblp.org/pid/g/VenuGovindaraju.html', 'Venu Govindaraju', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Venu Govindaraju'),
(2, 'Jinjun', 'Xiong', 2, 'jinjun@buffalo.edu', '7166454760', 'approved', '2023-11-20 08:14:51', '2023-11-20 08:14:51', 'https://scholar.google.com/citations?user=tRt1xPYAAAAJ&hl', 'https://dl.acm.org/profile/81100313913', 'https://openalex.org/A5030156276', 'https://dblp.org/pid/81/1130.html', 'Jinjun Xiong', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Jinjun Xiong'),
(3, 'Srirangaraj', 'Setlur', 2, 'setlur@buffalo.edu', '7166451568', 'approved', '2023-11-20 08:14:51', '2023-11-20 08:14:51', 'https://scholar.google.com/citations?user=BPEF3ZwAAAAJ&hl', 'https://dl.acm.org/profile/81100609589', 'https://openalex.org/A5036052557', 'https://dblp.org/pid/80/1388.html', 'Srirangaraj Setlur', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Srirangaraj Setlur'),
(4, 'Pamela', 'Hadley', 2, 'phadley@illinois.edu', '2173331968', 'approved', '2023-11-20 08:14:51', '2023-11-20 08:14:51', 'https://scholar.google.com/citations?user=IqBZV2YAAAAJ&hl', '', 'https://openalex.org/A5040697733', '', 'Pamela Hadley', 'University of illinois Urbana-Champaign', 'Professor', NULL, NULL, NULL, NULL),
(5, 'Julie A.', 'Kientz', 2, 'jkientz@uw.edu', '2062210614', 'approved', '2023-11-20 08:17:34', '2023-11-20 08:17:34', 'https://scholar.google.com/citations?user=GvpuYB4AAAAJ&hl', 'https://dl.acm.org/profile/81548025762', 'https://openalex.org/A5066304043', 'https://dblp.org/pid/k/JAKientz.html', 'Julie A. Kientz', 'University of Washington', 'Professor', NULL, NULL, NULL, 'Julie A. Kientz'),
(6, 'David', 'Feil-Seifer', 2, 'dave@cse.unr.edu', '7757846469', 'approved', '2023-11-20 08:17:34', '2023-11-20 08:17:34', 'https://scholar.google.com/citations?user=m1VxcKcAAAAJ&hl', 'https://dl.acm.org/profile/81385594144', 'https://openalex.org/A5067204635', 'https://dblp.org/pid/70/2977.html', 'David Feil-Seifer', 'University of nevada, Reno', 'Professor', NULL, NULL, NULL, 'David Feil-Seifer'),
(7, 'Megan-Brette', 'Hamilton', 2, 'mb@meganbrettehamilton.com', '9176975625', 'approved', '2023-11-20 08:17:34', '2023-11-20 08:17:34', 'https://scholar.google.com/citations?user=09y1gLYAAAAJ&hl', '', 'https://openalex.org/A5040340900', '', 'Megan-Brette Hamilton', 'Unknown', 'Professor', NULL, NULL, NULL, NULL),
(8, 'Anil K.', 'Jain', 2, 'jain@cse.msu.edu', '5174206274', 'approved', '2023-11-20 08:17:34', '2023-11-20 08:17:34', 'https://scholar.google.com/citations?user=g-_ZXGsAAAAJ&hl', '', 'https://openalex.org/A5007029060', 'https://dblp.org/pid/j/AnilKJain.html', 'Anil K. Jain', 'Michigan State University', 'Professor', NULL, NULL, NULL, 'Anil K. Jain'),
(9, 'Ye', 'Jia', 2, NULL, NULL, 'approved', '2023-11-20 08:17:34', '2023-11-20 08:17:34', 'https://scholar.google.com/citations?user=kaO4R1kAAAAJ&hl', '', '', 'https://dblp.org/pid/217/2520.html', 'Ye Jia', 'Unknown', 'Professor', 'password', 'member', NULL, NULL),
(10, 'Alison', 'Eisel Hendricks', 2, 'ahendric@buffalo.edu', '7168295563', 'approved', '2023-11-20 08:18:01', '2023-11-20 08:18:01', 'https://scholar.google.com/citations?user=QbuFimgAAAAJ&hl', '', 'https://openalex.org/A5087211668', '', 'Alison Eisel Hendricks', 'University at Buffalo', 'Professor', NULL, NULL, NULL, NULL),
(11, 'Ifeoma', 'Nwogu', 2, 'inwogu@buffalo.edu', NULL, 'approved', '2023-11-20 08:22:20', '2023-11-20 08:22:20', 'https://scholar.google.com/citations?user=pCOmTY0AAAAJ&hl', '', 'https://openalex.org/A5022590472', 'https://dblp.org/pid/98/3822.html', 'Ifeoma Nwogu', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Ifeoma Nwogu'),
(12, 'X. Christine', 'Wang', 2, 'wangxc@buffalo.edu', '7166452379', 'approved', '2023-11-20 08:25:46', '2023-11-20 08:25:46', 'https://scholar.google.com/citations?user=BxJvoBgAAAAJ&hl', '', 'https://openalex.org/A5033623381', 'https://dblp.org/pid/181/2851.html', 'X. Christine Wang', 'University at Buffalo', 'Professor', NULL, NULL, NULL, NULL),
(13, 'Wenyao', 'Xu', 2, 'wenyaoxu@buffalo.edu', '7166453464', 'approved', '2023-11-20 08:24:59', '2023-11-20 08:24:59', 'https://scholar.google.com/citations?user=dvvN6qsAAAAJ&hl', 'https://dl.acm.org/profile/84459579257', 'https://openalex.org/A5035679293', 'https://dblp.org/pid/11/6689.html', 'Wenyao Xu', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Wenyao Xu'),
(14, 'Maneesh', 'Agrawala', 2, 'maneesh@cs.stanford.edu', '6507232642', 'approved', '2023-11-20 08:25:07', '2023-11-20 08:25:07', 'https://scholar.google.com/citations?user=YPzKczYAAAAJ&hl', '', 'https://openalex.org/A5045835385', 'https://dblp.org/pid/64/2431.html', 'Maneesh Agrawala', 'Stanford University', 'Professor', NULL, NULL, NULL, 'Maneesh Agrawala'),
(15, 'Diego', 'Aguirre', 2, 'daguirre6@utep.edu', NULL, 'approved', '2023-11-20 08:25:13', '2023-11-20 08:25:13', 'https://scholar.google.com/citations?user=PamAnPIAAAAJ&hl', '', '', 'https://dblp.org/pid/159/6172.html', 'Diego Aguirre', 'The University if Texas at El Paso', 'Professor', NULL, NULL, NULL, NULL),
(16, 'Chen', 'Changyou', 2, 'changyou@buffalo.edu', '7166454750', 'approved', '2023-11-20 08:28:25', '2023-11-20 08:28:25', 'https://scholar.google.com/citations?user=LtEcKBcAAAAJ&hl', '', 'https://openalex.org/A5006435999', 'https://dblp.org/pid/65/2802.html', 'Chen Changyou', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Changyou Chen'),
(17, 'Karthik', 'Dantu', 2, 'kdantu@buffalo.edu', '7166452670', 'pending', '2023-11-20 08:28:25', '2023-11-20 08:28:25', 'https://scholar.google.com/citations?user=aOO2tOwAAAAJ&hl', 'https://dl.acm.org/profile/81100400426', 'https://openalex.org/A5032635242', 'https://dblp.org/pid/89/1614.html', 'Karthik Dantu', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Karthik Dantu'),
(18, 'Mark', 'Frank', 2, 'mfrank83@buffalo.edu', '7166451170', 'pending', '2023-11-20 08:28:25', '2023-11-20 08:28:25', 'https://scholar.google.com/citations?user=ArHPm7EAAAAJ&hl', '', 'https://openalex.org/A5073706037', '', 'Mark Frank', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Mark G. Frank'),
(19, 'Nick', 'Haber', 2, 'nhaber@stanford.edu', NULL, 'approved', '2023-11-20 08:28:25', '2023-11-20 08:28:25', 'https://scholar.google.com/citations?user=euNCoVYAAAAJ&hl', '', 'https://openalex.org/A5069105490', 'https://dblp.org/pid/179/4983.html', 'Nick Haber', 'Stanford University', 'Professor', NULL, NULL, NULL, NULL),
(20, 'Mark', 'Hasegawa-Johnson', 2, 'jhasegaw@illinois.edu', '2173330925', 'approved', '2023-11-20 08:28:25', '2023-11-20 08:28:25', 'https://scholar.google.com/citations?user=18O0OAwAAAAJ&hl', '', 'https://openalex.org/A5004778663', 'https://dblp.org/pid/70/3186.html', 'Mark Hasegawa-Johnson', 'University of illinois Urbana-Champaign', 'Professor', NULL, NULL, NULL, 'Mark Hasegawa-Johnson'),
(21, 'Yun', 'Huang', 2, 'yunhuang@illinois.edu', '2172440418', 'pending', '2023-11-20 08:29:56', '2023-11-20 08:29:56', 'https://scholar.google.com/citations?user=VOWdBRMAAAAJ&hl', '', '', 'https://dblp.org/pid/33/5392-3.html', 'Yun Huang', 'University of illinois Urbana-Champaign', 'Professor', NULL, NULL, NULL, NULL),
(22, 'Heng', 'Ji', 2, 'hengji@illinois.edu', NULL, 'pending', '2023-11-20 08:29:56', '2023-11-20 08:29:56', 'https://scholar.google.com/citations?user=z7GCqT4AAAAJ&hl', '', '', '', 'Heng Ji', 'University of illinois Urbana-Champaign', 'Professor', NULL, NULL, NULL, NULL),
(23, 'Windi', 'Krok', 2, 'wkrok@purdue.edu', '7654943820', 'pending', '2023-11-20 08:29:56', '2023-11-20 08:29:56', 'https://scholar.google.com/citations?user=olwtKC0AAAAJ&hl', '', 'https://openalex.org/A5083556811', '', 'Windi Krok', 'Purdue University', 'Professor', NULL, NULL, NULL, NULL),
(24, 'Hedda', 'Meadan', 2, 'meadan@illinois.edu', '2173330260', 'approved', '2023-11-20 08:29:56', '2023-11-20 08:29:56', 'https://scholar.google.com/citations?user=uqJ5NRIAAAAJ&hl', '', 'https://openalex.org/A5063755483', '', 'Hedda Meadan', 'University of illinois Urbana-Champaign', 'Professor', NULL, NULL, NULL, NULL),
(25, 'Carol', 'Miller', 2, 'cam47@psu.edu', '8148656213', 'approved', '2023-11-20 08:29:56', '2023-11-20 08:29:56', 'https://scholar.google.com/citations?user=BUDJHoIAAAAJ&hl', '', 'https://openalex.org/A5072107775', '', 'Carol Miller', 'Penn State University', 'Professor', NULL, NULL, NULL, NULL),
(26, 'Abbie', 'Olszewski', 2, '', '7757844095', 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=TtswEQQAAAAJ&hl', '', 'https://openalex.org/A5021505064', '', 'Abbie Olszewski', 'Unknown', 'Professor', NULL, NULL, NULL, NULL),
(27, 'Mari', 'Ostendorf', 2, 'ostendor@ece.uw.edu', '2062215748', 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=exS-GecAAAAJ&hl', '', 'https://openalex.org/A5087215613', 'https://dblp.org/pid/85/2189.html', 'Mari Ostendorf', 'University of Washington', 'Professor', NULL, NULL, NULL, 'Mari Ostendorf'),
(28, 'Alexander', 'Rush', 2, '', NULL, 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=LIjnUGgAAAAJ&hl', '', 'https://openalex.org/A5085355324', 'https://dblp.org/pid/67/9012.html', 'Alexander Rush', 'Unknown', 'Professor', NULL, NULL, NULL, 'Alexander Rush'),
(29, 'Humphrey', 'Shi', 2, 'hshi3@uoregon.edu', NULL, 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=WBvt5A8AAAAJ&hl', '', 'https://openalex.org/A5002072267', 'https://dblp.org/pid/176/5516.html', 'Humphrey Shi', 'University of Oregon', 'Professor', NULL, NULL, NULL, 'Humphrey Shi'),
(30, 'Hariharan', 'Subramonyam', 2, 'harihars@stanford.edu', NULL, 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=xG3wqvEAAAAJ&hl', '', 'https://openalex.org/A5072561188', 'https://dblp.org/pid/161/3607.html', 'Hariharan Subramonyam', 'Stanford University', 'Professor', NULL, NULL, NULL, 'Hariharan Subramonyam'),
(31, 'Nigel', 'Ward', 2, 'nigelward@acm.org', '9157476827', 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=ncnkwCMAAAAJ&hl', '', 'https://openalex.org/A5039116422', 'https://dblp.org/pid/75/2130.html', 'Nigel Ward', 'Unknown', 'Professor', NULL, NULL, NULL, NULL),
(32, 'Junsong', 'Yuan', 2, 'jsyuan@buffalo.edu', '7166450562', 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=fJ7seq0AAAAJ&hl', '', 'https://openalex.org/A5073567796', 'https://dblp.org/pid/42/3332.html', 'Junsong Yuan', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Junsong Yuan'),
(33, 'Shaofeng', 'Zou', 2, 'szou3@buffalo.edu', '7166451053', 'approved', '2023-11-20 08:36:50', '2023-11-20 08:36:50', 'https://scholar.google.com/citations?user=abUmi6QAAAAJ&hl', '', 'https://openalex.org/A5012545205', 'https://dblp.org/pid/135/4981.html', 'Shaofeng Zou', 'University at Buffalo', 'Professor', NULL, NULL, NULL, 'Shaofeng Zou'),
(34, 'Dhaval', 'Patel', 2, 'dhavalja@buffa', '000000000', 'approved', '2023-11-20 08:36:50', '2023-12-04 19:39:41', NULL, NULL, NULL, NULL, 'Dhaval Patel', NULL, 'Student', 'password1', 'User', 'User', NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;