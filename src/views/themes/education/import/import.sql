-- MySQL dump 10.17  Distrib 10.3.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: npress
-- ------------------------------------------------------
-- Server version	10.3.22-MariaDB-0+deb10u1

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
-- Table structure for table `codeblock`
--

DROP TABLE IF EXISTS `codeblock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `codeblock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_88c8731f45a50f1c39a2917b3a5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codeblock`
--

LOCK TABLES `codeblock` WRITE;
/*!40000 ALTER TABLE `codeblock` DISABLE KEYS */;
INSERT INTO `codeblock` VALUES (1,'My first code block','my-first-code-block','<p>My first code block content</p>','active','2020-06-22 22:38:23','2020-06-22 22:38:23'),(2,'Course Card','course-card','<div class=\"card\">\n  <img class=\"card-img-top\" src=\"{{ img_src }}\" alt=\"Card image cap\">\n  <div class=\"card-body\">\n  <h5 class=\"card-title\">{{ title }}</h5>\n  </div>\n  <div class=\"card-footer d-flex justify-content-between\">\n  	<div>\n    	{{ attendants|default(0) }} <i class=\"fas fa-users\"></i>\n        {{ stars|default(0) }} <i class=\"fas fa-star\"></i>\n    </div>\n    <div class=\"rating\">    \n    	{% for i in range(1, 5) %}\n        	<i class=\"{{ i <= rating ? \'fas\' : \'far\' }} fa-star\"></i>        \n        {% endfor %}\n    </div>\n  </div>\n</div>','active','2020-06-23 20:50:53','2020-06-23 20:50:53');
/*!40000 ALTER TABLE `codeblock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `author_name` varchar(255) NOT NULL,
  `author_email` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_3b52abe435455a9c92a856baf76` (`page_id`),
  CONSTRAINT `FK_3b52abe435455a9c92a856baf76` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,1,0,'Comment title','comment_author@npress.com','My first comment','active','2020-06-22 22:38:22','2020-06-22 22:38:22');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `type` varchar(128) NOT NULL,
  `html_title` text DEFAULT NULL,
  `html_alt` text DEFAULT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_89b4fe084a7f36a2ddf04cc427f` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,'8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg','/uploads/8ecc0262-92c8-4459-9b0e-ef0de283dd56.jpg','image/jpeg','','','active','2020-06-22 22:39:31','2020-06-22 22:39:31'),(2,'zovu css.txt','/uploads/zovu css.txt','text/plain','','','active','2020-06-22 23:26:56','2020-06-22 23:26:56'),(3,'poze playform.txt','/uploads/poze playform.txt','text/plain','','','active','2020-06-22 23:26:59','2020-06-22 23:26:59'),(4,'logo.png','/uploads/logo.png','image/png','','','active','2020-06-23 19:41:17','2020-06-23 19:41:17'),(5,'pexels-photo-448877.jpeg','/uploads/pexels-photo-448877.jpeg','image/jpeg','','','active','2020-06-23 19:52:30','2020-06-23 19:52:30'),(6,'pexels-photo-716276.jpeg','/uploads/pexels-photo-716276.jpeg','image/jpeg','','','active','2020-06-23 19:52:30','2020-06-23 19:52:30'),(7,'blog-5-450x445.jpg','/uploads/blog-5-450x445.jpg','image/jpeg','','','active','2020-06-23 22:34:44','2020-06-23 22:34:44'),(8,'pexels-photo-301920.jpeg','/uploads/pexels-photo-301920.jpeg','image/jpeg','','','active','2020-06-25 14:41:38','2020-06-25 14:41:38'),(9,'book-4.jpg','/uploads/book-4.jpg','image/jpeg','','','active','2020-06-25 15:19:00','2020-06-25 15:19:00');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `is_default` int(1) NOT NULL DEFAULT 0,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'My First Menu','first-menu',1,'active','2020-06-22 22:38:22','2020-06-22 22:38:22');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_item`
--

DROP TABLE IF EXISTS `menu_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `label` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item`
--

LOCK TABLES `menu_item` WRITE;
/*!40000 ALTER TABLE `menu_item` DISABLE KEYS */;
INSERT INTO `menu_item` VALUES (1,1,0,0,'Sample page','sample-page','/sample-page','active','2020-06-22 22:38:23','2020-06-22 22:38:23'),(2,1,1,0,'Another sample page','another-sample-page','/another-sample-page','active','2020-06-22 22:38:23','2020-06-22 22:38:23');
/*!40000 ALTER TABLE `menu_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1564669039537,'Tables1564669039537');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `custom_css` text DEFAULT NULL,
  `custom_js` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_robots` varchar(255) DEFAULT NULL,
  `show_comment_section` int(1) NOT NULL DEFAULT 1,
  `show_comment_form` int(1) NOT NULL DEFAULT 1,
  `show_sidebar` int(1) NOT NULL DEFAULT 1,
  `sidebar_content` text DEFAULT NULL,
  `is_homepage` int(1) NOT NULL DEFAULT 0,
  `header_full_width` int(1) NOT NULL DEFAULT 0,
  `header_content` text DEFAULT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_3e65301a379e6ca2c468c700aa9` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` VALUES (1,'Sample page','/sample-page','<div class=\"container mb-5\">\n    <h2>Popular courses</h2>\n    <div class=\"row\">\n        <div class=\"col-12\">\n            <div class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"20000\">\n              <div class=\"carousel-inner\">\n                <div class=\"carousel-item active\">\n                    <div class=\"row\">\n                        <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" attendants=\"2\" stars=\"1\" rating=\"4\" title=\"Sample course\"]]</div>\n                        <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" attendants=\"4\" stars=\"1\" rating=\"5\" title=\"Sample\"]]</div>\n                        <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" title=\"Sample\"]]</div>\n                    </div>\n                </div>\n                <div class=\"carousel-item\">\n                    <div class=\"row\">\n                      <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" attendants=2 stars=1 title=\"Sample\"]]</div>\n                        <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" attendants=4 stars=1 title=\"Sample\"]]</div>\n                        <div class=\"col-4\">[[course-card img_src=\"/uploads/blog-5-450x445.jpg\" title=\"Sample\"]]</div>\n                    </div>\n                </div>    \n              </div>\n              <a class=\"carousel-control-prev\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"prev\">\n                \n                <span class=\"sr-only\">Previous</span>\n              </a>\n              <a class=\"carousel-control-next\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"next\">\n                \n                <span class=\"sr-only\">Next</span>\n              </a>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"achievements text-white text-center font-weight-bold\">\n    <h2 class=\"font-weight-bold\">CENTER ACHIEVEMENTS</h2>\n    <p>Here you can review some statistics about our Education Center</p>\n    <div class=\"row\">\n        <div class=\"col-4\">\n            <span class=\"d-block text-warning\">10,328</span>\n            FOREIGN FOLLOWERS\n        </div>\n        <div class=\"col-4\">\n            <span class=\"d-block text-warning\">549</span>\n            CLASSES COMPLETE\n        </div>\n        <div class=\"col-4\">\n            <span class=\"d-block text-warning\">6,789</span>\n            STUDENTS ENROLLED\n        </div>\n    </div>\n</div>\n<div class=\"bg-light py-5 mb-5\">\n<div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-6\">\n                <img class=\"img-fluid\" src=\"/uploads/book-4.jpg\">\n            </div>\n            <div class=\"col-6 d-flex align-items-center\">\n                <div>\n                    <h2 class=\"font-weight-bold\">HIGH QUALITY EDUCATION</h2>\n                    <p>Dis class porro pretium dignissimos veritatis, nostrud natus curae, animi diamlorem? Netus, quia mus, proident quaerat iaculis nascetur sodales, vulputate, sequi mollitia class repellat, aliquip aliquid. Justo iste veniam amet,\n        </p>\n    </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"container mb-5\">\n    <h2 class=\"font-weight-bold\">Top courses</h2>\n    <div class=\"row\">\n        <div class=\"col-6\">C1</div>\n        <div class=\"col-6\">\n            <div class=\"row\">\n                <div class=\"col-6\">\n                    C2</div>\n                <div class=\"col-6\">\n                    C3\n                </div>\n                <div class=\"col-6\">\n                    C4\n                </div>\n                <div class=\"col-6\">\n                    C5\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"bg-light py-5 mb-5\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-4\">\n                P1\n            </div>\n            <div class=\"col-4\">\n                P2\n            </div>\n            <div class=\"col-4\">\n                P3\n            </div>\n        </div>\n    </div>\n</div>','header .carousel{\n  height: 700px;\n  overflow: hidden;\n}\nheader .carousel-item h2{\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%,-50%);\n  color: #fff;\n  z-index: 1;\n}\nheader .carousel-item img{\n  transform: translateY(-25%);\n}\n.benefit-box{\n  margin-top: -30px;\n}\n.benefit-box .fas{\n   font-size: 56px;\n}\n.achievements{\n  padding: 10rem 2rem;\n  background-image: url(/uploads/pexels-photo-301920.jpeg);\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-attachment: fixed;\n}','','','','','',1,1,0,'',1,1,'<div class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"10000\">\n  <div class=\"carousel-inner\">\n    <div class=\"carousel-item active\">\n      <h2>E-Learning</h2>\n      <img class=\"d-block w-100\" src=\" /uploads/pexels-photo-716276.jpeg\" alt=\"Second slide\" />\n    </div>\n    <div class=\"carousel-item\">\n      <h2>Welcome to Education</h2>\n      <img class=\"d-block w-100\" src=\"/uploads/pexels-photo-448877.jpeg\" alt=\"First slide\" />\n    </div>    \n  </div>\n  <a class=\"carousel-control-prev\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"prev\">\n    <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Previous</span>\n  </a>\n  <a class=\"carousel-control-next\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"next\">\n    <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Next</span>\n  </a>\n</div>\n    <div class=\"benefit-box container text-white mb-5\">\n      <div class=\"row\">\n        <div class=\"col-4 bg-success px-5 py-3\">\n          <div class=\"d-flex align-items-center\">\n            <div>\n              <h3>Courses Online</h3>\n              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n            </div>\n            <i class=\"fas fa-graduation-cap\"></i>\n          </div>\n        </div>\n        <div class=\"col-4 bg-warning px-5 py-3\">\n          <div class=\"d-flex align-items-center\">\n            <div>\n          <h3>Apply Now</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class=\"fas fa-trophy\"></i>\n          </div>\n        </div>\n        <div class=\"col-4 bg-primary px-5 py-3\">\n          <div class=\"d-flex align-items-center\">\n            <div>\n          <h3>Certified Teachers</h3>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n              </div>\n            <i class=\"fas fa-pencil-alt\"></i>\n          </div>\n        </div>\n      </div>\n    </div>','active','2021-01-31 02:00:00','2020-06-22 22:38:22'),(2,'Another sample page','/another-sample-page','<h2>Another sample page h2</h2><h3>Another sample page h3</h3><p>Another sample page first paragraph</p>',NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,NULL,0,0,NULL,'active','2020-06-22 22:38:22','2020-06-22 22:38:22');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(128) NOT NULL,
  `value` text NOT NULL,
  `options` text DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(16) NOT NULL,
  `input_type` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_1c4c95d773004250c157a744d6e` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'admin_email','admin@npress.com',NULL,'Admin Email','Where to send notification emails','active','text','2020-06-22 22:38:22','2020-06-22 22:38:22'),(2,'site_name','Education','null','Site Name','Will be displayed in case a logo is not set','active','text','2020-06-22 22:38:22','2020-06-22 22:38:22'),(3,'site_logo','/uploads/logo.png','null','Site Logo','Site Logo','active','image','2020-06-22 22:38:22','2020-06-22 22:38:22'),(4,'active_theme','education','[]','Active Theme','Active Theme','active','select','2020-06-22 22:38:22','2020-06-22 22:38:22'),(5,'recaptcha_enabled','0','null','Recaptcha Enabled','Recaptcha Enabled','active','checkbox','2020-06-22 22:38:22','2020-06-22 22:38:22'),(6,'recaptcha_site_key','',NULL,'Recaptcha Site Key','Recaptcha Site Key','active','text','2020-06-22 22:38:22','2020-06-22 22:38:22'),(7,'google_analytics_script','',NULL,'Google Analytics Script','Paste the code snippet here','active','textarea','2020-06-22 22:38:22','2020-06-22 22:38:22'),(8,'recaptcha_secret_key','',NULL,'Recaptcha Secret Key','Recaptcha Secret Key','active','text','2020-06-22 22:38:22','2020-06-22 22:38:22'),(9,'navbar_layout','logo-left-menu-right','[{\"label\":\"Logo left, menu right\",\"value\":\"logo-left-menu-right\"},{\"label\":\"Logo right, menu left\",\"value\":\"logo-right-menu-left\"}]','Navbar layout','Navbar layout','active','select','2020-06-22 22:38:22','2020-06-22 22:38:22'),(10,'site_width','container-fluid','[{\"label\":\"Full width\",\"value\":\"container-fluid\"},{\"label\":\"Boxed\",\"value\":\"container\"}]','Site width','Full width or boxed','active','select','2020-06-22 22:38:22','2020-06-22 22:38:22');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `status` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_e12875dfb3b1d92d7d7c5377e22` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@npress.com','d21a3ebbd9dcd4af4003b2121615b056d2e1adcbd163a61284dff7fc1b0850d68b81e1ed2f897d61d4f74e9a7b481993b6449386d7ca9f46606e49e55a472877','90136f0e500493e216fc27b097c79055','active','2020-06-22 22:38:22','2020-06-22 22:38:22');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'npress'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-25 19:31:16
