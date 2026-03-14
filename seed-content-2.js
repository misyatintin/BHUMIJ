const pool = require('./config/database');

async function seed2() {
    // ========== POEMS (3 poems from Page 11) ==========
    await pool.query('DELETE FROM poems');
    const poems = [
        {
            title_en: 'Bar Kaji (Listen O People)',
            title_bn: 'বার কাজি',
            content_en: `Listen to my words O people,\nThe elders of our first village,\nThe elders of our first village.\nLet us all walk together as one.\nMountain rocks and trees are our home\nWe all say this.\nLet us all walk together as one.\nOur words and our language\nWe speak them with pride.\nJust like the father knows the child\nWe shall cherish each other,\nListen to my words O people,\nThe elders of our first village,\nLet us all walk together as one.\nOur language is our identity\nWe shall not let it fade.\nOur rules, religion, dance and songs\nThey are ours alone,\nWe shall not let them fade\nLet us all walk together as one.\nListen to my words O people,\nThe elders of our first village,\nLet us all walk together as one.\nLet us all walk as one,\nLet us all walk as one.`,
            content_bn: `বার কাজি মেতা পেগীয়ও\nমাড়াং হাতু হড়ক,\nমাড়াং হাতু হড়ক।\nআবু যত মোসা তেবু সেনোয়া।।\nবুরু দিরি দারক গে বাসা আবু\nআবু দবু মেনেয়া।\nআবু যত মোসাতেবু সেনোয়া।\nআবু ভাষা কাজি যত গে\nমেন-মেন মেনাতেবু মেনেয়া।\nজানে বাবা লেকা যত ত্বেবু\nসালা-সায় এনয়া,\nবার কাজি মেতা পেগীয়ও\nমাড়াং হাতু হড়ক,\nআবু যত মোসা ত্বেবু সেনোয়া।।\nভাষা আবু আবু- আবু তেদ\nকাব তপা তেনেয়া।\nনিয়ম ধরম সুসুন দুরাং\nআবু আবু তেদ,\nকাবু তপা তেনেয়া\nআবু যত মোসা তেবু সেনোয়া।\nবার কাজি মেতা পেগীয়ও\nমাড়াং হাতু হড়ক,\nআবু যত মোসা ত্বেবু সেনোয়া।\nমোসা তেবু সেনোয়া,\nমোসা তেবু সেনোয়া।।`,
            author_en: 'Birendra Sardar',
            author_bn: 'বীরেন্দ্র সদ্দার',
            sort_order: 1
        },
        {
            title_en: 'Murukh Baha (Palash Flower)',
            title_bn: 'মুরুঃ বাহা',
            content_en: `Winter has arrived,\nThe Murukh flower has bloomed.\nWith its bright reddish-orange hue,\nThe whole country is decorated.\nIt comes with gentle swaying,\nIn our midst.\nIt will go to the end of the field,\nWhen the Baha Chadur is over.\nIt brings beauty to this mortal world,\nWith its different colors.\nAfter the fun of Chadur,\nIt goes on its own path.\nHow many days will love remain,\nIn our midst.\nFor those many days love will stay,\nIn the festive path.\nWith the color and form of the Murukh flower,\nThe festive mood is in the heart.\nBeneath the Murukh tree,\nLet there be dance and song.\nDon't knock down the Murukh flower,\nDon't trample it.\nThe honey-sweet nectar of Murukh,\nThe mountain birds will sip.\nDon't cut down the Murukh tree,\nDon't break its branches.\nBecause if there is Murukh flower among us,\nIt will surely come back next year.`,
            content_bn: `জেটে সিগি সেটের জানা,\nমুরুঃ বাহা ফুটোও জানা।\nরাংগা রাংগা সুরুক বাহাতে,\nগোটা দিশম সাজাও জানা।।\nলীদা লীলাতে হিজু জানা,\nআবু কো তালারে।\nমাড় সয় রেহাড় সেনো আঃ,\nবাহা চাডুর মুডি জান রে।।\nনে ধাবতিপুরিকে শোভা লাগেন,\nহিজ জানা বেডে রাঙ্গাতে।\nমজ চাডুর তায়োম তেগে,\nসেনো আঃ এঁগাম এঁগাম তে।।\nযাহা তিমা দিন দুলাঃ ভায়ো আঃ,\nআবু কো তালারে।\nইমতা দিন দুলাঃ গে তায়ো আঃ,\nরাস্তা রমজ তে।।\nমুরুক বাহা রেয়াঃ রং রূপতে,\nমনেরে রাস্তা জং নে।\nমুরুক বাহা দরক লাতার,\nসুসুন দুরাং জং নে।।\nমুরুক বাহা আলো বুন কোটা এয়া,\nআলো বুন পজ এয়া।\nমুরুক বাহা হয়েম সিবিল রাসে,\nবুরু চেঁড়ে চিপকুদ কো লুই আঃ।।\nমুরুক দারু আলো বুন মাগেয়া,\nডাল ই আলো বুন রাপুদ এয়া।\nকারোদো মুরুঃ বাহা আবু কো তালারে,\nহিতজান কালম কাকেও হিজ দাড়িয়া।।`,
            author_en: 'Sri Nityalal Singh',
            author_bn: 'শ্রী নিত্যলাল সিং',
            sort_order: 2
        },
        {
            title_en: 'Jargi Gama (Monsoon Rain)',
            title_bn: 'জারগি গামা',
            content_en: `Rain, oh rain\nSo much rain, monsoon rain.\nIt rains from the morning\nIt rains till the evening\nIt rains the whole day\nIt rains the whole night\nRain, oh rain,\nSo much rain.\nMonsoon rain\nDrizzling rain\nSplashing rain\nRain in the mountains\nRain in the valleys\nRain in the fields\nRain in the rivers\nRain everywhere\nSo much rain,\nRain, oh rain.\nMonsoon rain\nDark clouds in the sky\nNew rain everywhere\nNo one goes out because of the rain\nWe stay hidden in the huts\nRain, oh rain\nSo much rain\nMonsoon rain\nRain, oh rain\nSo much rain\nMonsoon rain.`,
            content_bn: `গামা গে গামা\nইমিনগে গামা, জারগি গামা।\nসেতাঃ আতে গামা\nআয়ুব হাবেজ গামা\nগোটা সিদি গামা\nগোটা নিদা গামা\nগামা গে গামা,\nইমিন গে গামা।\nজারগি গামা\nপুস্তুর পুস্তুর গামা\nসাড়াই সাড়াই গামা\nবুরু রই গামা\nগাড়া রেহ গামা\nগড়া রেহ গামা\nগাডা রেহ গামা\nগোটা গে গামা\nইমিন গে গামা,\nগামা গে গামা।\nজারগি গামা\nসিরমা রেমা রিমিল\nইবিন গে নামা নামা\nঅকয়হ কাক সেন তান গামা গামা\nআড়াঃ রেগে মেনাঃ ক সামা গে সামা\nগামা গে গামা\nইমিন গে গামা\nজারগি গামা\nগামা গে গামা\nইমিন গে গামা\nজারগি গামা।`,
            author_en: 'Birendra Sardar',
            author_bn: 'বীরেন্দ্র সদ্দার',
            sort_order: 3
        }
    ];
    for (const p of poems) {
        await pool.query('INSERT INTO poems (title_en,title_bn,content_en,content_bn,author_en,author_bn,sort_order) VALUES (?,?,?,?,?,?,?)',
            [p.title_en,p.title_bn,p.content_en,p.content_bn,p.author_en,p.author_bn,p.sort_order]);
    }
    console.log('✅ 3 Poems inserted');

    // ========== BOARD MEMBERS (14 from Pages 15-16) ==========
    await pool.query('DELETE FROM board_members');
    const members = [
        {sl:1, ne:'Dr. Godala Kiran Kumar, IAS', nb:'ড. গোডালা কিরণ কুমার, আই.এ.এস.', de:'Divisional Commissioner, Medinipur Division — Chairman', db:'ডিভিশনাল কমিশনার, মেদিনীপুর ডিভিশন — চেয়ারম্যান', ae:'Office of the Divisional Commissioner, Keranitola, Medinipur, West Medinipur - 721101', ab:'ডিভিশনাল কমিশনারের দপ্তর, কেরানিতলা, মেদিনীপুর, পশ্চিম মেদিনীপুর - ৭২১১০১', ph:''},
        {sl:2, ne:'Shri Anshuman Adhikari, WBCS', nb:'শ্রী অংশুমান অধিকারী, ডব্লিউ.বি.সি.এস', de:'Special Divisional Commissioner — Member Secretary', db:'স্পেশাল ডিভিশনাল কমিশনার — মেম্বার সেক্রেটারি', ae:'Office of the Divisional Commissioner, Keranitola, Medinipur, West Medinipur - 721101', ab:'ডিভিশনাল কমিশনারের দপ্তর, কেরানিতলা, মেদিনীপুর, পশ্চিম মেদিনীপুর - ৭২১১০১', ph:'97329 00999'},
        {sl:3, ne:'Shri Rampada Singh Sardar', nb:'শ্রী রামপদ সিং সর্দ্দার', de:'Vice Chairman (Ex-Vice Chairman 07/03/2014 - 04/09/2024)', db:'ভাইস চেয়ারম্যান (প্রাক্তন ভাইস চেয়ারম্যান ০৭/০৩/২০১৪ - ০৪/০৯/২০২৪)', ae:'Vill- Pidra, PO- Chakilbon, PS- Purulia Mofussil, Purulia - 723102', ab:'গ্রাম- পিড়রা, পোস্ট অফিস- চাকিলবোন, থানা— পুরুলিয়া মফঃস্বল, পুরুলিয়া - ৭২৩১০২', ph:'9362496368'},
        {sl:4, ne:'Shri Nityalal Singh', nb:'শ্রী নিত্যলাল সিং', de:'Vice Chairman', db:'ভাইস চেয়ারম্যান', ae:'Vill- Boyardihi, PO- Thakurapahari, PS- Belpahari, Jhargram - 721203', ab:'গ্রাম- বোয়ারডিহি, পোস্ট অফিস- ঠাকুরানপাহাড়ী, থানা- বেলপাহাড়ী, ঝাড়গ্রাম - ৭২১২০৩', ph:'73092 56706'},
        {sl:5, ne:'Shri Dhananjaya Sardar', nb:'শ্রী ধনঞ্জয় সর্দ্দার', de:'Vice Chairman', db:'ভাইস চেয়ারম্যান', ae:'Vill- Khadutor, PO- Phulkushmia, PS- Barikul, Bankura - 722162', ab:'গ্রাম-খাদুতোর, পোঃ-ফুলকুশমিয়া, থানা-বারিকুল, বাঁকুড়া - ৭২২১৬২', ph:'97347 31599'},
        {sl:6, ne:'Shri Nitai Singh Sardar', nb:'শ্রী নিতাই সিং সর্দ্দার', de:'Member', db:'মেম্বার', ae:'Vill- Kalusar, PO- Pali, PS- Barikul, Bankura - 722134', ab:'গ্রাম— কলুসার, পোস্ট অফিস— পালি, থানা— বারিকুল, বাঁকুড়া - ৭২২১৩৪', ph:'80162 67835'},
        {sl:7, ne:'Shri Dhananjaya Mura', nb:'শ্রী ধনঞ্জয় মুড়া', de:'Member', db:'মেম্বার', ae:'Vill- Ichap, PO- Ichag, PS- Jhalda, Purulia - 723202', ab:'গ্রাম— ইছাপ, পোস্ট অফিস— ইছাগ, থানা— ঝালদা, পুরুলিয়া - ৭২৩২০২', ph:'98756 15374'},
        {sl:8, ne:'Shri Gopal Singh', nb:'শ্রী গোপাল সিং', de:'Member', db:'মেম্বার', ae:'Vill- Pankui, PO- Antala, PS- Debra, West Medinipur - 721258', ab:'গ্রাম— পানকুই, পোস্ট অফিস— অন্তলা, থানা— ডেবরা, পশ্চিম মেদিনীপুর - ৭২১২৫৮', ph:'85973 46516'},
        {sl:9, ne:'Shri Sanjib Singh Sardar', nb:'শ্রী সঞ্জীব সিং সর্দ্দার', de:'Member', db:'মেম্বার', ae:'Vill- Laihadihi, PO- Rakab, PS- Hura, Purulia - 723130', ab:'গ্রাম— লাইহাডিহি, পোস্ট অফিস— রাকাব, থানা— হুড়া, পুরুলিয়া - ৭২৩১৩০', ph:'90640 47145'},
        {sl:10, ne:'Shri Paritosh Sardar', nb:'শ্রী পরিতোষ সর্দ্দার', de:'Member', db:'মেম্বার', ae:'Vill- Mitha-Am, PO- Mitha-Am, PS- Ranibandh, Bankura - 722148', ab:'গ্রাম— মিঠা-Am, পোস্ট অফিস— মিঠা-Am, থানা— রানিবাঁধ, বাঁকুড়া - ৭২২১৪৮', ph:'81674 41877'},
        {sl:11, ne:'Shri Manotosh Singh', nb:'শ্রী মনতোষ সিং', de:'Member', db:'মেম্বার', ae:'Vill- Purnapani, PO- Arjunchoa, PS- Belpahari, Jhargram - 721501', ab:'গ্রাম— পূর্ণাপাণি, পোস্ট অফিস— অর্জুনচুয়া, থানা— বেলপাহাড়ী, ঝাড়গ্রাম - ৭২১৫০১', ph:'76794-80770'},
        {sl:12, ne:'Shri Lakshmi Narayan Singh Sardar', nb:'শ্রী লক্ষ্মী নারায়ণ সিং সর্দ্দার', de:'Member', db:'মেম্বার', ae:'Vill- Rupabanpur, PO- Shyamnagar, PS- Balarampur, Purulia - 723143', ab:'গ্রাম— রূপাবনপুর, পোস্ট অফিস— শ্যামনগর, থানা— বলরামপুর, পুরুলিয়া - ৭২৩১৪৩', ph:'86378 13391'},
        {sl:13, ne:'Shri Nepal Singh', nb:'শ্রী নেপাল সিং', de:'Member', db:'মেম্বার', ae:'Vill- Bamanghati, PO- Haria, PS- KLC, South 24 Parganas - 743506', ab:'গ্রাম— বামনঘাটী, পোস্ট অফিস— হাঁড়িয়া, থানা— কলকাতা লেদার কমপ্লেক্স, দক্ষিণ ২৪ পরগনা - ৭৪৩৫০৬', ph:'98019 42144'},
        {sl:14, ne:'Shri Ajay Kumar Bhumij', nb:'শ্রী অজয় কুমার ভূমিজ', de:'Member', db:'মেম্বার', ae:'Vill- Mahishgoria, PO- Mahishgoria, PS- Jamalpur, Purba Bardhaman - 713402', ab:'গ্রাম— মহিষগোরিয়া, পোস্ট অফিস— মহিষগোরিয়া, থানা— জামালপুর, পূর্ব বর্ধমান - ৭১৩৪০২', ph:'77987 19350'}
    ];
    for (const m of members) {
        await pool.query('INSERT INTO board_members (sl_no,name_en,name_bn,designation_en,designation_bn,address_en,address_bn,phone,sort_order) VALUES (?,?,?,?,?,?,?,?,?)',
            [m.sl, m.ne, m.nb, m.de, m.db, m.ae, m.ab, m.ph, m.sl]);
    }
    console.log('✅ 14 Board members inserted');

    console.log('✅ Part 2 done! Run seed-content-3.js next.');
    process.exit(0);
}

seed2().catch(e => { console.error(e); process.exit(1); });
