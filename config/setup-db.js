const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'new_password',
        multipleStatements: true
    });

    console.log('Connected to MySQL. Setting up database...');

    // Create database
    await conn.query('CREATE DATABASE IF NOT EXISTS bhumij CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await conn.query('USE bhumij');

    // Site settings table
    await conn.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) UNIQUE NOT NULL,
            setting_value_en TEXT,
            setting_value_bn TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Admin users table
    await conn.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Greeting messages table (Page 1-2 messages from CM, Minister, Secretary)
    await conn.query(`
        CREATE TABLE IF NOT EXISTS greeting_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            person_name_en VARCHAR(255),
            person_name_bn VARCHAR(255),
            designation_en TEXT,
            designation_bn TEXT,
            message_en TEXT,
            message_bn TEXT,
            image_path VARCHAR(500),
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Board formation & functions
    await conn.query(`
        CREATE TABLE IF NOT EXISTS board_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            section_key VARCHAR(100) UNIQUE,
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            content_en TEXT,
            content_bn TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Development works / achievements
    await conn.query(`
        CREATE TABLE IF NOT EXISTS achievements (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            description_en TEXT,
            description_bn TEXT,
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Meeting minutes
    await conn.query(`
        CREATE TABLE IF NOT EXISTS meetings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            meeting_number INT,
            meeting_date VARCHAR(50),
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            content_en TEXT,
            content_bn TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Gallery categories
    await conn.query(`
        CREATE TABLE IF NOT EXISTS gallery_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name_en VARCHAR(255),
            name_bn VARCHAR(255),
            description_en TEXT,
            description_bn TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Gallery images
    await conn.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT,
            image_path VARCHAR(500),
            caption_en VARCHAR(500),
            caption_bn VARCHAR(500),
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE CASCADE
        )
    `);

    // Poems / literature
    await conn.query(`
        CREATE TABLE IF NOT EXISTS poems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title_en VARCHAR(255),
            title_bn VARCHAR(255),
            content_en TEXT,
            content_bn TEXT,
            author_en VARCHAR(255),
            author_bn VARCHAR(255),
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Historical articles (Jilpa Laya, Bhumij Revolt, etc.)
    await conn.query(`
        CREATE TABLE IF NOT EXISTS articles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) UNIQUE,
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            content_en TEXT,
            content_bn TEXT,
            author_en VARCHAR(255),
            author_bn VARCHAR(255),
            image_path VARCHAR(500),
            article_type ENUM('history', 'biography', 'editorial', 'script') DEFAULT 'history',
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Board members
    await conn.query(`
        CREATE TABLE IF NOT EXISTS board_members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sl_no INT,
            name_en VARCHAR(255),
            name_bn VARCHAR(255),
            designation_en VARCHAR(255),
            designation_bn VARCHAR(255),
            address_en TEXT,
            address_bn TEXT,
            phone VARCHAR(100),
            image_path VARCHAR(500),
            member_type ENUM('elected', 'government') DEFAULT 'elected',
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Hero slider images
    await conn.query(`
        CREATE TABLE IF NOT EXISTS hero_slides (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image_path VARCHAR(500),
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            subtitle_en VARCHAR(500),
            subtitle_bn VARCHAR(500),
            sort_order INT DEFAULT 0,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // District tour activities
    await conn.query(`
        CREATE TABLE IF NOT EXISTS tour_activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title_en VARCHAR(500),
            title_bn VARCHAR(500),
            description_en TEXT,
            description_bn TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    console.log('All tables created successfully!');

    // Insert default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await conn.query(`
        INSERT IGNORE INTO admin_users (username, password, full_name)
        VALUES ('admin', ?, 'Administrator')
    `, [hashedPassword]);

    // Insert site settings
    const settings = [
        ['site_title', 'Bhumij Khobor - Quarterly Newsletter', 'ভূমিজ খবর - ত্রৈমাসিক নিউজলেটার'],
        ['site_subtitle', 'West Bengal Bhumij Development Board', 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ'],
        ['volume_info', 'Volume-1 | March - 2026', 'Volume-1 | March - 2026'],
        ['footer_text', 'Published by the West Bengal Bhumij Development Board, Government of West Bengal', 'পশ্চিমবঙ্গ সরকারের পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ দ্বারা প্রকাশিত'],
        ['prepared_by', 'Prepared by ANM News Pvt. Ltd. Website: www.anmnews.in', 'ANM News Pvt. Ltd. দ্বারা প্রস্তুত | ওয়েবসাইট: www.anmnews.in'],
        ['introduction_en', 'In the first newsletter "Bhumij Khobor" published through the West Bengal Bhumij Development Board under the management of the Tribal Development Department of the Government of West Bengal, the socio-economic position of the Bhumij community across the state has been highlighted.', ''],
        ['introduction_bn', '', 'পশ্চিমবঙ্গ সরকারের আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ডের মাধ্যমে প্রকাশিত প্রথম নিউজলেটার "ভূমিজ খবর" রাজ্যজুড়ে ভূমিজ সম্প্রদায়ের আর্থ-সামাজিক অবস্থান তুলে ধরা হল।'],
        ['contact_address', 'Office of the Divisional Commissioner, Keranitola, Medinipur, District - Paschim Medinipur, Pin - 721101', 'ডিভিশনাল কমিশনারের দপ্তর, কেরানিতলা, মেদিনীপুর জিলা— পশ্চিম মেদিনীপুর পিন— ৭২১১০১']
    ];

    for (const [key, en, bn] of settings) {
        await conn.query(`INSERT IGNORE INTO site_settings (setting_key, setting_value_en, setting_value_bn) VALUES (?, ?, ?)`, [key, en, bn]);
    }

    // Insert greeting messages
    const greetings = [
        {
            name_en: 'Mamata Banerjee', name_bn: 'মমতা বন্দ্যোপাধ্যায়',
            designation_en: 'Chief Minister, West Bengal', designation_bn: 'মুখ্যমন্ত্রী, পশ্চিমবঙ্গ',
            message_en: 'Under the management of the Backward Classes Welfare and Tribal Development Department of the Government of West Bengal, the West Bengal Bhumij Development Board and the Divisional Commissioner of the Medinipur Division have taken an initiative to publish a quarterly newsletter titled "Bhumij Khobor" to bring the problems and stories of the state\'s Bhumij community and the groups within this department to the public eye. I extend my sincere greetings and congratulations to everyone involved in this initiative. The Bhumij Development Board is one of the backbones of West Bengal\'s rural economy. I firmly believe that this "Bhumij Khobor" quarterly publication will be specifically capable of increasing awareness of the Bhumij community among the general public, and through this, the dream of reaching the benefits of the Bhumij movement to every village in West Bengal will be fulfilled. I wish this publication all-round success.',
            message_bn: 'পশ্চিমবঙ্গ সরকারের অনগ্রসর শ্রেণী কল্যাণ ও আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ ও ডিভিশনাল কমিশনার মেদিনীপুর বিভাগের উদ্যোগে রাজ্যের ভূমিজ সম্প্রদায় এবং এই বিভাগের অন্তর্গত গোষ্ঠীগুলির সমস্যাদি কাহিনী জনসমক্ষে তুলে ধরার উদ্দেশ্যে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। এই উদ্যোগের সাথে যুক্ত সবাইকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাই। ভূমিজ উন্নয়ন বোর্ড পশ্চিমবঙ্গের গ্রামীণ অর্থনীতির একটি অন্যতম মেরুদণ্ড। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই "ভূমিজ খবর" ত্রৈমাসিক প্রকাশনা আপামর জনসাধারণের মধ্যে ভূমিজ সম্প্রদায়ের সচেতনতা বৃদ্ধিতে বিশেষভাবে সক্ষম হবে এবং এর মাধ্যমে পশ্চিমবঙ্গের প্রতিটি গ্রামে ভূমিজ আন্দোলনের সুফল পৌঁছে দেওয়ার স্বপ্নপূরণ হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।',
            image: '7.jpg', sort: 1
        },
        {
            name_en: 'Bulu Chik Baraik', name_bn: 'বুলু চিক বরাইক',
            designation_en: 'Minister-in-Charge, Tribal Development Department, Government of West Bengal', designation_bn: 'ভারপ্রাপ্ত মন্ত্রী, আদিবাসী উন্নয়ন বিভাগ, পশ্চিমবঙ্গ সরকার',
            message_en: 'With the aim of making the Bhumij community stronger, self-reliant, and independent, the West Bengal Bhumij Development Board and the Divisional Commissioner of Medinipur Division have taken the initiative to publish a quarterly newsletter titled "Bhumij Khobor". I firmly believe that this "Bhumij Khobor" quarterly publication will be specifically able to increase the awareness of the Bhumij community among the general public. I wish all success to this publication.',
            message_bn: 'ভূমিজ সম্প্রদায়কে আরও শক্তিশালী, আত্মনির্ভরশীল ও স্বাবলম্বী করে গড়ে তোলার লক্ষ্যে পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ড ও ডিভিশনাল কমিশনার মেদিনীপুর বিভাগের উদ্যোগে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই "ভূমিজ খবর" ত্রৈমাসিক প্রকাশনা আপামর জনসাধারণের মধ্যে ভূমিজ সম্প্রদায়ের সচেতনতা বৃদ্ধিতে বিশেষভাবে সক্ষম হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।',
            image: '8.jpg', sort: 2
        },
        {
            name_en: 'Smt. Choten Dhendup Lama, IAS', name_bn: 'শ্রীমতি চোটেন ধেন্দুপ লামা, আই.এ.এস',
            designation_en: 'Principal Secretary, Tribal Development Department, Government of West Bengal', designation_bn: 'প্রধান সচিব, আদিবাসী উন্নয়ন বিভাগ, পশ্চিমবঙ্গ সরকার',
            message_en: 'The West Bengal Bhumij Development Board has taken an initiative to publish a quarterly newsletter titled "Bhumij Khobor" with the aim of presenting the stories of the problems of the state\'s Bhumij community to the public. I firmly believe that this publication will increase awareness among the general public. I wish for the all-round success of this publication.',
            message_bn: 'রাজ্যের ভূমিজ সম্প্রদায় এবং এই বিভাগের অন্তর্গত গোষ্ঠীগুলির সমস্যাদি কাহিনী জনসমক্ষে তুলে ধরার উদ্দেশ্যে পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদের উদ্যোগে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই প্রকাশনা আপামর জনসাধারণের মধ্যে সচেতনতা বৃদ্ধিতে সক্ষম হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।',
            image: '9.jpg', sort: 3
        }
    ];

    for (const g of greetings) {
        await conn.query(`INSERT IGNORE INTO greeting_messages (person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, image_path, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [g.name_en, g.name_bn, g.designation_en, g.designation_bn, g.message_en, g.message_bn, g.image, g.sort]);
    }

    // Insert board members
    const members = [
        { sl: 1, ne: 'Dr. Godala Kiran Kumar, IAS', nb: 'ড. গোডালা কিরণ কুমার, আই.এ.এস.', de: 'Chairman', db: 'চেয়ারম্যান', ae: 'Office of the Divisional Commissioner, Keranitola, Medinipur', ab: 'ডিভিশনাল কমিশনারের দপ্তর, কেরানিতলা, মেদিনীপুর', p: '', t: 'elected' },
        { sl: 2, ne: 'Shri Anshuman Adhikari, WBCS', nb: 'শ্রী অংশুমান অধিকারী, ডব্লিউ.বি.সি.এস', de: 'Member Secretary', db: 'মেম্বার সেক্রেটারি', ae: 'Office of the Divisional Commissioner, Keranitola, Medinipur', ab: 'ডিভিশনাল কমিশনারের দপ্তর, কেরানিতলা, মেদিনীপুর', p: '97329 00999', t: 'elected' },
        { sl: 3, ne: 'Shri Rampada Singh Sardar', nb: 'শ্রী রামপদ সিং সর্দ্দার', de: 'Vice Chairman', db: 'ভাইস চেয়ারম্যান', ae: 'Vill- Pidra, PO- Chakilbon, PS- Purulia Mofussil, Purulia', ab: 'গ্রাম- পিড়রা, পোস্ট অফিস- চাকিলবোন, থানা— পুরুলিয়া মফঃস্বল, পুরুলিয়া', p: '9362496368', t: 'elected' },
        { sl: 4, ne: 'Shri Nityalal Singh', nb: 'শ্রী নিত্যলাল সিং', de: 'Vice Chairman', db: 'ভাইস চেয়ারম্যান', ae: 'Vill- Boyardihi, PO - Thakurapahari, PS - Belpahari, Jhargram', ab: 'গ্রাম- বোয়ারডিহি, পোস্ট অফিস - ঠাকুরানপাহাড়ী, থানা - বেলপাহাড়ী, ঝাড়গ্রাম', p: '73092 56706', t: 'elected' },
        { sl: 5, ne: 'Shri Dhananjaya Sardar', nb: 'শ্রী ধনঞ্জয় সর্দ্দার', de: 'Vice Chairman', db: 'ভাইস চেয়ারম্যান', ae: 'Vill-Khadutor, PO-Phulkushmia, PS-Barikul, Bankura', ab: 'গ্রাম-খাদুতোর, পোঃ-ফুলকুশমিয়া, থানা-বারিকুল, বাঁকুড়া', p: '97347 31599', t: 'elected' },
        { sl: 6, ne: 'Shri Nitai Singh Sardar', nb: 'শ্রী নিতাই সিং সর্দ্দার', de: 'Member', db: 'মেম্বার', ae: 'Vill- Kalusar, PO- Pali, PS- Barikul, Bankura', ab: 'গ্রাম— কলুসার, পোস্ট অফিস— পালি, থানা— বারিকুল, বাঁকুড়া', p: '80162 67835', t: 'elected' },
        { sl: 7, ne: 'Shri Dhananjaya Mura', nb: 'শ্রী ধনঞ্জয় মুড়া', de: 'Member', db: 'মেম্বার', ae: 'Vill- Ichap, PO- Ichag, PS- Jhalda, Purulia', ab: 'গ্রাম— ইছাপ, পোস্ট অফিস— ইছাগ, থানা— ঝালদা, পুরুলিয়া', p: '98756 15374', t: 'elected' },
        { sl: 8, ne: 'Shri Gopal Singh', nb: 'শ্রী গোপাল সিং', de: 'Member', db: 'মেম্বার', ae: 'Vill- Pankui, PO- Antala, PS- Debra, Paschim Medinipur', ab: 'গ্রাম— পানকুই, পোস্ট অফিস— অন্তলা, থানা— ডেবরা, পশ্চিম মেদিনীপুর', p: '85973 46516', t: 'elected' },
    ];

    for (const m of members) {
        await conn.query(`INSERT IGNORE INTO board_members (sl_no, name_en, name_bn, designation_en, designation_bn, address_en, address_bn, phone, member_type, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [m.sl, m.ne, m.nb, m.de, m.db, m.ae, m.ab, m.p, m.t, m.sl]);
    }

    // Insert gallery categories
    const categories = [
        { ne: 'Maghaburu Festival', nb: 'মাঘবুরু উৎসব', de: 'Traditional Bhumij festival celebrations across 4 districts', db: 'চারটি জেলায় ভূমিজদের ঐতিহ্যবাহী উৎসব পালন' },
        { ne: 'Development Programs', nb: 'উন্নয়ন মূলক কর্মসূচি', de: 'Various developmental activities by the Board', db: 'পর্ষদ দ্বারা আয়োজিত বিভিন্ন উন্নয়নমূলক কর্মসূচি' },
        { ne: 'Board Meetings', nb: 'পর্ষদ বৈঠক', de: 'Meetings and conferences organized by the Board', db: 'পর্ষদ আয়োজিত বৈঠক ও সম্মেলন' },
        { ne: 'Sports Competitions', nb: 'ক্রীড়া প্রতিযোগিতা', de: 'Sports events organized by the Board', db: 'পর্ষদ আয়োজিত ক্রীড়া প্রতিযোগিতা' },
        { ne: 'Certificate Camps', nb: 'শংসাপত্র প্রদান শিবির', de: 'Caste certificate and land mutation camps', db: 'জাতি শংসাপত্র ও ল্যান্ড মিউটেশন শিবির' },
        { ne: 'Bright Moments', nb: 'উজ্জ্বল মুহূর্ত', de: 'Memorable moments from Board activities', db: 'পর্ষদের কার্যক্রমের স্মরণীয় মুহূর্ত' }
    ];

    for (const c of categories) {
        await conn.query(`INSERT IGNORE INTO gallery_categories (name_en, name_bn, description_en, description_bn, sort_order)
            VALUES (?, ?, ?, ?, ?)`,
            [c.ne, c.nb, c.de, c.db, categories.indexOf(c) + 1]);
    }

    // Insert poems
    const poems = [
        {
            te: 'Bar Kaji', tb: 'বার কাজি',
            ce: 'Listen to my words O people,\nThe elders of our first village,\nThe elders of our first village.\nLet us all walk together as one.\nMountain rocks and trees are our home\nWe all say this.\nLet us all walk together as one.\nOur words and our language\nWe speak them with pride.\nJust like the father knows the child\nWe shall cherish each other,\nListen to my words O people,\nThe elders of our first village,\nLet us all walk together as one.\nOur language is our identity\nWe shall not let it fade.\nOur rules, religion, dance and songs\nThey are ours alone,\nWe shall not let them fade\nLet us all walk together as one.',
            cb: 'বার কাজি মেতা পেগীয়ও\nমাড়াং হাতু হড়ক,\nমাড়াং হাতু হড়ক।\nআবু যত মোসা তেবু সেনোয়া।।\nবুরু দিরি দারক গে বাসা আবু\nআবু দবু মেনেয়া।\nআবু যত মোসাতেবু সেনোয়া।\nআবু ভাষা কাজি যত গে\nমেন-মেন মেনাতেবু মেনেয়া।\nজানে বাবা লেকা যত ত্বেবু\nসালা-সায় এনয়া,\nবার কাজি মেতা পেগীয়ও\nমাড়াং হাতু হড়ক,\nআবু যত মোসা ত্বেবু সেনোয়া।।',
            ae: 'Birendra Sardar', ab: 'বীরেন্দ্র সদ্দার'
        },
        {
            te: 'Murukh Baha (Palash Flower)', tb: 'মুরুঃ বাহা',
            ce: 'Winter has arrived,\nThe Murukh flower has bloomed.\nWith its bright reddish-orange hue,\nThe whole country is decorated.\nIt comes with gentle swaying,\nIn our midst.\nDon\'t knock down the Murukh flower,\nDon\'t trample it.\nThe honey-sweet nectar of Murukh,\nThe mountain birds will sip.\nBecause if there is Murukh flower among us,\nIt will surely come back next year.',
            cb: 'জেটে সিগি সেটের জানা,\nমুরুঃ বাহা ফুটোও জানা।\nরাংগা রাংগা সুরুক বাহাতে,\nগোটা দিশম সাজাও জানা।।\nলীদা লীলাতে হিজু জানা,\nআবু কো তালারে।\nমুরুক বাহা আলো বুন কোটা এয়া,\nআলো বুন পজ এয়া।\nমুরুক বাহা হয়েম সিবিল রাসে,\nবুরু চেঁড়ে চিপকুদ কো লুই আঃ।।\nকারোদো মুরুঃ বাহা আবু কো তালারে,\nহিতজান কালম কাকেও হিজ দাড়িয়া।।',
            ae: 'Sri Nityalal Singh', ab: 'শ্রী নিত্যলাল সিং'
        },
        {
            te: 'Jargi Gama (Monsoon Rain)', tb: 'জারগি গামা',
            ce: 'Rain, oh rain\nSo much rain, monsoon rain.\nIt rains from the morning\nIt rains till the evening\nIt rains the whole day\nIt rains the whole night\nRain, oh rain,\nSo much rain.\nMonsoon rain\nDrizzling rain\nSplashing rain\nRain in the mountains\nRain in the valleys\nRain everywhere\nSo much rain,\nRain, oh rain.',
            cb: 'গামা গে গামা\nইমিনগে গামা, জারগি গামা।\nসেতাঃ আতে গামা\nআয়ুব হাবেজ গামা\nগোটা সিদি গামা\nগোটা নিদা গামা\nগামা গে গামা,\nইমিন গে গামা।\nজারগি গামা\nপুস্তুর পুস্তুর গামা\nসাড়াই সাড়াই গামা\nবুরু রই গামা\nগাড়া রেহ গামা\nগোটা গে গামা\nইমিন গে গামা,\nগামা গে গামা।',
            ae: 'Birendra Sardar', ab: 'বীরেন্দ্র সদ্দার'
        }
    ];

    for (let i = 0; i < poems.length; i++) {
        const p = poems[i];
        await conn.query(`INSERT IGNORE INTO poems (title_en, title_bn, content_en, content_bn, author_en, author_bn, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [p.te, p.tb, p.ce, p.cb, p.ae, p.ab, i + 1]);
    }

    console.log('Seed data inserted successfully!');
    await conn.end();
    console.log('Database setup complete!');
    process.exit(0);
}

setupDatabase().catch(err => {
    console.error('Error setting up database:', err);
    process.exit(1);
});
