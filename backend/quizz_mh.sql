-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 25 juil. 2024 à 09:02
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `quizz_mh`
--

-- --------------------------------------------------------

--
-- Structure de la table `maps`
--

CREATE TABLE `maps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `maps`
--

INSERT INTO `maps` (`id`, `name`) VALUES
(1, 'Forêt ancienne'),
(2, 'Désert des termites'),
(3, 'Plateau de corail'),
(4, 'Terre des anciens'),
(5, 'Val putride'),
(6, 'Givre éternel'),
(7, 'Fief glorieux'),
(8, 'Temple oublié'),
(9, 'Archipel de glace'),
(10, 'Forêt inondée'),
(11, 'Plaines de sable'),
(12, 'Cavernes de lave'),
(13, 'Jungle'),
(14, 'Citadelle'),
(15, 'Steppe ancestrale'),
(16, 'Dunes'),
(17, 'Forêt primitive'),
(18, 'Vallon immergé'),
(19, 'Bois éternel'),
(20, 'Mer de glace'),
(21, 'Vallon volcanique'),
(22, 'Mont céleste'),
(23, 'Collines verdoyantes'),
(24, 'Frontière jurassique'),
(25, 'Crête arctique'),
(26, 'Cime oubliée'),
(27, 'Grand océan'),
(28, 'Sanctuaire'),
(29, 'Pointe de lance'),
(30, "Île d\'Ingle"),
(31, 'Pinacle'),
(32, 'Champ de bataille'),
(33, 'Fort Schrade'),
(34, 'Cime des esprits'),
(35, 'Cimetière des wyvernes'),
(36, 'Forteresse'),
(37, 'Bastion perdu'),
(38, 'Tour interdite');

-- --------------------------------------------------------

--
-- Structure de la table `monsters`
--

CREATE TABLE `monsters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type_id` bigint(20) UNSIGNED NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size_min` int(10) UNSIGNED NOT NULL,
  `size_max` int(10) UNSIGNED NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sound_path` varchar(255) DEFAULT NULL,
  `theme_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monsters`
--

INSERT INTO `monsters` (`id`, `name`, `type_id`, `color`, `size_min`, `size_max`, `description`, `image_path`, `sound_path`, `theme_path`) VALUES
(1, 'rathian', 11, 'vert', 1151, 2303, 'Reine des terres', '../../src/assets/monsters/images/rathian_rathian.png', '', '../../src/assets/monsters/themes/rathian_Monster Hunter ~ Ancient Rhythm  Rathian (OST).mp3'),
(2, 'rathalos', 11, 'rouge', 1140, 2248, 'Roi des cieux', '../../src/assets/monsters/images/rathalos_rathalos.png', '', '../../src/assets/monsters/themes/rathalos_Monster Hunter OST  Rathalos Theme.mp3'),
(3, 'nargacuga', 11, 'noir', 1377, 2066, 'Ombre bondissante', '../../src/assets/monsters/images/nargacuga_nargacuga.png', '../../src/assets/monsters/sounds/nargacuga_Nargacuga Silver Wind Nargacuga Roars.mp3', '../../src/assets/monsters/themes/nargacuga_Nargacuga  ナルガクルガ - Battle Theme [ Monster Hunter World Iceborne  モンスターハンターワールド：アイスボーン ].mp3'),
(4, 'alatreon', 18, 'noir', 3105, 3105, 'Dragon noir Ardent', '../../src/assets/monsters/images/alatreon_alatreon.png', '../../src/assets/monsters/sounds/alatreon_Monster Hunter Roars Alatreon Roar Comparison.mp3', '../../src/assets/monsters/themes/alatreon_MHW Iceborne OST Alatreon Theme.mp3');

-- --------------------------------------------------------

--
-- Structure de la table `monster_correct`
--

CREATE TABLE `monster_correct` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type_id` bigint(20) UNSIGNED NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size_min` int(10) UNSIGNED NOT NULL,
  `size_max` int(10) UNSIGNED NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sound_path` varchar(255) DEFAULT NULL,
  `theme_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monster_correct`
--

INSERT INTO `monster_correct` (`id`, `name`, `type_id`, `color`, `size_min`, `size_max`, `description`, `image_path`, `sound_path`, `theme_path`) VALUES
(4, 'alatreon', 18, 'noir', 3105, 3105, 'Dragon noir Ardent', '../../src/assets/monsters/images/alatreon_alatreon.png', '../../src/assets/monsters/sounds/alatreon_Monster Hunter Roars Alatreon Roar Comparison.mp3', '../../src/assets/monsters/themes/alatreon_MHW Iceborne OST Alatreon Theme.mp3');

-- --------------------------------------------------------

--
-- Structure de la table `monster_map`
--

