-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 28 juin 2024 à 10:51
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
(1, 'Forêt Ancienne'),
(2, 'Désert des Termites'),
(3, 'Hautes Terres de Corail'),
(4, 'Val Putride');

-- --------------------------------------------------------

--
-- Structure de la table `monsters`
--

CREATE TABLE `monsters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sound_path` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monsters`
--

INSERT INTO `monsters` (`id`, `name`, `type`, `color`, `description`, `image_path`, `sound_path`, `theme`) VALUES
(1, 'Rathalos', 'Wyvern Volante', 'Rouge', 'Roi des cieux', '/images/rathalos.jpg', '/sounds/rathalos.mp3', '/themes/rathalos_theme.mp3'),
(2, 'Rathian', 'Wyvern Volante', 'Verte', 'Contrepartie féminine de Rathalos', '/images/rathian.jpg', '/sounds/rathian.mp3', '/themes/rathian_theme.mp3'),
(3, 'Zinogre', 'Wyvern Crochue', 'Bleu', 'Connu pour ses capacités de foudre', '/images/zinogre.jpg', '/sounds/zinogre.mp3', '/themes/zinogre_theme.mp3'),
(4, 'Nergigante', 'Dragon Ancien', 'Noir', 'Dragon ancien féroce qui chasse les autres anciens', '/images/nergigante.jpg', '/sounds/nergigante.mp3', '/themes/nergigante_theme.mp3');

-- --------------------------------------------------------

--
-- Structure de la table `monster_correct`
--

CREATE TABLE `monster_correct` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sound_path` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monster_correct`
--

INSERT INTO `monster_correct` (`id`, `name`, `type`, `color`, `description`, `image_path`, `sound_path`, `theme`) VALUES
(4, 'Nergigante', 'Dragon Ancien', 'Noir', 'Dragon ancien féroce qui chasse les autres anciens', '/images/nergigante.jpg', '/sounds/nergigante.mp3', '/themes/nergigante_theme.mp3');

-- --------------------------------------------------------

--
-- Structure de la table `monster_map`
--

CREATE TABLE `monster_map` (
  `monster_id` int(11) NOT NULL,
  `map_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `monster_map`
--

INSERT INTO `monster_map` (`monster_id`, `map_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3),
(4, 4);

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `monster_correct`
--
ALTER TABLE `monster_correct`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `monster_map`
--
ALTER TABLE `monster_map`
  ADD PRIMARY KEY (`monster_id`,`map_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `maps`
--
ALTER TABLE `maps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `monsters`
--
ALTER TABLE `monsters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

DELIMITER $$
--
-- Évènements
--
CREATE DEFINER=`root`@`localhost` EVENT `update_monster_correct` ON SCHEDULE EVERY 10 MINUTE STARTS '2024-06-28 07:29:20' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  -- Vider la table monster_correct
  DELETE FROM monster_correct;

  -- Insérer une ligne aléatoire de la table monsters dans monster_correct
  INSERT INTO monster_correct (id, name, type, color, description, image_path, sound_path, theme)
  SELECT id, name, type, color, description, image_path, sound_path, theme
  FROM monsters
  ORDER BY RAND()
  LIMIT 1;
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
