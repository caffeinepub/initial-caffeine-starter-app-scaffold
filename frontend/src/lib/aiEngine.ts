// Client-side AI response engine - handles any question across all domains

interface ResponseTemplate {
  patterns: RegExp[];
  responses: string[];
}

const RESPONSE_DELAY_MS = 800;

// ─── Domain-specific knowledge bases ───────────────────────────────────────

const hinduKnowledge: ResponseTemplate[] = [
  {
    patterns: [/\bram(a)?\b/i, /\bramayana\b/i, /\bsita\b/i, /\bhanumanji?\b/i],
    responses: [
      "भगवान राम (Lord Rama) is the seventh avatar of Vishnu and the hero of the Ramayana. He is revered as Maryada Purushottam — the ideal man — embodying dharma, truth, and righteousness. His life journey from Ayodhya to Lanka and back is a timeless epic of devotion, sacrifice, and the triumph of good over evil. Hanumanji, his greatest devotee, symbolizes selfless service and unwavering bhakti.",
      "The Ramayana, composed by Maharishi Valmiki, narrates the life of Lord Rama. It teaches that dharma (righteousness) must be upheld even at great personal cost. Rama's 14-year exile, Sita's abduction by Ravana, and the eventual victory of good over evil are central themes. The story is celebrated during Diwali (Rama's return to Ayodhya) and Dussehra (Ravana's defeat).",
    ],
  },
  {
    patterns: [/\bkrishna\b/i, /\bmahabharata\b/i, /\bgita\b/i, /\bbhagavad\b/i, /\barjuna\b/i],
    responses: [
      "भगवान कृष्ण (Lord Krishna) is the eighth avatar of Vishnu and one of the most beloved deities in Hinduism. The Bhagavad Gita, spoken by Krishna to Arjuna on the battlefield of Kurukshetra, is one of the world's greatest philosophical texts. It teaches Karma Yoga (selfless action), Jnana Yoga (knowledge), and Bhakti Yoga (devotion) as paths to liberation (moksha).",
      "The Bhagavad Gita's core teaching is: 'Karmanye vadhikaraste, Ma phaleshu kadachana' — You have the right to perform your duties, but not to the fruits of your actions. This principle of nishkama karma (desireless action) is the foundation of Hindu philosophy and remains profoundly relevant today.",
    ],
  },
  {
    patterns: [/\bshiva\b/i, /\bmahade(v|va)\b/i, /\bparvati\b/i, /\bganesh(a)?\b/i, /\bkartik(eya)?\b/i],
    responses: [
      "भगवान शिव (Lord Shiva) is one of the principal deities of Hinduism — the destroyer and transformer in the Trimurti (Brahma, Vishnu, Shiva). He is Adiyogi, the first yogi, who transmitted the science of yoga to the Saptarishis. His consort Parvati represents Shakti (divine energy), and together they are the parents of Ganesha and Kartikeya.",
      "Lord Ganesha, the elephant-headed son of Shiva and Parvati, is worshipped as the remover of obstacles (Vighnaharta) and the lord of beginnings. He is invoked at the start of any auspicious activity. His large ears symbolize listening, his small mouth symbolizes speaking less, and his trunk symbolizes adaptability.",
    ],
  },
  {
    patterns: [/\bdurga\b/i, /\bkali\b/i, /\blakshmi\b/i, /\bsaraswati\b/i, /\bdevi\b/i, /\bshakti\b/i, /\bnavaratri\b/i],
    responses: [
      "The Divine Mother (Devi/Shakti) is worshipped in many forms in Hinduism. Durga is the warrior goddess who defeated the demon Mahishasura — celebrated during Navaratri. Lakshmi is the goddess of wealth and prosperity. Saraswati is the goddess of knowledge, arts, and wisdom. Kali represents the fierce aspect of Shakti, destroying ego and ignorance.",
      "Navaratri (nine nights) is one of the most important Hindu festivals, celebrating the nine forms of Goddess Durga. Each day is dedicated to a different form: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri. The festival culminates in Vijayadashami (Dussehra).",
    ],
  },
  {
    patterns: [/\bdiwali\b/i, /\bdeepawali\b/i, /\bfestival of lights\b/i],
    responses: [
      "Diwali (Deepawali) — the Festival of Lights — is one of the most celebrated Hindu festivals. It marks Lord Rama's return to Ayodhya after 14 years of exile and the defeat of Ravana. Celebrated on Amavasya (new moon) of Kartik month, it symbolizes the victory of light over darkness, knowledge over ignorance, and good over evil. Lakshmi Puja is performed on the main night.",
    ],
  },
  {
    patterns: [/\bom\b/i, /\baum\b/i, /\bmantra\b/i, /\bchant\b/i, /\bjap\b/i],
    responses: [
      "ॐ (Om/Aum) is the most sacred sound in Hinduism, considered the primordial sound of the universe. It represents Brahman (the ultimate reality) and encompasses all of existence — past, present, and future. Chanting Om during meditation helps calm the mind and connect with the divine. The Mandukya Upanishad dedicates itself entirely to the meaning of Om.",
      "Mantra japa (repetitive chanting) is a powerful spiritual practice. The Gayatri Mantra — 'Om Bhur Bhuvaḥ Swaḥ, Tat Savitur Vareṇyaṃ...' — is considered the mother of all mantras. Chanting 108 times (one mala) is considered auspicious. The number 108 is sacred: 1 represents the universe, 0 represents emptiness, and 8 represents infinity.",
    ],
  },
  {
    patterns: [/\bpuja\b/i, /\baarti\b/i, /\bworship\b/i, /\bprayer\b/i, /\bbhakti\b/i],
    responses: [
      "Puja is the act of worship in Hinduism, involving offerings of flowers, incense, light (aarti), food (prasad), and water to the deity. Aarti is the ritual of waving a lamp before the deity while singing devotional songs. It symbolizes the removal of darkness (ignorance) and the illumination of the divine presence. Bhakti (devotion) is considered one of the highest paths to God.",
    ],
  },
  {
    patterns: [/\bkarma\b/i, /\bdharma\b/i, /\bmoksha\b/i, /\bsamsara\b/i, /\breincarnation\b/i, /\brebirth\b/i],
    responses: [
      "Karma is the universal law of cause and effect — every action has consequences that shape future experiences. Dharma is one's righteous duty and moral order. Moksha is liberation from the cycle of birth and death (samsara). These four purusharthas (goals of life) — Dharma, Artha (prosperity), Kama (desire), and Moksha — form the foundation of Hindu philosophy.",
      "The concept of karma teaches that our current life is shaped by past actions, and our future is shaped by present actions. This is not fatalism — it empowers us to take responsibility for our choices. The Bhagavad Gita teaches that performing one's dharma without attachment to results (nishkama karma) purifies the soul and leads toward moksha.",
    ],
  },
  {
    patterns: [/\bveda(s|ic)?\b/i, /\bupanishad\b/i, /\bpurana\b/i, /\bscripture\b/i],
    responses: [
      "The Vedas are the oldest scriptures of Hinduism, composed in Sanskrit. There are four Vedas: Rigveda (hymns), Samaveda (melodies), Yajurveda (rituals), and Atharvaveda (spells and charms). The Upanishads are philosophical texts that explore the nature of Brahman (ultimate reality) and Atman (individual soul). The Puranas contain stories of gods, creation, and cosmology.",
    ],
  },
  {
    patterns: [/\bpanchang\b/i, /\btithi\b/i, /\bnakshatra\b/i, /\bmuhu?rat\b/i, /\bhindu calendar\b/i],
    responses: [
      "The Hindu Panchang (almanac) is a traditional calendar system based on lunar and solar movements. It contains five elements: Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (auspicious combination), and Karana (half-day). Muhurat refers to an auspicious time for important activities like weddings, business ventures, or travel. Rahu Kaal is an inauspicious period each day.",
    ],
  },
  // ─── Katha-specific knowledge ───────────────────────────────────────────
  {
    patterns: [
      /\bkatha\b/i, /\bkathayen\b/i, /\bsatyanarayan\b/i, /\bsomvar\b/i,
      /\bekadashi\b/i, /\bsamudra manthan\b/i, /\bvrat katha\b/i,
      /\bpuranik\b/i, /\bpuranic\b/i,
    ],
    responses: [
      "🙏 Kathayen (sacred stories) are the heart of Hindu devotional tradition. Puranik kathas narrate the divine exploits of gods and goddesses from the Puranas — texts like the Bhagavata Purana, Shiva Purana, and Vishnu Purana. These stories are not mere mythology; they encode profound spiritual truths about dharma, devotion, and the nature of reality. Listening to or reading a katha with faith and reverence is itself a form of worship (shravan bhakti).",
      "🙏 Vrat kathas are sacred stories associated with fasting rituals (vratas). Each vrat has its own katha that explains the origin and significance of the fast. By observing the vrat and listening to its katha, devotees seek blessings for health, prosperity, and spiritual merit. The Satyanarayan Katha, Ekadashi Katha, and Somvar Vrat Katha are among the most beloved in Hindu households.",
    ],
  },
  {
    patterns: [
      /\bmoral\b/i, /\bsignificance\b/i, /\bteaching\b/i, /\blesson\b/i,
      /\bspiritual\b/i, /\bwisdom\b/i, /\bmeaning\b/i, /\bexplain\b/i,
    ],
    responses: [
      "🙏 Every sacred katha carries layers of spiritual wisdom. At the surface level, these stories entertain and inspire. At a deeper level, they reveal eternal truths: the importance of satya (truth), the power of bhakti (devotion), the inevitability of karma, and the grace of God that transcends all obstacles. The moral of most kathas can be summarized in the Vedic teaching: 'Satyam Vada, Dharmam Chara' — Speak truth, walk the path of righteousness.\n\nThe Satyanarayan Katha teaches that honesty and gratitude toward God bring lasting prosperity. The Ekadashi Katha reveals that fasting and prayer purify the mind and lead to moksha. The Somvar Vrat Katha shows that sincere devotion to Lord Shiva can transform even the most difficult circumstances.",
      "🙏 The spiritual significance of Hindu kathas lies in their power to transform the listener. When we hear about Lord Vishnu's compassion in the Satyanarayan Katha, we are inspired to cultivate compassion ourselves. When we hear about Ganesha's birth, we understand that obstacles in life are opportunities for divine grace. The Puranas teach through story (katha) because stories bypass the intellect and speak directly to the heart — this is the ancient wisdom of narrative as spiritual practice.",
    ],
  },
  {
    patterns: [
      /\bsatyanarayan\b/i, /\bsatya narayan\b/i,
    ],
    responses: [
      "🙏 The Satyanarayan Katha is one of the most widely performed pujas in Hindu households. It is dedicated to Lord Vishnu in his form as Satyanarayan — the Lord of Truth. The katha consists of five chapters narrating how devotees who performed this puja with faith received divine blessings, and how those who neglected it faced difficulties.\n\n**Moral & Spiritual Teaching:** The katha emphasizes that truth (satya) is the highest dharma. It teaches gratitude — never forgetting God's grace after receiving blessings. It also teaches that material prosperity without spiritual grounding is incomplete. The prasad (panchamrit) distributed after the puja symbolizes the sweetness of divine grace shared with all.",
    ],
  },
  {
    patterns: [
      /\bganesha? (birth|janm|katha)\b/i, /\bganesh janm\b/i,
    ],
    responses: [
      "🙏 The Ganesha Janm Katha (story of Ganesha's birth) is a profound Puranik narrative from the Shiva Purana. It teaches several deep spiritual lessons:\n\n**Dharmic Values:** The story shows that even divine beings must respect boundaries and authority. Ganesha's initial refusal to let Shiva enter was born of loyalty to his mother — a virtue. Shiva's anger, though fierce, was ultimately transformed into love and blessing.\n\n**Spiritual Significance:** Ganesha's elephant head symbolizes wisdom (large brain), discrimination (large ears to hear truth), and the ability to remove obstacles (trunk). His mouse vehicle represents the ego that must be controlled. Worshipping Ganesha first in any endeavor invites divine wisdom and the removal of obstacles from our path. 🐘",
    ],
  },
  {
    patterns: [
      /\bsomvar\b/i, /\bmonday fast\b/i, /\bshiva vrat\b/i,
    ],
    responses: [
      "🙏 The Somvar (Monday) Vrat Katha is dedicated to Lord Shiva. Monday is considered Shiva's day — Somvar means 'day of the Moon,' and Shiva wears the crescent moon on his head.\n\n**Moral Teaching:** The katha teaches that sincere devotion and faith can overcome even the most difficult circumstances. The merchant's wife in the story exemplifies nishtha (steadfast devotion) — she continued her vrat even when faced with the prospect of losing her son. Her unwavering faith moved Lord Shiva to grant extended life.\n\n**Spiritual Significance:** Fasting on Mondays and observing the Somvar Vrat purifies the mind, strengthens willpower, and deepens one's connection with Lord Shiva. It teaches that God's grace is always available to those who seek it with a pure heart. 🔱",
    ],
  },
  {
    patterns: [
      /\bekadashi\b/i, /\beleventh day\b/i,
    ],
    responses: [
      "🙏 Ekadashi (the eleventh day of the lunar fortnight) is one of the most sacred fasting days in Hinduism, dedicated to Lord Vishnu. There are 24 Ekadashis in a year, each with its own name and katha.\n\n**Moral & Spiritual Teaching:** The Ekadashi Vrat Katha teaches that sincere devotion and self-discipline (tapas) can overcome even the most powerful forces of darkness. The divine maiden Ekadashi who emerged from Lord Vishnu's body represents the power of pure devotion.\n\nFasting on Ekadashi is believed to cleanse the body and mind, reduce the influence of the ego, and accelerate spiritual progress. The Padma Purana states that the merit of observing Ekadashi equals that of performing thousands of yagnas. It is a day for prayer, scripture reading, and turning inward. 🌸",
    ],
  },
  {
    patterns: [
      /\bsamudra manthan\b/i, /\bocean churning\b/i, /\bkurma\b/i, /\bamrita\b/i,
    ],
    responses: [
      "🙏 The Samudra Manthan (Churning of the Ocean) is one of the most celebrated Puranik kathas from the Bhagavata Purana and Vishnu Purana. It is rich with allegorical and spiritual meaning.\n\n**Allegorical Meaning:** The ocean represents the mind. The churning represents spiritual practice (sadhana). The mountain (Mandara) represents concentration. The serpent (Vasuki) represents the ego being used as a tool. The treasures that emerge represent the fruits of spiritual practice — wisdom, health, prosperity, and ultimately amrita (immortality/moksha).\n\n**Moral Teaching:** Before amrita, the terrible poison Halahala emerged — Lord Shiva drank it to save the world, turning his throat blue (Neelakantha). This teaches that a true spiritual seeker must be willing to absorb difficulties and negativity without being destroyed by them. The cooperation between gods and demons teaches that even opposing forces must work together for the greater good. 🌊",
    ],
  },
];

