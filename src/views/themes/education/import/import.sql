-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.11 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table npress.codeblock
DROP TABLE IF EXISTS `codeblock`;
CREATE TABLE IF NOT EXISTS `codeblock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_88c8731f45a50f1c39a2917b3a5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.codeblock: ~2 rows (approximately)
DELETE FROM `codeblock`;
/*!40000 ALTER TABLE `codeblock` DISABLE KEYS */;
INSERT INTO `codeblock` (`id`, `name`, `slug`, `content`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'My first code block', 'my-first-code-block', '<p>My first code block content</p>', 'active', '2020-06-22 22:38:23', '2020-06-22 22:38:23'),
	(2, 'Course Card', 'course-card', '<div class="card">\n  <img class="card-img-top" src="{{ img_src }}" alt="Card image cap">\n  <div class="card-body">\n  <h5 class="card-title">{{ title }}</h5>\n  </div>\n  <div class="card-footer d-flex justify-content-between">\n  	<div>\n    	{{ attendants|default(0) }} <i class="fas fa-users"></i>\n        {{ stars|default(0) }} <i class="fas fa-star"></i>\n    </div>\n    <div class="rating">    \n        <i class="far fa-star"></i> <i class="far fa-star"></i> <i class="far fa-star"></i> <i class="far fa-star"></i> <i class="far fa-star"></i>\n    </div>\n  </div>\n</div>', 'active', '2020-06-23 20:50:53', '2020-06-23 20:50:53');
/*!40000 ALTER TABLE `codeblock` ENABLE KEYS */;

-- Dumping structure for table npress.comment
DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `author_name` varchar(255) NOT NULL,
  `author_email` varchar(255) NOT NULL,
  `content` text,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_3b52abe435455a9c92a856baf76` (`page_id`),
  CONSTRAINT `FK_3b52abe435455a9c92a856baf76` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.comment: ~1 rows (approximately)
DELETE FROM `comment`;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` (`id`, `page_id`, `parent_id`, `author_name`, `author_email`, `content`, `status`, `created_at`, `updated_at`) VALUES
	(1, 1, 0, 'Comment title', 'comment_author@npress.com', 'My first comment', 'active', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;

-- Dumping structure for table npress.file
DROP TABLE IF EXISTS `file`;
CREATE TABLE IF NOT EXISTS `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `type` varchar(128) NOT NULL,
  `html_title` text,
  `html_alt` text,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_89b4fe084a7f36a2ddf04cc427f` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.file: ~7 rows (approximately)
DELETE FROM `file`;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` (`id`, `name`, `uri`, `type`, `html_title`, `html_alt`, `status`, `created_at`, `updated_at`) VALUES
	(1, '8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg', '/uploads/8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg', 'image/jpeg', '', '', 'active', '2020-06-22 22:39:31', '2020-06-22 22:39:31'),
	(2, 'zovu css.txt', '/uploads/zovu css.txt', 'text/plain', '', '', 'active', '2020-06-22 23:26:56', '2020-06-22 23:26:56'),
	(3, 'poze playform.txt', '/uploads/poze playform.txt', 'text/plain', '', '', 'active', '2020-06-22 23:26:59', '2020-06-22 23:26:59'),
	(4, 'logo.png', '/uploads/logo.png', 'image/png', '', '', 'active', '2020-06-23 19:41:17', '2020-06-23 19:41:17'),
	(5, 'pexels-photo-448877.jpeg', '/uploads/pexels-photo-448877.jpeg', 'image/jpeg', '', '', 'active', '2020-06-23 19:52:30', '2020-06-23 19:52:30'),
	(6, 'pexels-photo-716276.jpeg', '/uploads/pexels-photo-716276.jpeg', 'image/jpeg', '', '', 'active', '2020-06-23 19:52:30', '2020-06-23 19:52:30'),
	(7, 'blog-5-450x445.jpg', '/uploads/blog-5-450x445.jpg', 'image/jpeg', '', '', 'active', '2020-06-23 22:34:44', '2020-06-23 22:34:44');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;