CREATE TABLE `monster_map` (
  `monster_id` bigint(20) UNSIGNED NOT NULL,
  `map_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monster_map`
--

INSERT INTO `monster_map` (`monster_id`, `map_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 16),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 16),
(3, 1),
(3, 3),
(3, 6),
(3, 7),
(3, 8),
(4, 10),
(4, 13),
(4, 30);

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token`, `expires_at`) VALUES
(33, 2, '$2y$10$LO5ChdIYyo0fBoWoJm44LewQz2iOxi9OcpKKxwy5x4rXFKDmlHe82', '2024-08-23 09:42:27');

--
-- Déclencheurs `sessions`
--
DELIMITER $$
CREATE TRIGGER `set_expiration_date` BEFORE INSERT ON `sessions` FOR EACH ROW BEGIN
    SET NEW.expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `types`
--

CREATE TABLE `types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `types`
--

INSERT INTO `types` (`id`, `name`) VALUES
(1, 'Herbivores'),
(2, 'Lyniens'),
(3, 'Poissons'),
(4, 'Drakes ailés'),
(5, 'Neopterons'),
(6, 'Carapaceons'),
(7, 'Temnocerans'),
(8, 'Amphibiens'),
(9, 'Léviathans'),
(10, 'Bêtes à crocs'),
(11, 'Wyvernes volantes'),
(12, 'Wyvernes rapaces'),
(13, 'Wyvernes de terre'),
(14, 'Wyvernes à crocs'),
(15, 'Wyvernes aquatiques'),
(16, 'Wyvernes reptiles'),
(17, 'Inclassables'),
(18, 'Dragons anciens'),
(19, '???'),
(20, 'Reliques');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `created_at`, `role`) VALUES
(1, 'aceacw', '$2y$10$AqSU3jLX1Eb8FAwAPwmF3.TOaiGYxdEM13/00EjkPwS0G.QbL2tr.', 'ace@acw.fr', '2024-07-10 10:05:43', 'user'),
(2, 'admin-quizz', '$2y$10$zbvufRAehtYT22FOjD2T7OJMtjoN/Y0w/gwMdBsYS1o/x87mic5US', 'admin@admin.fr', '2024-07-10 10:29:06', 'admin'),
(3, 'user', '$2y$10$.9lyHwsZu9ebtqvSlPRpwuSo78iwQFImYCCjB6rQyv9Sb9sNItuLa', 'user@user.fr', '2024-07-11 13:51:00', 'user'),
(4, 'test', '$2y$10$mPHKRYQVSfC4lbvv6mz74O9z97oq2dLJfRaMzwOIimiGl6uCKm4hu', 'test@test', '2024-07-18 07:39:32', 'user'),
(5, 'esin', '$2y$10$so0aTj6m7ggCqOLteTieVOMr0.FnMaW20L/Lq6pR.uQe9sLwZ74Py', 'esin@esin', '2024-07-18 10:14:15', 'user'),
(6, 'ace', '$2y$10$gEpPRudUetoPW5keRkgSP..2/qtHqOOQ8XEPuBrgmzW72LMe5ePUO', 'ace@ace', '2024-07-18 13:08:09', 'user'),
(7, 'azerty', '$2y$10$S45RdnQQpbYovNVBSoR/weRPdSp4ZtVtTbHT/6AC4RNp71mc.oR3O', 'azerty@azerty', '2024-07-18 13:10:30', 'user');

-- --------------------------------------------------------

--
-- Structure de la table `wallpaper`
--

CREATE TABLE `wallpaper` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `wallpaper`
--

INSERT INTO `wallpaper` (`id`, `name`, `path`) VALUES
(1, 'wallpaper.jpg', './src/assets/monsters/images/wallpaper/wallpaper.jpg');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `monsters`
--
ALTER TABLE `monsters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_type_id` (`type_id`);

--
-- Index pour la table `monster_correct`
--
ALTER TABLE `monster_correct`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_correct_type_id` (`type_id`);

--
-- Index pour la table `monster_map`
--
ALTER TABLE `monster_map`
  ADD PRIMARY KEY (`monster_id`,`map_id`),
  ADD KEY `fk_map_id` (`map_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Index pour la table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `wallpaper`
--
ALTER TABLE `wallpaper`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `maps`
--
ALTER TABLE `maps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `monsters`
--
ALTER TABLE `monsters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `monster_correct`
--
ALTER TABLE `monster_correct`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `types`
--
ALTER TABLE `types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `wallpaper`
--
ALTER TABLE `wallpaper`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `monsters`
--
ALTER TABLE `monsters`
  ADD CONSTRAINT `fk_type_id` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `monster_correct`
--
ALTER TABLE `monster_correct`
  ADD CONSTRAINT `fk_correct_type_id` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `monster_map`
--
ALTER TABLE `monster_map`
  ADD CONSTRAINT `fk_map_id` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_monster_id` FOREIGN KEY (`monster_id`) REFERENCES `monsters` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

DELIMITER $$
--
-- Évènements
--
CREATE DEFINER=`root`@`localhost` EVENT `update_monster_correct` ON SCHEDULE EVERY 10 MINUTE STARTS '2024-06-28 07:29:20' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DELETE FROM monster_correct;
  INSERT INTO monster_correct (id, name, type_id, color, size_min, size_max, description, image_path, sound_path, theme_path)
  SELECT id, name, type_id, color, size_min, size_max, description, image_path, sound_path, theme_path
  FROM monsters
  ORDER BY RAND()
  LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_expired_sessions` ON SCHEDULE EVERY 1 HOUR STARTS '2024-07-18 11:54:48' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM `sessions` WHERE `expires_at` < CURRENT_TIMESTAMP$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
