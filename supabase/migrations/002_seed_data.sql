-- Ethiopian FPL Seed Data
-- Run this after 001_initial_schema.sql

-- ==========================================
-- SEED LEAGUES (Regional & Prize)
-- ==========================================

INSERT INTO leagues (id, name, type, entry_fee, entry_currency, prize_pool, min_level, code, location, organization, status) VALUES
-- Public Leagues
('11111111-1111-1111-1111-111111111111', 'Ethiopia Overall', 'public', 0, 'etb', 0, 1, NULL, 'Ethiopia', NULL, 'active'),
('11111111-1111-1111-1111-111111111112', 'Addis Ababa City League', 'city', 0, 'etb', 0, 1, 'ADDIS2024', 'Addis Ababa', NULL, 'active'),
('11111111-1111-1111-1111-111111111113', 'Bahir Dar Blues', 'city', 0, 'etb', 0, 1, 'BAHIR2024', 'Bahir Dar', NULL, 'active'),
('11111111-1111-1111-1111-111111111114', 'Hawassa Hawks', 'city', 0, 'etb', 0, 1, 'HAWAS2024', 'Hawassa', NULL, 'active'),
('11111111-1111-1111-1111-111111111115', 'Dire Dawa Dynasty', 'city', 0, 'etb', 0, 1, 'DIRED2024', 'Dire Dawa', NULL, 'active'),
('11111111-1111-1111-1111-111111111116', 'Mekelle Managers', 'city', 0, 'etb', 0, 1, 'MEKEL2024', 'Mekelle', NULL, 'active'),
('11111111-1111-1111-1111-111111111117', 'Jimma Giants', 'city', 0, 'etb', 0, 1, 'JIMMA2024', 'Jimma', NULL, 'active'),

-- Prize Leagues (ETB)
('22222222-2222-2222-2222-222222222221', 'Weekly Jackpot', 'prize', 100, 'etb', 5000, 1, 'JACKPOT', NULL, NULL, 'active'),
('22222222-2222-2222-2222-222222222222', 'VIP Masters League', 'prize', 500, 'etb', 25000, 10, 'VIPMASTERS', NULL, NULL, 'active'),
('22222222-2222-2222-2222-222222222223', 'Champions Cup', 'prize', 250, 'etb', 12500, 5, 'CHAMPCUP', NULL, NULL, 'active'),

-- Coin Entry Leagues (For casual players)
('33333333-3333-3333-3333-333333333331', 'Weekly Challenge', 'prize', 50, 'coins', 500, 1, 'COINWEEKLY', NULL, NULL, 'active'),
('33333333-3333-3333-3333-333333333332', 'Monthly Marathon', 'prize', 200, 'coins', 2000, 1, 'COINMONTH', NULL, NULL, 'active'),
('33333333-3333-3333-3333-333333333333', 'Beginners Cup', 'prize', 0, 'coins', 100, 1, 'BEGINNER', NULL, NULL, 'active'),

-- H2H Leagues
('44444444-4444-4444-4444-444444444441', 'Amharic Football Chat H2H', 'h2h', 0, 'etb', 0, 1, 'AMHH2H', NULL, NULL, 'active'),

-- Company/University Leagues
('55555555-5555-5555-5555-555555555551', 'Ethio Telecom HQ', 'company', 50, 'etb', 2500, 1, 'ETHTEL', NULL, 'Ethio Telecom', 'active'),
('55555555-5555-5555-5555-555555555552', 'AAU Students League', 'university', 0, 'etb', 0, 1, 'AAUSTU', NULL, 'Addis Ababa University', 'active'),
('55555555-5555-5555-5555-555555555553', 'Commercial Bank of Ethiopia', 'company', 100, 'etb', 5000, 1, 'CBELEAGUE', NULL, 'Commercial Bank of Ethiopia', 'active'),
('55555555-5555-5555-5555-555555555554', 'Bahir Dar University', 'university', 0, 'etb', 0, 1, 'BDUSTU', NULL, 'Bahir Dar University', 'active');

