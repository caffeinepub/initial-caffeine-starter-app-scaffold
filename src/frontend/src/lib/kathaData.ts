import { KathaCategory } from "../backend";

export interface StaticKatha {
  id: string;
  title: string;
  deity: string;
  category: KathaCategory;
  hindiText: string;
  englishText: string;
  tags: string[];
  emoji: string;
}

export const STATIC_KATHAS: StaticKatha[] = [
  {
    id: "static-ramayan-1",
    title: "रामायण - श्री राम जन्म कथा",
    deity: "श्री राम",
    category: KathaCategory.puranik,
    emoji: "🏹",
    tags: ["राम", "अयोध्या", "रामायण"],
    hindiText: `श्री राम जन्म कथा

त्रेतायुग में अयोध्या नगरी में महाराज दशरथ राज्य करते थे। वे बड़े धर्मात्मा और प्रजापालक राजा थे। उनकी तीन रानियाँ थीं - कौशल्या, कैकेयी और सुमित्रा। परंतु बहुत समय बीत जाने पर भी उनके कोई संतान नहीं हुई।

महाराज दशरथ ने पुत्र प्राप्ति के लिए पुत्रकामेष्टि यज्ञ करवाया। महर्षि वशिष्ठ के मार्गदर्शन में ऋषि श्रृंगी ने यह यज्ञ संपन्न किया। यज्ञ की पावन अग्नि से एक दिव्य पुरुष प्रकट हुए और उन्होंने खीर का पात्र महाराज दशरथ को दिया।

महाराज ने वह खीर अपनी तीनों रानियों को दी। समय आने पर चैत्र मास के शुक्ल पक्ष की नवमी तिथि को, जब सूर्य मध्याह्न में था, माता कौशल्या की कोख से भगवान विष्णु के अवतार श्री राम का जन्म हुआ। उसी दिन कैकेयी से भरत और सुमित्रा से लक्ष्मण और शत्रुघ्न का जन्म हुआ।

चारों राजकुमारों के जन्म से अयोध्या में महान उत्सव मनाया गया। देवताओं ने पुष्पवर्षा की। श्री राम बड़े होकर मर्यादा पुरुषोत्तम कहलाए और उन्होंने अपने जीवन से धर्म का मार्ग दिखाया।

जय श्री राम! 🙏`,
    englishText: `The Birth Story of Lord Rama

In the Treta Yuga, King Dasharatha ruled the city of Ayodhya. He was a righteous and benevolent king. He had three queens - Kaushalya, Kaikeyi, and Sumitra. However, even after a long time, they had no children.

King Dasharatha performed the Putrakameshti Yajna (a sacred ritual for obtaining a son). Under the guidance of Maharishi Vashistha, Rishi Shringi conducted this yajna. From the sacred fire of the yajna, a divine being appeared and gave a pot of kheer (sweet rice pudding) to King Dasharatha.

The king distributed the kheer among his three queens. In due time, on the ninth day of the bright fortnight of the month of Chaitra, when the sun was at its zenith, Lord Rama - an avatar of Lord Vishnu - was born to Queen Kaushalya. On the same day, Bharata was born to Kaikeyi, and Lakshmana and Shatrughna were born to Sumitra.

The birth of the four princes was celebrated with great joy in Ayodhya. The gods showered flowers from the heavens. Lord Rama grew up to be called Maryada Purushottam (the ideal man) and showed the path of righteousness through his life.

Jai Shri Ram! 🙏`,
  },
  {
    id: "static-ramayan-2",
    title: "रामायण - सीता स्वयंवर",
    deity: "श्री राम",
    category: KathaCategory.puranik,
    emoji: "🏹",
    tags: ["राम", "सीता", "स्वयंवर", "धनुष"],
    hindiText: `सीता स्वयंवर कथा

राजा जनक की पुत्री सीता अत्यंत सुंदर और गुणवती थीं। उनके स्वयंवर के लिए राजा जनक ने एक शर्त रखी थी - जो भी वीर पुरुष भगवान शिव के धनुष को उठाकर उस पर प्रत्यंचा चढ़ा देगा, उसी से सीता का विवाह होगा।

अनेक राजा और वीर योद्धा आए, परंतु कोई भी उस दिव्य धनुष को हिला तक नहीं सका। तब गुरु विश्वामित्र की आज्ञा से श्री राम आगे बढ़े। उन्होंने सहज भाव से उस विशाल धनुष को उठाया और जैसे ही उस पर प्रत्यंचा चढ़ाने लगे, वह धनुष टूट गया।

धनुष के टूटने की आवाज से सारी सभा गूंज उठी। राजा जनक की प्रसन्नता का ठिकाना न रहा। माता सीता ने श्री राम के गले में वरमाला डाली। इस प्रकार राम और सीता का मिलन हुआ।

यह विवाह केवल दो व्यक्तियों का नहीं, बल्कि धर्म और शक्ति का, आदर्श और सौंदर्य का मिलन था। जय सियाराम! 🙏`,
    englishText: `The Swayamvara of Sita

King Janaka's daughter Sita was extremely beautiful and virtuous. For her swayamvara (self-choice ceremony), King Janaka had set a condition - whoever could lift Lord Shiva's divine bow and string it would marry Sita.

Many kings and brave warriors came, but none could even move that divine bow. Then, at the command of Guru Vishwamitra, Lord Rama stepped forward. He effortlessly lifted the massive bow, and as he began to string it, the bow broke.

The sound of the bow breaking echoed throughout the assembly. King Janaka's joy knew no bounds. Mother Sita placed the garland of victory around Lord Rama's neck. Thus, Ram and Sita were united.

This marriage was not just the union of two individuals, but the union of righteousness and strength, of ideal virtue and beauty. Jai Siyaram! 🙏`,
  },
  {
    id: "static-mahabharat-1",
    title: "महाभारत - गीता उपदेश",
    deity: "श्री कृष्ण",
    category: KathaCategory.puranik,
    emoji: "🪷",
    tags: ["कृष्ण", "अर्जुन", "गीता", "महाभारत"],
    hindiText: `भगवद्गीता - कुरुक्षेत्र का उपदेश

कुरुक्षेत्र के मैदान में दोनों सेनाएँ आमने-सामने खड़ी थीं। अर्जुन ने जब अपने सामने अपने ही गुरुजनों, पितामहों और बंधुओं को देखा तो उनका मन विचलित हो गया। उन्होंने श्री कृष्ण से कहा - "हे केशव! मैं यह युद्ध नहीं कर सकता। अपने ही स्वजनों को मारकर मुझे क्या मिलेगा?"

तब भगवान श्री कृष्ण ने अर्जुन को गीता का उपदेश दिया। उन्होंने कहा - "हे अर्जुन! आत्मा अमर है, शरीर नश्वर है। जो जन्म लेता है उसकी मृत्यु निश्चित है और जो मरता है उसका जन्म भी निश्चित है। इसलिए तू शोक मत कर।"

"कर्म कर, फल की चिंता मत कर। यही कर्मयोग है। अपना कर्तव्य निभाना ही सच्चा धर्म है। क्षत्रिय का धर्म है युद्ध करना, अधर्म का नाश करना।"

"जो मुझे सब कुछ समर्पित करके, मेरी शरण में आता है, मैं उसे सभी पापों से मुक्त कर देता हूँ। तू शोक मत कर।"

इस प्रकार भगवान कृष्ण ने अर्जुन को जीवन का सत्य समझाया और वे युद्ध के लिए तैयार हो गए। भगवद्गीता आज भी मानवता का मार्गदर्शन करती है।

जय श्री कृष्ण! 🙏`,
    englishText: `Bhagavad Gita - The Divine Teaching at Kurukshetra

On the battlefield of Kurukshetra, both armies stood facing each other. When Arjuna saw his own teachers, grandfathers, and relatives standing before him, his mind became troubled. He said to Lord Krishna - "O Keshava! I cannot fight this war. What will I gain by killing my own kinsmen?"

Then Lord Krishna gave Arjuna the teachings of the Gita. He said - "O Arjuna! The soul is immortal, the body is perishable. Death is certain for one who is born, and birth is certain for one who dies. Therefore, do not grieve."

"Do your duty, do not worry about the fruits. This is Karma Yoga. Fulfilling one's duty is true dharma. The duty of a Kshatriya is to fight, to destroy unrighteousness."

"Whoever surrenders everything to me and takes refuge in me, I free them from all sins. Do not grieve."

Thus, Lord Krishna explained the truth of life to Arjuna, and he became ready for battle. The Bhagavad Gita continues to guide humanity even today.

Jai Shri Krishna! 🙏`,
  },
  {
    id: "static-mahabharat-2",
    title: "महाभारत - द्रौपदी चीरहरण",
    deity: "श्री कृष्ण",
    category: KathaCategory.puranik,
    emoji: "🪷",
    tags: ["द्रौपदी", "कृष्ण", "महाभारत", "धर्म"],
    hindiText: `द्रौपदी की रक्षा - भगवान कृष्ण की लीला

जुए में हारने के बाद दुर्योधन ने द्रौपदी को भरी सभा में अपमानित करने का आदेश दिया। दुःशासन द्रौपदी को बालों से पकड़कर सभा में ले आया। दुर्योधन ने दुःशासन को आदेश दिया कि वह द्रौपदी का चीर हरण करे।

द्रौपदी ने सभी से सहायता माँगी, परंतु कोई आगे नहीं आया। पांडव भी असहाय थे क्योंकि वे जुए में हार चुके थे। तब द्रौपदी ने अपने दोनों हाथ ऊपर उठाकर भगवान कृष्ण को पुकारा - "हे द्वारकाधीश! हे गोविंद! मेरी रक्षा करो!"

भगवान कृष्ण ने द्रौपदी की पुकार सुनी। दुःशासन जितना साड़ी खींचता, उतनी ही साड़ी बढ़ती जाती। अंत में दुःशासन थककर गिर पड़ा। द्रौपदी की लाज बच गई।

यह कथा हमें सिखाती है कि जो पूर्ण समर्पण से भगवान को पुकारता है, भगवान उसकी अवश्य रक्षा करते हैं। भक्त की पुकार कभी व्यर्थ नहीं जाती।

जय श्री कृष्ण! 🙏`,
    englishText: `The Protection of Draupadi - Lord Krishna's Divine Act

After losing in the game of dice, Duryodhana ordered Draupadi to be humiliated in the open court. Dushasana dragged Draupadi by her hair into the assembly. Duryodhana ordered Dushasana to disrobe Draupadi.

Draupadi sought help from everyone, but no one came forward. The Pandavas were also helpless as they had lost in the dice game. Then Draupadi raised both her hands and called out to Lord Krishna - "O Dwarkadhish! O Govinda! Protect me!"

Lord Krishna heard Draupadi's call. The more Dushasana pulled the saree, the more it kept growing. Finally, Dushasana fell down exhausted. Draupadi's honor was saved.

This story teaches us that whoever calls upon God with complete surrender, God surely protects them. The call of a devotee never goes unanswered.

Jai Shri Krishna! 🙏`,
  },
  {
    id: "static-krishna-1",
    title: "श्री कृष्ण जन्म कथा",
    deity: "श्री कृष्ण",
    category: KathaCategory.puranik,
    emoji: "🪷",
    tags: ["कृष्ण", "जन्माष्टमी", "मथुरा", "देवकी"],
    hindiText: `श्री कृष्ण जन्म कथा

द्वापरयुग में मथुरा नगरी में कंस नाम का अत्याचारी राजा राज्य करता था। आकाशवाणी हुई कि उसकी बहन देवकी का आठवाँ पुत्र उसका वध करेगा। इससे भयभीत होकर कंस ने देवकी और उनके पति वासुदेव को कारागार में डाल दिया।

एक-एक करके देवकी के सात पुत्रों को कंस ने मार डाला। जब आठवें पुत्र का जन्म होने वाला था, तब भाद्रपद मास की कृष्ण पक्ष की अष्टमी को अर्धरात्रि में भगवान विष्णु ने श्री कृष्ण के रूप में जन्म लिया।

उसी रात कारागार के सभी पहरेदार सो गए, दरवाजे अपने आप खुल गए। वासुदेव जी ने नवजात शिशु को टोकरी में रखकर अपने सिर पर उठाया और यमुना नदी पार करके गोकुल में नंद बाबा के घर पहुँचे। वहाँ नंद बाबा की पत्नी यशोदा ने एक कन्या को जन्म दिया था। वासुदेव जी ने कृष्ण को वहाँ छोड़ दिया और उस कन्या को लेकर वापस आ गए।

जब कंस ने उस कन्या को मारने की कोशिश की, तो वह आकाश में उड़ गई और बोली - "तुझे मारने वाला तो गोकुल में पल रहा है।"

इस प्रकार श्री कृष्ण का जन्म हुआ और उन्होंने बड़े होकर कंस का वध किया और धर्म की स्थापना की।

जय श्री कृष्ण! 🙏`,
    englishText: `The Birth Story of Lord Krishna

In the Dwapara Yuga, a tyrannical king named Kansa ruled the city of Mathura. A divine prophecy declared that the eighth son of his sister Devaki would kill him. Frightened by this, Kansa imprisoned Devaki and her husband Vasudeva.

One by one, Kansa killed Devaki's seven sons. When the eighth son was about to be born, on the eighth day of the dark fortnight of the month of Bhadrapada, at midnight, Lord Vishnu took birth as Lord Krishna.

That very night, all the guards in the prison fell asleep, and the doors opened by themselves. Vasudeva placed the newborn in a basket, carried it on his head, crossed the Yamuna river, and reached Nanda Baba's home in Gokul. There, Nanda Baba's wife Yashoda had given birth to a daughter. Vasudeva left Krishna there and returned with the daughter.

When Kansa tried to kill that daughter, she flew into the sky and said - "The one who will kill you is being raised in Gokul."

Thus Lord Krishna was born, and when he grew up, he killed Kansa and established righteousness.

Jai Shri Krishna! 🙏`,
  },
  {
    id: "static-shiv-1",
    title: "शिव पुराण - समुद्र मंथन",
    deity: "भगवान शिव",
    category: KathaCategory.puranik,
    emoji: "🔱",
    tags: ["शिव", "समुद्र मंथन", "नीलकंठ", "अमृत"],
    hindiText: `समुद्र मंथन और नीलकंठ की कथा

देवताओं और असुरों ने मिलकर अमृत प्राप्त करने के लिए क्षीरसागर का मंथन किया। मंदराचल पर्वत को मथानी और वासुकि नाग को रस्सी बनाया गया। भगवान विष्णु ने कूर्म (कछुए) का रूप धारण करके पर्वत को अपनी पीठ पर धारण किया।

मंथन के दौरान सबसे पहले हलाहल विष निकला। यह विष इतना भयंकर था कि इससे सारी सृष्टि नष्ट हो सकती थी। सभी देवता और असुर भयभीत हो गए। तब सभी ने भगवान शिव की शरण ली।

भगवान शिव ने सृष्टि की रक्षा के लिए वह सारा विष अपने हाथ में ले लिया और पी गए। माता पार्वती ने उनका गला पकड़ लिया ताकि विष नीचे न उतरे। इससे भगवान शिव का कंठ नीला पड़ गया और वे "नीलकंठ" कहलाए।

इस कथा से हमें सीख मिलती है कि सच्चा महान वही है जो दूसरों की रक्षा के लिए स्वयं कष्ट उठाए। भगवान शिव की यह लीला उनकी महानता और करुणा का प्रतीक है।

ॐ नमः शिवाय! 🙏`,
    englishText: `The Churning of the Ocean and the Story of Neelkantha

The gods and demons together churned the ocean of milk to obtain amrita (nectar of immortality). Mount Mandara was used as the churning rod and the serpent Vasuki as the rope. Lord Vishnu took the form of a tortoise (Kurma) and supported the mountain on his back.

During the churning, the first thing to emerge was the deadly poison Halahala. This poison was so terrible that it could destroy all of creation. All the gods and demons became frightened. Then everyone sought refuge with Lord Shiva.

To protect creation, Lord Shiva took all the poison in his hand and drank it. Mother Parvati held his throat so that the poison would not go down. This turned Lord Shiva's throat blue, and he came to be known as "Neelkantha" (the blue-throated one).

This story teaches us that the truly great are those who endure suffering for the protection of others. This divine act of Lord Shiva is a symbol of his greatness and compassion.

Om Namah Shivaya! 🙏`,
  },
  {
    id: "static-ekadashi-1",
    title: "एकादशी व्रत कथा",
    deity: "भगवान विष्णु",
    category: KathaCategory.vrat,
    emoji: "🌸",
    tags: ["एकादशी", "व्रत", "विष्णु", "मोक्ष"],
    hindiText: `एकादशी व्रत की महिमा

एकादशी व्रत भगवान विष्णु को अत्यंत प्रिय है। इस व्रत को करने से समस्त पापों का नाश होता है और मोक्ष की प्राप्ति होती है।

एक बार एक पापी व्यक्ति था जिसने अपने जीवन में अनेक पाप किए थे। मृत्यु के समय यमदूत उसे लेने आए। परंतु भगवान विष्णु के दूतों ने उसे रोका और कहा कि इस व्यक्ति ने एक बार अनजाने में एकादशी का व्रत किया था, इसलिए यह विष्णुलोक जाएगा।

यमराज ने पूछा - "केवल एक एकादशी व्रत से इतने पापों का नाश कैसे हो सकता है?"

भगवान विष्णु के दूत ने कहा - "एकादशी व्रत का फल अनंत है। जो व्यक्ति श्रद्धा और भक्ति से यह व्रत करता है, उसके सभी पाप नष्ट हो जाते हैं। भगवान विष्णु की कृपा से उसे मोक्ष मिलता है।"

इसलिए प्रत्येक एकादशी को व्रत रखें, भगवान विष्णु का ध्यान करें और उनकी कथा सुनें। यह व्रत आपके जीवन को पवित्र बनाएगा।

जय श्री हरि! 🙏`,
    englishText: `The Glory of Ekadashi Vrat

The Ekadashi fast is very dear to Lord Vishnu. Observing this fast destroys all sins and leads to liberation (moksha).

Once there was a sinful person who had committed many sins in his life. At the time of death, the messengers of Yama came to take him. But the messengers of Lord Vishnu stopped them and said that this person had once unknowingly observed the Ekadashi fast, so he would go to Vishnuloka.

Yamraj asked - "How can so many sins be destroyed by just one Ekadashi fast?"

Lord Vishnu's messenger said - "The fruit of the Ekadashi fast is infinite. Whoever observes this fast with faith and devotion, all their sins are destroyed. By the grace of Lord Vishnu, they attain liberation."

Therefore, observe the fast on every Ekadashi, meditate on Lord Vishnu, and listen to his stories. This fast will purify your life.

Jai Shri Hari! 🙏`,
  },
  {
    id: "static-navratri-1",
    title: "नवरात्रि व्रत कथा - माँ दुर्गा",
    deity: "माँ दुर्गा",
    category: KathaCategory.vrat,
    emoji: "🌺",
    tags: ["नवरात्रि", "दुर्गा", "व्रत", "शक्ति"],
    hindiText: `नवरात्रि व्रत की कथा

प्राचीन काल में महिषासुर नाम का एक महाबलशाली असुर था। उसने ब्रह्मा जी से वरदान प्राप्त किया था कि कोई भी पुरुष उसे नहीं मार सकता। इस वरदान के बल पर उसने स्वर्ग पर अधिकार कर लिया और देवताओं को स्वर्ग से निकाल दिया।

सभी देवता ब्रह्मा, विष्णु और महेश के पास गए और अपनी व्यथा सुनाई। तब तीनों देवों के तेज से एक महाशक्ति प्रकट हुई - माँ दुर्गा। सभी देवताओं ने अपने-अपने अस्त्र-शस्त्र माँ दुर्गा को दिए।

माँ दुर्गा और महिषासुर के बीच नौ दिनों तक भीषण युद्ध हुआ। दसवें दिन माँ दुर्गा ने महिषासुर का वध किया। इसीलिए नवरात्रि नौ दिनों तक मनाई जाती है और दसवें दिन विजयादशमी (दशहरा) मनाया जाता है।

नवरात्रि में माँ के नौ रूपों की पूजा की जाती है - शैलपुत्री, ब्रह्मचारिणी, चंद्रघंटा, कूष्मांडा, स्कंदमाता, कात्यायनी, कालरात्रि, महागौरी और सिद्धिदात्री।

जय माँ दुर्गा! 🙏`,
    englishText: `The Story of Navratri Vrat - Maa Durga

In ancient times, there was a mighty demon named Mahishasura. He had obtained a boon from Brahma that no male could kill him. With the power of this boon, he conquered heaven and drove the gods out.

All the gods went to Brahma, Vishnu, and Mahesh and told them of their plight. Then from the combined radiance of the three gods, a great power emerged - Maa Durga. All the gods gave their weapons to Maa Durga.

A fierce battle took place between Maa Durga and Mahishasura for nine days. On the tenth day, Maa Durga killed Mahishasura. That is why Navratri is celebrated for nine days and the tenth day is celebrated as Vijayadashami (Dussehra).

During Navratri, the nine forms of the Mother are worshipped - Shailputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri.

Jai Maa Durga! 🙏`,
  },
  {
    id: "static-satyanarayan-1",
    title: "सत्यनारायण व्रत कथा",
    deity: "भगवान विष्णु",
    category: KathaCategory.vrat,
    emoji: "🌸",
    tags: ["सत्यनारायण", "व्रत", "विष्णु", "कथा"],
    hindiText: `श्री सत्यनारायण व्रत कथा

एक बार नारद मुनि भ्रमण करते हुए पृथ्वी पर आए। उन्होंने देखा कि मनुष्य अनेक प्रकार के कष्टों से पीड़ित हैं। वे भगवान विष्णु के पास गए और पूछा - "हे प्रभु! मनुष्यों के कष्टों को दूर करने का कोई सरल उपाय बताइए।"

भगवान विष्णु ने कहा - "हे नारद! सत्यनारायण व्रत करने से मनुष्य के सभी कष्ट दूर होते हैं। इस व्रत में मेरी पूजा करके कथा सुनने से धन, संतान, सुख और मोक्ष की प्राप्ति होती है।"

एक गरीब ब्राह्मण ने यह व्रत किया। भगवान की कृपा से वह धनवान हो गया। उसने अपनी पुत्री का विवाह एक व्यापारी से किया। व्यापारी ने भी यह व्रत किया और उसे व्यापार में सफलता मिली।

परंतु एक बार व्यापारी ने व्रत की प्रसाद का अपमान किया। इससे उसे कष्ट हुआ। जब उसने पश्चाताप करके पुनः व्रत किया, तो भगवान ने उसे क्षमा कर दिया।

इस कथा से सीख मिलती है कि भगवान की भक्ति में श्रद्धा और नियमितता आवश्यक है।

जय सत्यनारायण! 🙏`,
    englishText: `Sri Satyanarayan Vrat Katha

Once Narada Muni came to earth during his wanderings. He saw that humans were suffering from many kinds of troubles. He went to Lord Vishnu and asked - "O Lord! Please tell me a simple way to remove the sufferings of humans."

Lord Vishnu said - "O Narada! By observing the Satyanarayan Vrat, all the sufferings of humans are removed. By worshipping me and listening to the story in this vrat, one obtains wealth, children, happiness, and liberation."

A poor Brahmin observed this vrat. By the grace of God, he became wealthy. He married his daughter to a merchant. The merchant also observed this vrat and achieved success in business.

But once the merchant disrespected the prasad (sacred offering) of the vrat. This caused him suffering. When he repented and observed the vrat again, God forgave him.

This story teaches us that faith and regularity are essential in devotion to God.

Jai Satyanarayan! 🙏`,
  },
  {
    id: "static-hanuman-1",
    title: "हनुमान जी की भक्ति कथा",
    deity: "हनुमान जी",
    category: KathaCategory.puranik,
    emoji: "🚩",
    tags: ["हनुमान", "राम भक्ति", "संकटमोचन"],
    hindiText: `हनुमान जी की अनन्य भक्ति

हनुमान जी श्री राम के परम भक्त हैं। उनकी भक्ति की कथा अत्यंत प्रेरणादायक है।

एक बार माता सीता ने हनुमान जी को सिंदूर लगाते देखा। उन्होंने पूछा - "हनुमान! तुम सिंदूर क्यों लगाते हो?" हनुमान जी ने कहा - "माता! आप श्री राम जी की प्रिया हैं और आप सिंदूर लगाती हैं। मैंने सोचा कि यदि थोड़ा सिंदूर लगाने से श्री राम जी प्रसन्न होते हैं, तो यदि मैं पूरे शरीर पर सिंदूर लगाऊँ तो वे और अधिक प्रसन्न होंगे।"

यह सुनकर माता सीता और श्री राम दोनों बहुत प्रसन्न हुए। श्री राम ने हनुमान जी को गले लगाया और कहा - "हनुमान! तुम्हारी भक्ति अनुपम है। जो भी तुम्हारा स्मरण करेगा, उसे मेरी कृपा प्राप्त होगी।"

इसीलिए आज भी हनुमान जी के भक्त उन्हें सिंदूर चढ़ाते हैं। हनुमान जी की भक्ति हमें सिखाती है कि सच्ची भक्ति में तर्क नहीं, केवल प्रेम होता है।

जय हनुमान! 🙏`,
    englishText: `The Unparalleled Devotion of Hanuman Ji

Hanuman Ji is the supreme devotee of Lord Rama. The story of his devotion is extremely inspiring.

Once Mother Sita saw Hanuman Ji applying sindoor (vermilion). She asked - "Hanuman! Why do you apply sindoor?" Hanuman Ji said - "Mother! You are Lord Rama's beloved and you apply sindoor. I thought that if applying a little sindoor pleases Lord Rama, then if I apply sindoor all over my body, he will be even more pleased."

Hearing this, both Mother Sita and Lord Rama were very pleased. Lord Rama embraced Hanuman Ji and said - "Hanuman! Your devotion is incomparable. Whoever remembers you will receive my grace."

That is why even today, devotees of Hanuman Ji offer him sindoor. Hanuman Ji's devotion teaches us that in true devotion, there is no logic, only love.

Jai Hanuman! 🙏`,
  },
  {
    id: "static-ganesh-1",
    title: "गणेश जी की कथा - प्रथम पूज्य",
    deity: "गणेश जी",
    category: KathaCategory.puranik,
    emoji: "🐘",
    tags: ["गणेश", "विघ्नहर्ता", "प्रथम पूज्य"],
    hindiText: `गणेश जी - प्रथम पूज्य की कथा

एक बार देवताओं में विवाद हुआ कि सबसे पहले किसकी पूजा होनी चाहिए। सभी देवता भगवान शिव के पास गए। भगवान शिव ने कहा - "जो सबसे पहले पृथ्वी की परिक्रमा करके वापस आएगा, उसकी पूजा सबसे पहले होगी।"

सभी देवता अपने-अपने वाहनों पर सवार होकर पृथ्वी की परिक्रमा के लिए निकल पड़े। गणेश जी के पास केवल एक छोटा चूहा था। गणेश जी ने सोचा और फिर अपने माता-पिता शिव और पार्वती की परिक्रमा की और बोले - "माता-पिता में ही सारी सृष्टि समाई है।"

भगवान शिव और माता पार्वती बहुत प्रसन्न हुए। उन्होंने गणेश जी को आशीर्वाद दिया और घोषणा की कि अब से सभी शुभ कार्यों में सबसे पहले गणेश जी की पूजा होगी।

इस कथा से हमें सीख मिलती है कि बुद्धि और विवेक से बड़ी से बड़ी समस्या का समाधान निकाला जा सकता है।

जय गणेश! 🙏`,
    englishText: `Lord Ganesha - The Story of the First Worshipped

Once there was a dispute among the gods about who should be worshipped first. All the gods went to Lord Shiva. Lord Shiva said - "Whoever circumambulates the earth first and returns will be worshipped first."

All the gods set out on their respective vehicles to circumambulate the earth. Ganesha Ji only had a small mouse. Ganesha Ji thought and then circumambulated his parents Shiva and Parvati and said - "All of creation is contained within one's parents."

Lord Shiva and Mother Parvati were very pleased. They blessed Ganesha Ji and declared that from now on, Ganesha Ji would be worshipped first in all auspicious occasions.

This story teaches us that with intelligence and wisdom, even the biggest problems can be solved.

Jai Ganesha! 🙏`,
  },
  {
    id: "static-shivratri-1",
    title: "महाशिवरात्रि व्रत कथा",
    deity: "भगवान शिव",
    category: KathaCategory.vrat,
    emoji: "🔱",
    tags: ["शिवरात्रि", "शिव", "व्रत", "महादेव"],
    hindiText: `महाशिवरात्रि व्रत की कथा

एक बार एक शिकारी जंगल में शिकार करने गया। दिन भर भटकने के बाद भी उसे कोई शिकार नहीं मिला। रात होने पर वह एक बेल के पेड़ पर चढ़ गया। उस पेड़ के नीचे एक शिवलिंग था।

रात भर जागते हुए शिकारी ने बेल के पत्ते तोड़-तोड़कर नीचे फेंके, जो शिवलिंग पर गिरते रहे। इस प्रकार अनजाने में उसने शिवरात्रि का व्रत और शिव पूजा कर ली।

प्रातःकाल एक हिरण आया। शिकारी ने उसे मारने के लिए धनुष उठाया, परंतु हिरण ने कहा - "मुझे मत मारो। मेरे बच्चे मेरी प्रतीक्षा कर रहे हैं। मैं उन्हें किसी के पास छोड़कर वापस आऊँगा।" शिकारी ने उसे जाने दिया।

इसी प्रकार एक-एक करके हिरण का पूरा परिवार आया और शिकारी ने सबको जाने दिया। अंत में सभी हिरण वापस आ गए और शिकारी के सामने खड़े हो गए। शिकारी का हृदय परिवर्तन हो गया और उसने शिकार छोड़ दिया।

भगवान शिव की कृपा से उस शिकारी को मोक्ष प्राप्त हुआ। इस कथा से सीख मिलती है कि भगवान की भक्ति जाने-अनजाने में भी फल देती है।

ॐ नमः शिवाय! 🙏`,
    englishText: `The Story of Mahashivratri Vrat

Once a hunter went to the forest to hunt. After wandering all day, he found no prey. As night fell, he climbed a bel (wood apple) tree. Under that tree was a Shivalinga.

Staying awake all night, the hunter kept plucking bel leaves and throwing them down, which kept falling on the Shivalinga. Thus, unknowingly, he observed the Shivratri fast and performed Shiva puja.

In the morning, a deer came. The hunter raised his bow to kill it, but the deer said - "Don't kill me. My children are waiting for me. I will leave them with someone and come back." The hunter let it go.

Similarly, one by one, the deer's entire family came and the hunter let them all go. Finally, all the deer came back and stood before the hunter. The hunter's heart was transformed and he gave up hunting.

By the grace of Lord Shiva, that hunter attained liberation. This story teaches us that devotion to God bears fruit whether done knowingly or unknowingly.

Om Namah Shivaya! 🙏`,
  },
  {
    id: "static-radha-1",
    title: "राधा-कृष्ण प्रेम कथा",
    deity: "राधा-कृष्ण",
    category: KathaCategory.puranik,
    emoji: "🪷",
    tags: ["राधा", "कृष्ण", "प्रेम", "वृंदावन"],
    hindiText: `राधा-कृष्ण की दिव्य प्रेम कथा

वृंदावन की कुंज गलियों में श्री कृष्ण की बाँसुरी की मधुर धुन गूँजती थी। उस धुन को सुनकर राधा रानी का मन विचलित हो जाता था। राधा और कृष्ण का प्रेम दिव्य और अलौकिक था।

एक दिन राधा रानी अपनी सखियों के साथ यमुना तट पर गई थीं। वहाँ श्री कृष्ण बाँसुरी बजा रहे थे। बाँसुरी की धुन सुनकर राधा रानी मंत्रमुग्ध हो गईं। उनके पैर अपने आप कृष्ण की ओर बढ़ने लगे।

कृष्ण ने राधा को देखा और बाँसुरी बजाना बंद कर दिया। उन्होंने कहा - "राधे! तुम्हारे बिना यह बाँसुरी अधूरी है, यह वृंदावन अधूरा है, और मैं भी अधूरा हूँ।"

राधा-कृष्ण का यह प्रेम भक्ति का सर्वोच्च रूप है। यह प्रेम आत्मा और परमात्मा के मिलन का प्रतीक है। जो भक्त इस प्रेम को समझ लेता है, वह मोक्ष को प्राप्त होता है।

राधे राधे! जय श्री कृष्ण! 🙏`,
    englishText: `The Divine Love Story of Radha-Krishna

In the bower lanes of Vrindavan, the sweet melody of Lord Krishna's flute echoed. Hearing that melody, Radha Rani's heart would become restless. The love of Radha and Krishna was divine and transcendental.

One day, Radha Rani went to the banks of the Yamuna with her companions. There, Lord Krishna was playing the flute. Hearing the melody of the flute, Radha Rani became spellbound. Her feet began to move towards Krishna on their own.

Krishna saw Radha and stopped playing the flute. He said - "Radhe! Without you, this flute is incomplete, this Vrindavan is incomplete, and I too am incomplete."

This love of Radha-Krishna is the highest form of devotion. This love is a symbol of the union of the soul and the Supreme Soul. The devotee who understands this love attains liberation.

Radhe Radhe! Jai Shri Krishna! 🙏`,
  },
];
