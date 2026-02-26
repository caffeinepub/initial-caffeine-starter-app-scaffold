export interface Shloka {
  id: number;
  sanskrit: string;
  hindiMeaning: string;
  englishMeaning: string;
}

export interface AartiData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  hindiText: string;
  englishText: string;
}

export const AARTIS: AartiData[] = [
  {
    id: 'ganesh',
    name: 'Ganesh Aarti',
    emoji: '🐘',
    color: 'bg-yellow-100',
    hindiText: `जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

एकदंत दयावंत चार भुजाधारी।
माथे सिंदूर सोहे मूसे की सवारी॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

पान चढ़े फूल चढ़े और चढ़े मेवा।
लड्डुअन का भोग लगे संत करें सेवा॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

अंधन को आंख देत कोढ़िन को काया।
बांझन को पुत्र देत निर्धन को माया॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

सूर श्याम शरण आए सफल कीजे सेवा।
माता जाकी पार्वती पिता महादेवा॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

दीनन की लाज रखो शंभु सुतकारी।
कामना को पूर्ण करो जाऊं बलिहारी॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

भक्त जनन की रक्षा करो गणपति स्वामी।
विघ्न विनाशक मंगल दाता जग के अंतर्यामी॥
जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥`,
    englishText: `Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Ekdant Dayavant Char Bhujaadhari.
Mathe Sindoor Sohe Muse Ki Savari.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Pan Chadhe Phool Chadhe Aur Chadhe Meva.
Ladduan Ka Bhog Lage Sant Karen Seva.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Andhan Ko Aankh Det Kodhin Ko Kaya.
Banjhan Ko Putra Det Nirdhan Ko Maya.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Sur Shyam Sharan Aaye Safal Keeje Seva.
Mata Jaki Parvati Pita Mahadeva.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Deenan Ki Laaj Rakho Shambhu Sutkaari.
Kamna Ko Poorn Karo Jaaun Balihaari.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.

Bhakt Janan Ki Raksha Karo Ganpati Swami.
Vighna Vinashak Mangal Data Jag Ke Antaryami.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata Jaki Parvati Pita Mahadeva.`,
  },
  {
    id: 'shiv',
    name: 'Shiv Aarti',
    emoji: '🔱',
    color: 'bg-blue-100',
    hindiText: `ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव अर्धांगी धारा॥
ॐ जय शिव ओंकारा॥

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥
ॐ जय शिव ओंकारा॥

दो भुज चार चतुर्भुज दसभुज अति सोहे।
त्रिगुण रूप निरखते त्रिभुवन जन मोहे॥
ॐ जय शिव ओंकारा॥

अक्षमाला वनमाला मुण्डमाला धारी।
त्रिपुरारी कंसारी कर माला धारी॥
ॐ जय शिव ओंकारा॥

श्वेताम्बर पीताम्बर बाघम्बर अंगे।
सनकादिक गरुड़ादिक भूतादिक संगे॥
ॐ जय शिव ओंकारा॥

कर के मध्य कमण्डलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालन कारी॥
ॐ जय शिव ओंकारा॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर के मध्ये ये तीनों एका॥
ॐ जय शिव ओंकारा॥

त्रिगुण स्वामी जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी मनवांछित फल पावे॥
ॐ जय शिव ओंकारा॥`,
    englishText: `Om Jai Shiv Omkara, Swami Jai Shiv Omkara.
Brahma Vishnu Sadashiv Ardhangi Dhara.
Om Jai Shiv Omkara.

Ekaanan Chaturanan Panchaanan Raje.
Hansaasan Garudaasan Vrishvaahan Saaje.
Om Jai Shiv Omkara.

Do Bhuj Char Chaturbhuj Dasbhuj Ati Sohe.
Trigun Roop Nirakhate Tribhuvan Jan Mohe.
Om Jai Shiv Omkara.

Akshamala Vanmala Mundmala Dhari.
Tripurari Kansari Kar Mala Dhari.
Om Jai Shiv Omkara.

Shvetambar Pitambar Baghambar Ange.
Sanakadik Garudadik Bhutadik Sange.
Om Jai Shiv Omkara.

Kar Ke Madhya Kamandalu Chakra Trishuldhari.
Sukhkari Dukhhhari Jagpalan Kari.
Om Jai Shiv Omkara.

Brahma Vishnu Sadashiv Janat Aviveka.
Pranavakshar Ke Madhye Ye Teeno Eka.
Om Jai Shiv Omkara.

Trigun Swami Ji Ki Aarti Jo Koi Nar Gaave.
Kahat Shivanand Swami Manvanchit Phal Paave.
Om Jai Shiv Omkara.`,
  },
  {
    id: 'vishnu',
    name: 'Vishnu Aarti',
    emoji: '🪷',
    color: 'bg-purple-100',
    hindiText: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥
ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, सुख सम्पत्ति घर आवे,
कष्ट मिटे तन का॥
ॐ जय जगदीश हरे॥

मात पिता तुम मेरे, शरण गहूं मैं किसकी।
स्वामी शरण गहूं मैं किसकी।
तुम बिन और न दूजा, तुम बिन और न दूजा,
आस करूं मैं जिसकी॥
ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा, तुम अंतर्यामी।
स्वामी तुम अंतर्यामी।
पारब्रह्म परमेश्वर, पारब्रह्म परमेश्वर,
तुम सब के स्वामी॥
ॐ जय जगदीश हरे॥

तुम करुणा के सागर, तुम पालनकर्ता।
स्वामी तुम पालनकर्ता।
मैं मूरख खल कामी, मैं मूरख खल कामी,
कृपा करो भर्ता॥
ॐ जय जगदीश हरे॥

तुम हो एक अगोचर, सबके प्राणपति।
स्वामी सबके प्राणपति।
किस विधि मिलूं दयामय, किस विधि मिलूं दयामय,
तुमको मैं कुमति॥
ॐ जय जगदीश हरे॥

दीनबंधु दुखहर्ता, तुम रक्षक मेरे।
स्वामी तुम रक्षक मेरे।
अपने हाथ उठाओ, अपने शरण लगाओ,
द्वार पड़ा तेरे॥
ॐ जय जगदीश हरे॥

विषय विकार मिटाओ, पाप हरो देवा।
स्वामी पाप हरो देवा।
श्रद्धा भक्ति बढ़ाओ, श्रद्धा भक्ति बढ़ाओ,
संतन की सेवा॥
ॐ जय जगदीश हरे॥`,
    englishText: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare.
Bhakt Janon Ke Sankat, Das Janon Ke Sankat,
Kshan Mein Door Kare.
Om Jai Jagdish Hare.

Jo Dhyave Phal Pave, Dukh Binse Man Ka.
Swami Dukh Binse Man Ka.
Sukh Sampatti Ghar Aave, Sukh Sampatti Ghar Aave,
Kasht Mite Tan Ka.
Om Jai Jagdish Hare.

Maat Pita Tum Mere, Sharan Gahun Main Kiski.
Swami Sharan Gahun Main Kiski.
Tum Bin Aur Na Dooja, Tum Bin Aur Na Dooja,
Aas Karun Main Jiski.
Om Jai Jagdish Hare.

Tum Pooran Paramatma, Tum Antaryami.
Swami Tum Antaryami.
Parabrahm Parameshwar, Parabrahm Parameshwar,
Tum Sab Ke Swami.
Om Jai Jagdish Hare.

Tum Karuna Ke Sagar, Tum Palankarta.
Swami Tum Palankarta.
Main Moorakh Khal Kami, Main Moorakh Khal Kami,
Kripa Karo Bharta.
Om Jai Jagdish Hare.

Tum Ho Ek Agochar, Sabke Pranpati.
Swami Sabke Pranpati.
Kis Vidhi Milun Dayamay, Kis Vidhi Milun Dayamay,
Tumko Main Kumati.
Om Jai Jagdish Hare.

Deenbandhu Dukhharta, Tum Rakshak Mere.
Swami Tum Rakshak Mere.
Apne Haath Uthao, Apne Sharan Lagao,
Dwar Pada Tere.
Om Jai Jagdish Hare.

Vishay Vikar Mitao, Paap Haro Deva.
Swami Paap Haro Deva.
Shraddha Bhakti Badhao, Shraddha Bhakti Badhao,
Santan Ki Seva.
Om Jai Jagdish Hare.`,
  },
  {
    id: 'durga',
    name: 'Durga Aarti',
    emoji: '🌺',
    color: 'bg-red-100',
    hindiText: `जय अम्बे गौरी, मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी॥
जय अम्बे गौरी॥

माँग सिंदूर विराजत, टीको मृगमद को।
उज्ज्वल से दोउ नैना, चंद्रवदन नीको॥
जय अम्बे गौरी॥

कनक समान कलेवर, रक्ताम्बर राजे।
रक्तपुष्प गल माला, कंठन पर साजे॥
जय अम्बे गौरी॥

केहरि वाहन राजत, खड्ग खप्परधारी।
सुर-नर मुनिजन सेवत, तिनके दुखहारी॥
जय अम्बे गौरी॥

कानन कुण्डल शोभित, नासाग्रे मोती।
कोटिक चंद्र दिवाकर, राजत समज्योती॥
जय अम्बे गौरी॥

शुम्भ निशुम्भ बिदारे, महिषासुर घाती।
धूम्र विलोचन नैना, निशदिन मदमाती॥
जय अम्बे गौरी॥

चण्ड मुण्ड संहारे, शोणित बीज हरे।
मधु कैटभ दोउ मारे, सुर भयहीन करे॥
जय अम्बे गौरी॥

ब्रह्माणी रुद्राणी तुम कमला रानी।
आगम निगम बखानी, तुम शिव पटरानी॥
जय अम्बे गौरी॥

चौसठ योगिनी मंगल गावत, नृत्य करत भैरू।
बाजत ताल मृदंगा, अरु बाजत डमरू॥
जय अम्बे गौरी॥

तुम ही जग की माता, तुम ही हो भर्ता।
भक्तन की दुख हर्ता, सुख सम्पत्ति कर्ता॥
जय अम्बे गौरी॥

भुजा चार अति शोभित, वर मुद्रा धारी।
मनवांछित फल पावत, सेवत नर नारी॥
जय अम्बे गौरी॥

कंचन थाल विराजत, अगर कपूर बाती।
श्री मालकेतु में राजत, कोटि रतन ज्योती॥
जय अम्बे गौरी॥

श्री अम्बेजी की आरती, जो कोई नर गावे।
कहत शिवानंद स्वामी, सुख सम्पत्ति पावे॥
जय अम्बे गौरी॥`,
    englishText: `Jai Ambe Gauri, Maiya Jai Shyama Gauri.
Tumko Nishdin Dhyavat, Hari Brahma Shivri.
Jai Ambe Gauri.

Maang Sindoor Virajat, Teeko Mrigmad Ko.
Ujjwal Se Dou Naina, Chandravadan Neeko.
Jai Ambe Gauri.

Kanak Saman Kalevar, Raktambar Raaje.
Raktapushp Gal Mala, Kanthan Par Saaje.
Jai Ambe Gauri.

Kehari Vahan Rajat, Khadg Khappar Dhari.
Sur-Nar Munijan Sevat, Tinke Dukhhhari.
Jai Ambe Gauri.

Kanan Kundal Shobhit, Nasagre Moti.
Kotik Chandra Divakar, Rajat Samjyoti.
Jai Ambe Gauri.

Shumbh Nishumbh Bidare, Mahishasur Ghati.
Dhumra Vilochan Naina, Nishdin Madmati.
Jai Ambe Gauri.

Chand Mund Sanhare, Shonit Beej Hare.
Madhu Kaitabh Dou Mare, Sur Bhayhin Kare.
Jai Ambe Gauri.

Brahmani Rudrani Tum Kamla Rani.
Aagam Nigam Bakhani, Tum Shiv Patrani.
Jai Ambe Gauri.

Chausath Yogini Mangal Gavat, Nritya Karat Bhairu.
Bajat Taal Mridanga, Aru Bajat Damru.
Jai Ambe Gauri.

Tum Hi Jag Ki Mata, Tum Hi Ho Bharta.
Bhaktan Ki Dukh Harta, Sukh Sampatti Karta.
Jai Ambe Gauri.

Bhuja Char Ati Shobhit, Var Mudra Dhari.
Manvanchit Phal Pavat, Sevat Nar Nari.
Jai Ambe Gauri.

Kanchan Thal Virajat, Agar Kapoor Bati.
Shri Malaketu Mein Rajat, Koti Ratan Jyoti.
Jai Ambe Gauri.

Shri Ambaji Ki Aarti, Jo Koi Nar Gaave.
Kahat Shivanand Swami, Sukh Sampatti Paave.
Jai Ambe Gauri.`,
  },
  {
    id: 'hanuman',
    name: 'Hanuman Aarti',
    emoji: '🐒',
    color: 'bg-orange-100',
    hindiText: `आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

जाके बल से गिरिवर काँपे।
रोग दोष जाके निकट न झाँके॥
आरती कीजै हनुमान लला की॥

अंजनि पुत्र महा बलदाई।
संतन के प्रभु सदा सहाई॥
आरती कीजै हनुमान लला की॥

दे बीड़ा रघुपति पठाए।
लंका जारि सिया सुधि लाए॥
आरती कीजै हनुमान लला की॥

लंका सो कोट समुद्र सी खाई।
जात पवनसुत बार न लाई॥
आरती कीजै हनुमान लला की॥

लंका जारि असुर संहारे।
सियाराम जी के काज संवारे॥
आरती कीजै हनुमान लला की॥

लक्ष्मण मूर्छित पड़े सकारे।
आनि संजीवन प्राण उबारे॥
आरती कीजै हनुमान लला की॥

पैठि पताल तोरि जमकारे।
अहिरावण की भुजा उखारे॥
आरती कीजै हनुमान लला की॥

बाईं भुजा असुर दल मारे।
दाहिनी भुजा संतजन तारे॥
आरती कीजै हनुमान लला की॥

सुर नर मुनि जन आरती उतारें।
जय जय जय हनुमान उचारें॥
आरती कीजै हनुमान लला की॥

कंचन थार कपूर लौ छाई।
आरती करत अंजना माई॥
आरती कीजै हनुमान लला की॥

जो हनुमान जी की आरती गावे।
बसि बैकुण्ठ परम पद पावे॥
आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥`,
    englishText: `Aarti Keejai Hanuman Lala Ki.
Dusht Dalan Raghunath Kala Ki.

Jake Bal Se Girivar Kaanpe.
Rog Dosh Jake Nikat Na Jhaanke.
Aarti Keejai Hanuman Lala Ki.

Anjani Putra Maha Baldaai.
Santan Ke Prabhu Sada Sahaai.
Aarti Keejai Hanuman Lala Ki.

De Beeda Raghupati Pathaaye.
Lanka Jaari Siya Sudhi Laaye.
Aarti Keejai Hanuman Lala Ki.

Lanka So Kot Samudra Si Khaai.
Jaat Pavansut Baar Na Laai.
Aarti Keejai Hanuman Lala Ki.

Lanka Jaari Asur Sanhare.
Siyaram Ji Ke Kaaj Sanvare.
Aarti Keejai Hanuman Lala Ki.

Lakshman Murchhit Pade Sakare.
Aani Sanjeevan Praan Ubaare.
Aarti Keejai Hanuman Lala Ki.

Paithi Patal Tori Jamkaare.
Ahiravan Ki Bhuja Ukhaare.
Aarti Keejai Hanuman Lala Ki.

Baain Bhuja Asur Dal Maare.
Daahini Bhuja Santjan Taare.
Aarti Keejai Hanuman Lala Ki.

Sur Nar Muni Jan Aarti Utaaren.
Jai Jai Jai Hanuman Uchaaren.
Aarti Keejai Hanuman Lala Ki.

Kanchan Thaar Kapoor Lau Chhaai.
Aarti Karat Anjana Maai.
Aarti Keejai Hanuman Lala Ki.

Jo Hanuman Ji Ki Aarti Gaave.
Basi Baikunth Param Pad Paave.
Aarti Keejai Hanuman Lala Ki.
Dusht Dalan Raghunath Kala Ki.`,
  },
  {
    id: 'radha',
    name: 'Radha Aarti',
    emoji: '🌸',
    color: 'bg-pink-100',
    hindiText: `आरती राधा जी की कीजे।
वृन्दावन की रानी जी की कीजे॥

श्री राधे राधे राधे राधे।
श्री राधे राधे राधे राधे॥

कुंज बिहारिनी राधे प्यारी।
नंद किशोर की प्राण आधारी॥
आरती राधा जी की कीजे॥

वृन्दावन की रानी राधे।
गोकुल की महारानी राधे॥
आरती राधा जी की कीजे॥

श्री राधे राधे राधे राधे।
श्री राधे राधे राधे राधे॥

बरसाने की लाडली राधे।
श्याम की प्यारी सखी राधे॥
आरती राधा जी की कीजे॥

कदम्ब की छाया में राधे।
यमुना के तट पर राधे॥
आरती राधा जी की कीजे॥

श्री राधे राधे राधे राधे।
श्री राधे राधे राधे राधे॥

मोर मुकुट पीताम्बर राधे।
मुरली की धुन पर राधे॥
आरती राधा जी की कीजे॥

भक्तन की रक्षा करो राधे।
सबके मन में बसो राधे॥
आरती राधा जी की कीजे।
वृन्दावन की रानी जी की कीजे॥`,
    englishText: `Aarti Radha Ji Ki Keeje.
Vrindavan Ki Rani Ji Ki Keeje.

Shri Radhe Radhe Radhe Radhe.
Shri Radhe Radhe Radhe Radhe.

Kunj Biharini Radhe Pyari.
Nand Kishor Ki Pran Aadhhari.
Aarti Radha Ji Ki Keeje.

Vrindavan Ki Rani Radhe.
Gokul Ki Maharani Radhe.
Aarti Radha Ji Ki Keeje.

Shri Radhe Radhe Radhe Radhe.
Shri Radhe Radhe Radhe Radhe.

Barsane Ki Ladli Radhe.
Shyam Ki Pyari Sakhi Radhe.
Aarti Radha Ji Ki Keeje.

Kadamb Ki Chhaya Mein Radhe.
Yamuna Ke Tat Par Radhe.
Aarti Radha Ji Ki Keeje.

Shri Radhe Radhe Radhe Radhe.
Shri Radhe Radhe Radhe Radhe.

Mor Mukut Pitambar Radhe.
Murali Ki Dhun Par Radhe.
Aarti Radha Ji Ki Keeje.

Bhaktan Ki Raksha Karo Radhe.
Sabke Man Mein Baso Radhe.
Aarti Radha Ji Ki Keeje.
Vrindavan Ki Rani Ji Ki Keeje.`,
  },
  {
    id: 'krishna',
    name: 'Krishna Aarti',
    emoji: '🦚',
    color: 'bg-indigo-100',
    hindiText: `आरती कुंजबिहारी की, श्री गिरिधर कृष्ण मुरारी की॥

गले में बैजंती माला, बजावत मुरली मधुर बाला।
श्रवण में कुण्डल झलकाला, नंद के आनंद नंदलाला॥
आरती कुंजबिहारी की॥

গগन सम अंग कांति काली, राधिका चमक रही आली।
लतन में ठाढ़े बनमाली, भ्रमर सी अलक, कस्तूरी तिलक॥
आरती कुंजबिहारी की॥

कनकमय मोर मुकुट बिलसे, देवता दर्शन को तरसे।
গগन सों सुमन रासि बरसे, बजे मुरचंग, मधुर मिरदंग॥
आरती कुंजबिहारी की॥

ब्रह्मांड निकाया निर्मित माया, रोम रोम प्रति वेद कहाया।
निज ब्रह्म समझो मन में आया, अखिल विश्व यह ब्रह्म दिखाया॥
आरती कुंजबिहारी की॥

मन की मन ही माँझ रही, कहि कहि कहि नहिं कही।
देखत देखत नैन दई, यह जाकी छवि बनी रही॥
आरती कुंजबिहारी की॥

उपजत प्रेम भक्त जन मन में, आनंद उमंग बढ़े क्षण क्षण में।
घट घट में पूर्ण ब्रह्म रमन में, जय जय जय श्री कृष्ण भजन में॥
आरती कुंजबिहारी की, श्री गिरिधर कृष्ण मुरारी की॥`,
    englishText: `Aarti Kunjabihari Ki, Shri Giridhar Krishna Murari Ki.

Gale Mein Baijanti Mala, Bajavat Murali Madhur Bala.
Shravan Mein Kundal Jhalkaala, Nand Ke Anand Nandlala.
Aarti Kunjabihari Ki.

Gagan Sam Ang Kanti Kali, Radhika Chamak Rahi Aali.
Latan Mein Thaadhe Banmaali, Bhramar Si Alak, Kasturi Tilak.
Aarti Kunjabihari Ki.

Kanakamay Mor Mukut Bilase, Devata Darshan Ko Tarase.
Gagan Son Suman Raasi Barase, Baje Murachang, Madhur Mirdang.
Aarti Kunjabihari Ki.

Brahmand Nikaya Nirmit Maya, Rom Rom Prati Ved Kahaya.
Nij Brahm Samjho Man Mein Aaya, Akhil Vishwa Yeh Brahm Dikhaya.
Aarti Kunjabihari Ki.

Man Ki Man Hi Maanjh Rahi, Kahi Kahi Kahi Nahin Kahi.
Dekhat Dekhat Nain Dai, Yeh Jaki Chhavi Bani Rahi.
Aarti Kunjabihari Ki.

Upajat Prem Bhakt Jan Man Mein, Anand Umang Badhe Kshan Kshan Mein.
Ghat Ghat Mein Poorn Brahm Raman Mein, Jai Jai Jai Shri Krishna Bhajan Mein.
Aarti Kunjabihari Ki, Shri Giridhar Krishna Murari Ki.`,
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Aarti',
    emoji: '💛',
    color: 'bg-yellow-100',
    hindiText: `ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।
तुमको निशदिन सेवत, हर विष्णु विधाता॥
ॐ जय लक्ष्मी माता॥

उमा रमा ब्रह्माणी, तुम ही जग माता।
सूर्य चंद्रमा ध्यावत, नारद ऋषि गाता॥
ॐ जय लक्ष्मी माता॥

दुर्गा रूप निरंजनी, सुख सम्पत्ति दाता।
जो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥
ॐ जय लक्ष्मी माता॥

तुम पाताल निवासिनी, तुम ही शुभदाता।
कर्म प्रभाव प्रकाशिनी, भवनिधि की त्राता॥
ॐ जय लक्ष्मी माता॥

जिस घर में तुम रहती, सब सद्गुण आता।
सब सम्भव हो जाता, मन नहीं घबराता॥
ॐ जय लक्ष्मी माता॥

तुम बिन यज्ञ न होते, वस्त्र न कोई पाता।
खान पान का वैभव, सब तुमसे आता॥
ॐ जय लक्ष्मी माता॥

शुभ गुण मंदिर सुंदर, क्षीरोदधि जाता।
रत्न चतुर्दश तुम बिन, कोई नहीं पाता॥
ॐ जय लक्ष्मी माता॥

महालक्ष्मी जी की आरती, जो कोई नर गाता।
उर आनंद समाता, पाप उतर जाता॥
ॐ जय लक्ष्मी माता॥`,
    englishText: `Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata.
Tumko Nishdin Sevat, Har Vishnu Vidhata.
Om Jai Lakshmi Mata.

Uma Rama Brahmani, Tum Hi Jag Mata.
Surya Chandrama Dhyavat, Narad Rishi Gaata.
Om Jai Lakshmi Mata.

Durga Roop Niranjani, Sukh Sampatti Daata.
Jo Koi Tumko Dhyavat, Riddhi Siddhi Dhan Paata.
Om Jai Lakshmi Mata.

Tum Patal Nivasini, Tum Hi Shubhdaata.
Karm Prabhav Prakashini, Bhavnidhi Ki Traata.
Om Jai Lakshmi Mata.

Jis Ghar Mein Tum Rahti, Sab Sadgun Aata.
Sab Sambhav Ho Jaata, Man Nahin Ghabraata.
Om Jai Lakshmi Mata.

Tum Bin Yagya Na Hote, Vastra Na Koi Paata.
Khan Paan Ka Vaibhav, Sab Tumse Aata.
Om Jai Lakshmi Mata.

Shubh Gun Mandir Sundar, Kshirodadhi Jaata.
Ratan Chaturdash Tum Bin, Koi Nahin Paata.
Om Jai Lakshmi Mata.

Mahalakshmi Ji Ki Aarti, Jo Koi Nar Gaata.
Ur Anand Samaata, Paap Utar Jaata.
Om Jai Lakshmi Mata.`,
  },
  {
    id: 'hanuman-chalisa',
    name: 'Hanuman Chalisa',
    emoji: '📿',
    color: 'bg-orange-100',
    hindiText: `॥ दोहा ॥
श्री गुरु चरण सरोज रज, निज मन मुकुर सुधारि।
बरनउं रघुबर बिमल जसु, जो दायकु फल चारि॥

बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार।
बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार॥

॥ चौपाई ॥
जय हनुमान ज्ञान गुण सागर।
जय कपीस तिहुं लोक उजागर॥

राम दूत अतुलित बल धामा।
अंजनि पुत्र पवनसुत नामा॥

महावीर विक्रम बजरंगी।
कुमति निवार सुमति के संगी॥

कंचन बरन बिराज सुबेसा।
कानन कुण्डल कुंचित केसा॥

हाथ बज्र औ ध्वजा बिराजे।
काँधे मूँज जनेऊ साजे॥

शंकर सुवन केसरी नंदन।
तेज प्रताप महा जग वंदन॥

विद्यावान गुणी अति चातुर।
राम काज करिबे को आतुर॥

प्रभु चरित्र सुनिबे को रसिया।
राम लखन सीता मन बसिया॥

सूक्ष्म रूप धरि सियहिं दिखावा।
विकट रूप धरि लंक जरावा॥

भीम रूप धरि असुर संहारे।
रामचंद्र के काज संवारे॥

लाय सजीवन लखन जियाए।
श्री रघुबीर हरषि उर लाए॥

रघुपति कीन्ही बहुत बड़ाई।
तुम मम प्रिय भरतहि सम भाई॥

सहस बदन तुम्हरो जस गावैं।
अस कहि श्रीपति कंठ लगावैं॥

सनकादिक ब्रह्मादि मुनीसा।
नारद सारद सहित अहीसा॥

जम कुबेर दिगपाल जहाँ ते।
कवि कोविद कहि सके कहाँ ते॥

तुम उपकार सुग्रीवहिं कीन्हा।
राम मिलाय राजपद दीन्हा॥

तुम्हरो मंत्र विभीषण माना।
लंकेश्वर भए सब जग जाना॥

जुग सहस्र जोजन पर भानू।
लील्यो ताहि मधुर फल जानू॥

प्रभु मुद्रिका मेलि मुख माहीं।
जलधि लाँघि गए अचरज नाहीं॥

दुर्गम काज जगत के जेते।
सुगम अनुग्रह तुम्हरे तेते॥

राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे॥

सब सुख लहै तुम्हारी सरना।
तुम रक्षक काहू को डरना॥

आपन तेज सम्हारो आपै।
तीनों लोक हाँक ते काँपै॥

भूत पिशाच निकट नहिं आवै।
महाबीर जब नाम सुनावै॥

नासै रोग हरै सब पीरा।
जपत निरंतर हनुमत बीरा॥

संकट से हनुमान छुड़ावै।
मन क्रम बचन ध्यान जो लावै॥

सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा॥

और मनोरथ जो कोई लावै।
सोई अमित जीवन फल पावै॥

चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा॥

साधु संत के तुम रखवारे।
असुर निकंदन राम दुलारे॥

अष्ट सिद्धि नव निधि के दाता।
अस बर दीन जानकी माता॥

राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा॥

तुम्हरे भजन राम को पावै।
जनम जनम के दुख बिसरावै॥

अंत काल रघुबर पुर जाई।
जहाँ जन्म हरि भक्त कहाई॥

और देवता चित्त न धरई।
हनुमत सेई सर्व सुख करई॥

संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा॥

जय जय जय हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं॥

जो सत बार पाठ कर कोई।
छूटहि बंदि महा सुख होई॥

जो यह पढ़ै हनुमान चालीसा।
होय सिद्धि साखी गौरीसा॥

तुलसीदास सदा हरि चेरा।
कीजै नाथ हृदय मँह डेरा॥

॥ दोहा ॥
पवन तनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप॥`,
    englishText: `|| Doha ||
Shri Guru Charan Saroj Raj, Nij Man Mukur Sudhari.
Barnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari.

Buddhihin Tanu Janike, Sumirau Pavan Kumar.
Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikar.

|| Chaupai ||
Jai Hanuman Gyan Gun Sagar.
Jai Kapees Tihun Lok Ujagar.

Ram Doot Atulit Bal Dhama.
Anjani Putra Pavansut Nama.

Mahaveer Vikram Bajrangi.
Kumati Nivar Sumati Ke Sangi.

Kanchan Baran Biraj Subesa.
Kanan Kundal Kunchit Kesa.

Hath Bajra Au Dhwaja Biraje.
Kandhe Munj Janeu Saaje.

Shankar Suvan Kesari Nandan.
Tej Pratap Maha Jag Vandan.

Vidyavan Guni Ati Chatur.
Ram Kaaj Karibe Ko Aatur.

Prabhu Charitra Sunibe Ko Rasiya.
Ram Lakhan Sita Man Basiya.

Sukshma Roop Dhari Siyahi Dikhava.
Vikat Roop Dhari Lanka Jarava.

Bheem Roop Dhari Asur Sanhare.
Ramchandra Ke Kaaj Sanvare.

Laay Sajeevan Lakhan Jiyaye.
Shri Raghubeer Harashi Ur Laaye.

Raghupati Keenhi Bahut Badaai.
Tum Mam Priya Bharatahi Sam Bhai.

Sahas Badan Tumharo Jas Gaavain.
As Kahi Shripati Kanth Lagavain.

Sanakadik Brahmadi Munisa.
Narad Sarad Sahit Ahisa.

Jam Kuber Digpal Jahan Te.
Kavi Kovid Kahi Sake Kahan Te.

Tum Upkar Sugrivahi Keenha.
Ram Milaay Rajpad Deenha.

Tumharo Mantra Vibhishan Mana.
Lankeshwar Bhaye Sab Jag Jana.

Jug Sahastra Jojan Par Bhanu.
Leelyo Tahi Madhur Phal Janu.

Prabhu Mudrika Meli Mukh Mahin.
Jaladhi Laanghi Gaye Acharaj Nahin.

Durgam Kaaj Jagat Ke Jete.
Sugam Anugraha Tumhare Tete.

Ram Duare Tum Rakhvare.
Hot Na Aagya Binu Paisare.

Sab Sukh Lahai Tumhari Sarna.
Tum Rakshak Kahu Ko Darna.

Aapan Tej Samharo Aapai.
Teeno Lok Haank Te Kaanpai.

Bhoot Pishach Nikat Nahin Aavai.
Mahaveer Jab Naam Sunavai.

Naase Rog Harai Sab Pira.
Japat Nirantar Hanumat Bira.

Sankat Se Hanuman Chhudavai.
Man Kram Bachan Dhyan Jo Lavai.

Sab Par Ram Tapasvi Raja.
Tin Ke Kaaj Sakal Tum Saaja.

Aur Manorath Jo Koi Lavai.
Soi Amit Jeevan Phal Pavai.

Charon Jug Partap Tumhara.
Hai Parsiddh Jagat Ujiyara.

Sadhu Sant Ke Tum Rakhvare.
Asur Nikandan Ram Dulare.

Asht Siddhi Nav Nidhi Ke Data.
As Bar Deen Janaki Mata.

Ram Rasayan Tumhare Pasa.
Sada Raho Raghupati Ke Dasa.

Tumhare Bhajan Ram Ko Pavai.
Janam Janam Ke Dukh Bisravai.

Ant Kaal Raghubar Pur Jaai.
Jahan Janam Hari Bhakt Kahaai.

Aur Devata Chitt Na Dharai.
Hanumat Sei Sarv Sukh Karai.

Sankat Katai Mitai Sab Pira.
Jo Sumirai Hanumat Balbira.

Jai Jai Jai Hanuman Gosain.
Kripa Karahu Gurudev Ki Naain.

Jo Sat Bar Path Kar Koi.
Chhutahi Bandi Maha Sukh Hoi.

Jo Yeh Padhai Hanuman Chalisa.
Hoy Siddhi Sakhi Gaurisa.

Tulsidas Sada Hari Chera.
Keejai Nath Hriday Manh Dera.

|| Doha ||
Pavan Tanay Sankat Haran, Mangal Moorati Roop.
Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop.`,
  },
  {
    id: 'jagdish',
    name: 'Jagdish Aarti',
    emoji: '🌟',
    color: 'bg-amber-100',
    hindiText: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥
ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, सुख सम्पत्ति घर आवे,
कष्ट मिटे तन का॥
ॐ जय जगदीश हरे॥

मात पिता तुम मेरे, शरण गहूं मैं किसकी।
स्वामी शरण गहूं मैं किसकी।
तुम बिन और न दूजा, तुम बिन और न दूजा,
आस करूं मैं जिसकी॥
ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा, तुम अंतर्यामी।
स्वामी तुम अंतर्यामी।
पारब्रह्म परमेश्वर, पारब्रह्म परमेश्वर,
तुम सब के स्वामी॥
ॐ जय जगदीश हरे॥

तुम करुणा के सागर, तुम पालनकर्ता।
स्वामी तुम पालनकर्ता।
मैं मूरख खल कामी, मैं मूरख खल कामी,
कृपा करो भर्ता॥
ॐ जय जगदीश हरे॥

तुम हो एक अगोचर, सबके प्राणपति।
स्वामी सबके प्राणपति।
किस विधि मिलूं दयामय, किस विधि मिलूं दयामय,
तुमको मैं कुमति॥
ॐ जय जगदीश हरे॥

दीनबंधु दुखहर्ता, तुम रक्षक मेरे।
स्वामी तुम रक्षक मेरे।
अपने हाथ उठाओ, अपने शरण लगाओ,
द्वार पड़ा तेरे॥
ॐ जय जगदीश हरे॥

विषय विकार मिटाओ, पाप हरो देवा।
स्वामी पाप हरो देवा।
श्रद्धा भक्ति बढ़ाओ, श्रद्धा भक्ति बढ़ाओ,
संतन की सेवा॥
ॐ जय जगदीश हरे॥`,
    englishText: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare.
Bhakt Janon Ke Sankat, Das Janon Ke Sankat,
Kshan Mein Door Kare.
Om Jai Jagdish Hare.

Jo Dhyave Phal Pave, Dukh Binse Man Ka.
Swami Dukh Binse Man Ka.
Sukh Sampatti Ghar Aave, Sukh Sampatti Ghar Aave,
Kasht Mite Tan Ka.
Om Jai Jagdish Hare.

Maat Pita Tum Mere, Sharan Gahun Main Kiski.
Swami Sharan Gahun Main Kiski.
Tum Bin Aur Na Dooja, Tum Bin Aur Na Dooja,
Aas Karun Main Jiski.
Om Jai Jagdish Hare.

Tum Pooran Paramatma, Tum Antaryami.
Swami Tum Antaryami.
Parabrahm Parameshwar, Parabrahm Parameshwar,
Tum Sab Ke Swami.
Om Jai Jagdish Hare.

Tum Karuna Ke Sagar, Tum Palankarta.
Swami Tum Palankarta.
Main Moorakh Khal Kami, Main Moorakh Khal Kami,
Kripa Karo Bharta.
Om Jai Jagdish Hare.

Tum Ho Ek Agochar, Sabke Pranpati.
Swami Sabke Pranpati.
Kis Vidhi Milun Dayamay, Kis Vidhi Milun Dayamay,
Tumko Main Kumati.
Om Jai Jagdish Hare.

Deenbandhu Dukhharta, Tum Rakshak Mere.
Swami Tum Rakshak Mere.
Apne Haath Uthao, Apne Sharan Lagao,
Dwar Pada Tere.
Om Jai Jagdish Hare.

Vishay Vikar Mitao, Paap Haro Deva.
Swami Paap Haro Deva.
Shraddha Bhakti Badhao, Shraddha Bhakti Badhao,
Santan Ki Seva.
Om Jai Jagdish Hare.`,
  },
];