-- ==========================================
-- DEMO USERS (50 Realistic Ethiopian Names)
-- ==========================================

INSERT INTO users (id, display_name, phone, email, level, xp, coins, eth_balance, favorite_team) VALUES
-- Top Managers
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Abebe Kebede', '+251911234567', 'abebe.k@email.com', 15, 8500, 2500, 500, 'LIV'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Dawit Tadesse', '+251912345678', 'dawit.t@email.com', 12, 6200, 1800, 350, 'MCI'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', 'Yohannes Haile', '+251913456789', 'yohannes.h@email.com', 18, 12000, 3200, 750, 'ARS'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad', 'Tewodros Bekele', '+251914567890', 'tewodros.b@email.com', 10, 4800, 1200, 200, 'CHE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae', 'Solomon Girma', '+251915678901', 'solomon.g@email.com', 8, 3200, 900, 150, 'MUN'),

-- Rising Stars
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf', 'Ermias Assefa', '+251916789012', 'ermias.a@email.com', 6, 1800, 600, 100, 'TOT'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Biniam Tekle', '+251917890123', 'biniam.t@email.com', 7, 2400, 750, 120, 'NEW'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Henok Mekonnen', '+251918901234', 'henok.m@email.com', 5, 1500, 500, 80, 'AVL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Nahom Desta', '+251919012345', 'nahom.d@email.com', 4, 1100, 350, 50, 'BHA'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Yared Wolde', '+251920123456', 'yared.w@email.com', 9, 3800, 1100, 180, 'LIV'),

-- Female Managers
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba', 'Tigist Alemayehu', '+251921234567', 'tigist.a@email.com', 14, 7800, 2200, 450, 'ARS'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Hiwot Gebremedhin', '+251922345678', 'hiwot.g@email.com', 11, 5500, 1600, 300, 'LIV'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Bethlehem Tesfaye', '+251923456789', 'bethlehem.t@email.com', 8, 3100, 950, 140, 'MCI'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Meron Abera', '+251924567890', 'meron.a@email.com', 6, 1900, 620, 90, 'CHE'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'Selamawit Fisseha', '+251925678901', 'selamawit.f@email.com', 13, 7200, 2000, 400, 'TOT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'Rahel Negash', '+251926789012', 'rahel.n@email.com', 7, 2600, 800, 110, 'NEW'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'Eden Mulugeta', '+251927890123', 'eden.m@email.com', 5, 1400, 450, 70, 'AVL'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7', 'Lidya Tsegaye', '+251928901234', 'lidya.t@email.com', 10, 4500, 1350, 220, 'ARS'),

