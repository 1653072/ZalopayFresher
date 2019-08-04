-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 04, 2019 at 08:11 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rps`
--
CREATE DATABASE IF NOT EXISTS `rps` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `rps`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `username` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`username`, `password`) VALUES
('cattran', '$2a$10$27wzxL.fZBXCr6KWOK6KP.Qod.mIDACPLVGU/QGh6AW8lzWdnvfz6'),
('duythanh', '$2a$10$hJzZsDjVkrVzULgrz5semuhdtc9M2bL6mx.zQIqrcKOgwn.oca09.'),
('minhan', '$2a$10$NZ99n5EfZuMs9c8OfgLO4Owmx51jmumn2jmWl4VRSbSlJ9rNMvr8e'),
('ngocvo', '$2a$10$6BpS3jzhQ9KpCJNZNKGLjuTpEF132rz96rPTRpY0kx.BA3Fev0CJi'),
('quoctk', '$2a$10$ZDK7v53iAJk6LvgcVDKA2eXwmF/a4LsMeS2rbUL/w9irDStM1Qm8u'),
('trankienquoc', '$2a$10$Heq9x1x8JSd1TbSzmgEInuGvXD1BdJu1LtbeS6zKRDI1nYfYKbUiO');

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `startDate` datetime NOT NULL,
  `gameResult` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `username`, `startDate`, `gameResult`) VALUES
(19, 'quoctk', '2019-08-02 01:10:59', 1),
(20, 'quoctk', '2019-08-02 01:12:49', 0),
(21, 'minhan', '2019-08-02 10:24:57', 0),
(22, 'minhan', '2019-08-02 10:25:00', 0),
(23, 'minhan', '2019-08-02 10:25:01', 1),
(24, 'minhan', '2019-08-02 10:25:02', 0),
(25, 'minhan', '2019-08-02 10:25:02', 0),
(26, 'minhan', '2019-08-02 10:25:09', 0),
(27, 'ngocvo', '2019-08-02 10:26:17', 1),
(28, 'ngocvo', '2019-08-02 10:27:03', 0),
(29, 'ngocvo', '2019-08-02 10:27:05', 0),
(30, 'ngocvo', '2019-08-02 10:27:06', 1),
(31, 'trankienquoc', '2019-08-02 10:27:40', 0),
(32, 'trankienquoc', '2019-08-02 10:27:41', 1),
(33, 'trankienquoc', '2019-08-02 10:27:41', 1),
(34, 'trankienquoc', '2019-08-02 10:27:43', 0),
(35, 'trankienquoc', '2019-08-02 10:28:22', 1),
(36, 'trankienquoc', '2019-08-02 13:00:53', 0),
(37, 'quoctk', '2019-08-02 15:47:42', 0),
(38, 'quoctk', '2019-08-02 15:48:27', 1),
(39, 'quoctk', '2019-08-02 15:51:46', 0),
(40, 'quoctk', '2019-08-02 15:53:25', 0),
(41, 'cattran', '2019-08-03 01:30:16', 1),
(42, 'cattran', '2019-08-03 01:31:27', 1),
(43, 'cattran', '2019-08-03 01:32:35', 0),
(44, 'quoctk', '2019-08-03 01:36:27', 0),
(45, 'cattran', '2019-08-04 14:43:06', 0),
(46, 'cattran', '2019-08-04 14:43:59', 1),
(47, 'cattran', '2019-08-04 14:44:32', 1),
(48, 'cattran', '2019-08-04 14:46:14', 0);

-- --------------------------------------------------------

--
-- Table structure for table `gameturns`
--

DROP TABLE IF EXISTS `gameturns`;
CREATE TABLE IF NOT EXISTS `gameturns` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `gameID` bigint(20) NOT NULL,
  `userResult` tinyint(1) NOT NULL,
  `machineResult` tinyint(1) NOT NULL,
  `turnType` tinyint(1) NOT NULL,
  `turnDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`gameID`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `gameturns`
--