export const SHLOKAS: Shloka[] = [
  {
    id: 1,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    hindiMeaning: 'तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। इसलिए कर्म को फल की इच्छा से मत करो और न ही कर्म न करने में आसक्त हो।',
    englishMeaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  },
  {
    id: 2,
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    hindiMeaning: 'हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं स्वयं को प्रकट करता हूं।',
    englishMeaning: 'Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest Myself on earth.',
  },
  {
    id: 3,
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    hindiMeaning: 'सभी धर्मों को त्यागकर केवल मेरी शरण में आओ। मैं तुम्हें सभी पापों से मुक्त कर दूंगा, शोक मत करो।',
    englishMeaning: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
  },
  {
    id: 4,
    sanskrit: 'ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय। ॐ शान्तिः शान्तिः शान्तिः॥',
    hindiMeaning: 'हे प्रभु! मुझे असत्य से सत्य की ओर ले चलो। अंधकार से प्रकाश की ओर ले चलो। मृत्यु से अमरता की ओर ले चलो। ॐ शांति शांति शांति।',
    englishMeaning: 'Lead me from the unreal to the real. Lead me from darkness to light. Lead me from death to immortality. Om Peace Peace Peace.',
  },
  {
    id: 5,
    sanskrit: 'त्वमेव माता च पिता त्वमेव। त्वमेव बन्धुश्च सखा त्वमेव। त्वमेव विद्या द्रविणं त्वमेव। त्वमेव सर्वं मम देव देव॥',
    hindiMeaning: 'हे देव! तुम ही मेरी माता हो, तुम ही पिता हो। तुम ही बंधु हो, तुम ही सखा हो। तुम ही विद्या हो, तुम ही धन हो। तुम ही मेरा सब कुछ हो।',
    englishMeaning: 'You are my mother and my father. You are my relative and my friend. You are my knowledge and my wealth. You are everything to me, O God of gods.',
  },
  {
    id: 6,
    sanskrit: 'सहनाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै। तेजस्विनावधीतमस्तु मा विद्विषावहै। ॐ शान्तिः शान्तिः शान्तिः॥',
    hindiMeaning: 'हम दोनों की रक्षा हो। हम दोनों का पालन हो। हम दोनों मिलकर शक्ति प्राप्त करें। हमारी विद्या तेजस्वी हो। हम एक-दूसरे से द्वेष न करें।',
    englishMeaning: 'May we both be protected. May we both be nourished. May we work together with great energy. May our study be vigorous and effective. May we not hate each other.',
  },
  {
    id: 7,
    sanskrit: 'वसुधैव कुटुम्बकम्',
    hindiMeaning: 'सारी पृथ्वी एक परिवार है। यह विचार हमें सभी प्राणियों के प्रति प्रेम और करुणा रखने की प्रेरणा देता है।',
    englishMeaning: 'The whole world is one family. This ancient wisdom teaches us to treat all beings with love and compassion.',
  },
  {
    id: 8,
    sanskrit: 'अहिंसा परमो धर्मः धर्म हिंसा तथैव च।',
    hindiMeaning: 'अहिंसा सबसे बड़ा धर्म है, और धर्म की रक्षा के लिए हिंसा भी उतनी ही आवश्यक है।',
    englishMeaning: 'Non-violence is the highest virtue, and so is violence in service of righteousness.',
  },
  {
    id: 9,
    sanskrit: 'सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः।',
    hindiMeaning: 'सत्य की ही जीत होती है, असत्य की नहीं। सत्य के मार्ग से ही देवलोक का रास्ता खुलता है।',
    englishMeaning: 'Truth alone triumphs, not falsehood. Through truth the divine path is spread out by which the sages whose desires have been completely fulfilled, reach where that supreme treasure of Truth resides.',
  },
  {
    id: 10,
    sanskrit: 'आत्मा वा अरे द्रष्टव्यः श्रोतव्यो मन्तव्यो निदिध्यासितव्यः।',
    hindiMeaning: 'आत्मा को देखना चाहिए, सुनना चाहिए, सोचना चाहिए और ध्यान करना चाहिए।',
    englishMeaning: 'The Self should be seen, heard, reflected upon, and meditated upon. By seeing, hearing, reflecting, and meditating on the Self, all this is known.',
  },
];