-- More Male Managers
('cccccccc-cccc-cccc-cccc-ccccccccccca', 'Getachew Fikadu', '+251929012345', 'getachew.f@email.com', 16, 9500, 2800, 600, 'MCI'),
('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Mulugeta Tesfaye', '+251930123456', 'mulugeta.t@email.com', 9, 3600, 1050, 170, 'LIV'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Bereket Hailu', '+251931234567', 'bereket.h@email.com', 11, 5200, 1550, 280, 'ARS'),
('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Kidus Alemayehu', '+251932345678', 'kidus.a@email.com', 7, 2500, 780, 100, 'CHE'),
('cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Eyob Girma', '+251933456789', 'eyob.g@email.com', 4, 1000, 320, 40, 'MUN'),
('cccccccc-cccc-cccc-cccc-ccccccccccc5', 'Temesgen Worku', '+251934567890', 'temesgen.w@email.com', 19, 14000, 3800, 900, 'LIV'),
('cccccccc-cccc-cccc-cccc-ccccccccccc6', 'Fitsum Berhane', '+251935678901', 'fitsum.b@email.com', 8, 3000, 920, 130, 'TOT'),
('cccccccc-cccc-cccc-cccc-ccccccccccc7', 'Amanuel Wolde', '+251936789012', 'amanuel.w@email.com', 6, 1700, 580, 85, 'NEW'),
('cccccccc-cccc-cccc-cccc-ccccccccccc8', 'Daniel Habtamu', '+251937890123', 'daniel.h@email.com', 12, 6500, 1900, 380, 'MCI'),
('cccccccc-cccc-cccc-cccc-ccccccccccc9', 'Tesfaye Mengistu', '+251938901234', 'tesfaye.m@email.com', 5, 1300, 420, 60, 'AVL'),

-- University Students
('dddddddd-dddd-dddd-dddd-ddddddddddda', 'Kirubel Tadesse', '+251939012345', 'kirubel.t@email.com', 3, 800, 250, 30, 'LIV'),
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'Robel Gebre', '+251940123456', 'robel.g@email.com', 4, 1200, 380, 45, 'ARS'),
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'Samuel Kifle', '+251941234567', 'samuel.k@email.com', 2, 400, 150, 20, 'MCI'),
('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'Michael Biru', '+251942345678', 'michael.b@email.com', 5, 1600, 520, 75, 'CHE'),
('dddddddd-dddd-dddd-dddd-ddddddddddd4', 'Yonatan Debebe', '+251943456789', 'yonatan.d@email.com', 3, 700, 220, 25, 'MUN'),
('dddddddd-dddd-dddd-dddd-ddddddddddd5', 'Nathnael Alemu', '+251944567890', 'nathnael.a@email.com', 6, 2000, 650, 95, 'TOT'),

-- Female University Students
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeea', 'Feven Haile', '+251945678901', 'feven.h@email.com', 4, 1050, 340, 50, 'LIV'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'Helina Tadesse', '+251946789012', 'helina.t@email.com', 5, 1450, 480, 65, 'ARS'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'Mahlet Abebe', '+251947890123', 'mahlet.a@email.com', 3, 650, 200, 35, 'MCI'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'Ruth Bekele', '+251948901234', 'ruth.b@email.com', 7, 2800, 850, 120, 'NEW'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 'Sara Gebreyes', '+251949012345', 'sara.g@email.com', 2, 350, 120, 15, 'CHE'),

-- More Diverse Names
('ffffffff-ffff-ffff-ffff-fffffffffffa', 'Binyam Kebede', '+251950123456', 'binyam.k@email.com', 17, 11000, 3100, 650, 'LIV'),
('ffffffff-ffff-ffff-ffff-fffffffffff1', 'Habtamu Sisay', '+251951234567', 'habtamu.s@email.com', 10, 4200, 1250, 200, 'ARS'),
('ffffffff-ffff-ffff-ffff-fffffffffff2', 'Yidnekachew Zewdu', '+251952345678', 'yidnekachew.z@email.com', 8, 2900, 880, 145, 'MCI'),
('ffffffff-ffff-ffff-ffff-fffffffffff3', 'Meseret Defar', '+251953456789', 'meseret.d@email.com', 13, 7000, 2050, 420, 'CHE'),
('ffffffff-ffff-ffff-ffff-fffffffffff4', 'Tsegaye Kebede', '+251954567890', 'tsegaye.k@email.com', 20, 16000, 4200, 1000, 'LIV'),
('ffffffff-ffff-ffff-ffff-fffffffffff5', 'Genzebe Dibaba', '+251955678901', 'genzebe.d@email.com', 15, 8800, 2600, 520, 'ARS'),
('ffffffff-ffff-ffff-ffff-fffffffffff6', 'Kenenisa Bekele', '+251956789012', 'kenenisa.b@email.com', 22, 20000, 5500, 1200, 'MCI'),
('ffffffff-ffff-ffff-ffff-fffffffffff7', 'Tirunesh Dibaba', '+251957890123', 'tirunesh.d@email.com', 18, 13000, 3500, 800, 'NEW');

-- ==========================================
-- POPULATE LEAGUE MEMBERS
-- ==========================================

-- Ethiopia Overall (everyone joins by default)
INSERT INTO league_members (league_id, user_id, rank, total_points, gameweek_points)
SELECT '11111111-1111-1111-1111-111111111111', id,
       ROW_NUMBER() OVER (ORDER BY xp DESC),
       xp / 4 + (random() * 200)::int,
       50 + (random() * 40)::int
FROM users;

-- Addis Ababa City League (subset)
INSERT INTO league_members (league_id, user_id, rank, total_points, gameweek_points)
SELECT '11111111-1111-1111-1111-111111111112', id,
       ROW_NUMBER() OVER (ORDER BY xp DESC),
       xp / 4 + (random() * 200)::int,
       50 + (random() * 40)::int
FROM users
WHERE random() < 0.6;

-- Weekly Jackpot (paid league - fewer members)
INSERT INTO league_members (league_id, user_id, rank, total_points, gameweek_points)
SELECT '22222222-2222-2222-2222-222222222221', id,
       ROW_NUMBER() OVER (ORDER BY xp DESC),
       xp / 4 + (random() * 200)::int,
       50 + (random() * 40)::int
FROM users
WHERE level >= 5 AND random() < 0.3;

-- Coin Entry - Weekly Challenge
INSERT INTO league_members (league_id, user_id, rank, total_points, gameweek_points)
SELECT '33333333-3333-3333-3333-333333333331', id,
       ROW_NUMBER() OVER (ORDER BY xp DESC),
       xp / 4 + (random() * 200)::int,
       50 + (random() * 40)::int
FROM users
WHERE random() < 0.4;

-- AAU Students League
INSERT INTO league_members (league_id, user_id, rank, total_points, gameweek_points)
SELECT '55555555-5555-5555-5555-555555555552', id,
       ROW_NUMBER() OVER (ORDER BY xp DESC),
       xp / 4 + (random() * 200)::int,
       50 + (random() * 40)::int
FROM users
WHERE level <= 7;

-- ==========================================
-- SAMPLE CHAT MESSAGES
-- ==========================================

INSERT INTO chat_messages (league_id, user_id, message, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Did you see Haaland blank? My captaincy is ruined! 😂', NOW() - INTERVAL '2 hours'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba', 'I told you to pick Salah! 🦁', NOW() - INTERVAL '1 hour 55 minutes'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'There goes my rank... time to use the Wildcard?', NOW() - INTERVAL '1 hour 50 minutes'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-ccccccccccca', 'Palmer carrying my team this week!', NOW() - INTERVAL '1 hour'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Anyone else bringing in Isak?', NOW() - INTERVAL '45 minutes'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Newcastle fixtures look tasty', NOW() - INTERVAL '30 minutes'),
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-ddddddddddda', 'First time cracking top 100k! 🎉', NOW() - INTERVAL '15 minutes'),
('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeea', 'Congratulations! Keep it going!', NOW() - INTERVAL '10 minutes'),

-- Addis Ababa chat
('11111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Addis managers, who are we captaining?', NOW() - INTERVAL '3 hours'),
('11111111-1111-1111-1111-111111111112', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Salah at Anfield is always the answer', NOW() - INTERVAL '2 hours 30 minutes'),
('11111111-1111-1111-1111-111111111112', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'I am going differential with Son', NOW() - INTERVAL '2 hours'),

-- Weekly Jackpot chat
('22222222-2222-2222-2222-222222222221', 'cccccccc-cccc-cccc-cccc-ccccccccccc5', 'Prize pool looking good this week!', NOW() - INTERVAL '4 hours'),
('22222222-2222-2222-2222-222222222221', 'ffffffff-ffff-ffff-ffff-fffffffffff4', 'Good luck everyone! May the best team win', NOW() - INTERVAL '3 hours 30 minutes');
