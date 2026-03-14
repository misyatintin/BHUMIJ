const pool = require('./config/database');
const fs = require('fs');

// Read content files
const enFile = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_translation_english.md', 'utf8');
const bnFile = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_transcription_bengali.md', 'utf8');

async function seed() {
    // Clear existing data
    await pool.query('DELETE FROM greeting_messages');
    await pool.query('DELETE FROM articles');
    await pool.query('DELETE FROM poems');
    await pool.query('DELETE FROM meetings');
    await pool.query('DELETE FROM board_members');
    await pool.query('DELETE FROM tour_activities');

    // ========== GREETING MESSAGES ==========
    const greetings = [
        {
            person_name_en: 'Mamata Banerjee',
            person_name_bn: 'মমতা বন্দ্যোপাধ্যায়',
            designation_en: 'Chief Minister, West Bengal',
            designation_bn: 'মুখ্যমন্ত্রী, পশ্চিমবঙ্গ',
            message_en: `Under the management of the Backward Classes Welfare and Tribal Development Department of the Government of West Bengal, the West Bengal Bhumij Development Board and the Divisional Commissioner of the Medinipur Division have taken an initiative to publish a quarterly newsletter titled "Bhumij Khobor" to bring the problems and stories of the state's Bhumij community and the groups within this department to the public eye. I extend my sincere greetings and congratulations to everyone involved in this initiative. The Bhumij Development Board is one of the backbones of West Bengal's rural economy. This Bhumij Board is the best example of how the marginalized people of the Bhumij community can collectively improve their socio-economic condition by joining together. Under the leadership of the Tribal Development Department of the West Bengal Government, this board is making continuous efforts to further strengthen the community through various technical and vocational training, including the protection of Bhumij language, heritage, and culture, folk art, education, and sports. Along with providing benefits from various public welfare schemes of the West Bengal Government, easy help and assistance are being provided through close connection with the board. As a result, the foundation of the rural Bhumij community of Bengal has become stronger. I firmly believe that this "Bhumij Khobor" quarterly publication will be specifically capable of increasing awareness of the Bhumij community among the general public, and through this, the dream of reaching the benefits of the Bhumij movement to every village in West Bengal will be fulfilled. I wish this publication all-round success.`,
            message_bn: `পশ্চিমবঙ্গ সরকারের অনগ্রসর শ্রেণী কল্যাণ ও আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ ও ডিভিশনাল কমিশনার মেদিনীপুর বিভাগের উদ্যোগে রাজ্যের ভূমিজ সম্প্রদায় এবং এই বিভাগের অন্তর্গত গোষ্ঠীগুলির সমস্যাদি কাহিনী জনসমক্ষে তুলে ধরার উদ্দেশ্যে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। এই উদ্যোগের সাথে যুক্ত সবাইকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাই। ভূমিজ উন্নয়ন বোর্ড পশ্চিমবঙ্গের গ্রামীণ অর্থনীতির একটি অন্যতম মেরুদণ্ড। ভূমিজ সমাজের প্রান্তিক মানুষ জোটবদ্ধ হয়ে সমবেতভাবে কিভাবে তাঁদের আর্থ-সামাজিক অবস্থার উন্নয়ন করতে পারেন তার সেরা নিদর্শন এই ভূমিজ বোর্ড। পশ্চিমবঙ্গ সরকারের আদিবাসী উন্নয়ন বিভাগের নেতৃত্বে এই বোর্ড ভূমিজ ভাষা, ঐতিহ্য এবং সংস্কৃতির সুরক্ষা, লোকশিল্প, শিক্ষা ও খেলাধুলাসহ সকল ভূমিজ সম্প্রদায়ের বিভিন্ন কারিগরী ও বৃত্তিমূলক প্রশিক্ষণ প্রদানের মাধ্যমে আরও শক্তিশালী করার নিরন্তর প্রয়াস চালিয়ে যাচ্ছে। পশ্চিমবঙ্গ সরকারের বিভিন্ন জনহিতকর প্রকল্পের সুবিধা প্রদানের পাশাপাশি পর্ষদের সাথে নিবিড় সংযোগ স্থাপন করে তাঁদের সহজে বিভিন্ন সাহায্য ও সহায়তা প্রদান করা হচ্ছে। যার ফলস্বরূপ বাংলার গ্রামীণ ভূমিজ সম্প্রদায়ের ভিত্তি আরও শক্তিশালী হয়েছে। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই "ভূমিজ খবর" ত্রৈমাসিক প্রকাশনা আপামর জনসাধারণের মধ্যে ভূমিজ সম্প্রদায়ের সচেতনতা বৃদ্ধিতে বিশেষভাবে সক্ষম হবে এবং এর মাধ্যমে পশ্চিমবঙ্গের প্রতিটি গ্রামে ভূমিজ আন্দোলনের সুফল পৌঁছে দেওয়ার স্বপ্নপূরণ হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।`,
            image_path: '7.jpg',
            sort_order: 1
        },
        {
            person_name_en: 'Bulu Chik Baraik',
            person_name_bn: 'বুলু চিক বরাইক',
            designation_en: 'Minister-in-Charge, Tribal Development Department, Government of West Bengal',
            designation_bn: 'ভারপ্রাপ্ত মন্ত্রী, আদিবাসী উন্নয়ন বিভাগ, পশ্চিমবঙ্গ সরকার',
            message_en: `With the aim of making the Bhumij community stronger, self-reliant, and independent, the West Bengal Bhumij Development Board and the Divisional Commissioner of Medinipur Division have taken the initiative to publish a quarterly newsletter titled "Bhumij Khobor" to present the stories of the problems of the state's Bhumij community and the groups belonging to this department to the public. I extend my sincere greetings and congratulations to everyone involved in this initiative. The Bhumij Development Board is one of the backbones of the rural economy of West Bengal, as a result of which the rural social foundation of Bengal has become stronger. This Bhumij Board is the best example of how the marginalized people of the Bhumij society can collectively improve their socio-economic condition by coming together. Under the leadership of the Honorable Chief Minister of the Government of West Bengal, the Tribal Development Department is making constant efforts to further strengthen the community by providing various technical and vocational training. Along with providing benefits of various public welfare projects of the West Bengal Government, easy help and assistance are being provided through close connection with the Board. As a result, the foundation of Bengal's rural Bhumij community has become stronger. I firmly believe that this "Bhumij Khobor" quarterly publication will be specifically able to increase the awareness of the Bhumij community among the general public and through this, it will be possible to deliver the benefits of the Bhumij movement to every village of West Bengal. I wish all success to this publication.`,
            message_bn: `ভূমিজ সম্প্রদায়কে আরও শক্তিশালী, আত্মনির্ভরশীল ও স্বাবলম্বী করে গড়ে তোলার লক্ষ্যে পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ড ও ডিভিশনাল কমিশনার মেদিনীপুর বিভাগের উদ্যোগে রাজ্যের ভূমিজ সম্প্রদায় এবং এই বিভাগের অন্তর্গত গোষ্ঠীগুলির সমস্যাদি কাহিনী জনসমক্ষে তুলে ধরার উদ্দেশ্যে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। এই উদ্যোগের সাথে যুক্ত সবাইকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাই। ভূমিজ উন্নয়ন বোর্ড পশ্চিমবঙ্গের গ্রামীণ অর্থনীতির একটি অন্যতম মেরুদণ্ড যার ফলস্বরূপ বাংলার গ্রামীণ সামাজিক ভিত্তি আরও শক্তিশালী হয়েছে। ভূমিজ সমাজের প্রান্তিক মানুষ জোটবদ্ধ হয়ে সমবেতভাবে কিভাবে তাঁদের আর্থ-সামাজিক অবস্থার উন্নয়ন করতে পারেন তার সেরা নিদর্শন এই ভূমিজ বোর্ড। পশ্চিমবঙ্গ সরকারের মাননীয়া মুখ্যমন্ত্রীর নেতৃত্বে আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় এই ভূমিজ সম্প্রদায়কে বিভিন্ন কারিগরী ও বৃত্তিমূলক প্রশিক্ষণ প্রদানের মাধ্যমে আরও শক্তিশালী করার নিরন্তর প্রয়াস চালিয়ে যাচ্ছে। পশ্চিমবঙ্গ সরকারের বিভিন্ন জনহিতকর প্রকল্পের সুবিধা প্রদানের পাশাপাশি বোর্ডের সাথে নিবিড় সংযোগ স্থাপন করে তাঁদের সহজে বিভিন্ন সাহায্য ও সহায়তা প্রদান করা হচ্ছে। যার ফলস্বরূপ বাংলার গ্রামীণ ভূমিজ সম্প্রদায়ের ভিত্তি আরও শক্তিশালী হয়েছে। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই "ভূমিজ খবর" ত্রৈমাসিক প্রকাশনা আপামর জনসাধারণের মধ্যে ভূমিজ সম্প্রদায়ের সচেতনতা বৃদ্ধিতে বিশেষভাবে সক্ষম হবে এবং এর মাধ্যমে পশ্চিমবঙ্গের প্রতিটি গ্রামে ভূমিজ আন্দোলনের সুফল পৌঁছে দেওয়া সম্ভবপর হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।`,
            image_path: '8.jpg',
            sort_order: 2
        },
        {
            person_name_en: 'Smt. Choten Dhendup Lama, IAS',
            person_name_bn: 'শ্রীমতি চোটেন ধেন্দুপ লামা, আই.এ.এস',
            designation_en: 'Principal Secretary, Tribal Development Department, Government of West Bengal',
            designation_bn: 'প্রধান সচিব, আদিবাসী উন্নয়ন বিভাগ, পশ্চিমবঙ্গ সরকার',
            message_en: `The West Bengal Bhumij Development Board has taken an initiative to publish a quarterly newsletter titled "Bhumij Khobor" with the aim of presenting the stories of the problems of the state's Bhumij community and the groups within this department to the public. Through this newsletter, the people of the state can learn about various activities, new initiatives, future plans, and success stories of the Bhumij Development Board, as well as get an outline of how their socio-economic development is taking place. I extend my sincere greetings and congratulations to everyone involved in this initiative. This Bhumij development is one of the backbones of the rural economy of West Bengal. This Bhumij Board is the best example of how the marginalized people of the Bhumij community can collectively improve their socio-economic condition by coming together. Under the leadership of the Honorable Chief Minister of the Government of West Bengal, the Tribal Development Department is making constant efforts to further strengthen all Bhumij communities through various technical and vocational training. Along with providing benefits of various humanitarian projects of the West Bengal Government, easy help and assistance are being provided by establishing a close connection with the board. As a result, the foundation of the rural Bhumij community of Bengal has become stronger. I firmly believe that this "Bhumij Khobor" quarterly publication will be specifically able to increase awareness about the Bhumij community among the general public and through this, it will be possible to reach the benefits of the Bhumij movement to every village of West Bengal. I wish for the all-round success of this publication.`,
            message_bn: `রাজ্যের ভূমিজ সম্প্রদায় এবং এই বিভাগের অন্তর্গত গোষ্ঠীগুলির সমস্যাদি কাহিনী জনসমক্ষে তুলে ধরার উদ্দেশ্যে পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদের উদ্যোগে "ভূমিজ খবর" শীর্ষক একটি ত্রৈমাসিক নিউজলেটার প্রকাশের উদ্যোগ নিয়েছে। এই নিউজলেটারের মাধ্যমে রাজ্যবাসী ভূমিজ উন্নয়ন বোর্ডের বিভিন্ন কার্যক্রম, নতুন উদ্যোগ, ভবিষ্যৎ পরিকল্পনা, সাফল্য কাহিনী যেমন জানতে পারবেন তেমনি কিভাবে তাঁদের আর্থ-সামাজিক উন্নয়ন হচ্ছে তার একটি রূপরেখা পাবেন। এই উদ্যোগের সাথে যুক্ত সবাইকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাই। এই ভূমিজ উন্নয়ন পশ্চিমবঙ্গ গ্রামীণ অর্থনীতির একটি অন্যতম মেরুদণ্ড। ভূমিজ সমাজের প্রান্তিক মানুষ জোটবদ্ধ হয়ে সমবেতভাবে কিভাবে তাঁদের আর্থ-সামাজিক অবস্থার উন্নয়ন করতে পারেন তার সেরা নিদর্শন এই ভূমিজ পর্ষদ। পশ্চিমবঙ্গ সরকারের মাননীয়া মুখ্যমন্ত্রীর নেতৃত্বে আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় এই পর্ষদ সকল ভূমিজ সম্প্রদায়ের বিভিন্ন কারিগরী ও বৃত্তিমূলক প্রশিক্ষণ প্রদানের মাধ্যমে আরও শক্তিশালী করার নিরন্তর প্রয়াস চালিয়ে যাচ্ছে। পশ্চিমবঙ্গ সরকারের বিভিন্ন জনহিতকর প্রকল্পের সুবিধা প্রদানের পাশাপাশি পর্ষদের সাথে নিবিড় সংযোগ স্থাপন করে তাঁদের সহজে বিভিন্ন সাহায্য ও সহায়তা প্রদান করা হচ্ছে। যার ফলস্বরূপ বাংলার গ্রামীণ ভূমিজ সম্প্রদায়ের ভিত্তি আরও শক্তিশালী হয়েছে। আমি দৃঢ়ভাবে বিশ্বাস করি যে এই "ভূমিজ খবর" ত্রৈমাসিক প্রকাশনা আপামর জনসাধারণের মধ্যে ভূমিজ সম্প্রদায়ের সচেতনতা বৃদ্ধিতে বিশেষভাবে সক্ষম হবে এবং এর মাধ্যমে পশ্চিমবঙ্গের প্রতিটি গ্রামে ভূমিজ আন্দোলনের সুফল পৌঁছে দেওয়া সম্ভবপর হবে। এই প্রকাশনার সর্বাঙ্গীন সাফল্য কামনা করি।`,
            image_path: '9.jpg',
            sort_order: 3
        }
    ];

    for (const g of greetings) {
        await pool.query('INSERT INTO greeting_messages (person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, image_path, sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [g.person_name_en, g.person_name_bn, g.designation_en, g.designation_bn, g.message_en, g.message_bn, g.image_path, g.sort_order]);
    }
    console.log('✅ 3 Greetings inserted');

    // ========== SITE SETTINGS ==========
    await pool.query('DELETE FROM site_settings');
    const settings = [
        ['volume_info', 'Volume-1 | March - 2026', 'ভলিউম-১ | মার্চ - ২০২৬'],
        ['site_title', 'Bhumij Khobor - Quarterly Newsletter', 'ভূমিজ খবর - ত্রৈমাসিক নিউজলেটার'],
        ['site_subtitle', 'Quarterly Newsletter of West Bengal Bhumij Development Board, Government of West Bengal', 'পশ্চিমবঙ্গ সরকারের পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদের ত্রৈমাসিক নিউজলেটার'],
        ['introduction_en', 'In the first newsletter "Bhumij Khobor" published through the West Bengal Bhumij Development Board under the management of the Tribal Development Department of the Government of West Bengal, the socio-economic position of the Bhumij community across the state has been highlighted. Besides, through this, various activities, protection of Bhumij language, heritage, and culture, folk art, education, and sports, including various technical and vocational training related matters, will be highlighted.', 'পশ্চিমবঙ্গ সরকারের আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ডের মাধ্যমে প্রকাশিত প্রথম নিউজলেটার "ভূমিজ খবর" রাজ্যজুড়ে ভূমিজ সম্প্রদায়ের আর্থ-সামাজিক অবস্থান তুলে ধরা হল। এ ছাড়া এর মাধ্যমে বিভিন্ন কার্যক্রম, ভূমিজ ভাষা, ঐতিহ্য এবং সংস্কৃতির সুরক্ষা, লোকশিল্প, শিক্ষা ও খেলাধুলাসহ বিভিন্ন কারিগরী ও বৃত্তিমূলক প্রশিক্ষণ সংক্রান্ত বিষয়গুলো তুলে ধরা হবে।'],
        ['footer_text', 'Published by the West Bengal Bhumij Development Board, Government of West Bengal. Dedicated to the preservation, development and welfare of the Bhumij community.', 'পশ্চিমবঙ্গ সরকারের পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ কর্তৃক প্রকাশিত। ভূমিজ সম্প্রদায়ের সংরক্ষণ, উন্নয়ন ও কল্যাণে নিবেদিত।'],
        ['contact_address', 'Office of the Divisional Commissioner, Hospital Road, Keranitola, Medinipur Town, West Medinipur - 721101', 'বিভাগীয় কমিশনারের দপ্তর, হাসপাতাল রোড, কেরানিতলা, মেদিনীপুর শহর, পশ্চিম মেদিনীপুর - ৭২১১০১'],
        ['prepared_by', 'Prepared by ANM News Pvt. Ltd. Website: www.anmnews.in', 'প্রস্তুতকারী: ANM News Pvt. Ltd. ওয়েবসাইট: www.anmnews.in']
    ];
    for (const s of settings) {
        await pool.query('INSERT INTO site_settings (setting_key, setting_value_en, setting_value_bn) VALUES (?,?,?)', s);
    }
    console.log('✅ Site settings inserted');

    console.log('✅ Part 1 done! Run seed-content-2.js next.');
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
