/*
Navicat MySQL Data Transfer

Source Server         : WORK
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : bhi

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-05-22 09:01:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `actividad`
-- ----------------------------
DROP TABLE IF EXISTS `actividad`;
CREATE TABLE `actividad` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo_actividad` varchar(255) DEFAULT NULL,
  `descripcion_actividad` varchar(255) DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of actividad
-- ----------------------------

-- ----------------------------
-- Table structure for `agencia`
-- ----------------------------
DROP TABLE IF EXISTS `agencia`;
CREATE TABLE `agencia` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_agencia` varchar(255) DEFAULT NULL,
  `email_agencia` varchar(255) DEFAULT NULL,
  `nombre_vendedor` varchar(255) DEFAULT NULL,
  `direccion_vendedor` varchar(255) DEFAULT NULL,
  `telefono_agencia` varchar(255) DEFAULT NULL,
  `facebook_agencia` varchar(255) DEFAULT NULL,
  `twitter_agencia` varchar(255) DEFAULT NULL,
  `instagram_agencia` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `imagen_agencia` varchar(255) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of agencia
-- ----------------------------

-- ----------------------------
-- Table structure for `archive`
-- ----------------------------
DROP TABLE IF EXISTS `archive`;
CREATE TABLE `archive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` bigint(20) DEFAULT NULL,
  `fromModel` varchar(255) DEFAULT NULL,
  `originalRecord` longtext DEFAULT NULL,
  `originalRecordId` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of archive
-- ----------------------------

-- ----------------------------
-- Table structure for `asientoreservado`
-- ----------------------------
DROP TABLE IF EXISTS `asientoreservado`;
CREATE TABLE `asientoreservado` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etiqueta` varchar(255) DEFAULT NULL,
  `id_reserva` int(11) DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of asientoreservado
-- ----------------------------

-- ----------------------------
-- Table structure for `destino`
-- ----------------------------
DROP TABLE IF EXISTS `destino`;
CREATE TABLE `destino` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_destino` varchar(255) DEFAULT NULL,
  `descripcion_destino` varchar(255) DEFAULT NULL,
  `imagen_destino` varchar(255) DEFAULT NULL,
  `ext` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `nombre_destino` (`nombre_destino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of destino
-- ----------------------------

-- ----------------------------
-- Table structure for `estado`
-- ----------------------------
DROP TABLE IF EXISTS `estado`;
CREATE TABLE `estado` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of estado
-- ----------------------------
INSERT INTO `estado` VALUES ('1621578881281', '1621578881281', '1', 'Activo');
INSERT INTO `estado` VALUES ('1621578881401', '1621578881401', '2', 'Inactivo');

-- ----------------------------
-- Table structure for `excursion`
-- ----------------------------
DROP TABLE IF EXISTS `excursion`;
CREATE TABLE `excursion` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo_excursion` varchar(255) DEFAULT NULL,
  `descripcion_excursion` varchar(255) DEFAULT NULL,
  `observaciones_excursion` varchar(255) DEFAULT NULL,
  `imagen_excursion` varchar(255) DEFAULT NULL,
  `ext_imagen` varchar(255) DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of excursion
-- ----------------------------

-- ----------------------------
-- Table structure for `excursionopcional`
-- ----------------------------
DROP TABLE IF EXISTS `excursionopcional`;
CREATE TABLE `excursionopcional` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of excursionopcional
-- ----------------------------

-- ----------------------------
-- Table structure for `habitacion`
-- ----------------------------
DROP TABLE IF EXISTS `habitacion`;
CREATE TABLE `habitacion` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `precio` varchar(255) DEFAULT NULL,
  `id_tipo_habitacion` int(11) DEFAULT NULL,
  `id_hotel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of habitacion
-- ----------------------------

-- ----------------------------
-- Table structure for `hotel`
-- ----------------------------
DROP TABLE IF EXISTS `hotel`;
CREATE TABLE `hotel` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_hotel` varchar(255) DEFAULT NULL,
  `categoria_hotel` double DEFAULT NULL,
  `imagen_hotel` varchar(255) DEFAULT NULL,
  `cama_simple` double DEFAULT NULL,
  `cama_doble` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of hotel
-- ----------------------------

-- ----------------------------
-- Table structure for `imagen`
-- ----------------------------
DROP TABLE IF EXISTS `imagen`;
CREATE TABLE `imagen` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `ext` varchar(255) DEFAULT NULL,
  `nivel` double DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of imagen
-- ----------------------------

-- ----------------------------
-- Table structure for `paquete`
-- ----------------------------
DROP TABLE IF EXISTS `paquete`;
CREATE TABLE `paquete` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_paquete` varchar(255) DEFAULT NULL,
  `destino` varchar(255) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  `cantidad_noches` double DEFAULT NULL,
  `lugar_salida` varchar(255) DEFAULT NULL,
  `properties_paquete` varchar(255) DEFAULT NULL,
  `edad_desde` double DEFAULT NULL,
  `edad_hasta` double DEFAULT NULL,
  `asientos` varchar(255) DEFAULT NULL,
  `observaciones_paquete` varchar(255) DEFAULT NULL,
  `titulo_observaciones` varchar(255) DEFAULT NULL,
  `id_hotel` int(11) DEFAULT NULL,
  `id_tipoBus` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of paquete
-- ----------------------------

-- ----------------------------
-- Table structure for `pasajero`
-- ----------------------------
DROP TABLE IF EXISTS `pasajero`;
CREATE TABLE `pasajero` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_pasajero` varchar(255) DEFAULT NULL,
  `telefono_pasajero` varchar(255) DEFAULT NULL,
  `email_pasajero` varchar(255) DEFAULT NULL,
  `tipo_documento` varchar(255) DEFAULT NULL,
  `numero_documento` double DEFAULT NULL,
  `observaciones_pasajero` varchar(255) DEFAULT NULL,
  `imagen_documento` varchar(255) DEFAULT NULL,
  `ficha_medica` varchar(255) DEFAULT NULL,
  `nombre_emergencia` varchar(255) DEFAULT NULL,
  `telefono_emergencia` double DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL,
  `facebook_pasajero` varchar(255) DEFAULT NULL,
  `twitter_pasajero` varchar(255) DEFAULT NULL,
  `instagram_pasajero` varchar(255) DEFAULT NULL,
  `estado` double DEFAULT NULL,
  `id_tipoHabitacion` int(11) DEFAULT NULL,
  `id_reservacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of pasajero
-- ----------------------------

-- ----------------------------
-- Table structure for `reservacion`
-- ----------------------------
DROP TABLE IF EXISTS `reservacion`;
CREATE TABLE `reservacion` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cantidad_adultos` double DEFAULT NULL,
  `cantidad_menores` double DEFAULT NULL,
  `cantidad_bebes` double DEFAULT NULL,
  `cantidad_doble` double DEFAULT NULL,
  `cantidad_individual` double DEFAULT NULL,
  `cantidad_triple` double DEFAULT NULL,
  `cantidad_cuadruple` double DEFAULT NULL,
  `cantidad_twin` double DEFAULT NULL,
  `cantidad_matrimonial` double DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `estado` double DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL,
  `id_agencia` int(11) DEFAULT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of reservacion
-- ----------------------------

-- ----------------------------
-- Table structure for `tipocama`
-- ----------------------------
DROP TABLE IF EXISTS `tipocama`;
CREATE TABLE `tipocama` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tipocama
-- ----------------------------
INSERT INTO `tipocama` VALUES ('1621578881866', '1621578881866', '1', 'Twin');
INSERT INTO `tipocama` VALUES ('1621578881913', '1621578881913', '2', 'Matrimonial');

-- ----------------------------
-- Table structure for `tipohabitacion`
-- ----------------------------
DROP TABLE IF EXISTS `tipohabitacion`;
CREATE TABLE `tipohabitacion` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tipohabitacion
-- ----------------------------
INSERT INTO `tipohabitacion` VALUES ('1621578881665', '1621578881665', '1', 'Individual');
INSERT INTO `tipohabitacion` VALUES ('1621578881691', '1621578881691', '2', 'Doble');
INSERT INTO `tipohabitacion` VALUES ('1621578881716', '1621578881716', '3', 'Triple');
INSERT INTO `tipohabitacion` VALUES ('1621578881758', '1621578881758', '4', 'Cuadruple');

-- ----------------------------
-- Table structure for `tipotransporte`
-- ----------------------------
DROP TABLE IF EXISTS `tipotransporte`;
CREATE TABLE `tipotransporte` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  `asientos_ocupados` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tipotransporte
-- ----------------------------
INSERT INTO `tipotransporte` VALUES ('1621578881495', '1621578881495', '1', 'Bus mix', '08*14*16*24');
INSERT INTO `tipotransporte` VALUES ('1621578881549', '1621578881549', '2', 'Bus semi cama', '08*14*16*24');
INSERT INTO `tipotransporte` VALUES ('1621578881600', '1621578881600', '3', 'Minibus', '08*16*24');

-- ----------------------------
-- Table structure for `tipo_usuario`
-- ----------------------------
DROP TABLE IF EXISTS `tipo_usuario`;
CREATE TABLE `tipo_usuario` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tipo_usuario
-- ----------------------------
INSERT INTO `tipo_usuario` VALUES ('1621578881112', '1621578881112', '1', 'Administrador');
INSERT INTO `tipo_usuario` VALUES ('1621578881156', '1621578881156', '2', 'Agencia');

-- ----------------------------
-- Table structure for `transporte`
-- ----------------------------
DROP TABLE IF EXISTS `transporte`;
CREATE TABLE `transporte` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_transporte` varchar(255) DEFAULT NULL,
  `cantidad_asientos` double DEFAULT NULL,
  `asientos_libres` double DEFAULT NULL,
  `asientos_ocupados` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of transporte
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email_user` varchar(255) DEFAULT NULL,
  `password_user` varchar(255) DEFAULT NULL,
  `password_user_temp` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `id_roll_user` int(11) DEFAULT NULL,
  `id_estado_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email_user` (`email_user`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1621578880559', '1621673906810', '1', 'bhi2021manager@hotmail.com', '$2b$10$sqa4hX2t4YhSjY4l9iHGHuTA8PEx1nlMOzcilcoI429BDyrREShA2', '', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIxNjczOTA2LCJleHAiOjE2MjE3NjAzMDZ9.knlFm1gNAQntjCLmw7JFKQp6FflFegUr_ON1G1ukCV4', '1', '1');
