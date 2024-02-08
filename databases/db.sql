CREATE TABLE `admins` (
  `adminID` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`adminID`),
  UNIQUE KEY `adminID_UNIQUE` (`adminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `deadlines` (
  `id` char(8) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `submissionMonth` date DEFAULT NULL,
  `deadlineDateTime` varchar(45) DEFAULT NULL,
  `createdBy` varchar(256) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedBy` varchar(255) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `events` (
  `id` char(8) NOT NULL,
  `title` varchar(256) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `eventDateTime` datetime DEFAULT NULL,
  `createdBy` varchar(256) DEFAULT NULL,
  `modifiedDate` varchar(256) DEFAULT NULL,
  `modifiedBy` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` char(8) NOT NULL,
  `type` varchar(100) NOT NULL,
  `imageURL` varchar(255) NOT NULL,
  `createdBy` varchar(256) NOT NULL,
  `createdDate` datetime NOT NULL,
  `modifiedBy` varchar(256) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `news` (
  `id` char(8) NOT NULL,
  `title` varchar(256) NOT NULL,
  `createdDate` datetime NOT NULL,
  `url` varchar(256) DEFAULT NULL,
  `description` varchar(256) NOT NULL,
  `createdBy` varchar(256) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `modifiedBy` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `member` (
  `memberID` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`memberID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

INSERT INTO `member` (`memberID`, `password`) VALUES
('Member', 'Dhaval');


CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` char(8) NOT NULL,
  `type` varchar(100) NOT NULL,
  `fileURL` varchar(255) NOT NULL,
  `createdBy` varchar(256) NOT NULL,
  `createdDate` datetime NOT NULL,
  `modifiedBy` varchar(256) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `reports` (
  `id` char(8) NOT NULL,
  `title` varchar(256) NOT NULL,
  `createdDate` datetime NOT NULL,
  `type` varchar(256) DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL,
  `createdBy` varchar(256) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `modifiedBy` varchar(256) DEFAULT NULL,
  `submissionTitle` varchar(255),
  `submissionStatus` varchar(50),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `deadlines` (
  `id` char(8) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `submissionMonth` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `deadlineDateTime` varchar(45) DEFAULT NULL,
  `createdBy` varchar(256) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedBy` varchar(255) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
