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
	(2, 'Course Card', 'course-card', '<div class="card">\n  <img class="card-img-top" src="{{ img_src }}" alt="Card image cap">\n  <div class="card-body">\n  <h5 class="card-title">{{ title }}</h5>\n  </div>\n  <div class="card-footer d-flex justify-content-between">\n  	<div>\n    	{{ attendants|default(0) }} <i class="fas fa-users"></i>\n        {{ stars|default(0) }} <i class="fas fa-star"></i>\n    </div>\n    <div class="rating">    \n    	{% for i in range(1, 5) %}\n        	<i class="{{ i <= rating ? \'fas\' : \'far\' }} fa-star"></i>        \n        {% endfor %}\n    </div>\n  </div>\n</div>', 'active', '2020-06-23 20:50:53', '2020-06-23 20:50:53');
/*!40000 ALTER TABLE `codeblock` ENABLE KEYS */;

-- Dumping structure for table npress.comment
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.file: ~22 rows (approximately)
DELETE FROM `file`;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` (`id`, `name`, `uri`, `type`, `html_title`, `html_alt`, `status`, `created_at`, `updated_at`) VALUES
	(1, '8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg', '/uploads/8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg', 'image/jpeg', '', '', 'active', '2020-06-22 22:39:31', '2020-06-22 22:39:31'),
	(2, 'zovu css.txt', '/uploads/zovu css.txt', 'text/plain', '', '', 'active', '2020-06-22 23:26:56', '2020-06-22 23:26:56'),
	(3, 'poze playform.txt', '/uploads/poze playform.txt', 'text/plain', '', '', 'active', '2020-06-22 23:26:59', '2020-06-22 23:26:59'),
	(4, 'logo.png', '/uploads/logo.png', 'image/png', '', '', 'active', '2020-06-23 19:41:17', '2020-06-23 19:41:17'),
	(5, 'pexels-photo-448877.jpeg', '/uploads/pexels-photo-448877.jpeg', 'image/jpeg', '', '', 'active', '2020-06-23 19:52:30', '2020-06-23 19:52:30'),
	(6, 'pexels-photo-716276.jpeg', '/uploads/pexels-photo-716276.jpeg', 'image/jpeg', '', '', 'active', '2020-06-23 19:52:30', '2020-06-23 19:52:30'),
	(7, 'blog-5-450x445.jpg', '/uploads/blog-5-450x445.jpg', 'image/jpeg', '', '', 'active', '2020-06-23 22:34:44', '2020-06-23 22:34:44'),
	(8, 'pexels-photo-301920.jpeg', '/uploads/pexels-photo-301920.jpeg', 'image/jpeg', '', '', 'active', '2020-06-25 14:41:38', '2020-06-25 14:41:38'),
	(9, 'book-4.jpg', '/uploads/book-4.jpg', 'image/jpeg', '', '', 'active', '2020-06-25 15:19:00', '2020-06-25 15:19:00'),
	(10, 'team5-8-480x300.jpg', '/uploads/team5-8-480x300.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 16:43:42', '2020-06-28 16:43:42'),
	(11, 'team3-8-480x300.jpg', '/uploads/team3-8-480x300.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 16:43:44', '2020-06-28 16:43:44'),
	(12, 'team6-480x300.jpg', '/uploads/team6-480x300.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 16:43:46', '2020-06-28 16:43:46'),
	(13, 'larozse-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', '/uploads/larozse-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', 'image/png', '', '', 'active', '2020-06-28 17:21:25', '2020-06-28 17:21:25'),
	(14, 'bolier-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', '/uploads/bolier-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', 'image/png', '', '', 'active', '2020-06-28 17:21:27', '2020-06-28 17:21:27'),
	(15, 'mapmaster-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', '/uploads/mapmaster-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', 'image/png', '', '', 'active', '2020-06-28 17:21:29', '2020-06-28 17:21:29'),
	(16, 'darkside-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', '/uploads/darkside-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', 'image/png', '', '', 'active', '2020-06-28 17:21:31', '2020-06-28 17:21:31'),
	(17, 'madrin-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', '/uploads/madrin-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png', 'image/png', '', '', 'active', '2020-06-28 17:21:33', '2020-06-28 17:21:33'),
	(18, 'pexels-photo-108148.jpeg', '/uploads/pexels-photo-108148.jpeg', 'image/jpeg', '', '', 'active', '2020-06-28 18:04:23', '2020-06-28 18:04:23'),
	(19, 'pexels-photo-374016.jpeg', '/uploads/pexels-photo-374016.jpeg', 'image/jpeg', '', '', 'active', '2020-06-28 18:04:23', '2020-06-28 18:04:23'),
	(20, 'blog-5.jpg', '/uploads/blog-5.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 18:04:23', '2020-06-28 18:04:23'),
	(21, 'hands-people-woman-working.jpg', '/uploads/hands-people-woman-working.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 18:04:23', '2020-06-28 18:04:23'),
	(22, 'blog-4.jpg', '/uploads/blog-4.jpg', 'image/jpeg', '', '', 'active', '2020-06-28 18:04:23', '2020-06-28 18:04:23');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;

-- Dumping structure for table npress.menu
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table npress.menu_item: ~1 rows (approximately)
DELETE FROM `menu_item`;
/*!40000 ALTER TABLE `menu_item` DISABLE KEYS */;
INSERT INTO `menu_item` (`id`, `menu_id`, `parent_id`, `order`, `label`, `slug`, `url`, `status`, `created_at`, `updated_at`) VALUES
	(3, 1, 0, 0, 'Home', 'home', '/home', 'active', '2020-06-28 18:34:22', '2020-06-28 18:34:22');
/*!40000 ALTER TABLE `menu_item` ENABLE KEYS */;

-- Dumping structure for table npress.migrations
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
	(1, 'Home', '/home', '<div class="container mb-5">\n    <h2>Popular courses</h2>\n    <div class="row">\n        <div class="col-12">\n            <div class="carousel slide" data-ride="carousel" data-interval="20000">\n              <div class="carousel-inner">\n                <div class="carousel-item">\n                    <div class="row">\n                        <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants="2" stars="1" rating="4" title="Sample course"]]</div>\n                        <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants="4" stars="1" rating="5" title="Sample"]]</div>\n                        <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" title="Sample"]]</div>\n                    </div>\n                </div>\n                <div class="carousel-item active">\n                    <div class="row">\n                      <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=2 stars=1 title="Sample"]]</div>\n                        <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" attendants=4 stars=1 title="Sample"]]</div>\n                        <div class="col-4">[[course-card img_src="/uploads/blog-5-450x445.jpg" title="Sample"]]</div>\n                    </div>\n                </div>    \n              </div>\n              <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">\n                \n                <span class="sr-only">Previous</span>\n              </a>\n              <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">\n                \n                <span class="sr-only">Next</span>\n              </a>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="achievements py-5 text-white text-center font-weight-bold">\n    <h2 class="font-weight-bold">CENTER ACHIEVEMENTS</h2>\n    <p>Here you can review some statistics about our Education Center</p>\n    <div class="row mt-5">\n        <div class="col-sm">\n            <span class="d-block text-warning">10,328</span>\n            FOREIGN FOLLOWERS\n        </div>\n        <div class="col-sm">\n            <span class="d-block text-warning">549</span>\n            CLASSES COMPLETE\n        </div>\n        <div class="col-sm">\n            <span class="d-block text-warning">6,789</span>\n            STUDENTS ENROLLED\n        </div>\n    </div>\n</div>\n<div class="bg-light py-5 mb-5">\n<div class="container">\n        <div class="row">\n            <div class="col-sm">\n                <img class="img-fluid" src="/uploads/book-4.jpg">\n            </div>\n            <div class="col-sm d-flex align-items-center">\n                <div>\n                    <h2 class="font-weight-bold">HIGH QUALITY EDUCATION</h2>\n                    <p>Dis class porro pretium dignissimos veritatis, nostrud natus curae, animi diamlorem? Netus, quia mus, proident quaerat iaculis nascetur sodales, vulputate, sequi mollitia class repellat, aliquip aliquid. Justo iste veniam amet,\n        </p>\n    </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="container mb-5">\n    <h2 class="font-weight-bold">Top courses</h2>\n    <a href="#">View all</a>\n    <div class="row mt-4">\n        <div class="col-sm">\n            <a href="#" class="d-block course-holder">\n            <span class="course-bg" style="background-image: url(/uploads/pexels-photo-374016.jpeg)"></span>\n            <span class="course-info">Getting started</span>\n            </a>\n        </div>\n        <div class="col-sm mt-4 mt-sm-0">\n            <div class="row">\n                <div class="col-6">\n                    <a href="#" class="d-block course-holder">\n                    <span class="course-bg" style="background-image: url(/uploads/pexels-photo-108148.jpeg)"></span>\n                    <span class="course-info">Photography Fundamentals</span>\n                    </a>\n                </div>\n                <div class="col-6">\n                    <a href="#" class="d-block course-holder">\n                    <span class="course-bg" style="background-image: url(/uploads/blog-5.jpg)"></span>\n                    <span class="course-info">Affiliate Marketing</span>\n                    </a>\n                </div>\n                <div class="col-6">\n                    <a href="#" class="d-block course-holder mt-4">\n                    <span class="course-bg" style="background-image: url(/uploads/hands-people-woman-working.jpg)"></span><span class="course-info">The Complete HTML5/CSS3</span>\n                </a></div>\n                <div class="col-6">\n                    <a href="#" class="d-block course-holder mt-4">\n                    <span class="course-bg" style="background-image: url(/uploads/blog-4.jpg)"></span>\n                    <span class="course-info">Become a SEO Master</span></a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="bg-light py-5">\n    <div class="container">\n        <h2 class="font-weight-bold">Our Teachers</h2>\n        <div class="row">\n            <div class="col-sm">\n               <img src="/uploads/team5-8-480x300.jpg" class="img-fluid mb-3">\n               <h4>Peter Mendez</h4>\n               <p>Donec a felis sed ligula aliquet sollicitudin a in elit. Nunc at commodo erat, fringilla egestas tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.</p>\n               <a href="#">View details</a>\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/team3-8-480x300.jpg" class="img-fluid mb-3">\n               <h4>Sarah Johnson</h4>\n               <p>Donec a felis sed ligula aliquet sollicitudin a in elit. Nunc at commodo erat, fringilla egestas tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.</p>\n               <a href="#">View details</a>\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/team6-480x300.jpg" class="img-fluid mb-3">\n               <h4>Harry Kane</h4>\n               <p>Donec a felis sed ligula aliquet sollicitudin a in elit. Nunc at commodo erat, fringilla egestas tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.</p>\n               <a href="#">View details</a>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="what-will-you-learn bg-secondary py-5 text-white">\n    <div class="container">\n        <h2 class="font-weight-bold">WHAT WILL YOU LEARN</h2>\n        <div class="row text-center">\n           <div class="col-sm">\n               <div class="bg-primary py-5 my-2">\n                   <i class="fas fa-lightbulb d-block mb-3"></i>\n                   Logical Idea\n               </div>\n           </div>\n           <div class="col-sm">\n               <div class="bg-info py-5 my-2">\n                   <i class="fas fa-globe d-block mb-3"></i>\n                   Web development\n               </div>\n           </div>\n           <div class="col-sm">\n               <div class="bg-success py-5 my-2">\n                   <i class="fas fa-random d-block mb-3"></i>\n                   Social Marketing\n               </div>\n           </div>\n           <div class="col-sm">\n               <div class="bg-warning py-5 my-2">\n                   <i class="fas fa-laptop d-block mb-3"></i>\n                   Graphic &amp; Design\n               </div>\n           </div>\n           <div class="col-sm">\n               <div class="bg-danger py-5 my-2">\n                   <i class="fas fa-money-bill-alt d-block mb-3"></i>\n                   Business &amp; Finance\n               </div>\n           </div>\n        </div>\n    </div>\n</div>\n<div class="py-5">\n    <div class="container">\n        <h2 class="font-weight-bold">Our partners</h2>\n        <div class="row">\n            <div class="col-sm">\n               <img src="/uploads/larozse-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/bolier-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/mapmaster-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n            <div class="col-sm">\n               <img src="/uploads/larozse-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/bolier-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n            <div class="col-sm">\n                <img src="/uploads/mapmaster-nq4e6i9q73t7ji58wdo2xdpg98xnq2yq4m6cd6afoc.png" class="img-fluid">\n            </div>\n        </div>\n    </div>\n</div>', 'header .carousel-item h2{\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%,-50%);\n  color: #fff;\n  z-index: 1;\n}\n@media (max-width: 767px){\n  header .carousel-item h2{\n    font-size: 1.5rem\n  }\n}\nheader .carousel-item img{\n  max-height: 100vh;\n  object-fit: cover;\n}\n.benefit-box{\n  margin-top: -30px;\n}\n.benefit-box .fas{\n   font-size: 56px;\n}\n.achievements{\n  padding-left: 2rem;\n  padding-right: 2rem;\n  background-image: url(/uploads/pexels-photo-301920.jpeg);\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-attachment: fixed;\n}\n.achievements .text-warning{\n  font-size: 32px;\n}\n.what-will-you-learn i{\n    font-size: 32px;\n}\n.course-bg{\n  height: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    display: block;\n    background-size: cover;\n    background-repeat: no-repeat;\n    background-position: center;\n    width: calc(100% + 40px);\n    max-width: none;\n    min-height: 100.6%;\n}\n.course-info{\n  position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    color: #fff;\n    text-align: center;\n    padding-top: 15px;\n    padding-bottom: 15px;\n    background: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, 0.8)), to(transparent));\n    background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0, transparent 100%);\n    border-bottom-left-radius: 4px;\n    border-bottom-right-radius: 4px;\n}\n.course-holder{\n  position: relative;\n    padding-bottom: 65%;\n    background-color: #495057;\n    overflow: hidden;\n    border-radius: 0;\n}', '', '', '', '', '', 1, 1, 0, '', 1, 1, '<div class="carousel slide" data-ride="carousel" data-interval="10000">\n  <div class="carousel-inner">\n    <div class="carousel-item active">\n      <h2>E-Learning</h2>\n      <img class="d-block w-100" src=" /uploads/pexels-photo-716276.jpeg" alt="Second slide" />\n    </div>\n    <div class="carousel-item">\n      <h2>Welcome to Education</h2>\n      <img class="d-block w-100" src="/uploads/pexels-photo-448877.jpeg" alt="First slide" />\n    </div>    \n  </div>\n  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">\n    <span class="carousel-control-prev-icon" aria-hidden="true"></span>\n    <span class="sr-only">Previous</span>\n  </a>\n  <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">\n    <span class="carousel-control-next-icon" aria-hidden="true"></span>\n    <span class="sr-only">Next</span>\n  </a>\n</div>\n    <div class="benefit-box container text-white mb-5">\n      <div class="row">\n        <div class="col-sm bg-success px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n              <h3>Courses Online</h3>\n              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n            </div>\n            <i class="fas fa-graduation-cap"></i>\n          </div>\n        </div>\n        <div class="col-sm bg-warning px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n          <h3>Apply Now</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class="fas fa-trophy"></i>\n          </div>\n        </div>\n        <div class="col-sm bg-primary px-5 py-3">\n          <div class="d-flex align-items-center">\n            <div>\n          <h3>Certified Teachers</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class="fas fa-pencil-alt"></i>\n          </div>\n        </div>\n      </div>\n    </div>', 'active', '2021-01-31 02:00:00', '2020-06-22 22:38:22'),
	(2, 'Another sample page', '/another-sample-page', '<h2>Another sample page h2</h2><h3>Another sample page h3</h3><p>Another sample page first paragraph</p>', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, NULL, 0, 0, NULL, 'active', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;

-- Dumping structure for table npress.setting
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
	(10, 'site_width', 'container-fluid', '[{"label":"Full width","value":"container-fluid"},{"label":"Boxed","value":"container"}]', 'Site width', 'Full width or boxed', 'active', 'select', '2020-06-22 22:38:22', '2020-06-22 22:38:22');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;

-- Dumping structure for table npress.user
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
