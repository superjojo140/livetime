-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 03. Sep 2023 um 11:18
-- Server-Version: 11.1.2-MariaDB
-- PHP-Version: 8.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `livetime`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(100) NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `projectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projectattributes`
--

CREATE TABLE `projectattributes` (
  `projectid` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `description` text NOT NULL,
  `datatype` varchar(100) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects_timesnippets`
--

CREATE TABLE `projects_timesnippets` (
  `projectid` int(11) NOT NULL,
  `timesnippetid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects_users`
--

CREATE TABLE `projects_users` (
  `projectid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `timesnippets`
--

CREATE TABLE `timesnippets` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start` varchar(30) DEFAULT NULL COMMENT 'ISO Datestring',
  `end` varchar(30) DEFAULT NULL COMMENT 'ISO Datestring',
  `invoice` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `projectattributes`
--
ALTER TABLE `projectattributes`
  ADD PRIMARY KEY (`projectid`,`name`);

--
-- Indizes für die Tabelle `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `projects_timesnippets`
--
ALTER TABLE `projects_timesnippets`
  ADD PRIMARY KEY (`projectid`,`timesnippetid`);

--
-- Indizes für die Tabelle `projects_users`
--
ALTER TABLE `projects_users`
  ADD PRIMARY KEY (`projectid`,`userid`);

--
-- Indizes für die Tabelle `timesnippets`
--
ALTER TABLE `timesnippets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `timesnippets`
--
ALTER TABLE `timesnippets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
