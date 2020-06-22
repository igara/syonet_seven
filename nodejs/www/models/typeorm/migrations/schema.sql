CREATE TABLE `auth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sns_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c9a7bc90e53c61cb4c76101e19` (`type`,`sns_id`),
  KEY `IDX_e95ea875418d2fd7541093cedc` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `access_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `auth_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_70ba8f6af34bc924fc9e12adb8` (`token`),
  KEY `FK_3e411496f864032d6c8c3997d8b` (`auth_id`),
  CONSTRAINT `FK_3e411496f864032d6c8c3997d8b` FOREIGN KEY (`auth_id`) REFERENCES `auth` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
