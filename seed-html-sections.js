const pool = require('./config/database');

async function migrate() {
    // 1. Etymology cards
    await pool.query(`CREATE TABLE IF NOT EXISTS etymology_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(50),
        title_en VARCHAR(255), title_bn VARCHAR(255),
        content_en TEXT, content_bn TEXT,
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 2. Geographic states (for map section)
    await pool.query(`CREATE TABLE IF NOT EXISTS geographic_states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        state_code VARCHAR(10),
        name_en VARCHAR(100), name_bn VARCHAR(100),
        subtitle_en VARCHAR(255), subtitle_bn VARCHAR(255),
        description_en TEXT, description_bn TEXT,
        image_path VARCHAR(500),
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 3. Government Initiatives
    await pool.query(`CREATE TABLE IF NOT EXISTS initiatives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(50),
        title_en VARCHAR(255), title_bn VARCHAR(255),
        content_en TEXT, content_bn TEXT,
        features_en TEXT, features_bn TEXT,
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 4. Culture cards
    await pool.query(`CREATE TABLE IF NOT EXISTS culture_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(50), color VARCHAR(20) DEFAULT 'primary',
        title_en VARCHAR(255), title_bn VARCHAR(255),
        content_en TEXT, content_bn TEXT,
        image_url VARCHAR(500),
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 5. Historical timeline events
    await pool.query(`CREATE TABLE IF NOT EXISTS timeline_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        period_code VARCHAR(10),
        period_label_en VARCHAR(100), period_label_bn VARCHAR(100),
        title_en VARCHAR(255), title_bn VARCHAR(255),
        description_en TEXT, description_bn TEXT,
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 6. Notable people
    await pool.query(`CREATE TABLE IF NOT EXISTS notable_people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_en VARCHAR(255), name_bn VARCHAR(255),
        title_en VARCHAR(100), title_bn VARCHAR(100),
        description_en TEXT, description_bn TEXT,
        image_path VARCHAR(500),
        sort_order INT DEFAULT 0, is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    console.log('✅ All 6 new tables created!');

    // ===== SEED DATA =====

    // Etymology Cards
    const etymCards = [
        { icon:'landscape', te:'Bhūmi — The Earth', tb:'ভূমি — পৃথিবী', ce:'Deriving from Sanskrit "bhūmi", meaning land or soil. It literally translates to "one who is born from the soil," emphasizing their autochthonous nature.', cb:'সংস্কৃত "ভূমি" থেকে উদ্ভূত, যার অর্থ জমি বা মাটি। এটি আক্ষরিক অর্থে "যিনি মাটি থেকে জন্ম নিয়েছেন" এমন ব্যক্তিকে বোঝায়, যা তাদের আদিবাসী প্রকৃতিকে জোর দেয়।' },
        { icon:'public', te:'Bhūm-jo — From Bhum', tb:'ভূম-জো — ভূম থেকে', ce:'Scholarly interpretations suggest "Bhūm-jo" signifies people originating specifically from the ancient "Bhum" territories of the eastern plateau.', cb:'পণ্ডিতদের ব্যাখ্যা অনুসারে "ভূম-জো" পূর্ব মালভূমির প্রাচীন "ভূম" অঞ্চল থেকে উদ্ভূত মানুষদের বোঝায়।' },
        { icon:'emoji_nature', te:'Original Inhabitants', tb:'মূল অধিবাসী', ce:'British ethnographic records by Dalton highlight the Bhumij as the primal inhabitants of Dhalbhum and Barabhum, predating major migrations.', cb:'ডালটনের ব্রিটিশ জাতিতাত্ত্বিক নথি ভূমিজদের ধলভূম ও বড়াভূমের আদি অধিবাসী হিসেবে চিহ্নিত করে, যারা প্রধান অভিবাসনের পূর্ববর্তী।' }
    ];
    for (let i = 0; i < etymCards.length; i++) {
        const c = etymCards[i];
        await pool.query('INSERT INTO etymology_cards (icon,title_en,title_bn,content_en,content_bn,sort_order) VALUES (?,?,?,?,?,?)',
            [c.icon, c.te, c.tb, c.ce, c.cb, i+1]);
    }
    console.log('✅ 3 Etymology cards inserted');

    // Geographic States
    const geoStates = [
        { code:'jh', ne:'Jharkhand', nb:'ঝাড়খণ্ড', se:'Primal Heartland', sb:'আদি কেন্দ্রভূমি', de:'The primary heartland of the Bhumij tribe, concentrated in East Singhbhum and Saraikela Kharsawan.', db:'ভূমিজ উপজাতির প্রাথমিক কেন্দ্রভূমি, পূর্ব সিংভূম এবং সরাইকেলা খরসাওয়ানে কেন্দ্রীভূত।', img:'' },
        { code:'wb', ne:'West Bengal', nb:'পশ্চিমবঙ্গ', se:'Cultural Heartland & Leadership', sb:'সাংস্কৃতিক কেন্দ্রভূমি ও নেতৃত্ব', de:'Significant presence in the Purulia, Bankura, and Midnapore districts, maintaining strong cultural ties.', db:'পুরুলিয়া, বাঁকুড়া এবং মেদিনীপুর জেলায় উল্লেখযোগ্য উপস্থিতি, শক্তিশালী সাংস্কৃতিক বন্ধন বজায় রেখে।', img:'' },
        { code:'or', ne:'Odisha', nb:'ওড়িশা', se:'Ancestral Hills', sb:'পূর্বপুরুষের পর্বত', de:'Ancestral inhabitants of Mayurbhanj and Sundargarh, preserving unique linguistic dialects.', db:'ময়ূরভঞ্জ এবং সুন্দরগড়ের আদি অধিবাসী, অনন্য ভাষাগত উপভাষা সংরক্ষণ করে।', img:'' },
        { code:'as', ne:'North East', nb:'উত্তর-পূর্ব', se:'Tea Garden Belt', sb:'চা বাগান এলাকা', de:'Communities migrated during the colonial era, now a vital part of the North Eastern cultural tapestry.', db:'ঔপনিবেশিক যুগে অভিবাসিত সম্প্রদায়, এখন উত্তর-পূর্বাঞ্চলের সাংস্কৃতিক মিশ্রণের একটি গুরুত্বপূর্ণ অংশ।', img:'' }
    ];
    for (let i = 0; i < geoStates.length; i++) {
        const s = geoStates[i];
        await pool.query('INSERT INTO geographic_states (state_code,name_en,name_bn,subtitle_en,subtitle_bn,description_en,description_bn,image_path,sort_order) VALUES (?,?,?,?,?,?,?,?,?)',
            [s.code, s.ne, s.nb, s.se, s.sb, s.de, s.db, s.img, i+1]);
    }
    console.log('✅ 4 Geographic states inserted');

    // Government Initiatives
    const inits = [
        { icon:'gavel', te:'Scheduled Tribe Status', tb:'তফসিলি উপজাতি মর্যাদা', ce:'Constitutional recognition in Jharkhand, Odisha, and West Bengal, ensuring legal and social safeguards.', cb:'ঝাড়খণ্ড, ওড়িশা এবং পশ্চিমবঙ্গে সাংবিধানিক স্বীকৃতি, আইনি ও সামাজিক সুরক্ষা নিশ্চিত করে।', fe:'Land Rights Protection|Job Reservation', fb:'ভূমি অধিকার সুরক্ষা|চাকরি সংরক্ষণ' },
        { icon:'school', te:'Education Support', tb:'শিক্ষা সহায়তা', ce:'Comprehensive scholarship programs and Eklavya residential schools for academic excellence.', cb:'একাডেমিক শ্রেষ্ঠত্বের জন্য ব্যাপক বৃত্তি কর্মসূচি এবং একলব্য আবাসিক বিদ্যালয়।', fe:'Post-Matric Scholarships|Higher Education Grants', fb:'পোস্ট-ম্যাট্রিক বৃত্তি|উচ্চ শিক্ষা অনুদান' },
        { icon:'translate', te:'Language Vitality', tb:'ভাষার প্রাণশক্তি', ce:'Recognition of Bhumij as a second state language (2019) and active promotion of the Ol Onal script.', cb:'ভূমিজ ভাষাকে দ্বিতীয় রাজ্য ভাষা হিসেবে স্বীকৃতি (২০১৯) এবং অল ওনাল লিপির সক্রিয় প্রচার।', fe:'Ol Onal Script Promotion|State Language Status', fb:'অল ওনাল লিপি প্রচার|রাজ্য ভাষা মর্যাদা' }
    ];
    for (let i = 0; i < inits.length; i++) {
        const n = inits[i];
        await pool.query('INSERT INTO initiatives (icon,title_en,title_bn,content_en,content_bn,features_en,features_bn,sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [n.icon, n.te, n.tb, n.ce, n.cb, n.fe, n.fb, i+1]);
    }
    console.log('✅ 3 Initiatives inserted');

    // Culture Cards
    const cultures = [
        { icon:'menu_book', color:'primary', te:'Language', tb:'ভাষা', ce:'Bhumij is a refined Austroasiatic language of the Munda subfamily, utilizing the unique Ol Onal script for its literary expression.', cb:'ভূমিজ মুন্ডা উপপরিবারের একটি পরিমার্জিত অস্ট্রোএশিয়াটিক ভাষা, এর সাহিত্যিক প্রকাশের জন্য অনন্য অল ওনাল লিপি ব্যবহার করে।', img:'' },
        { icon:'sports_martial_arts', color:'maya-blue', te:'Firkal Art', tb:'ফিরকাল শিল্প', ce:'A legendary ancient martial art tradition representing the warrior heritage and rhythmic combat mastery of the Bhumij people.', cb:'একটি কিংবদন্তি প্রাচীন মার্শাল আর্ট ঐতিহ্য, যা ভূমিজ জনগোষ্ঠীর যোদ্ধা ঐতিহ্য এবং ছন্দবদ্ধ যুদ্ধ দক্ষতার প্রতিনিধিত্ব করে।', img:'' },
        { icon:'temple_hindu', color:'sky-blue', te:'Sarnaism', tb:'সর্ণাবাদ', ce:'The core spiritual path, centered on nature worship and the preservation of sacred groves, coexisting harmoniously with traditional practices.', cb:'মূল আধ্যাত্মিক পথ, প্রকৃতি পূজা এবং পবিত্র বনের সংরক্ষণকে কেন্দ্র করে, ঐতিহ্যবাহী অনুশীলনের সাথে সামঞ্জস্যপূর্ণভাবে সহাবস্থান করে।', img:'' }
    ];
    for (let i = 0; i < cultures.length; i++) {
        const c = cultures[i];
        await pool.query('INSERT INTO culture_cards (icon,color,title_en,title_bn,content_en,content_bn,image_url,sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [c.icon, c.color, c.te, c.tb, c.ce, c.cb, c.img, i+1]);
    }
    console.log('✅ 3 Culture cards inserted');

    // Timeline Events
    const events = [
        { code:'ANC', le:'Ancient', lb:'প্রাচীন', te:'Original Inhabitants', tb:'আদি অধিবাসী', de:'Primal establishing of territories in Dhalbhum and Patkum.', db:'ধলভূম এবং পাটকুমে অঞ্চলের প্রাথমিক স্থাপনা।' },
        { code:'COL', le:'Colonial Era', lb:'ঔপনিবেশিক যুগ', te:'Rise of Nobility', tb:'অভিজাত শ্রেণীর উত্থান', de:'Epoch of Zamindars and Rajas among the Bhumij aristocracy.', db:'ভূমিজ অভিজাতদের মধ্যে জমিদার এবং রাজাদের যুগ।' },
        { code:'WAR', le:'1766 – 1816', lb:'১৭৬৬ – ১৮১৬', te:'Epoch of Resistance', tb:'প্রতিরোধের যুগ', de:'Chuar Rebellion: Uprising against East India Company policies.', db:'চুয়াড় বিদ্রোহ: ইস্ট ইন্ডিয়া কোম্পানির নীতির বিরুদ্ধে বিদ্রোহ।' },
        { code:'MOD', le:'1956', lb:'১৯৫৬', te:'Tribal Recognition', tb:'উপজাতি স্বীকৃতি', de:'Formal recognition of Bhumij as Scheduled Tribe.', db:'ভূমিজদের তফসিলি উপজাতি হিসেবে আনুষ্ঠানিক স্বীকৃতি।' }
    ];
    for (let i = 0; i < events.length; i++) {
        const e = events[i];
        await pool.query('INSERT INTO timeline_events (period_code,period_label_en,period_label_bn,title_en,title_bn,description_en,description_bn,sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [e.code, e.le, e.lb, e.te, e.tb, e.de, e.db, i+1]);
    }
    console.log('✅ 4 Timeline events inserted');

    // Notable People
    const people = [
        { ne:'Rani Shiromani', nb:'রানি শিরোমণি', te:'Freedom Fighter', tb:'স্বাধীনতা সংগ্রামী', de:'Queen of Karnagarh, legendary leader of the Chuar Rebellion.', db:'কর্ণগড়ের রানি, চুয়াড় বিদ্রোহের কিংবদন্তি নেত্রী।', img:'' },
        { ne:'G. N. Singh', nb:'গঙ্গা নারায়ণ সিং', te:'Revolutionary', tb:'বিপ্লবী', de:'Spearheaded the Bhumij Revolt against colonial land policies.', db:'ঔপনিবেশিক ভূমি নীতির বিরুদ্ধে ভূমিজ বিদ্রোহের নেতৃত্ব দিয়েছিলেন।', img:'' },
        { ne:'Gambhir S. Mura', nb:'গম্ভীর সিং মুড়া', te:'Padma Shri', tb:'পদ্মশ্রী', de:'World-renowned exponent of the tribal Chhau dance.', db:'আদিবাসী ছৌ নৃত্যের বিশ্ববিখ্যাত প্রবক্তা।', img:'' },
        { ne:'Durjan Singh', nb:'দুর্জন সিং', te:'Rebellion Leader', tb:'বিদ্রোহ নেতা', de:'A key strategist in the resistance against British forces.', db:'ব্রিটিশ বাহিনীর বিরুদ্ধে প্রতিরোধে একজন প্রধান কৌশলবিদ।', img:'' }
    ];
    for (let i = 0; i < people.length; i++) {
        const p = people[i];
        await pool.query('INSERT INTO notable_people (name_en,name_bn,title_en,title_bn,description_en,description_bn,image_path,sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [p.ne, p.nb, p.te, p.tb, p.de, p.db, p.img, i+1]);
    }
    console.log('✅ 4 Notable people inserted');

    console.log('\n🎉 All missing sections from HTML template are now in the DB!');
    process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