const generalKnowledge: ResponseTemplate[] = [
  // Science
  {
    patterns: [/\bquantum\b/i, /\bphysics\b/i, /\beinstein\b/i, /\brelativity\b/i],
    responses: [
      "Quantum physics is the branch of physics that studies matter and energy at the smallest scales — atoms and subatomic particles. Key principles include wave-particle duality (particles behave as both waves and particles), the uncertainty principle (you cannot simultaneously know a particle's exact position and momentum), and quantum entanglement (particles can be correlated regardless of distance). Einstein's theory of relativity revolutionized our understanding of space, time, and gravity.",
      "Einstein's Special Theory of Relativity (1905) introduced E=mc², showing that mass and energy are interchangeable. His General Theory of Relativity (1915) described gravity as the curvature of spacetime caused by mass. These theories have been confirmed by countless experiments, including the detection of gravitational waves by LIGO in 2015.",
    ],
  },
  {
    patterns: [/\bai\b/i, /\bartificial intelligence\b/i, /\bmachine learning\b/i, /\bchatgpt\b/i, /\bllm\b/i],
    responses: [
      "Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence — reasoning, learning, problem-solving, perception, and language understanding. Machine Learning (ML) is a subset of AI where systems learn from data rather than being explicitly programmed. Large Language Models (LLMs) like GPT are trained on vast amounts of text to understand and generate human language.",
      "Modern AI is powered by deep learning — neural networks with many layers that can learn complex patterns. Key breakthroughs include the Transformer architecture (2017), which powers most modern AI systems. AI is now used in healthcare (disease diagnosis), science (protein folding), creative arts (image generation), and everyday tools (voice assistants, recommendation systems).",
    ],
  },
  {
    patterns: [/\bclimate\b/i, /\bglobal warming\b/i, /\benvironment\b/i, /\bcarbon\b/i],
    responses: [
      "Climate change refers to long-term shifts in global temperatures and weather patterns. While natural factors play a role, human activities — primarily burning fossil fuels — have been the main driver since the 1800s. The greenhouse effect traps heat in Earth's atmosphere. Rising CO₂ levels are causing higher temperatures, melting ice caps, rising sea levels, and more extreme weather events.",
    ],
  },
  // History
  {
    patterns: [/\bhistory\b/i, /\bancient\b/i, /\bcivilization\b/i, /\bempire\b/i],
    responses: [
      "Human civilization has a rich history spanning thousands of years. Ancient civilizations like Mesopotamia, Egypt, the Indus Valley, and China developed writing, agriculture, and complex societies. The Indus Valley Civilization (3300–1300 BCE) was one of the world's earliest urban cultures, with advanced city planning, drainage systems, and trade networks. India's history includes the Vedic period, Maurya Empire, Gupta Empire, and Mughal Empire.",
    ],
  },
  // Health
  {
    patterns: [/\bhealth\b/i, /\bmeditation\b/i, /\byoga\b/i, /\bwellness\b/i, /\bmindfulness\b/i],
    responses: [
      "Yoga and meditation, originating from ancient India, are now globally recognized for their profound health benefits. Regular meditation reduces stress, anxiety, and depression while improving focus and emotional regulation. Yoga combines physical postures (asanas), breathing exercises (pranayama), and meditation to promote holistic well-being. Studies show that just 10-20 minutes of daily meditation can significantly improve mental health.",
      "Mindfulness — the practice of being fully present in the moment — is rooted in ancient contemplative traditions including Hindu and Buddhist practices. Modern neuroscience confirms that mindfulness meditation physically changes the brain, increasing gray matter density in areas associated with learning, memory, and emotional regulation. The Mandukya Upanishad and Yoga Sutras of Patanjali are foundational texts on meditation.",
    ],
  },
  // Technology
  {
    patterns: [/\bblockchain\b/i, /\bcrypto\b/i, /\bbitcoin\b/i, /\bweb3\b/i, /\bicp\b/i, /\binternet computer\b/i],
    responses: [
      "Blockchain is a distributed ledger technology where data is stored in blocks linked cryptographically. Bitcoin (2009) was the first cryptocurrency, enabling peer-to-peer transactions without intermediaries. The Internet Computer Protocol (ICP) by DFINITY is a next-generation blockchain that runs smart contracts at web speed, enabling fully decentralized applications (dApps) that can serve web content directly from the blockchain.",
      "Web3 represents the next evolution of the internet — decentralized, user-owned, and powered by blockchain technology. Unlike Web2 (dominated by centralized platforms), Web3 gives users control over their data and digital assets. Smart contracts are self-executing programs on the blockchain that enable trustless transactions and decentralized applications.",
    ],
  },
  // Mathematics
  {
    patterns: [/\bmath(ematics)?\b/i, /\bcalculus\b/i, /\balgebra\b/i, /\bgeometry\b/i, /\bstatistics\b/i],
    responses: [
      "Mathematics is the language of the universe. Ancient Indian mathematicians made groundbreaking contributions: Aryabhata calculated π (pi) and introduced the concept of zero; Brahmagupta formalized rules for arithmetic with zero and negative numbers; Madhava of Sangamagrama developed infinite series centuries before Newton and Leibniz. The decimal number system we use today originated in India.",
    ],
  },
  // Space
  {
    patterns: [/\bspace\b/i, /\buniverse\b/i, /\bgalaxy\b/i, /\bplanet\b/i, /\bnasa\b/i, /\bisro\b/i, /\bmars\b/i],
    responses: [
      "The universe is approximately 13.8 billion years old and contains over 2 trillion galaxies. Our Milky Way galaxy alone has 100-400 billion stars. India's ISRO has made remarkable achievements: Chandrayaan-3 successfully landed near the Moon's south pole in 2023, making India the first country to do so. The Mangalyaan Mars mission was completed at a fraction of the cost of comparable missions.",
    ],
  },
  // Philosophy
  {
    patterns: [/\bphilosophy\b/i, /\bmeaning of life\b/i, /\bexistence\b/i, /\bconsciousness\b/i, /\bsoul\b/i],
    responses: [
      "The question of consciousness and the meaning of life has fascinated philosophers across cultures. Hindu philosophy offers profound insights: Advaita Vedanta (non-dualism) teaches that individual consciousness (Atman) is identical to universal consciousness (Brahman). The Upanishads declare 'Aham Brahmasmi' (I am Brahman) and 'Tat Tvam Asi' (Thou art That) — pointing to the unity of all existence.",
      "The meaning of life, according to various philosophical traditions: Hinduism — to realize one's divine nature (moksha); Buddhism — to end suffering through enlightenment; Existentialism — to create your own meaning; Stoicism — to live virtuously in accordance with nature. The Bhagavad Gita synthesizes these by teaching that life's purpose is to perform one's dharma with love and without attachment to outcomes.",
    ],
  },
  // Food & Cooking
  {
    patterns: [/\bfood\b/i, /\bcooking\b/i, /\brecipe\b/i, /\bcuisine\b/i, /\bvegetarian\b/i],
    responses: [
      "Indian cuisine is one of the world's most diverse and flavorful, with thousands of regional variations. Vegetarianism has deep roots in Hindu philosophy — ahimsa (non-violence) toward all living beings. Key spices include turmeric (anti-inflammatory), cumin, coriander, cardamom, and saffron. Ayurvedic cooking emphasizes balancing the three doshas (Vata, Pitta, Kapha) through food choices.",
    ],
  },
  // Music & Arts
  {
    patterns: [/\bmusic\b/i, /\bsong\b/i, /\bbhajan\b/i, /\bkirtan\b/i, /\bclassical\b/i],
    responses: [
      "Indian classical music is one of the oldest musical traditions in the world, rooted in the Sama Veda. It is based on ragas (melodic frameworks) and talas (rhythmic cycles). Bhajans and kirtans are devotional songs that form an integral part of Hindu worship. The Natyashastra by Bharata Muni (200 BCE–200 CE) is the foundational text on Indian performing arts, covering music, dance, and drama.",
    ],
  },
];