-- Dumping structure for table npress.menu
DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `is_default` int(1) NOT NULL DEFAULT '0',
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.menu: ~1 rows (approximately)
DELETE FROM `menu`;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` (`id`, `name`, `slug`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'My First Menu', 'first-menu', 1, 'active', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

-- Dumping structure for table npress.menu_item
DROP TABLE IF EXISTS `menu_item`;
CREATE TABLE IF NOT EXISTS `menu_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `order` int(11) NOT NULL DEFAULT '0',
  `label` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.menu_item: ~2 rows (approximately)
DELETE FROM `menu_item`;
/*!40000 ALTER TABLE `menu_item` DISABLE KEYS */;
INSERT INTO `menu_item` (`id`, `menu_id`, `parent_id`, `order`, `label`, `slug`, `url`, `status`, `created_at`, `updated_at`) VALUES
	(1, 1, 0, 0, 'Sample page', 'sample-page', '/sample-page', 'active', '2020-06-22 22:38:23', '2020-06-22 22:38:23'),
	(2, 1, 1, 0, 'Another sample page', 'another-sample-page', '/another-sample-page', 'active', '2020-06-22 22:38:23', '2020-06-22 22:38:23');
/*!40000 ALTER TABLE `menu_item` ENABLE KEYS */;

-- Dumping structure for table npress.migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.migrations: ~1 rows (approximately)
DELETE FROM `migrations`;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
	(1, 1564669039537, 'Tables1564669039537');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

