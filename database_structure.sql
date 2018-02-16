--
-- Database: `asteroids`
--
CREATE DATABASE IF NOT EXISTS `asteroids` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `asteroids`;

DELIMITER $$
--
-- Functions
--
DROP FUNCTION IF EXISTS `get_hscore`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_hscore` (`user_` VARCHAR(10)) RETURNS INT(11) BEGIN
	DECLARE hScore INT;

    SELECT MAX(DD.num)
 	INTO hScore
    FROM (
        SELECT D.n AS num
        FROM (
            SELECT N.n
            FROM scores S, generator_256 N
            WHERE S.user = user_ AND S.score >= N.n*1000
        ) AS D
        GROUP BY D.n
        HAVING COUNT(*) >= num
    ) AS DD;

    RETURN hScore;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `generator_16`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `generator_16`;
CREATE TABLE `generator_16` (
`n` bigint(20)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `generator_256`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `generator_256`;
CREATE TABLE `generator_256` (
`n` bigint(21) unsigned
);

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--
-- Creation: Feb 13, 2018 at 06:30 PM
--

DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `user` varchar(10) NOT NULL,
  `score` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Triggers `scores`
--
DROP TRIGGER IF EXISTS `update_scores`;
DELIMITER $$
CREATE TRIGGER `update_scores` AFTER INSERT ON `scores` FOR EACH ROW BEGIN
DECLARE old_highscore INT;

SELECT highscore
INTO old_highscore
FROM users
WHERE username = new.user;

IF new.score > old_highscore THEN
	UPDATE users
	SET highscore = new.score
	WHERE username = new.user;
END IF;

UPDATE users
SET avgscore = (
	SELECT FLOOR(AVG(score))
    FROM scores
    WHERE user = new.user)
WHERE username = new.user;

UPDATE users
SET hscore = get_hscore(new.user)
WHERE username = new.user;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Creation: Feb 14, 2018 at 11:02 AM
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` char(60) NOT NULL,
  `highscore` int(11) NOT NULL DEFAULT '0',
  `hscore` int(11) NOT NULL DEFAULT '0',
  `avgscore` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure for view `generator_16`
--
DROP TABLE IF EXISTS `generator_16`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `generator_16`  AS  select 0 AS `n` union all select 1 AS `1` union all select 2 AS `2` union all select 3 AS `3` union all select 4 AS `4` union all select 5 AS `5` union all select 6 AS `6` union all select 7 AS `7` union all select 8 AS `8` union all select 9 AS `9` union all select 10 AS `10` union all select 11 AS `11` union all select 12 AS `12` union all select 13 AS `13` union all select 14 AS `14` union all select 15 AS `15` ;

-- --------------------------------------------------------

--
-- Structure for view `generator_256`
--
DROP TABLE IF EXISTS `generator_256`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `generator_256`  AS  select ((`hi`.`n` << 4) | `lo`.`n`) AS `n` from (`generator_16` `lo` join `generator_16` `hi`) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_user` (`user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `FK_user` FOREIGN KEY (`user`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