// ─── Greeting & small talk ──────────────────────────────────────────────────

const greetingPatterns = [/^(hi|hello|hey|namaste|jai|hare|pranam|namaskar)\b/i, /^good (morning|afternoon|evening|night)/i];
const greetingResponses = [
  "🙏 Namaste! I am AI Guru, your divine knowledge companion. I can answer questions on any topic — Hindu philosophy, science, history, technology, health, and much more. What would you like to explore today?",
  "🙏 Jai Shri Ram! Welcome, seeker of knowledge. Whether you wish to learn about the Vedas, modern science, world history, or any other topic, I am here to guide you. What is on your mind?",
  "🙏 Namaste! I am here to help you with any question — from ancient scriptures to modern technology. Ask me anything!",
];

const thankPatterns = [/\bthank(s| you)\b/i, /\bdhanyavad\b/i, /\bshukriya\b/i];
const thankResponses = [
  "🙏 You are most welcome! May your quest for knowledge be ever fruitful. Is there anything else you'd like to know?",
  "🙏 Dhanyavaad! It is my honor to serve. Feel free to ask any other question.",
  "🙏 Anytime! Knowledge shared is knowledge multiplied. What else can I help you with?",
];

const helpPatterns = [/\bwhat can you do\b/i, /\bwhat do you know\b/i, /\bhelp\b/i, /\bwhat are you\b/i, /\bwho are you\b/i];
const helpResponses = [
  "🙏 I am AI Guru — your all-knowing digital companion! I can help you with:\n\n• **Hindu Philosophy & Scriptures** — Vedas, Upanishads, Gita, Ramayana, Mahabharata\n• **Festivals & Rituals** — Diwali, Navaratri, Holi, puja, aarti, mantras\n• **Sacred Kathayen** — Puranik stories, Vrat kathas, their morals and spiritual significance\n• **Science & Technology** — AI, space, physics, biology, computers\n• **History & Culture** — Ancient civilizations, Indian history, world events\n• **Health & Wellness** — Yoga, meditation, Ayurveda, mindfulness\n• **Mathematics & Logic** — Concepts, problem-solving, explanations\n• **Philosophy** — Meaning of life, consciousness, ethics\n• **And much more!**\n\nJust ask me anything! 🌟",
];

