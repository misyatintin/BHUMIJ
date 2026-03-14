const pool = require('./config/database');

async function seedGallery() {
    // Map images to gallery categories
    // Category 1: Maghaburu Festival
    // Category 2: Development Programs
    // Category 3: Board Meetings
    // Category 4: Sports
    // Category 5: Certificate Camps
    // Category 6: Bright Moments

    const imageMap = [
        // Board meetings & activities
        { cat: 3, img: '10.jpg', en: 'Board meeting proceedings', bn: 'পর্ষদের বৈঠকের কার্যবিবরণী' },
        { cat: 3, img: '11.jpg', en: 'Board assembly', bn: 'পর্ষদের সভা' },
        { cat: 2, img: '12.jpg', en: 'Development program inauguration', bn: 'উন্নয়ন কর্মসূচির উদ্বোধন' },
        { cat: 2, img: '13.jpg', en: 'Community gathering', bn: 'সম্প্রদায়ের সমাবেশ' },
        { cat: 2, img: '14.jpg', en: 'Community development activity', bn: 'সম্প্রদায়ের উন্নয়ন কার্যক্রম' },
        { cat: 1, img: '15.jpg', en: 'Maghaburu festival celebration', bn: 'মাঘবুরু উৎসব পালন' },
        { cat: 1, img: '16.jpg', en: 'Maghaburu festival crowd', bn: 'মাঘবুরু উৎসবের জনসমাবেশ' },
        { cat: 1, img: '17.jpg', en: 'Cultural dance performance', bn: 'সাংস্কৃতিক নৃত্য পরিবেশনা' },
        { cat: 1, img: '18.jpg', en: 'Festival rituals', bn: 'উৎসবের আচার-অনুষ্ঠান' },
        { cat: 1, img: '19.jpg', en: 'Traditional celebration', bn: 'ঐতিহ্যবাহী উৎসব' },
        { cat: 2, img: '20.jpg', en: 'Board development meeting', bn: 'পর্ষদের উন্নয়ন বৈঠক' },
        { cat: 2, img: '21.jpg', en: 'Public meeting', bn: 'জনসভা' },
        { cat: 4, img: '22.jpg', en: 'Sports competition', bn: 'ক্রীড়া প্রতিযোগিতা' },
        { cat: 4, img: '23.jpg', en: 'Sports event', bn: 'ক্রীড়া অনুষ্ঠান' },
        { cat: 5, img: '24.jpg', en: 'Certificate distribution camp', bn: 'শংসাপত্র বিতরণ শিবির' },
        { cat: 5, img: '25.jpg', en: 'Land mutation camp', bn: 'ভূমি মিউটেশন শিবির' },
        { cat: 6, img: '26.jpg', en: 'Felicitation ceremony', bn: 'সংবর্ধনা অনুষ্ঠান' },
        { cat: 6, img: '27.jpg', en: 'Award distribution', bn: 'পুরস্কার বিতরণ' },
        { cat: 6, img: '28.jpg', en: 'Cultural program', bn: 'সাংস্কৃতিক অনুষ্ঠান' },
        { cat: 6, img: '29.jpg', en: 'Community event', bn: 'সম্প্রদায়ের অনুষ্ঠান' },
        { cat: 6, img: '30.jpg', en: 'Bright moments', bn: 'উজ্জ্বল মুহূর্ত' },
        { cat: 6, img: '31.jpg', en: 'Group photo', bn: 'দলীয় ছবি' },
        { cat: 2, img: '32.jpg', en: 'Development initiative', bn: 'উন্নয়ন উদ্যোগ' },
        { cat: 2, img: '33.jpg', en: 'Community service', bn: 'সামাজিক সেবা' },
        { cat: 3, img: '34.jpg', en: 'Official meeting', bn: 'সরকারি বৈঠক' },
        { cat: 3, img: '35.jpg', en: 'Board conference', bn: 'পর্ষদের সম্মেলন' },
        { cat: 1, img: '36.jpg', en: 'Festival decoration', bn: 'উৎসবের সাজসজ্জা' },
        { cat: 1, img: '37.jpg', en: 'Traditional music', bn: 'ঐতিহ্যবাহী সংগীত' },
        { cat: 6, img: '38.jpg', en: 'Memorable moment', bn: 'স্মরণযোগ্য মুহূর্ত' },
        { cat: 6, img: '39.jpg', en: 'Cultural heritage', bn: 'সাংস্কৃতিক ঐতিহ্য' },
        { cat: 2, img: '40.jpg', en: 'Welfare program', bn: 'কল্যাণমূলক কর্মসূচি' },
        { cat: 2, img: '41.jpg', en: 'Social welfare activity', bn: 'সমাজকল্যাণ কার্যক্রম' },
        { cat: 4, img: '42.jpg', en: 'Youth sports', bn: 'যুব ক্রীড়া' },
        { cat: 4, img: '43.jpg', en: 'Tournament event', bn: 'প্রতিযোগিতার অনুষ্ঠান' },
        { cat: 5, img: '44.jpg', en: 'Document verification camp', bn: 'নথি যাচাই শিবির' },
        { cat: 5, img: '45.jpg', en: 'Community service camp', bn: 'সেবা শিবির' },
        { cat: 6, img: '46.jpg', en: 'Board activity', bn: 'পর্ষদের কার্যক্রম' },
        { cat: 6, img: '47.jpg', en: 'Public program', bn: 'জনকল্যাণ কর্মসূচি' },
        { cat: 2, img: '48.jpg', en: 'Educational program', bn: 'শিক্ষামূলক কর্মসূচি' },
        { cat: 2, img: '49.jpg', en: 'Awareness campaign', bn: 'সচেতনতা প্রচার' },
        { cat: 6, img: '50.jpg', en: 'Important event', bn: 'গুরুত্বপূর্ণ অনুষ্ঠান' },
        { cat: 6, img: '51.jpg', en: 'Celebration', bn: 'উদযাপন' },
        { cat: 6, img: '52.jpg', en: 'Community gathering', bn: 'সম্প্রদায়ের সমাবেশ' },
        { cat: 6, img: '53.jpg', en: 'Board event', bn: 'পর্ষদের অনুষ্ঠান' },
        { cat: 6, img: '54.jpg', en: 'Program event', bn: 'অনুষ্ঠান' },
        { cat: 6, img: '55.jpg', en: 'Official ceremony', bn: 'আনুষ্ঠানিক অনুষ্ঠান' },
        { cat: 6, img: '56.jpg', en: 'Board members gathering', bn: 'পর্ষদ সদস্যদের সমাবেশ' },
    ];

    for (let i = 0; i < imageMap.length; i++) {
        const m = imageMap[i];
        await pool.query('INSERT INTO gallery_images (category_id, image_path, caption_en, caption_bn, sort_order) VALUES (?, ?, ?, ?, ?)',
            [m.cat, m.img, m.en, m.bn, i + 1]);
    }

    // Add hero slides
    const slides = [
        { img: '15.jpg', te: 'Bhumij Khobor', tb: 'ভূমিজ খবর', se: 'Quarterly Newsletter of West Bengal Bhumij Development Board', sb: 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদের ত্রৈমাসিক নিউজলেটার' },
        { img: '17.jpg', te: 'Culture & Heritage', tb: 'সংস্কৃতি ও ঐতিহ্য', se: 'Preserving the rich traditions of the Bhumij community', sb: 'ভূমিজ সম্প্রদায়ের সমৃদ্ধ ঐতিহ্য সংরক্ষণ' },
        { img: '20.jpg', te: 'Development Works', tb: 'উন্নয়ন কর্মসূচি', se: 'Empowering the Bhumij community through development', sb: 'উন্নয়নের মাধ্যমে ভূমিজ সম্প্রদায়ের ক্ষমতায়ন' },
    ];

    for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        await pool.query('INSERT INTO hero_slides (image_path, title_en, title_bn, subtitle_en, subtitle_bn, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [s.img, s.te, s.tb, s.se, s.sb, i + 1]);
    }

    // Add articles
    const articles = [
        {
            slug: 'jilpa-laya', type: 'biography',
            te: 'Jilpa Laya - The Great Bhumij Leader', tb: 'জিলপা লায়া - মহান ভূমিজ নেতা',
            ce: 'Jilpa Laya was a significant Bhumij community leader whose life and contributions have shaped the identity and history of the Bhumij people. His leadership during challenging times inspired generations and left an indelible mark on the community\'s struggle for dignity and rights.\n\nJilpa Laya fought bravely during the 1857 uprising and played a key role in organizing the Bhumij community against colonial oppression. His vision for a united and empowered Bhumij society continues to inspire the community today.',
            cb: 'জিলপা লায়া ছিলেন একজন গুরুত্বপূর্ণ ভূমিজ সম্প্রদায়ের নেতা যার জীবন ও অবদান ভূমিজ মানুষের পরিচয় ও ইতিহাস গঠন করেছে। চ্যালেঞ্জিং সময়ে তার নেতৃত্ব প্রজন্মকে অনুপ্রাণিত করেছিল এবং সম্প্রদায়ের মর্যাদা ও অধিকারের সংগ্রামে একটি অমোচনীয় চিহ্ন রেখে গেছে।\n\nজিলপা লায়া ১৮৫৭ সালের অভ্যুত্থানের সময় সাহসিকতার সাথে লড়াই করেছিলেন এবং ঔপনিবেশিক নিপীড়নের বিরুদ্ধে ভূমিজ সম্প্রদায়কে সংগঠিত করতে গুরুত্বপূর্ণ ভূমিকা পালন করেছিলেন।',
            ae: '', ab: ''
        },
        {
            slug: 'bhumij-revolt', type: 'history',
            te: 'The Bhumij Revolt (1832-1833)', tb: 'ভূমিজ বিদ্রোহ (১৮৩২-১৮৩৩)',
            ce: 'The Bhumij Revolt, also known as the "Ganga Narain Hangama" (Ganga Narain\'s Disturbance), was one of the earliest tribal uprisings in colonial India. Led by Ganga Narain, a prominent Bhumij leader, this revolt occurred in the Jungle Mahal region (present-day Jhargram, Purulia, Bankura, and parts of Medinipur districts in West Bengal).\n\nThe immediate cause was the exploitative practices of the British colonial administration and their intermediaries, including heavy taxation, land alienation, and forced labor. Ganga Narain, along with other leaders, mobilized the Bhumij and other tribal communities to resist these oppressions.\n\nThe revolt saw significant participation from various tribal groups and challenged British authority in the region. Though eventually suppressed by British forces, the Bhumij Revolt left a lasting legacy as a symbol of tribal resistance against colonial exploitation.',
            cb: 'ভূমিজ বিদ্রোহ, যা "গঙ্গা নারায়ণ হাঙ্গামা" নামেও পরিচিত, ঔপনিবেশিক ভারতের প্রথমদিকের আদিবাসী অভ্যুত্থানগুলির মধ্যে একটি ছিল। ভূমিজ সম্প্রদায়ের একজন বিশিষ্ট নেতা গঙ্গা নারায়ণের নেতৃত্বে এই বিদ্রোহ জঙ্গল মহল অঞ্চলে (বর্তমান ঝাড়গ্রাম, পুরুলিয়া, বাঁকুড়া এবং পশ্চিমবঙ্গের মেদিনীপুর জেলার কিছু অংশ) সংঘটিত হয়েছিল।\n\nএর তাৎক্ষণিক কারণ ছিল ব্রিটিশ ঔপনিবেশিক প্রশাসন এবং তাদের মধ্যস্বত্বভোগীদের শোষণমূলক প্রথা, যার মধ্যে ছিল ভারী কর, জমি অধিগ্রহণ এবং বেগার শ্রম। গঙ্গা নারায়ণ অন্যান্য নেতাদের সাথে ভূমিজ ও অন্যান্য আদিবাসী সম্প্রদায়কে এই নিপীড়নের বিরুদ্ধে প্রতিরোধের জন্য সংগঠিত করেছিলেন।',
            ae: '', ab: ''
        },
        {
            slug: 'ol-onal-script', type: 'script',
            te: 'Ol Onal - The Bhumij Script', tb: 'ওল ওনল - ভূমিজ লিপি',
            ce: 'Ol Onal is a unique script developed specifically for writing the Ho language and other Munda family languages, closely related to the Bhumij community. The script was created by Lako Bodra, a visionary tribal intellectual, to preserve the linguistic identity of the Mundari-speaking peoples.\n\nThe Ol Onal script represents a significant cultural achievement for the Bhumij and related communities. It embodies the community\'s aspiration for linguistic autonomy and cultural preservation in the modern era.',
            cb: 'ওল ওনল হল একটি অনন্য লিপি যা হো ভাষা এবং মুণ্ডা পরিবারের অন্যান্য ভাষা লেখার জন্য বিশেষভাবে তৈরি করা হয়েছে, যা ভূমিজ সম্প্রদায়ের সাথে ঘনিষ্ঠভাবে সম্পর্কিত। একজন দূরদর্শী আদিবাসী বুদ্ধিজীবী লাকো বোদরা মুণ্ডারী-ভাষী জনগণের ভাষাগত পরিচয় সংরক্ষণের জন্য এই লিপি তৈরি করেছিলেন।\n\nওল ওনল লিপি ভূমিজ ও সম্পর্কিত সম্প্রদায়গুলির জন্য একটি উল্লেখযোগ্য সাংস্কৃতিক অর্জনকে প্রতিনিধিত্ব করে।',
            ae: '', ab: ''
        },
        {
            slug: 'board-formation', type: 'editorial',
            te: 'Formation and Functions of the Board', tb: 'পর্ষদের গঠন ও কার্যাবলী',
            ce: 'The West Bengal Bhumij Development Board was constituted under the provisions of the West Bengal Tribal Development Board Act. It operates under the Backward Classes Welfare and Tribal Development Department of the Government of West Bengal.\n\nThe Board was formed with the primary objective of facilitating the overall development and welfare of the Bhumij community across the state. Key functions include:\n\n1. Identifying the socio-economic needs of the Bhumij community\n2. Planning and implementing development programs\n3. Providing assistance for education, health, and livelihood improvement\n4. Preserving cultural heritage and traditions\n5. Coordinating with government departments for effective service delivery\n6. Organizing cultural events and festivals\n7. Maintaining community records and documentation',
            cb: 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ পশ্চিমবঙ্গ আদিবাসী উন্নয়ন পর্ষদ আইনের বিধান অনুসারে গঠিত হয়। এটি পশ্চিমবঙ্গ সরকারের অনগ্রসর শ্রেণী কল্যাণ ও আদিবাসী উন্নয়ন বিভাগের অধীনে কাজ করে।\n\nরাজ্যজুড়ে ভূমিজ সম্প্রদায়ের সামগ্রিক উন্নয়ন ও কল্যাণের সুবিধার্থে পর্ষদ গঠিত হয়েছিল। প্রধান কার্যাবলীর মধ্যে রয়েছে:\n\n১. ভূমিজ সম্প্রদায়ের আর্থ-সামাজিক চাহিদা চিহ্নিত করা\n২. উন্নয়ন কর্মসূচি পরিকল্পনা ও বাস্তবায়ন\n৩. শিক্ষা, স্বাস্থ্য ও জীবিকার উন্নতিতে সহায়তা প্রদান\n৪. সাংস্কৃতিক ঐতিহ্য ও ঐতিহ্য সংরক্ষণ\n৫. কার্যকর সেবা প্রদানের জন্য সরকারি বিভাগের সাথে সমন্বয়\n৬. সাংস্কৃতিক অনুষ্ঠান ও উৎসব আয়োজন\n৭. সম্প্রদায়ের নথি ও ডকুমেন্টেশন রক্ষণাবেক্ষণ',
            ae: '', ab: ''
        }
    ];

    for (let i = 0; i < articles.length; i++) {
        const a = articles[i];
        await pool.query('INSERT IGNORE INTO articles (slug, title_en, title_bn, content_en, content_bn, author_en, author_bn, article_type, sort_order) VALUES (?,?,?,?,?,?,?,?,?)',
            [a.slug, a.te, a.tb, a.ce, a.cb, a.ae, a.ab, a.type, i + 1]);
    }

    console.log('Gallery images, hero slides, and articles seeded successfully!');
    process.exit(0);
}

seedGallery().catch(err => { console.error(err); process.exit(1); });