-- Dumping structure for table npress.page
DROP TABLE IF EXISTS `page`;
CREATE TABLE IF NOT EXISTS `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `content` text,
  `custom_css` text,
  `custom_js` text,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keywords` text,
  `seo_description` text,
  `seo_robots` varchar(255) DEFAULT NULL,
  `show_comment_section` int(1) NOT NULL DEFAULT '1',
  `show_comment_form` int(1) NOT NULL DEFAULT '1',
  `show_sidebar` int(1) NOT NULL DEFAULT '1',
  `sidebar_content` text,
  `is_homepage` int(1) NOT NULL DEFAULT '0',
  `header_full_width` int(1) NOT NULL DEFAULT '0',
  `header_content` text,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_3e65301a379e6ca2c468c700aa9` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.page: ~2 rows (approximately)
DELETE FROM `page`;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` (`id`, `title`, `uri`, `content`, `custom_css`, `custom_js`, `seo_title`, `seo_keywords`, `seo_description`, `seo_robots`, `show_comment_section`, `show_comment_form`, `show_sidebar`, `sidebar_content`, `is_homepage`, `header_full_width`, `header_content`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'Sample page', '/sample-page', '<h2>Popular courses</h2>\n<div class="row">\n    <div class="col-12">\n        <div class="carousel slide" data-ride="carousel" data-interval="10000">\n          <div class="carousel-inner">\n            <div class="carousel-item active">\n                <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=2 stars=1 title="Sample"]]</div>\n                <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=4 stars=1 title="Sample"]]</div>\n                <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" title="Sample"]]</div>\n            </div>\n            <div class="carousel-item">\n              <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=2 stars=1 title="Sample"]]</div>\n                <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=4 stars=1 title="Sample"]]</div>\n                <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" title="Sample"]]</div>\n            </div>    \n          </div>\n          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">\n            \n            <span class="sr-only">Previous</span>\n          </a>\n          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">\n            \n            <span class="sr-only">Next</span>\n          </a>\n        </div>\n    </div>\n</div>', '.carousel{\n  height: 700px;\n  overflow: hidden;\n}\n.carousel-item h2{\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%,-50%);\n  color: #fff;\n  z-index: 1;\n}\n.carousel-item img{\n  transform: translateY(-25%);\n}\n.benefit-box{\n  margin-top: -30px;\n}\n.benefit-box .fas{\n   font-size: 56px;\n}', '', '', '', '', '', 1, 1, 0, '', 1, 1, '<div class="carousel slide" data-ride="carousel" data-interval="10000">\n  <div class="carousel-inner">\n    <div class="carousel-item active">\n      <h2>E-Learning</h2>\n      <img class="d-block w-100" src=" /uploads/pexels-photo-716276.jpeg" alt="Second slide" />\n    </div>\n    <div class="carousel-item">\n      <h2>Welcome to Education</h2>\n      <img class="d-block w-100" src="/uploads/pexels-photo-448877.jpeg" alt="First slide" />\n    </div>    \n  </div>\n  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">\n    <span class="carousel-control-prev-icon" aria-hidden="true"></span>\n    <span class="sr-only">Previous</span>\n  </a>\n  <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">\n    <span class="carousel-control-next-icon" aria-hidden="true"></span>\n    <span class="sr-only">Next</span>\n  </a>\n</div>\n    <div class="benefit-box container text-white">\n      <div class="row">\n        <div class="col-4 bg-success px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n              <h3>Courses Online</h3>\n              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n            </div>\n            <i class="fas fa-graduation-cap"></i>\n          </div>\n        </div>\n        <div class="col-4 bg-warning px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n          <h3>Apply Now</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class="fas fa-trophy"></i>\n          </div>\n        </div>\n        <div class="col-4 bg-primary px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n          <h3>Certified Teachers</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class="fas fa-pencil-alt"></i>\n          </div>\n        </div>\n      </div>\n    </div>', 'active', '2021-01-31 02:00:00', '2020-06-22 22:38:22'),
	(2, 'Another sample page', '/another-sample-page', '<h2>Another sample page h2</h2><h3>Another sample page h3</h3><p>Another sample page first paragraph</p>', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, NULL, 0, 0, NULL, 'active', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;

-- Dumping structure for table npress.setting
DROP TABLE IF EXISTS `setting`;
CREATE TABLE IF NOT EXISTS `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(128) NOT NULL,
  `value` text NOT NULL,
  `options` text,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `status` varchar(16) NOT NULL,
  `input_type` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_1c4c95d773004250c157a744d6e` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.setting: ~10 rows (approximately)
DELETE FROM `setting`;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` (`id`, `key`, `value`, `options`, `name`, `description`, `status`, `input_type`, `created_at`, `updated_at`) VALUES
	(1, 'admin_email', 'admin@npress.com', NULL, 'Admin Email', 'Where to send notification emails', 'active', 'text', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(2, 'site_name', 'Education', 'null', 'Site Name', 'Will be displayed in case a logo is not set', 'active', 'text', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(3, 'site_logo', '/uploads/logo.png', 'null', 'Site Logo', 'Site Logo', 'active', 'image', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(4, 'active_theme', 'education', '[]', 'Active Theme', 'Active Theme', 'active', 'select', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(5, 'recaptcha_enabled', '0', 'null', 'Recaptcha Enabled', 'Recaptcha Enabled', 'active', 'checkbox', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(6, 'recaptcha_site_key', '', NULL, 'Recaptcha Site Key', 'Recaptcha Site Key', 'active', 'text', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(7, 'google_analytics_script', '', NULL, 'Google Analytics Script', 'Paste the code snippet here', 'active', 'textarea', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(8, 'recaptcha_secret_key', '', NULL, 'Recaptcha Secret Key', 'Recaptcha Secret Key', 'active', 'text', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(9, 'navbar_layout', 'logo-left-menu-right', '[{"label":"Logo left, menu right","value":"logo-left-menu-right"},{"label":"Logo right, menu left","value":"logo-right-menu-left"}]', 'Navbar layout', 'Navbar layout', 'active', 'select', '2020-06-22 22:38:22', '2020-06-22 22:38:22'),
	(10, 'site_width', 'container', '[{"label":"Full width","value":"container-fluid"},{"label":"Boxed","value":"container"}]', 'Site width', 'Full width or boxed', 'active', 'select', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;

-- Dumping structure for table npress.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_e12875dfb3b1d92d7d7c5377e22` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.user: ~1 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `email`, `password`, `salt`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'admin@npress.com', 'd21a3ebbd9dcd4af4003b2121615b056d2e1adcbd163a61284dff7fc1b0850d68b81e1ed2f897d61d4f74e9a7b481993b6449386d7ca9f46606e49e55a472877', '90136f0e500493e216fc27b097c79055', 'active', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