// ─── Fallback responses for unknown topics ──────────────────────────────────

function generateContextualFallback(question: string): string {
  const words = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const topic = words.slice(0, 3).join(' ') || 'this topic';

  const fallbacks = [
    `That's a fascinating question about "${topic}"! From a philosophical perspective, the ancient Indian tradition of inquiry (jijnasa) teaches us that every question is a step toward greater understanding. The Vedantic approach would be to examine this from multiple angles — the empirical (pratyaksha), the inferential (anumana), and the scriptural (agama). Could you share more context about what specifically you'd like to know? I'll do my best to provide a comprehensive answer.`,
    `Great question! The topic of "${topic}" is multifaceted. In the spirit of the Socratic and Vedantic traditions of inquiry, let me offer this perspective: all knowledge ultimately connects to the fundamental questions of existence, consciousness, and purpose. The Upanishads teach 'Ekam sat vipra bahudha vadanti' — Truth is one, the wise call it by many names. What specific aspect of this topic interests you most?`,
    `Interesting! "${topic}" is a subject worth exploring deeply. The Indian philosophical tradition emphasizes that true knowledge (jnana) comes from direct experience, logical reasoning, and guidance from authentic sources. While I'm continuously learning, I'd love to explore this with you. Can you tell me more about what you'd like to know?`,
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─── Main AI response function ──────────────────────────────────────────────

function findResponse(question: string, templates: ResponseTemplate[]): string | null {
  for (const template of templates) {
    for (const pattern of template.patterns) {
      if (pattern.test(question)) {
        const responses = template.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  return null;
}

export async function getAIResponse(question: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY_MS));

  const q = question.trim();

  // Check greetings
  for (const pattern of greetingPatterns) {
    if (pattern.test(q)) {
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
  }

  // Check thanks
  for (const pattern of thankPatterns) {
    if (pattern.test(q)) {
      return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }
  }

  // Check help
  for (const pattern of helpPatterns) {
    if (pattern.test(q)) {
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
  }

  // Check Hindu knowledge (includes katha knowledge)
  const hinduResponse = findResponse(q, hinduKnowledge);
  if (hinduResponse) return hinduResponse;

  // Check general knowledge
  const generalResponse = findResponse(q, generalKnowledge);
  if (generalResponse) return generalResponse;

  // Fallback
  return generateContextualFallback(q);
}
