import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  public type KathaCategory = {
    #puranik;
    #vrat;
  };

  public type KathaApprovalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Katha = {
    id : Nat;
    title : Text;
    category : KathaCategory;
    deity : Text;
    hindiText : Text;
    englishText : Text;
    tags : [Text];
    createdAt : Int;
    status : KathaApprovalStatus;
  };

  type ActorState = {
    kathayen : Map.Map<Nat, Katha>;
    kathaCounter : Nat;
  };

  public type OldActor = ActorState;
  public type NewActor = ActorState;

  public func run(old : OldActor) : NewActor {
    if (not old.kathayen.isEmpty()) {
      return old;
    };

    let seeded = Map.empty<Nat, Katha>();

    let seedData : [Katha] = [
      {
        id = 0;
        title = "Santoshi Mata Vrat Katha";
        category = #vrat;
        deity = "Santoshi Mata";
        hindiText = "पूजा की विधि:\n\nसबसे पहले शुक्रवार व्रत की संकल्पना करें। जैसे-जैसे शक्ति हो, इतने शुक्रवार तक व्रत रखें। व्रत के दिन सुबह स्नान कर साफ-सुथरे वस्त्र पहनें। मंदिर या घर के पूजा स्थल को स्वच्छ कर वहां माता की मूर्ति या चित्र स्थापित करें। माता की पूजा अर्पण, जैसे चावल, गुड़, चना, तथा पुष्प आदि से करें।\n\nपूजा के बाद कथा का श्रवण करें और आरती करें। माता का भोग लगाकर प्रसाद बांटें।\n\nकथा:\n\nएक समय की बात है, एक निर्धन महिला संतोषी माता के व्रत से अपने जीवन में सुख-समृद्धि लाती है। उसके पति कार्य के सिलसिले में दूसरे नगर चले जाते हैं। स्त्री माता की उपासना में लगी रहती है और शुक्रवार का व्रत करती है। माता की कृपा से पति लौट आते हैं और परिवार में संपन्नता आती है।\n\nइस कथा का संदेश है कि श्रद्धा और विश्वास से माता संतोषी की पूजा करने पर हर संकट दूर हो जाता है।";
        englishText = "Method of Worship:\n\nFirst, take the pledge of Friday fasting. Perform as many Fridays as possible as per your capacity. On the day of the fast, bathe in the morning and wear clean clothes. Clean the temple or worship area and place the idol or picture of the Mother. Offerings such as rice, jaggery, chickpeas, and flowers are to be presented.\n\nAfter worship, listen to the Katha and perform the Aarti. Distribute the offerings as prasad.\n\nKatha:\n\nOnce, a poor woman brings prosperity to her life through the fasting of Santoshi Mata. Her husband goes to another town for work. The woman continues to worship the mother and observes the Friday fast. Due to the mother's blessings, her husband returns and prosperity comes to their family.\n\nThe message of this story is that faith and devotion to Santoshi Mata remove all obstacles.";
        tags = ["vrat", "friday", "prosperity", "santoshi"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 1;
        title = "Solah Somvar Vrat Katha";
        category = #vrat;
        deity = "Shiva";
        hindiText = "सोलह सोमवार व्रत कथा:\n\nएक बार भगवान शिव और माता पार्वती भ्रमण करते हुए विदर्भ नगर पहुंचे। वहां एक सुंदर मंदिर में विश्राम किया। पार्वती जी ने शिवजी से चौसर खेलने की इच्छा जताई। खेल में पार्वती जी जीत गईं। मंदिर के पुजारी ने शिवजी को विजयी बताया। पार्वती जी ने पुजारी को कोढ़ी होने का श्राप दिया।\n\nकुछ समय बाद अप्सराएं आईं और उन्होंने पुजारी को सोलह सोमवार का व्रत बताया। व्रत करने से पुजारी का कोढ़ ठीक हो गया। इस व्रत के प्रभाव से सभी मनोकामनाएं पूर्ण होती हैं।\n\nव्रत विधि: सोलह सोमवार तक प्रत्येक सोमवार को उपवास रखें। शिवलिंग पर जल, दूध, बेलपत्र, धतूरा अर्पित करें। शिव चालीसा और महामृत्युंजय मंत्र का जाप करें।";
        englishText = "Solah Somvar Vrat Katha:\n\nOnce Lord Shiva and Mother Parvati were wandering and reached the city of Vidarbha. They rested in a beautiful temple. Parvati expressed her desire to play dice with Shiva. Parvati won the game. The temple priest declared Shiva as the winner. Parvati cursed the priest to become a leper.\n\nAfter some time, celestial nymphs came and told the priest about the Solah Somvar Vrat. By observing this fast, the priest was cured of leprosy. Through the effect of this fast, all wishes are fulfilled.\n\nFasting Method: Observe fast every Monday for sixteen Mondays. Offer water, milk, Belpatra, and Datura on the Shivalinga. Chant Shiva Chalisa and Mahamrityunjaya Mantra.";
        tags = ["vrat", "monday", "shiva", "solah somvar"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 2;
        title = "Ekadashi Vrat Katha";
        category = #vrat;
        deity = "Vishnu";
        hindiText = "एकादशी व्रत कथा:\n\nप्राचीन काल में मुर नामक एक दैत्य था जो बहुत शक्तिशाली था। उसने देवताओं को परेशान करना शुरू किया। भगवान विष्णु ने उससे युद्ध किया। युद्ध के दौरान भगवान विष्णु एक गुफा में विश्राम करने लगे। मुर ने उन पर आक्रमण किया। तब भगवान के शरीर से एक दिव्य कन्या प्रकट हुई और उसने मुर का वध किया।\n\nभगवान विष्णु ने उस कन्या से वरदान मांगने को कहा। कन्या ने कहा कि जो इस दिन व्रत रखे उसके पाप नष्ट हों। भगवान ने कहा यह एकादशी तिथि है, इस दिन व्रत रखने से सभी पाप नष्ट होते हैं और मोक्ष की प्राप्ति होती है।";
        englishText = "Ekadashi Vrat Katha:\n\nIn ancient times there was a demon named Mura who was very powerful. He started troubling the gods. Lord Vishnu fought with him. During the battle, Lord Vishnu rested in a cave. Mura attacked him. Then a divine maiden appeared from the Lord's body and killed Mura.\n\nLord Vishnu asked the maiden to ask for a boon. The maiden said that whoever fasts on this day, their sins should be destroyed. The Lord said this is the Ekadashi date, by fasting on this day all sins are destroyed and salvation is attained.";
        tags = ["vrat", "ekadashi", "vishnu", "moksha"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 3;
        title = "Pradosh Vrat Katha";
        category = #vrat;
        deity = "Shiva";
        hindiText = "प्रदोष व्रत कथा:\n\nएक बार एक विधवा ब्राह्मणी अपने पुत्र के साथ रहती थी। वह प्रतिदिन भिक्षा मांगकर जीवन यापन करती थी। एक दिन उसे एक राजकुमार मिला जो जंगल में भटक रहा था। उसने उसे अपने घर में आश्रय दिया। ब्राह्मणी प्रदोष व्रत करती थी।\n\nभगवान शिव की कृपा से राजकुमार को उसका राज्य वापस मिल गया। राजकुमार ने ब्राह्मणी के पुत्र को अपना मंत्री बनाया। इस प्रकार प्रदोष व्रत के प्रभाव से सभी कष्ट दूर होते हैं और सुख-समृद्धि आती है।\n\nव्रत विधि: प्रत्येक त्रयोदशी को प्रदोष काल में शिव पूजा करें। उपवास रखें और शिव कथा सुनें।";
        englishText = "Pradosh Vrat Katha:\n\nOnce a widowed Brahmin woman lived with her son. She used to earn her living by begging every day. One day she met a prince who was wandering in the forest. She gave him shelter in her home. The Brahmin woman used to observe Pradosh Vrat.\n\nBy the grace of Lord Shiva, the prince got his kingdom back. The prince made the Brahmin woman's son his minister. Thus, through the effect of Pradosh Vrat, all troubles are removed and happiness and prosperity come.\n\nFasting Method: Perform Shiva Puja during Pradosh Kaal on every Trayodashi. Observe fast and listen to Shiva Katha.";
        tags = ["vrat", "pradosh", "shiva", "trayodashi"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 4;
        title = "Navratri Vrat Katha";
        category = #vrat;
        deity = "Durga";
        hindiText = "नवरात्रि व्रत कथा:\n\nप्राचीन काल में महिषासुर नामक राक्षस ने तीनों लोकों पर अधिकार कर लिया। देवता परेशान होकर ब्रह्मा, विष्णु और महेश के पास गए। तीनों देवों के तेज से माँ दुर्गा प्रकट हुईं। माँ दुर्गा ने नौ दिनों तक महिषासुर से युद्ध किया और दसवें दिन उसका वध किया।\n\nइसीलिए नौ दिनों तक नवरात्रि मनाई जाती है और दसवें दिन विजयदशमी। माँ दुर्गा के नौ रूपों की पूजा की जाती है। व्रत रखने से माँ की कृपा प्राप्त होती है और सभी मनोकामनाएं पूर्ण होती हैं।";
        englishText = "Navratri Vrat Katha:\n\nIn ancient times, a demon named Mahishasura took control of all three worlds. The gods, troubled, went to Brahma, Vishnu, and Mahesh. From the combined energy of the three gods, Mother Durga appeared. Mother Durga fought Mahishasura for nine days and killed him on the tenth day.\n\nThat is why Navratri is celebrated for nine days and the tenth day is Vijayadashami. The nine forms of Mother Durga are worshipped. By fasting, one receives the blessings of the Mother and all wishes are fulfilled.";
        tags = ["vrat", "navratri", "durga", "devi"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 5;
        title = "Karva Chauth Vrat Katha";
        category = #vrat;
        deity = "Shiva-Parvati";
        hindiText = "करवा चौथ व्रत कथा:\n\nएक बार एक सेठ के सात पुत्र और एक पुत्री थी। पुत्री का नाम वीरावती था। उसकी शादी हो गई। करवा चौथ के दिन वह मायके आई। उसने व्रत रखा लेकिन भूख-प्यास से व्याकुल हो गई। भाइयों ने उसे छलकर चंद्रमा दिखाया और उसने व्रत तोड़ दिया।\n\nइससे उसके पति की मृत्यु हो गई। वीरावती ने यम के द्वार पर जाकर अपने पति को वापस मांगा। यम ने कहा कि अगले वर्ष विधिपूर्वक करवा चौथ का व्रत करो। वीरावती ने विधिपूर्वक व्रत किया और उसके पति को जीवन मिल गया।";
        englishText = "Karva Chauth Vrat Katha:\n\nOnce a merchant had seven sons and one daughter. The daughter's name was Veeravati. She got married. On the day of Karva Chauth, she came to her parents' home. She observed the fast but became distressed with hunger and thirst. Her brothers deceived her by showing a fake moon and she broke her fast.\n\nThis caused her husband's death. Veeravati went to Yama's door and asked for her husband back. Yama said to observe Karva Chauth fast properly next year. Veeravati observed the fast properly and her husband got life back.";
        tags = ["vrat", "karva chauth", "husband", "pati"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 6;
        title = "Hartalika Teej Vrat Katha";
        category = #vrat;
        deity = "Shiva-Parvati";
        hindiText = "हरतालिका तीज व्रत कथा:\n\nमाता पार्वती ने भगवान शिव को पति रूप में पाने के लिए कठोर तपस्या की। उनके पिता हिमाचल उनका विवाह भगवान विष्णु से करना चाहते थे। पार्वती की सखी उन्हें जंगल में ले गई। वहां पार्वती ने बालू का शिवलिंग बनाकर पूजा की।\n\nभगवान शिव प्रसन्न हुए और उन्होंने पार्वती को वरदान दिया कि वे उनकी पत्नी बनेंगी। इस व्रत को हरतालिका तीज कहते हैं। इस व्रत को करने से सुहागिन स्त्रियों का सौभाग्य बना रहता है और कुंवारी कन्याओं को मनचाहा वर मिलता है।";
        englishText = "Hartalika Teej Vrat Katha:\n\nMother Parvati performed severe penance to get Lord Shiva as her husband. Her father Himachal wanted to marry her to Lord Vishnu. Parvati's friend took her to the forest. There Parvati made a Shivalinga of sand and worshipped it.\n\nLord Shiva was pleased and gave Parvati a boon that he would become her husband. This fast is called Hartalika Teej. By observing this fast, married women's good fortune remains intact and unmarried girls get their desired groom.";
        tags = ["vrat", "teej", "parvati", "shiva", "marriage"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 7;
        title = "Ganesh Chaturthi Vrat Katha";
        category = #vrat;
        deity = "Ganesha";
        hindiText = "गणेश चतुर्थी व्रत कथा:\n\nएक बार भगवान शिव और माता पार्वती कैलाश पर्वत पर विराजमान थे। पार्वती जी स्नान करने गईं और उन्होंने अपने शरीर के मैल से एक बालक बनाया और उसमें प्राण फूंके। उस बालक को द्वार पर पहरा देने को कहा।\n\nभगवान शिव जब आए तो बालक ने उन्हें रोका। क्रोधित शिव ने बालक का सिर काट दिया। पार्वती जी को जब पता चला तो वे बहुत दुखी हुईं। शिव जी ने हाथी का सिर लगाकर बालक को जीवित किया। यही गणेश जी हैं। गणेश चतुर्थी पर व्रत रखने से सभी विघ्न दूर होते हैं।";
        englishText = "Ganesh Chaturthi Vrat Katha:\n\nOnce Lord Shiva and Mother Parvati were residing on Mount Kailash. Parvati went to bathe and created a boy from the dirt of her body and breathed life into him. She asked the boy to stand guard at the door.\n\nWhen Lord Shiva came, the boy stopped him. Angry Shiva cut off the boy's head. When Parvati came to know, she was very sad. Shiva attached an elephant's head and brought the boy back to life. This is Lord Ganesha. By fasting on Ganesh Chaturthi, all obstacles are removed.";
        tags = ["vrat", "ganesh", "chaturthi", "obstacle"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 8;
        title = "Satyanarayan Vrat Katha";
        category = #vrat;
        deity = "Vishnu";
        hindiText = "सत्यनारायण व्रत कथा:\n\nएक बार नारद मुनि भ्रमण करते हुए पृथ्वी पर आए। उन्होंने देखा कि मनुष्य अनेक कष्टों से पीड़ित हैं। वे भगवान विष्णु के पास गए और उपाय पूछा। भगवान ने सत्यनारायण व्रत का विधान बताया।\n\nएक गरीब ब्राह्मण ने यह व्रत किया और धनवान हो गया। एक लकड़हारे ने व्रत किया और उसकी सभी मनोकामनाएं पूर्ण हुईं। एक राजा ने व्रत का अपमान किया तो उसे कष्ट हुआ, बाद में क्षमा मांगने पर सब ठीक हो गया। इस व्रत से सत्य की महिमा का बोध होता है।";
        englishText = "Satyanarayan Vrat Katha:\n\nOnce Narada Muni came to earth while wandering. He saw that humans were suffering from many troubles. He went to Lord Vishnu and asked for a remedy. The Lord described the Satyanarayan Vrat.\n\nA poor Brahmin performed this fast and became wealthy. A woodcutter performed the fast and all his wishes were fulfilled. A king insulted the fast and suffered, but later after seeking forgiveness everything was fine. This fast teaches the glory of truth.";
        tags = ["vrat", "satyanarayan", "vishnu", "truth"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 9;
        title = "Mangala Gauri Vrat Katha";
        category = #vrat;
        deity = "Gauri";
        hindiText = "मंगला गौरी व्रत कथा:\n\nएक नगर में एक धनी व्यापारी रहता था। उसकी पत्नी बहुत धर्मपरायण थी। उनके कोई संतान नहीं थी। व्यापारी की पत्नी ने मंगला गौरी का व्रत रखना शुरू किया। माता गौरी की कृपा से उन्हें एक पुत्र की प्राप्ति हुई।\n\nपुत्र बड़ा होकर व्यापार के लिए परदेस गया। वहां उसे एक सर्प ने डस लिया। माता गौरी की कृपा से वह बच गया। इस व्रत को करने से संतान सुख, सौभाग्य और पति की दीर्घायु की प्राप्ति होती है।";
        englishText = "Mangala Gauri Vrat Katha:\n\nIn a city there lived a wealthy merchant. His wife was very religious. They had no children. The merchant's wife started observing Mangala Gauri Vrat. By the grace of Mother Gauri, they were blessed with a son.\n\nThe son grew up and went abroad for business. There a snake bit him. By the grace of Mother Gauri, he survived. By observing this fast, one gets the happiness of children, good fortune, and long life of the husband.";
        tags = ["vrat", "gauri", "mangala", "tuesday", "children"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 10;
        title = "Vaibhav Lakshmi Vrat Katha";
        category = #vrat;
        deity = "Lakshmi";
        hindiText = "वैभव लक्ष्मी व्रत कथा:\n\nएक नगर में शीला नाम की एक स्त्री रहती थी। उसके पति का व्यापार ठीक नहीं चल रहा था। घर में दरिद्रता थी। एक दिन उसकी पड़ोसन ने उसे वैभव लक्ष्मी व्रत के बारे में बताया।\n\nशीला ने श्रद्धापूर्वक यह व्रत किया। माता लक्ष्मी की कृपा से उसके पति का व्यापार चमक उठा। घर में सुख-समृद्धि आई। इस व्रत को शुक्रवार को करने से माता लक्ष्मी प्रसन्न होती हैं और घर में धन-धान्य की वृद्धि होती है।";
        englishText = "Vaibhav Lakshmi Vrat Katha:\n\nIn a city there lived a woman named Sheela. Her husband's business was not going well. There was poverty at home. One day her neighbor told her about the Vaibhav Lakshmi Vrat.\n\nSheela observed this fast with devotion. By the grace of Mother Lakshmi, her husband's business flourished. Happiness and prosperity came to the home. By observing this fast on Friday, Mother Lakshmi is pleased and wealth and prosperity increase in the home.";
        tags = ["vrat", "lakshmi", "friday", "wealth", "prosperity"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 11;
        title = "Ahoi Ashtami Vrat Katha";
        category = #vrat;
        deity = "Ahoi Mata";
        hindiText = "अहोई अष्टमी व्रत कथा:\n\nप्राचीन काल में एक साहूकार की सात बहुएं थीं। दीपावली से पहले सभी बहुएं जंगल से मिट्टी लाने गईं। एक बहू ने खुदाई करते समय गलती से एक स्याहु के बच्चे को मार दिया। स्याहु माता ने श्राप दिया कि उसके बच्चे भी मरेंगे।\n\nसातों बहुओं के बच्चे मरने लगे। तब एक बुजुर्ग महिला ने अहोई माता का व्रत बताया। बहू ने श्रद्धापूर्वक व्रत किया और माता से क्षमा मांगी। माता प्रसन्न हुईं और बच्चे जीवित हो गए। इस व्रत से संतान की रक्षा होती है।";
        englishText = "Ahoi Ashtami Vrat Katha:\n\nIn ancient times a moneylender had seven daughters-in-law. Before Diwali, all daughters-in-law went to the forest to bring clay. One daughter-in-law accidentally killed a Syahu's baby while digging. The Syahu mother cursed that her children would also die.\n\nThe children of all seven daughters-in-law started dying. Then an elderly woman told about the Ahoi Mata Vrat. The daughter-in-law observed the fast with devotion and asked for forgiveness from the mother. The mother was pleased and the children came back to life. This fast protects children.";
        tags = ["vrat", "ahoi", "children", "protection", "ashtami"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 12;
        title = "Nirjala Ekadashi Vrat Katha";
        category = #vrat;
        deity = "Vishnu";
        hindiText = "निर्जला एकादशी व्रत कथा:\n\nमहाभारत काल में भीम बहुत खाने के शौकीन थे। वे एकादशी का व्रत नहीं कर पाते थे। उन्होंने महर्षि व्यास से पूछा कि क्या कोई ऐसा उपाय है जिससे सभी एकादशियों का फल मिल जाए।\n\nव्यास जी ने निर्जला एकादशी का व्रत बताया। इस दिन बिना जल के व्रत रखने से सभी चौबीस एकादशियों का फल मिलता है। भीम ने यह व्रत किया और उन्हें सभी एकादशियों का पुण्य प्राप्त हुआ। इसीलिए इसे भीमसेनी एकादशी भी कहते हैं।";
        englishText = "Nirjala Ekadashi Vrat Katha:\n\nDuring the Mahabharata period, Bhima was very fond of eating. He could not observe the Ekadashi fast. He asked Maharishi Vyasa if there was any way to get the fruit of all Ekadashis.\n\nVyasa told about the Nirjala Ekadashi fast. By fasting without water on this day, one gets the fruit of all twenty-four Ekadashis. Bhima observed this fast and received the merit of all Ekadashis. That is why it is also called Bhimseni Ekadashi.";
        tags = ["vrat", "ekadashi", "nirjala", "vishnu", "bhima"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 13;
        title = "Sheetala Saptami Vrat Katha";
        category = #vrat;
        deity = "Sheetala Mata";
        hindiText = "शीतला सप्तमी व्रत कथा:\n\nएक नगर में एक ब्राह्मण परिवार रहता था। उनके बच्चों को चेचक हो गई। परिवार बहुत परेशान था। एक साधु ने उन्हें शीतला माता का व्रत करने की सलाह दी।\n\nपरिवार ने श्रद्धापूर्वक शीतला माता की पूजा की और व्रत रखा। माता की कृपा से बच्चे ठीक हो गए। शीतला माता को ठंडा भोग लगाया जाता है। इस व्रत से चेचक, खसरा जैसी बीमारियों से रक्षा होती है और परिवार स्वस्थ रहता है।";
        englishText = "Sheetala Saptami Vrat Katha:\n\nIn a city there lived a Brahmin family. Their children got smallpox. The family was very troubled. A sage advised them to observe the Sheetala Mata Vrat.\n\nThe family worshipped Sheetala Mata with devotion and observed the fast. By the grace of the mother, the children recovered. Cold offerings are made to Sheetala Mata. This fast protects from diseases like smallpox and measles and keeps the family healthy.";
        tags = ["vrat", "sheetala", "health", "children", "saptami"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 14;
        title = "Surya Shashthi Chhath Vrat Katha";
        category = #vrat;
        deity = "Surya";
        hindiText = "सूर्य षष्ठी छठ व्रत कथा:\n\nप्राचीन काल में राजा प्रियव्रत की पत्नी मालिनी को कोई संतान नहीं थी। उन्होंने महर्षि कश्यप से उपाय पूछा। महर्षि ने पुत्रेष्टि यज्ञ कराया। पत्नी को एक पुत्र हुआ लेकिन वह मृत पैदा हुआ।\n\nराजा पुत्र को श्मशान ले जा रहे थे तभी देवसेना प्रकट हुईं। उन्होंने कहा कि मैं सृष्टि की मूल प्रवृत्ति हूं। जो मेरी पूजा करेगा उसे संतान सुख मिलेगा। राजा ने षष्ठी माता की पूजा की और पुत्र जीवित हो गया। तब से छठ पूजा की परंपरा चली आ रही है।";
        englishText = "Surya Shashthi Chhath Vrat Katha:\n\nIn ancient times, King Priyavrata's wife Malini had no children. She asked Maharishi Kashyap for a remedy. The sage performed a Putresti Yajna. The wife had a son but he was born dead.\n\nThe king was taking the son to the cremation ground when Devasena appeared. She said that I am the original nature of creation. Whoever worships me will get the happiness of children. The king worshipped Shashthi Mata and the son came back to life. Since then the tradition of Chhath Puja has continued.";
        tags = ["vrat", "chhath", "surya", "sun", "children"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 15;
        title = "Tulsi Vivah Vrat Katha";
        category = #vrat;
        deity = "Vishnu-Tulsi";
        hindiText = "तुलसी विवाह व्रत कथा:\n\nपौराणिक कथा के अनुसार जालंधर नामक एक असुर था। उसकी पत्नी वृंदा बहुत पतिव्रता थी। उसके सतीत्व के कारण जालंधर को कोई नहीं मार सकता था। भगवान विष्णु ने जालंधर का रूप धारण कर वृंदा के सतीत्व को भंग किया।\n\nजब वृंदा को सच्चाई पता चली तो उसने विष्णु को श्राप दिया और खुद सती हो गई। उसकी राख से तुलसी का पौधा उगा। विष्णु ने कहा कि तुलसी मेरी प्रिय है और कार्तिक मास में तुलसी से मेरा विवाह होगा। तुलसी विवाह करने से कन्यादान का फल मिलता है।";
        englishText = "Tulsi Vivah Vrat Katha:\n\nAccording to mythology, there was a demon named Jalandhar. His wife Vrinda was very devoted to her husband. Due to her chastity, no one could kill Jalandhar. Lord Vishnu took the form of Jalandhar and broke Vrinda's chastity.\n\nWhen Vrinda learned the truth, she cursed Vishnu and became Sati herself. From her ashes grew the Tulsi plant. Vishnu said that Tulsi is dear to me and in the month of Kartik, I will marry Tulsi. By performing Tulsi Vivah, one gets the merit of Kanyadaan.";
        tags = ["vrat", "tulsi", "vishnu", "vivah", "kartik"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 16;
        title = "Jivitputrika Vrat Katha";
        category = #vrat;
        deity = "Jivitputrika";
        hindiText = "जीवित्पुत्रिका व्रत कथा:\n\nएक जंगल में एक चील और एक लोमड़ी रहती थी। दोनों ने जीवित्पुत्रिका व्रत रखा। व्रत के दिन एक मृत सर्प पड़ा था। लोमड़ी ने व्रत तोड़कर उसे खा लिया। चील ने व्रत नहीं तोड़ा।\n\nअगले जन्म में चील एक रानी बनी और उसके सभी पुत्र जीवित रहे। लोमड़ी एक गरीब स्त्री बनी और उसके सभी पुत्र मर गए। तब उसे पिछले जन्म की बात याद आई। उसने विधिपूर्वक व्रत किया और उसके पुत्र जीवित हो गए। यह व्रत पुत्रों की रक्षा के लिए किया जाता है।";
        englishText = "Jivitputrika Vrat Katha:\n\nIn a forest there lived an eagle and a fox. Both observed the Jivitputrika Vrat. On the day of the fast, a dead snake was lying there. The fox broke the fast and ate it. The eagle did not break the fast.\n\nIn the next birth, the eagle became a queen and all her sons remained alive. The fox became a poor woman and all her sons died. Then she remembered the previous birth. She observed the fast properly and her sons came back to life. This fast is observed for the protection of sons.";
        tags = ["vrat", "jivitputrika", "sons", "protection", "children"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 17;
        title = "Rishi Panchami Vrat Katha";
        category = #vrat;
        deity = "Saptarishi";
        hindiText = "ऋषि पंचमी व्रत कथा:\n\nएक ब्राह्मण की पत्नी ने अज्ञानतावश रजस्वला अवस्था में घर का काम किया। इससे उसे अगले जन्म में कुतिया का जन्म मिला। उसके पति को बैल का जन्म मिला।\n\nउनके पुत्र ने एक ज्ञानी ब्राह्मण से उपाय पूछा। ब्राह्मण ने ऋषि पंचमी व्रत बताया। पुत्र ने माता-पिता की ओर से यह व्रत किया। सप्तऋषियों की कृपा से माता-पिता को मुक्ति मिली। इस व्रत से जाने-अनजाने में हुए पापों से मुक्ति मिलती है।";
        englishText = "Rishi Panchami Vrat Katha:\n\nA Brahmin's wife unknowingly did household work during her menstrual period. Due to this, she was born as a dog in the next birth. Her husband was born as a bull.\n\nTheir son asked a learned Brahmin for a remedy. The Brahmin told about the Rishi Panchami Vrat. The son observed this fast on behalf of his parents. By the grace of the Saptarishis, the parents got liberation. This fast provides liberation from sins committed knowingly or unknowingly.";
        tags = ["vrat", "rishi panchami", "saptarishi", "liberation", "panchami"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 18;
        title = "Hariyali Teej Vrat Katha";
        category = #vrat;
        deity = "Shiva-Parvati";
        hindiText = "हरियाली तीज व्रत कथा:\n\nमाता पार्वती ने भगवान शिव को पाने के लिए 107 जन्मों तक तपस्या की। 108वें जन्म में उन्होंने श्रावण मास की तृतीया को कठोर व्रत रखा। भगवान शिव उनकी भक्ति से प्रसन्न हुए और उन्हें पत्नी के रूप में स्वीकार किया।\n\nइसी दिन से हरियाली तीज का व्रत मनाया जाता है। सुहागिन स्त्रियां इस दिन व्रत रखती हैं और झूला झूलती हैं। इस व्रत से पति की दीर्घायु और सुखी वैवाहिक जीवन की प्राप्ति होती है।";
        englishText = "Hariyali Teej Vrat Katha:\n\nMother Parvati performed penance for 107 births to get Lord Shiva. In the 108th birth, she observed a strict fast on the third day of Shravan month. Lord Shiva was pleased with her devotion and accepted her as his wife.\n\nFrom this day, the Hariyali Teej fast is celebrated. Married women observe fast on this day and swing on swings. This fast brings long life of the husband and a happy married life.";
        tags = ["vrat", "teej", "hariyali", "shravan", "parvati", "shiva"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 19;
        title = "Bhaiya Dooj Vrat Katha";
        category = #vrat;
        deity = "Yama";
        hindiText = "भैया दूज व्रत कथा:\n\nयमराज की बहन यमुना ने अपने भाई को कार्तिक शुक्ल द्वितीया को अपने घर बुलाया। यमराज बहुत प्रसन्न हुए। यमुना ने भाई का तिलक किया और भोजन कराया। यमराज ने कहा कि जो बहन इस दिन भाई का तिलक करेगी उसके भाई को अकाल मृत्यु नहीं होगी।\n\nतब से भैया दूज का त्योहार मनाया जाता है। बहनें भाई का तिलक करती हैं और भाई बहन को उपहार देते हैं। इस दिन यमुना में स्नान करने से यमराज का भय नहीं रहता।";
        englishText = "Bhaiya Dooj Vrat Katha:\n\nYamuna, the sister of Yamraj, invited her brother to her home on Kartik Shukla Dwitiya. Yamraj was very pleased. Yamuna applied tilak to her brother and fed him. Yamraj said that the brother of the sister who applies tilak on this day will not have untimely death.\n\nSince then the festival of Bhaiya Dooj is celebrated. Sisters apply tilak to brothers and brothers give gifts to sisters. By bathing in Yamuna on this day, one is freed from the fear of Yamraj.";
        tags = ["vrat", "bhaiya dooj", "yama", "yamuna", "brother", "sister"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 20;
        title = "Krishna Bal Leela";
        category = #puranik;
        deity = "Krishna";
        hindiText = "श्रीकृष्ण की बाल लीला:\n\nभगवान श्रीकृष्ण का जन्म मथुरा के कारागार में देवकी और वासुदेव के यहां हुआ। कंस के अत्याचार से भयभीत वासुदेव जी रात के अंधेरे में नवजात कृष्ण को यमुना पार कर गोकुल में नंद बाबा के घर छोड़ आए।\n\nमाता यशोदा ने कृष्ण को अपने पुत्र की तरह पाला। बाल कृष्ण की अनेक लीलाएं प्रसिद्ध हैं। उन्होंने माखन चुराया, गोपियों के साथ रास रचाया, पूतना का वध किया, कालिया नाग को नाथा और गोवर्धन पर्वत को उठाया।\n\nकृष्ण की बाल लीलाएं भक्तों के हृदय में आनंद और प्रेम का संचार करती हैं। उनकी हर लीला में एक गहरा आध्यात्मिक संदेश छिपा है।";
        englishText = "Krishna's Childhood Leelas:\n\nLord Krishna was born in the prison of Mathura to Devaki and Vasudeva. Fearing Kansa's tyranny, Vasudeva crossed the Yamuna in the dark of night and left the newborn Krishna at Nanda Baba's home in Gokul.\n\nMother Yashoda raised Krishna like her own son. Many childhood leelas of Krishna are famous. He stole butter, danced Raas with the Gopis, killed Putana, subdued the Kaliya serpent, and lifted the Govardhan mountain.\n\nKrishna's childhood leelas fill the hearts of devotees with joy and love. Each of his leelas contains a deep spiritual message.";
        tags = ["leela", "childhood", "krishna", "gokul", "yashoda"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 21;
        title = "Krishna Govardhan Leela";
        category = #puranik;
        deity = "Krishna";
        hindiText = "गोवर्धन लीला:\n\nएक बार व्रज में इंद्र की पूजा की तैयारी हो रही थी। बालकृष्ण ने नंद बाबा से पूछा कि यह पूजा क्यों हो रही है। नंद बाबा ने बताया कि इंद्र देवता वर्षा करते हैं इसलिए उनकी पूजा होती है।\n\nकृष्ण ने कहा कि हम गोपालक हैं, हमें गोवर्धन पर्वत की पूजा करनी चाहिए जो हमारी गायों को चारा देता है। व्रजवासियों ने गोवर्धन की पूजा की। इंद्र क्रोधित हुए और भारी वर्षा शुरू कर दी।\n\nकृष्ण ने गोवर्धन पर्वत को अपनी छोटी उंगली पर उठा लिया और सात दिनों तक व्रजवासियों की रक्षा की। इंद्र को अपनी गलती का एहसास हुआ और उन्होंने कृष्ण से क्षमा मांगी।";
        englishText = "Govardhan Leela:\n\nOnce preparations were being made for Indra's worship in Vraja. Young Krishna asked Nanda Baba why this worship was happening. Nanda Baba explained that Indra brings rain, so he is worshipped.\n\nKrishna said that we are cowherds, we should worship Govardhan mountain which provides fodder for our cows. The Vrajavasis worshipped Govardhan. Indra became angry and started heavy rainfall.\n\nKrishna lifted the Govardhan mountain on his little finger and protected the Vrajavasis for seven days. Indra realized his mistake and asked Krishna for forgiveness.";
        tags = ["leela", "govardhan", "krishna", "indra", "vraja"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 22;
        title = "Krishna Kaliya Daman Leela";
        category = #puranik;
        deity = "Krishna";
        hindiText = "कालिया दमन लीला:\n\nयमुना नदी में कालिया नाग रहता था। उसके विष से यमुना का जल विषैला हो गया था। गायें और गोप जब यमुना का जल पीते तो मर जाते थे।\n\nएक दिन कृष्ण की गेंद यमुना में गिर गई। कृष्ण यमुना में कूद गए। कालिया ने उन्हें अपनी कुंडलियों में जकड़ लिया। व्रजवासी घबरा गए। तब कृष्ण ने अपना विराट रूप धारण किया और कालिया के फनों पर नृत्य किया।\n\nकालिया की पत्नियों ने कृष्ण से क्षमा मांगी। कृष्ण ने कालिया को यमुना छोड़कर रमणक द्वीप जाने का आदेश दिया। इस प्रकार यमुना का जल शुद्ध हो गया।";
        englishText = "Kaliya Daman Leela:\n\nThe Kaliya serpent lived in the Yamuna river. Due to his poison, the water of Yamuna had become toxic. When cows and cowherds drank the water of Yamuna, they would die.\n\nOne day Krishna's ball fell into the Yamuna. Krishna jumped into the Yamuna. Kaliya coiled around him. The Vrajavasis panicked. Then Krishna assumed his cosmic form and danced on Kaliya's hoods.\n\nKaliya's wives asked Krishna for forgiveness. Krishna ordered Kaliya to leave Yamuna and go to Ramanika Island. Thus the water of Yamuna became pure.";
        tags = ["leela", "kaliya", "krishna", "yamuna", "serpent"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 23;
        title = "Krishna Putana Vadh Leela";
        category = #puranik;
        deity = "Krishna";
        hindiText = "पूतना वध लीला:\n\nकंस ने कृष्ण को मारने के लिए पूतना राक्षसी को भेजा। पूतना ने एक सुंदर स्त्री का रूप धारण किया और गोकुल में प्रवेश किया। उसने अपने स्तनों पर विष लगाया था।\n\nपूतना बालकृष्ण को दूध पिलाने लगी। कृष्ण ने दूध के साथ-साथ उसके प्राण भी खींच लिए। पूतना अपने असली रूप में आ गई और मर गई। उसका विशाल शरीर गोकुल के बाहर गिरा।\n\nव्रजवासी आश्चर्यचकित हो गए। यशोदा और नंद बाबा ने कृष्ण की रक्षा के लिए भगवान का धन्यवाद किया। इस लीला से यह संदेश मिलता है कि भगवान अपने भक्तों की सदा रक्षा करते हैं।";
        englishText = "Putana Vadh Leela:\n\nKansa sent the demoness Putana to kill Krishna. Putana assumed the form of a beautiful woman and entered Gokul. She had applied poison on her breasts.\n\nPutana started breastfeeding baby Krishna. Krishna sucked out her life force along with the milk. Putana reverted to her true form and died. Her huge body fell outside Gokul.\n\nThe Vrajavasis were astonished. Yashoda and Nanda Baba thanked God for protecting Krishna. This leela gives the message that God always protects his devotees.";
        tags = ["leela", "putana", "krishna", "gokul", "protection"];
        createdAt = 0;
        status = #approved;
      },
      {
        id = 24;
        title = "Krishna Raas Leela";
        category = #puranik;
        deity = "Krishna";
        hindiText = "रास लीला:\n\nशरद पूर्णिमा की रात यमुना के तट पर कृष्ण ने अपनी बांसुरी बजाई। बांसुरी की मधुर धुन सुनकर गोपियां अपना सब काम छोड़कर कृष्ण के पास आ गईं।\n\nकृष्ण ने गोपियों के साथ रास रचाया। हर गोपी को लगा कि कृष्ण उसके साथ नृत्य कर रहे हैं। यह दिव्य रास लीला ब्रह्मांड की सबसे पवित्र घटना मानी जाती है।\n\nरास लीला आत्मा और परमात्मा के मिलन का प्रतीक है। गोपियां जीवात्मा का प्रतीक हैं और कृष्ण परमात्मा का। यह लीला भक्ति और प्रेम की पराकाष्ठा है।";
        englishText = "Raas Leela:\n\nOn the night of Sharad Purnima, Krishna played his flute on the banks of the Yamuna. Hearing the sweet melody of the flute, the Gopis left all their work and came to Krishna.\n\nKrishna performed the Raas dance with the Gopis. Every Gopi felt that Krishna was dancing with her. This divine Raas Leela is considered the most sacred event in the universe.\n\nRaas Leela is a symbol of the union of the soul and the Supreme Soul. The Gopis symbolize the individual soul and Krishna symbolizes the Supreme Soul. This leela is the pinnacle of devotion and love.";
        tags = ["leela", "raas", "krishna", "gopis", "sharad purnima"];
        createdAt = 0;
        status = #approved;
      },
    ];

    for (katha in seedData.vals()) {
      seeded.add(katha.id, katha);
    };

    {
      kathayen = seeded;
      kathaCounter = 25;
    };
  };
};