INSERT INTO `gameturns` (`id`, `gameID`, `userResult`, `machineResult`, `turnType`, `turnDate`) VALUES
(6, 19, 1, 1, 1, '2019-08-02 01:10:59'),
(7, 19, 1, 0, 0, '2019-08-02 01:11:43'),
(8, 20, 1, 2, 0, '2019-08-02 01:12:49'),
(9, 21, 1, 2, 0, '2019-08-02 10:24:57'),
(10, 22, 1, 2, 0, '2019-08-02 10:25:00'),
(11, 23, 1, 1, 1, '2019-08-02 10:25:01'),
(12, 23, 1, 0, 0, '2019-08-02 10:25:01'),
(13, 24, 1, 2, 0, '2019-08-02 10:25:02'),
(14, 25, 1, 2, 0, '2019-08-02 10:25:02'),
(15, 26, 1, 1, 1, '2019-08-02 10:25:09'),
(16, 26, 1, 1, 1, '2019-08-02 10:26:15'),
(17, 26, 1, 2, 0, '2019-08-02 10:26:16'),
(18, 27, 1, 1, 1, '2019-08-02 10:26:17'),
(19, 27, 1, 0, 0, '2019-08-02 10:26:18'),
(20, 28, 1, 1, 1, '2019-08-02 10:27:03'),
(21, 28, 1, 2, 0, '2019-08-02 10:27:04'),
(22, 29, 1, 2, 0, '2019-08-02 10:27:05'),
(23, 30, 1, 0, 0, '2019-08-02 10:27:06'),
(24, 31, 1, 1, 1, '2019-08-02 10:27:40'),
(25, 31, 1, 2, 0, '2019-08-02 10:27:40'),
(26, 32, 1, 0, 0, '2019-08-02 10:27:41'),
(27, 33, 1, 1, 1, '2019-08-02 10:27:41'),
(28, 33, 1, 0, 0, '2019-08-02 10:27:42'),
(29, 34, 1, 1, 1, '2019-08-02 10:27:43'),
(30, 34, 1, 1, 1, '2019-08-02 10:27:43'),
(31, 34, 1, 1, 1, '2019-08-02 10:27:44'),
(32, 34, 1, 1, 1, '2019-08-02 10:28:16'),
(33, 34, 1, 1, 1, '2019-08-02 10:28:20'),
(34, 34, 1, 2, 0, '2019-08-02 10:28:21'),
(35, 35, 1, 0, 0, '2019-08-02 10:28:22'),
(36, 36, 2, 0, 0, '2019-08-02 13:00:53'),
(37, 37, 1, 2, 0, '2019-08-02 15:47:42'),
(38, 38, 1, 0, 0, '2019-08-02 15:48:27'),
(39, 39, 1, 1, 1, '2019-08-02 15:51:46'),
(40, 39, 1, 2, 0, '2019-08-02 15:52:12'),
(41, 40, 1, 2, 0, '2019-08-02 15:53:25'),
(42, 41, 1, 0, 0, '2019-08-03 01:30:16'),
(43, 42, 1, 1, 1, '2019-08-03 01:31:27'),
(44, 42, 1, 0, 0, '2019-08-03 01:31:35'),
(45, 43, 1, 2, 0, '2019-08-03 01:32:35'),
(46, 44, 1, 1, 1, '2019-08-03 01:36:27'),
(47, 45, 0, 0, 1, '2019-08-04 14:43:06'),
(48, 45, 0, 1, 0, '2019-08-04 14:43:18'),
(49, 46, 0, 2, 0, '2019-08-04 14:43:59'),
(50, 47, 0, 0, 1, '2019-08-04 14:44:32'),
(51, 47, 0, 0, 1, '2019-08-04 14:44:44'),
(52, 47, 0, 2, 0, '2019-08-04 14:44:53'),
(53, 48, 0, 0, 1, '2019-08-04 14:46:14'),
(54, 48, 0, 0, 1, '2019-08-04 14:46:15'),
(55, 48, 0, 1, 0, '2019-08-04 14:46:16');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `FK_GameUser_AccUser` FOREIGN KEY (`username`) REFERENCES `accounts` (`username`);

--
-- Constraints for table `gameturns`
--
ALTER TABLE `gameturns`
  ADD CONSTRAINT `FK_GameTurnID_GameID` FOREIGN KEY (`gameID`) REFERENCES `games` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