export const TEMPLES = [
  {
    name: 'Kashi Vishwanath Temple',
    location: 'Varanasi, Uttar Pradesh',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'One of the most famous Hindu temples dedicated to Lord Shiva',
    emoji: '🔱',
    liveDarshanUrl: 'https://www.youtube.com/@ShriKashiVishwanathTemple',
    mapsUrl: 'https://www.google.com/maps/search/Kashi+Vishwanath+Temple+Varanasi',
  },
  {
    name: 'Tirupati Balaji Temple',
    location: 'Tirupati, Andhra Pradesh',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    description: 'Sri Venkateswara Swamy Temple, the richest temple in the world',
    emoji: '🪷',
    liveDarshanUrl: 'https://www.youtube.com/@tirumaladevasthanams',
    mapsUrl: 'https://www.google.com/maps/search/Tirupati+Balaji+Temple',
  },
  {
    name: 'Vaishno Devi Temple',
    location: 'Katra, Jammu & Kashmir',
    city: 'Katra',
    state: 'Jammu & Kashmir',
    description: 'Sacred shrine of Mata Vaishno Devi in the Trikuta Mountains',
    emoji: '🌺',
    liveDarshanUrl: 'https://www.youtube.com/@ShriMataVaishnoDevi',
    mapsUrl: 'https://www.google.com/maps/search/Vaishno+Devi+Temple+Katra',
  },
  {
    name: 'Jagannath Temple',
    location: 'Puri, Odisha',
    city: 'Puri',
    state: 'Odisha',
    description: 'Ancient temple dedicated to Lord Jagannath, a form of Vishnu',
    emoji: '🌟',
    liveDarshanUrl: 'https://www.youtube.com/@JagannathTemple',
    mapsUrl: 'https://www.google.com/maps/search/Jagannath+Temple+Puri',
  },
];

export function getTodaysShloka(): Shloka {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return SHLOKAS[dayOfYear % SHLOKAS.length];
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning 🌅';
  if (hour < 17) return 'Good Afternoon ☀️';
  return 'Good Evening 🌙';
}

export function getHinduDate(): string {
  const months = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika',
    'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
  ];
  const now = new Date();
  const gregorianMonth = now.getMonth();
  const hinduMonthIndex = (gregorianMonth + 1) % 12;
  return `${months[hinduMonthIndex]} ${now.getFullYear() + 57}`;
}

// Deterministic tithi based on day of year
export function getTodaysTithi(): string {
  const tithis = [
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
    'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा / अमावस्या',
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Lunar cycle is ~29.5 days; approximate tithi from day of year
  const tithiIndex = Math.floor((dayOfYear % 30) * (15 / 30));
  return tithis[tithiIndex % tithis.length];
}

// Deterministic nakshatra based on day of year
export function getTodaysNakshatra(): string {
  const nakshatras = [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा',
    'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा',
    'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती',
    'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
    'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद',
    'उत्तराभाद्रपद', 'रेवती',
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Sidereal month ~27.3 days; cycle through 27 nakshatras
  return nakshatras[dayOfYear % nakshatras.length];
}
