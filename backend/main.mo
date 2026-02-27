import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  public type Festival = {
    name : Text;
    date : Text;
    description : Text;
  };

  public type Mantra = {
    #omNamahShivaya;
    #hareKrishna;
    #gayatriMantra;
    #mahamrityunjayaMantra;
    #saiRam;
    #sitaram;
    #omMantra;
    #radhaNamJap;
    #jaiShreeRamNamJap;
  };

  public type Aarti = {
    id : Nat;
    name : Text;
    hindiText : Text;
    englishText : Text;
  };

  public type Shloka = {
    id : Nat;
    sanskrit : Text;
    hindiMeaning : Text;
    englishMeaning : Text;
  };

  public type DharmaQuote = {
    id : Nat;
    englishText : Text;
    hindiText : Text;
    author : Text;
  };

  public type Temple = {
    name : Text;
    location : Text;
    city : Text;
    state : Text;
    liveDarshanUrl : Text;
  };

  public type CommunityPost = {
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : { #pending; #approved; #rejected };
    reports : Nat;
  };

  public type JapStats = {
    daily : Nat;
    weekly : Nat;
    lifetime : Nat;
  };

  public type UserProfile = {
    name : Text;
    selectedMantra : Mantra;
  };

  type JapStatsInternal = {
    daily : Nat;
    weekly : Nat;
    lifetime : Nat;
    lastReset : Int;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let temples = Map.empty<Nat, Temple>();
  let communityPosts = Map.empty<Nat, CommunityPost>();
  let japCounters = Map.empty<Principal, JapStatsInternal>();
  let dharmaQuotes = Map.empty<Nat, DharmaQuote>();

  var nextPostId = 0;
  var counter = 0;

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

  let kathayen = Map.fromIter<Nat, Katha>(
    [
      // Ramayan full Katha entry
      (
        0,
        {
          id = 0;
          title = "Ramayan - Sampurna Katha";
          category = #puranik;
          deity = "Ram";
          hindiText = "बाल काण्ड: राजा दशरथ की तीन रानियां, राम का जन्म, बचपन की लीलाएं।\n" #
          "अयोध्या काण्ड: राजा दशरथ द्वारा राम को वनवास, भरत की भक्ति।\n" #
          "अरण्य काण्ड: जंगल में साधु जीवन, रावण द्वारा सीता हरण।\n" #
          "किष्किन्धा काण्ड: हनुमान, सुग्रीव और वानर सेना से मित्रता।\n" #
          "सुंदर काण्ड: हनुमान जी द्वारा लंका यात्रा, सीता जी को संदेश।\n" #
          "लंकाकाण्ड/युद्ध काण्ड: राम-रावण युद्ध, रावण वध।\n" #
          "उत्तर काण्ड: अयोध्या लौटना, राम राज्य की स्थापना।";
          englishText = "The complete epic of Ramayan containing all major chapters and divine stories of Lord Ram's life.";
          tags = ["Ramayan", "Ram", "Hindu", "Puranik", "Story"];
          createdAt = 1;
          status = #approved;
        },
      ),
      // Mahabharat full Katha entry (after Ramayan)
      (
        1,
        {
          id = 1;
          title = "Mahabharat - Sampurna Katha";
          category = #puranik;
          deity = "Krishna";
          hindiText = "आदि पर्व: इतिहास, कौरव और पांडवों का जन्म, गुरु द्रोण।\n" #
          "सभा पर्व: युधिष्ठिर की राज्य सभा, चौसर खेल, द्रौपदी का अपमान।\n" #
          "वन पर्व: तेरह वर्ष का वनवास, विभिन्न तपस्याएं और कथाएं।\n" #
          "विराट पर्व: पांडवों का अज्ञातवास।\n" #
          "उद्योग पर्व: युद्ध की तैयारियां, श्रीकृष्ण का शांति संदेश।\n" #
          "भीष्म, द्रोण, कर्ण, शल्य पर्व: अठारह दिन का युद्ध।\n" #
          "शांति और अनुशासन पर्व: भीष्म द्वारा धर्म शिक्षा।\n" #
          "अश्वमेध, महाप्रस्थानिक और स्वर्गारोहण पर्व: धर्मराज युधिष्ठिर का राज्याभिषेक, स्वर्ग गमन।";
          englishText = "The epic saga of Mahabharat including all major parvas, divine stories, Dharma teachings and the great Kurukshetra war.";
          tags = ["Mahabharat", "Krishna", "Hindu", "Puranik", "Epic"];
          createdAt = 2;
          status = #approved;
        },
      ),
      (
        2,
        {
          id = 2;
          title = "Ekadashi Vrat Katha";
          category = #vrat;
          deity = "Vishnu";
          hindiText = "एक समय में धर्मराज ने मनुष्यों को उपदेश दिया कि एकादशी व्रत अवश्य करना चाहिए। यह व्रत भगवान विष्णु की पूजा और निर्जल उपवास के साथ किया जाता है...";
          englishText = "The story and procedure for observing Ekadashi fast dedicated to Lord Vishnu.";
          tags = ["Ekadashi", "Vishnu", "Vrat", "Fast", "Hindu"];
          createdAt = 3;
          status = #approved;
        },
      ),
      (
        3,
        {
          id = 3;
          title = "Somvar Vrat Katha (Monday Fast)";
          category = #vrat;
          deity = "Shiva";
          hindiText = "शिवभक्त एक समय सोमवार का व्रत करते थे। इस व्रत में भगवान शिव की विशेष पूजा और उपवास किया जाता है...";
          englishText = "Story and rituals of observing Somvar fast dedicated to Lord Shiva.";
          tags = ["Somvar", "Shiva", "Vrat", "Fast", "Hindu"];
          createdAt = 4;
          status = #approved;
        },
      ),
      (
        4,
        {
          id = 4;
          title = "Satyanarayan Vrat Katha";
          category = #vrat;
          deity = "Vishnu";
          hindiText = "प्राचीन काल में एक गरीब ब्राह्मण भगवान सत्यनारायण का व्रत कर धनवान हुआ। यह व्रत पूर्ण श्रद्धा और कथा के साथ किया जाता है...";
          englishText = "The famous story of Satyanarayan fast and puja dedicated to Lord Vishnu.";
          tags = ["Satyanarayan", "Vishnu", "Vrat", "Fast", "Puja"];
          createdAt = 5;
          status = #approved;
        },
      ),
      (
        5,
        {
          id = 5;
          title = "Shivratri Vrat Katha";
          category = #vrat;
          deity = "Shiva";
          hindiText = "शिवरात्रि का व्रत भगवान शिव के विवाह और जगत की भलाई के लिए किया जाता है। इसमें रात्रि जागरण, उपवास और विशेष पूजा होती है...";
          englishText = "Story and rituals of Maha Shivratri fast and its divine significance.";
          tags = ["Shivratri", "Shiva", "Vrat", "Fast", "Puja"];
          createdAt = 6;
          status = #approved;
        },
      ),
      (
        6,
        {
          id = 6;
          title = "Makhan Chor Leela";
          category = #puranik;
          deity = "Krishna";
          hindiText = "बाल श्रीकृष्ण अपने मित्रों के साथ मक्खन चुराने की लीलाएं करते थे। इन लीलाओं में माता यशोदा का स्नेह और भक्ति का भाव है...";
          englishText = "Divine childhood stories of Lord Krishna stealing butter and spreading love.";
          tags = ["Krishna", "MakhanChor", "Leela", "BalLeela", "Devotional"];
          createdAt = 7;
          status = #approved;
        },
      ),
      (
        7,
        {
          id = 7;
          title = "Kaliya Mardan Leela";
          category = #puranik;
          deity = "Krishna";
          hindiText = "यमुना नदी में रहने वाले कालिया नाग का उद्धार भगवान कृष्ण ने अपने पैरों से किया। यह लीला बुराई पर अच्छाई की जीत है...";
          englishText = "The miracle of Lord Krishna subduing the serpent Kaliya in Yamuna.";
          tags = ["KrishnaLeela", "Kaliya", "Serpent", "Miracles", "GoodVsEvil"];
          createdAt = 8;
          status = #approved;
        },
      ),
      (
        8,
        {
          id = 8;
          title = "Govardhan Leela";
          category = #puranik;
          deity = "Krishna";
          hindiText = "इंद्र के क्रोध में बरसात को शांत करने के लिए श्री कृष्ण ने गोवर्धन पर्वत उठाया। इससे गौ, ग्वाल और भक्तों की रक्षा हुई...";
          englishText = "Divine miracle of Lord Krishna holding Govardhan mountain for protection.";
          tags = ["Krishna", "Govardhan", "Miracles", "Protection", "Devotion"];
          createdAt = 9;
          status = #approved;
        },
      ),
      (
        9,
        {
          id = 9;
          title = "Janmashtami Katha";
          category = #puranik;
          deity = "Krishna";
          hindiText = "श्री कृष्ण का जन्म कंस के अत्याचारों से दुनिया को बचाने के लिए अर्जुन के परिवार में हुआ। उनका जीवन धर्म, भक्ति और बलिदान की मिसाल है...";
          englishText = "Story of Lord Krishna's divine birth and his mission to uphold Dharma.";
          tags = ["KrishnaLeela", "Janmashtami", "Birth", "Avataar", "Dharma"];
          createdAt = 10;
          status = #approved;
        },
      ),
    ].values(),
  );
  var kathaCounter = 10; // Next ID after seeded entries

  // Krishna Leela Full Story in Hindi (seeded data)
  public type KrishnaLeela = {
    id : Nat;
    hindiText : Text;
  };

  let krishnaLeelaData = Map.singleton<Nat, KrishnaLeela>(
    0,
    {
      id = 0;
      hindiText =
      "श्री कृष्ण जन्म और बाल लीलाएँ..."
      # "\nगोवर्धन पूजा कथा..."
      # "\nकालिय नाग मर्दन..."
      # "\nमथुरा गमन और कंस वध..."
      # "\nरास लीला, श्री कृष्ण के उपदेश..."
      # "\nधर्म की रक्षा और मोक्ष यात्रा...";
    },
  );

  // 20 Vrat Kathas in Hindi (seeded data)
  public type VratKatha = {
    id : Nat;
    title : Text;
    hindiText : Text;
  };

  let vratKathas = Map.fromIter<Nat, VratKatha>(
    [
      (0, { id = 0; title = "संतोषी माता व्रत कथा"; hindiText = "एक समय की बात है..." }),
      (1, { id = 1; title = "सोलह सोमवार व्रत कथा"; hindiText = "धर्मनिष्ठ पंडित की बेटी..." }),
      (2, { id = 2; title = "एकादशी व्रत कथा"; hindiText = "प्राचीन समय में..." }),
      (3, { id = 3; title = "प्रदोष व्रत कथा"; hindiText = "महादेव भक्त..." }),
      (4, { id = 4; title = "मंगलवार व्रत कथा"; hindiText = "हनुमान भक्त महिला..." }),
      (5, { id = 5; title = "शुक्रवार व्रत कथा"; hindiText = "शुक्र देव कथा..." }),
      (6, { id = 6; title = "बृहस्पतिवार व्रत कथा"; hindiText = "गुरु द्वार रक्षा..." }),
      (7, { id = 7; title = "शनिवार व्रत कथा"; hindiText = "शनि देव प्रसंग..." }),
      (8, { id = 8; title = "नवरात्रि व्रत कथा"; hindiText = "माता दुर्गा का वरदान..." }),
      (9, { id = 9; title = "करवा चौथ व्रत कथा"; hindiText = "प्यारी पत्नी की गाथा..." }),
      (10, { id = 10; title = "अहोई अष्टमी व्रत कथा"; hindiText = "साचोद धर्म पत्नी..." }),
      (11, { id = 11; title = "हरियाली तीज व्रत कथा"; hindiText = "माता पार्वती यज्ञ..." }),
      (12, { id = 12; title = "हरतालिका तीज व्रत कथा"; hindiText = "व्याह कथा..." }),
      (13, { id = 13; title = "गणेश चतुर्थी व्रत कथा"; hindiText = "माता की स्थापना..." }),
      (14, { id = 14; title = "जन्माष्टमी व्रत कथा"; hindiText = "श्री कृष्ण का प्रकट्य..." }),
      (15, { id = 15; title = "महाशिवरात्रि व्रत कथा"; hindiText = "महादेव की रात्रि..." }),
      (16, { id = 16; title = "राम नवमी व्रत कथा"; hindiText = "श्रीराम का अवतरण..." }),
      (17, { id = 17; title = "हनुमान जयंती व्रत कथा"; hindiText = "हनुमान प्रकट्य..." }),
      (18, { id = 18; title = "फुलेरा दूज व्रत कथा"; hindiText = "शिव-पार्वती कथा..." }),
      (19, { id = 19; title = "निर्जला एकादशी व्रत कथा"; hindiText = "भीम की प्रतिज्ञा..." }),
    ].values(),
  );

  // ── Approval helpers ────────────────────────────────────────────────────────

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // ── User profile ─────────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func setUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getUserMantra() : async Mantra {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Jap stats");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        {
          name = "";
          selectedMantra = #omNamahShivaya;
        };
      };
    };
    profile.selectedMantra;
  };

  // ── Jap counter ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func incrementJap(count : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can increment Jap count");
    };

    let now = Time.now();
    let currentStatsInternal = switch (japCounters.get(caller)) {
      case (?stats) {
        if (now - stats.lastReset > 86400_000_000_000) {
          {
            stats with
            daily = count;
            weekly = if (now - stats.lastReset > 604800_000_000_000) { count } else {
              stats.weekly + count : Nat;
            };
            lifetime = stats.lifetime + count : Nat;
          };
        } else {
          {
            stats with
            daily = stats.daily + count : Nat;
            weekly = stats.weekly + count : Nat;
            lifetime = stats.lifetime + count : Nat;
          };
        };
      };
      case (null) {
        { daily = count; weekly = count; lifetime = count; lastReset = now };
      };
    };
    japCounters.add(caller, currentStatsInternal);
  };

  public query ({ caller }) func getJapStats() : async JapStatsInternal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Jap stats");
    };
    switch (japCounters.get(caller)) {
      case (?stats) { stats };
      case (null) { { daily = 0; weekly = 0; lifetime = 0; lastReset = 0 } };
    };
  };

  public shared ({ caller }) func resetJapStats() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset Jap stats");
    };
    japCounters.remove(caller);
  };

  // Leaderboard is public — no auth required
  public query func getJapLeaderboard() : async [JapStats] {
    let entries = japCounters.toArray().map(
      func((principal, statsInternal)) {
        { daily = statsInternal.daily; weekly = statsInternal.weekly; lifetime = statsInternal.lifetime };
      }
    );

    entries.sort(
      func(a, b) {
        Nat.compare(b.lifetime, a.lifetime);
      }
    ).sliceToArray(0, Nat.min(entries.size(), 10 : Nat));
  };

  // ── Admin helpers ─────────────────────────────────────────────────────────────

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  public shared ({ caller }) func addDharmaQuote(id : Nat, englishText : Text, hindiText : Text, author : Text) : async () {
    requireAdmin(caller);
    let quote = { id; englishText; hindiText; author };
    dharmaQuotes.add(id, quote);
  };

  public shared ({ caller }) func addAarti(id : Nat, name : Text, hindiText : Text, englishText : Text) : async () {
    requireAdmin(caller);
  };

  // ── Public queries (no auth required) ────────────────────────────────────────

  public query func getDharmaQuoteOfDay() : async ?DharmaQuote {
    let now = Time.now();
    let dayIndex = (now / 86400_000_000_000 : Int) % 30 : Int;
    let activeValues = dharmaQuotes.toArray();
    if (activeValues.size() == 0) {
      return null;
    };
    let index = Int.abs(dayIndex) % activeValues.size();
    ?activeValues[index].1;
  };

  public query func getFestivals() : async [Festival] {
    [{ name = "Diwali"; date = "2024-11-12"; description = "Festival of Lights" }];
  };

  // ── Katha management ──────────────────────────────────────────────────────────

  public shared ({ caller }) func addKatha(title : Text, category : KathaCategory, deity : Text, hindiText : Text, englishText : Text, tags : [Text]) : async Nat {
    requireAdmin(caller);

    let katha : Katha = {
      id = kathaCounter;
      title;
      category;
      deity;
      hindiText;
      englishText;
      tags;
      createdAt = Time.now();
      status = #pending;
    };

    kathayen.add(kathaCounter, katha);
    kathaCounter += 1;
    katha.id;
  };

  public shared ({ caller }) func approveKatha(kathaId : Nat) : async Bool {
    requireAdmin(caller);
    switch (kathayen.get(kathaId)) {
      case (?katha) {
        let updatedKatha = { katha with status = #approved };
        kathayen.add(kathaId, updatedKatha);
        true;
      };
      case (null) {
        false;
      };
    };
  };

  // Katha reads are public — no auth required
  public query func getKatha(id : Nat) : async ?Katha {
    kathayen.get(id);
  };

  public query func listKathayenByCategory(category : KathaCategory) : async [Katha] {
    let kathas = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.category == category and katha.status == #approved) {
        kathas.add(katha);
      };
    };

    kathas.toArray();
  };

  public query func searchKathayenByTitle(search : Text) : async [Katha] {
    let results = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.title.contains(#text search) and katha.status == #approved) {
        results.add(katha);
      };
    };

    results.toArray();
  };

  public query func searchKathayenByDeity(deity : Text) : async [Katha] {
    let results = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.deity.contains(#text deity) and katha.status == #approved) {
        results.add(katha);
      };
    };

    results.toArray();
  };

  public query func getAllKathayen() : async [Katha] {
    let allKathaValues = kathayen.values().toArray();
    allKathaValues.filter(
      func(katha) {
        katha.status == #approved;
      }
    );
  };

  // Krishna Leela Full Story (public query)
  public query func getKrishnaLeelaStory() : async KrishnaLeela {
    switch (krishnaLeelaData.get(0)) {
      case (?story) { story };
      case (null) { Runtime.trap("Krishna Leela data not found") };
    };
  };

  // Get all Vrat Kathas
  public query func getAllVratKathas() : async [VratKatha] {
    vratKathas.values().toArray().sort(
      func(a, b) {
        Nat.compare(a.id, b.id);
      }
    );
  };

  // Get single Vrat Katha by ID
  public query func getVratKathaById(id : Nat) : async ?VratKatha {
    vratKathas.get(id);
  };
};
