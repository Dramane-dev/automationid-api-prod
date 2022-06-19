SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `idea_collector`;
USE `idea_collector`;

CREATE TABLE `contact_us` (
  `contactId` int(11) NOT NULL,
  `userMail` varchar(320) COLLATE utf8_unicode_ci NOT NULL,
  `contactSubject` set('pb_tech','aide','info','rdv','other') COLLATE utf8_unicode_ci DEFAULT 'other',
  `subjectPerso` varchar(320) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactMessage` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactSend` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `meetings` (
  `meetingId` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `meetingSubject` text COLLATE utf8_unicode_ci,
  `meetingDescript` text COLLATE utf8_unicode_ci,
  `meetingDate` int(3) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `meetings_members` (
  `REC` int(11) NOT NULL,
  `meetingId` int(11) NOT NULL,
  `userId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `userStatus` set('org','inv','unk') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unk'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `ideas` (
  `REC` int(4) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `idName` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `idUnit` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idGoal` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idDescript` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idScore` int(4) NOT NULL DEFAULT '0',
  `idCreat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `idea_feasibility` (
  `REC` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `idQ1` text COLLATE utf8_unicode_ci,
  `idCom1` text COLLATE utf8_unicode_ci,
  `idQ2` text COLLATE utf8_unicode_ci,
  `idCom2` text COLLATE utf8_unicode_ci,
  `idQ3` text COLLATE utf8_unicode_ci,
  `idCom3` text COLLATE utf8_unicode_ci,
  `idQ4` text COLLATE utf8_unicode_ci,
  `idCom4` text COLLATE utf8_unicode_ci
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `idea_files` (
  `fileId` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `fileName` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `fileType` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `filePath` text COLLATE utf8_unicode_ci NOT NULL,
  `fileCreat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `idea_meets` (
  `REC` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `meetingId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `meeting1` datetime DEFAULT NULL,
  `meeting2` datetime DEFAULT NULL,
  `meeting3` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `idea_payoff` (
  `REC` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `idMembers` int(3) DEFAULT '0',
  `idFreq` set('d','w','m','p-c','unknown') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown',
  `idTreats` int(3) DEFAULT '0',
  `idDuree` varchar(14) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0 Jour',
  `idErrPart` set('0','10','20','30','40','50','60','70','80','90','100') COLLATE utf8_unicode_ci DEFAULT '0',
  `idPicAct` set('y','n') COLLATE utf8_unicode_ci DEFAULT 'n',
  `idPicCom` text COLLATE utf8_unicode_ci,
  `idSteps` int(3) DEFAULT '0',
  `idRules` int(3) DEFAULT '0',
  `idAppUsed` int(3) DEFAULT '0',
  `idRemoteApp` set('y','n') COLLATE utf8_unicode_ci DEFAULT 'n',
  `idDigitData` set('0','10','20','30','40','50','60','70','80','90','100') COLLATE utf8_unicode_ci DEFAULT '0',
  `idScanDocs` set('y','n') COLLATE utf8_unicode_ci DEFAULT 'n'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `idea_status` (
  `statusId` int(11) NOT NULL,
  `ideaId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `statusValue` set("Brouillon", "À l'étude", "En développement", "Finalisé", "Inéligible") COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Brouillon'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `users` (
  `REC` int(6) NOT NULL,
  `userId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `userType` set('client','admin') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'client',
  `userNom` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `userPrenom` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `userGenre` set('H','F','none') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none',
  `userMail` varchar(320) COLLATE utf8_unicode_ci NOT NULL,
  `userPass` text COLLATE utf8_unicode_ci NOT NULL,
  `userCreat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accountValid` set('y','n') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `validationKeys` (
  `REC` int(6) NOT NULL,
  `userId` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `key` varchar(160) COLLATE utf8_unicode_ci NOT NULL,
  `keyType` set('mailConfirm','passConfirm','autre') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'autre'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`contactId`),
  ADD KEY `userMail` (`userMail`);

ALTER TABLE `meetings`
  ADD PRIMARY KEY (`meetingId`),
  ADD KEY `fk_ideaId` (`ideaId`);


ALTER TABLE `meetings_members`
  ADD PRIMARY KEY (`REC`),
  ADD KEY `fk_userId` (`userId`),
  ADD KEY `fk_meetingId` (`meetingId`);
ALTER TABLE `ideas`
  ADD PRIMARY KEY (`REC`),
  ADD UNIQUE KEY `ideaId` (`ideaId`),
  ADD KEY `fk_userId` (`userId`);
ALTER TABLE `idea_feasibility`
  ADD PRIMARY KEY (`REC`),
  ADD UNIQUE KEY `ideaId` (`ideaId`),
  ADD KEY `fk_userId` (`ideaId`);
ALTER TABLE `idea_files`
  ADD PRIMARY KEY (`fileId`),
  ADD KEY `fk_ideaId` (`ideaId`);
ALTER TABLE `idea_meets`
  ADD PRIMARY KEY (`REC`),
  ADD KEY `fk_ideaId` (`ideaId`);
ALTER TABLE `idea_payoff`
  ADD PRIMARY KEY (`REC`),
  ADD UNIQUE KEY `ideaId` (`ideaId`),
  ADD KEY `fk_ideaId` (`ideaId`);
ALTER TABLE `idea_status`
  ADD PRIMARY KEY (`statusId`),
  ADD UNIQUE KEY `ideaId` (`ideaId`),
  ADD KEY `fk_ideaId` (`ideaId`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`REC`),
  ADD UNIQUE KEY `userId` (`userId`);
ALTER TABLE `validationKeys`
  ADD PRIMARY KEY (`REC`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `key` (`key`),
  ADD KEY `fk_userId` (`userId`);
ALTER TABLE `contact_us`
  MODIFY `contactId` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `meetings`
  MODIFY `meetingId` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `meetings_members`
  MODIFY `REC` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `ideas`
  MODIFY `REC` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
ALTER TABLE `idea_feasibility`
  MODIFY `REC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
ALTER TABLE `idea_files`
  MODIFY `fileId` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `idea_meets`
  MODIFY `REC` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `idea_payoff`
  MODIFY `REC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `idea_status`
  MODIFY `statusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `users`
  MODIFY `REC` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `validationKeys`
  MODIFY `REC` int(6) NOT NULL AUTO_INCREMENT;
COMMIT;