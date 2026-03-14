const pool = require('./config/database');
const fs = require('fs');

// Read full content files
const enContent = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_translation_english.md', 'utf8');
const bnContent = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_transcription_bengali.md', 'utf8');

// Helper to extract text between markers
function extract(text, startMarker, endMarker) {
    const si = text.indexOf(startMarker);
    if (si === -1) return '';
    const s = si + startMarker.length;
    const e = endMarker ? text.indexOf(endMarker, s) : text.length;
    return (e === -1 ? text.substring(s) : text.substring(s, e)).trim();
}

async function seed3() {
    await pool.query('DELETE FROM articles');
    await pool.query('DELETE FROM meetings');
    await pool.query('DELETE FROM board_info');

    // ===== ARTICLES =====

    // 1. Board Formation (Page 2-4)
    const boardFormEn = extract(enContent, '**Formation and Functions of Bhumij Development Board**', '---\n\n## Page - 3');
    const boardFormBn = extract(bnContent, '**ভূমিজ উন্নয়ন পর্ষদ গঠন এবং কার্যাবলী**', '---\n\n## পৃষ্ঠা - ৩');

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['board-formation', 'Formation and Functions of Bhumij Development Board', 'ভূমিজ উন্নয়ন পর্ষদ গঠন এবং কার্যাবলী', boardFormEn, boardFormBn, 'West Bengal Bhumij Development Board', 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ', 'history', 1]);

    // 2. Tour Activities (Page 3)
    const tourEn = extract(enContent, '**Tour Activities of the Divisional Commissioner in the Districts**', '**Minutes of the Meetings');
    const tourBn = extract(bnContent, '**জেলাগুলিতে বিভাগীয় কমিশনারের সফর কার্যাবলী**', '**পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ বৈঠকের কার্যবিবরণী**');

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['tour-activities', 'Tour Activities of the Divisional Commissioner in the Districts', 'জেলাগুলিতে বিভাগীয় কমিশনারের সফর কার্যাবলী', tourEn, tourBn, 'West Bengal Bhumij Development Board', 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ', 'history', 2]);

    // 3. Jilpa Laya biography (Page 12-13)
    const jilpaEn = extract(enContent, '**Amar Shahid Jilpa Laya (1774-1834)**', '**(Right box text)**');
    const jilpaBn = extract(bnContent, '**অমর শহীদ জিলপা লায়া (১৭৭৪-১৮৩৪)**', '*(ডানদিকের বক্সের লেখা)*');
    // Get continuation from page 13
    const jilpaEn2 = extract(enContent, '... Among them, Dibas Laya', '**References :-**');
    const jilpaBn2 = extract(bnContent, '...তেমন দিবস লায়া', '**তথ্যসূত্র :-**');

    const fullJilpaEn = jilpaEn + '\n\n' + jilpaEn2;
    const fullJilpaBn = jilpaBn + '\n\n' + jilpaBn2;

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['jilpa-laya', 'Amar Shahid Jilpa Laya (1774-1834)', 'অমর শহীদ জিলপা লায়া (১৭৭৪-১৮৩৪)', fullJilpaEn, fullJilpaBn, 'Lakshminarayan Singh Sardar (Primary Teacher)', 'লক্ষ্মীনারায়ণ সিং সর্দ্দার (প্রাথমিক শিক্ষক)', 'biography', 3]);

    // 4. Sarthak Jonom - editorial poem (Page 12 right box)
    const sarthakEn = extract(enContent, '**Sarthak Jonom (A Meaningful Birth)', '---\n\n## Page - 13');
    const sarthakBn = extract(bnContent, '**সার্থক জনম —', '---\n\n## পৃষ্ঠা - ১৩');

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['sarthak-jonom', 'Sarthak Jonom (A Meaningful Birth)', 'সার্থক জনম', sarthakEn, sarthakBn, 'Arghya Bhusan Sinha (Chief Editor)', 'অর্ঘ্য ভূষণ সিংহ (Chief Editor)', 'editorial', 4]);

    // 5. Al-On Script (Page 13)
    const alonEn = extract(enContent, '**Inventor of the Al-On Script', '---\n\n## Page - 14');
    const alonBn = extract(bnContent, '**অনল লিপির আবিষ্কারক', '---\n\n## পৃষ্ঠা - ১৪');

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['al-on-script', 'Inventor of the Al-On Script: Honorable Mahendranath Sardar', 'অনল লিপির আবিষ্কারক মাননীয় মহেন্দ্রনাথ সর্দ্দার', alonEn, alonBn, 'Dhananjaya Sardar (Vice-Chairman)', 'ধনঞ্জয় সর্দ্দার (ভাইস-চেয়ারম্যান)', 'script', 5]);

    // 6. Bhumij Revolt (Page 14)
    const revoltEn = extract(enContent, '**Bhumij Revolt (1832-33)**', '**Author - Dhananjaya Sardar**\n\n---\n\n## Page - 15');
    const revoltBn = extract(bnContent, '**ভূমিজ বিদ্রোহ (১৮৩২-৩৩)**', '**লেখক - ধনঞ্জয় সর্দ্দার**\n\n---\n\n## পৃষ্ঠা - ১৫');

    await pool.query(`INSERT INTO articles (slug,title_en,title_bn,content_en,content_bn,author_en,author_bn,article_type,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['bhumij-revolt', 'Bhumij Revolt (1832-33)', 'ভূমিজ বিদ্রোহ (১৮৩২-৩৩)', revoltEn, revoltBn, 'Dhananjaya Sardar', 'ধনঞ্জয় সর্দ্দার', 'history', 6]);

    console.log('✅ 6 Articles inserted');

    // ===== MEETINGS (6 meetings from Pages 3-4) =====
    const meetingsData = [
        { num:1, date:'25.09.2014', te:'First Meeting', tb:'প্রথম বৈঠক',
          ce:'After thorough discussion among the board members, it was requested to prepare a consolidated list of their proposals and submit them in the next general meeting. PO and DWOs were requested to provide necessary assistance to this newly formed board. They were requested to identify or define the boundary of the Hargali land with the help of the land administration. It was decided to send a suitable proposal for including women members in the General Body of the board. It was decided to send a proposal to the Tribal Development Department to celebrate the birthday of the revolutionary leader Prasanna Narayan Singh on April 15 every year.',
          cb:'বোর্ড সদস্যদের মধ্যে পুঙ্খানুপুঙ্খ আলোচনার পর তাঁদের প্রস্তাবের একটি সংক্ষিপ্ত তালিকা তৈরি করার এবং পরবর্তী সাধারণ বৈঠকে তা জমা দেওয়ার অনুরোধ করা হয়েছে। PO এবং DWO-দের নবগঠিত এই বোর্ডকে প্রয়োজনীয় সহায়তা করার জন্য অনুরোধ করা হয়েছে। ভূমি প্রশাসনের সহায়তায় হাড়গালী জমি চিহ্নিত বা সীমানা নির্ধারণ করার জন্য তাঁদের অনুরোধ করা হয়েছে। বোর্ডের সাধারণ পরিষদে নারী সদস্যদের অন্তর্ভুক্ত করার জন্য উপযুক্ত প্রস্তাব পাঠানোর সিদ্ধান্ত নেওয়া হয়েছে। প্রতি বছর ১৫ এপ্রিল বিপ্লবী নেতা প্রসন্ন নারায়ণ সিংহ-এর জন্মদিন পালনের জন্য উপজাতি উন্নয়ন বিভাগে প্রস্তাব পাঠানোর সিদ্ধান্ত নেওয়া হয়েছে।'
        },
        { num:2, date:'28.11.2014', te:'Second Meeting', tb:'দ্বিতীয় বৈঠক',
          ce:'The list and proposal of the respective settlements must be submitted to PO cum DWOs by 12-11-2014. The money allocated by the government must be transferred from the District Magistrate, Purulia. The District Magistrate and committee members have been requested to temporarily use a vacant spot of a field administrative building for the board sub-committee. Land must be identified for construction of cultural and educational centers. The District Magistrate, Purulia, has been requested to organize a meeting with the relevant PO cum DWO. Members were requested to submit a list of relevant places for solving the drinking water problem.',
          cb:'সংশ্লিষ্ট বাস্তুস্থানের তালিকা এবং প্রস্তাবটি ভাইস-চেয়ারম্যান বা সদস্যদের মাধ্যমে ১২-১১-২০১৪ তারিখের মধ্যে PO কাম DWOs-এর কাছে জমা দিতে হবে। সরকারের বরাদ্দকৃত টাকা জেলা শাসক, পুরুলিয়া কর্তৃক স্থানান্তর করতে হবে। জেলা শাসক এবং কমিটির সদস্যদের অনুরোধ করা হয়েছে যেন তারা বোর্ডের উপ-কমিটির জন্য একটি সরজমিন প্রশাসনিক ভবনের ফাঁকা জায়গা ব্যবহার করতে পারেন। সাংস্কৃতিক এবং শিক্ষা কেন্দ্র নির্মাণের জন্য জমি চিহ্নিত করতে হবে। পানীয় জলের সমস্যার সমাধানকল্পে সংশ্লিষ্ট স্থানের তালিকা জমা দেওয়ার জন্য সদস্যদের অনুরোধ করা হয়েছে।'
        },
        { num:3, date:'27.01.2015', te:'Third Meeting', tb:'তৃতীয় বৈঠক',
          ce:'A new bank account has been opened at PO (BCW) office Purulia. The allocated money for 25 Hargali lands was deposited on 02.01.2015. A proposal has been made for the renovation of the board office rooms. Competitive exam training will be held at Purulia District School on 31.01.2015. Under the Yogashree project, coaching programs for government group B, C, and D posts have started. Road and drinking water projects have been undertaken in tribal-dominated areas under the state budget. A list of female members from all districts has been collected and sent to the West Bengal Tribal Development Department for approval.',
          cb:'পুরুলিয়া PO (BCW) দপ্তরে নতুন একটি ব্যাঙ্ক অ্যাকাউন্ট খোলা হয়েছে। ২৫টি হাড়গালী জমির জন্য বরাদ্দ টাকা ০২.০১.২০১৫ তারিখে জমা দেওয়া হয়েছে। বোর্ড-এর কার্যালয়ের ঘরগুলো সংস্কারের জন্য প্রস্তাব দেওয়া হয়েছে। ৩১.০১.২০১৫ তারিখে পুরুলিয়া জেলা স্কুলে প্রতিযোগিতামূলক পরীক্ষার প্রশিক্ষণ অনুষ্ঠিত হবে। যোগ্যশ্রী প্রকল্পের অধীনে সরকারি গ্রুপ বি, সি এবং ডি পদের কোচিং প্রোগ্রাম শুরু করা হয়েছে। রাজ্য বাজেটের অধীনে আদিবাসী অধ্যুষিত অঞ্চলগুলোতে রাস্তা এবং পানীয় জলের প্রকল্প গ্রহণ করা হয়েছে। সমগ্র জেলা থেকে মহিলা সদস্যদের তালিকা জমা নেওয়া হয়েছে এবং অনুমোদনের জন্য আদিবাসী উন্নয়ন দপ্তরে পাঠানো হয়েছে।'
        },
        { num:4, date:'16.06.2015', te:'Fourth Meeting', tb:'চতুর্থ বৈঠক',
          ce:'The process of granting for approved funds according to the plan list is ongoing in various districts. Proposed scheme lists must be submitted within a specific date for granting after correction. Until a regular DDO or treasurer is appointed, the relevant department of the Commissioner office will look after the financial matters. The Member Secretary will take necessary steps to present the final plan list for approval. The Member Secretary has been requested to take steps to register the West Bengal Bhumij Development Board under the West Bengal Society Registration Act, 1961 and a decision has been taken to appoint an auditor.',
          cb:'সব জেলায় পরিকল্পনা তালিকা অনুমোদিত হয়েছে, সেগুলোর অনুমোদিত তহবিল অনুযায়ী মঞ্জুরির প্রক্রিয়া চলছে। প্রস্তাবিত স্কিম তালিকাগুলি সংশোধনের পর মঞ্জুরির জন্য নির্দিষ্ট দিনের মধ্যে জমা দিতে হবে। নিয়মিত DDO বা কোষাধ্যক্ষ না হওয়া পর্যন্ত, কমিশনার অফিসের সংশ্লিষ্ট বিভাগ আর্থিক বিষয়গুলো দেখাশোনা করবে। মেম্বার সেক্রেটারি চূড়ান্ত পরিকল্পনা তালিকাটি অনুমোদনের জন্য পেশ করতে প্রয়োজনীয় ব্যবস্থা গ্রহণ করবেন। মেম্বার সেক্রেটারিকে ওয়েস্ট বেঙ্গল সোসাইটি রেজিস্ট্রেশন অ্যাক্ট, ১৯৬১-এর অধীনে বোর্ড নিবন্ধিত করার পদক্ষেপ নিতে অনুরোধ করা হয়েছে এবং অডিটর নিয়োগের সিদ্ধান্ত নেওয়া হয়েছে।'
        },
        { num:5, date:'20.09.2015', te:'Fifth Meeting', tb:'পঞ্চম বৈঠক',
          ce:'Member Secretary presents the financial progress report of the approved projects. Emphasis has been requested on projects that have not yet started and where progress is slow. For the 2014-15 financial year, the auditor found no anomalies, which was accepted by the board. Members from 4 districts, including the Vice-Chairman, raised various problems for the Bhumij community.',
          cb:'মেম্বার সেক্রেটারি অনুমোদিত প্রকল্পগুলোর আর্থিক অগ্রগতি বিবরণ পেশ করেন। যেসব প্রকল্প এখনও শুরু হয়নি এবং যেগুলোর অগ্রগতি ধীর, সেগুলোর ওপর জোর দেওয়ার জন্য অনুরোধ জানানো হয়েছে। ২০১৪-১৫ অর্থবর্ষের জন্য অডিটর কোনো অসঙ্গতি খুঁজে পাননি, যা বোর্ড কর্তৃক গৃহীত হয়েছে। ভাইস-চেয়ারম্যানসহ ৪টি জেলার সদস্যরা ভূমিজ সম্প্রদায়ের জন্য বিভিন্ন সমস্যার কথা উত্থাপন করেছেন।'
        },
        { num:6, date:'29.11.2015', te:'Sixth Meeting', tb:'ষষ্ঠ বৈঠক',
          ce:'1. For boundary wall construction of Berapal Jaherthan, RS Plot No. 26 of Teilokapur Mouza will be used instead of RS Plot No. 18. 2. Outreach camps for caste certificates and land mutation will be organized in different blocks of 4 districts. 3. Full-size statues of Bhumij heroes will be installed: Purulia - Jilpa Laya and Raghunath Singh; Jhargram and Bankura - Ganganarayan Singh and Raghunath Singh. 4. To finish outstanding projects quickly, their sub-allocation must be accelerated. 5. A proposal for including a female member in the board will be sent to the department.',
          cb:'১. বেড়াপাল জাহেরথানের সীমানা প্রাচীর নির্মাণের জন্য RS প্লট নং ১৮-এর পরিবর্তে RS প্লট নং ২৬ ব্যবহার করা হবে। ২. পুরুলিয়া, ঝাড়গ্রাম, বাঁকুড়া এবং পশ্চিম মেদিনীপুর জেলার বিভিন্ন ব্লকে জাতিগত শংসাপত্র এবং জমির মিউটেশনের জন্য আউটরিচ ক্যাম্প আয়োজন করা হবে। ৩. ভূমিজ বীরদের পূর্ণাবয়ব মূর্তি স্থাপন করা হবে: পুরুলিয়া - জিলপা লায়া এবং রঘুনাথ সিং; ঝাড়গ্রাম এবং বাঁকুড়া - গঙ্গানারায়ণ সিং এবং রঘুনাথ সিং। ৪. বকেয়া প্রকল্পগুলো দ্রুত শেষ করার জন্য সেগুলোর উপ-বরাদ্দ ত্বরান্বিত করতে হবে। ৫. বোর্ডে একজন নারী সদস্য অন্তর্ভুক্তির প্রস্তাব বিভাগে পাঠানো হবে।'
        }
    ];

    for (const m of meetingsData) {
        await pool.query('INSERT INTO meetings (meeting_number,meeting_date,title_en,title_bn,content_en,content_bn,sort_order) VALUES (?,?,?,?,?,?,?)',
            [m.num, m.date, m.te, m.tb, m.ce, m.cb, m.num]);
    }
    console.log('✅ 6 Meetings inserted');

    console.log('✅ All content seeded! Start server now.');
    process.exit(0);
}

seed3().catch(e => { console.error(e); process.exit(1); });
