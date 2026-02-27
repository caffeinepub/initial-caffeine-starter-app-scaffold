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
import Migration "migration";

(with migration = Migration.run)
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
      (
        1,
        {
          id = 1;
          title = "Monday Shiv Vrat Katha (सोमवार व्रत कथा)";
          category = #vrat;
          deity = "Shiva";
          hindiText = "प्राचीन काल में एक विधवा ब्राह्मणी अपने पुत्र के साथ जीवन यापन करती थी। ..." #
          "उसने भगवान शिव की पूजा की, और आखिरकार उसके परिवार को सुख-समृद्धि मिली।";
          englishText = "";
          tags = ["Vrat", "Monday", "Shiva", "Vrata", "Hindu"];
          createdAt = 2;
          status = #approved;
        },
      ),
      (
        2,
        {
          id = 2;
          title = "Varalaxmi Vrat Katha (वरलक्ष्मी व्रत कथा)";
          category = #vrat;
          deity = "Lakshmi";
          hindiText = "वरलक्ष्मी व्रत कथा बताती है कैसे देवी लक्ष्मी ने एक धर्मपरायण महिला को दर्शन देकर ..." #
          "उसे सुख और समृद्धि का आशीर्वाद दिया।";
          englishText = "";
          tags = ["Vrat", "Varalaxmi", "Lakshmi", "Vrata", "Hindu"];
          createdAt = 3;
          status = #approved;
        },
      ),
      (
        3,
        {
          id = 3;
          title = "Ekadashi Vrat Katha (एकादशी व्रत कथा)";
          category = #vrat;
          deity = "Vishnu";
          hindiText = "एक बार भगवान विष्णु ने ब्रह्माजी से कहा कि जो भी एकादशी व्रत करता है ..." #
          "उसे स्वर्ग यानी मोक्ष की प्राप्ति होती है।";
          englishText = "";
          tags = ["Vrat", "Ekadashi", "Vishnu", "Vrata", "Hindu"];
          createdAt = 4;
          status = #approved;
        },
      ),
      (
        4,
        {
          id = 4;
          title = "Karva Chauth Vrat Katha (करवा चौथ व्रत कथा)";
          category = #vrat;
          deity = "Various";
          hindiText = "करवा चौथ व्रत कथा बताती है कि एक महिला ने अपने पति की लंबी उम्र के लिए ..." #
          "पूरे आकर्षण और विश्वास के साथ उपवास किया और महत्व समझाया।";
          englishText = "";
          tags = ["Vrat", "Karva Chauth", "Vrata", "Hindu"];
          createdAt = 5;
          status = #approved;
        },
      ),
      (
        5,
        {
          id = 5;
          title = "Shravan Somvar Katha (श्रावण सोमवार व्रत कथा)";
          category = #vrat;
          deity = "Shiva";
          hindiText = "एक बार एक गरीब व्यापारी ने भगवान शिव के श्रावण सोमवार व्रत करने का संकल्प लिया ..." #
          "उसका जीवन खुशहाल हो गया।";
          englishText = "";
          tags = ["Vrat", "Shravan", "Somvar", "Shiva", "Vrata", "Hindu"];
          createdAt = 6;
          status = #approved;
        },
      ),
      (
        6,
        {
          id = 6;
          title = "Chandra Darshan Vrat Katha (चंद्र दर्शन व्रत कथा)";
          category = #vrat;
          deity = "Chandra Dev";
          hindiText = "चंद्र दर्शन व्रत कथा चंद्र देव के महत्व और उन्हें प्रसन्न करने के उपायों के बारे में ..." #
          "जागरूकता फैलाती है।";
          englishText = "";
          tags = ["Vrat", "Chandra", "Vrata", "Hindu"];
          createdAt = 7;
          status = #approved;
        },
      ),
      (
        7,
        {
          id = 7;
          title = "Paush Amavasya Vrat Katha (पौष अमावस्या व्रत कथा)";
          category = #vrat;
          deity = "Various";
          hindiText = "पौष अमावस्या कथा धार्मिक परंपराओं, पितृ तर्पण और भगवान विष्णु के साथ जुड़े व्रत को ..." #
          "महत्व देती है।";
          englishText = "";
          tags = ["Vrat", "Paush Amavasya", "Vrata", "Hindu"];
          createdAt = 8;
          status = #approved;
        },
      ),
      (
        8,
        {
          id = 8;
          title = "Skanda Shashti Vrat Katha (स्कंद षष्ठी व्रत कथा)";
          category = #vrat;
          deity = "Kartikeya";
          hindiText = "स्कंद षष्ठी व्रत कथा भगवान कार्तिकेय के जीवन और उनके चमत्कारी कार्यों के बारे में ..." #
          "जागरूक करती है।";
          englishText = "";
          tags = ["Vrat", "Skanda Shashti", "Kartikeya", "Vrata", "Hindu"];
          createdAt = 9;
          status = #approved;
        },
      ),
      (
        9,
        {
          id = 9;
          title = "Sankashti Chaturthi Vrat Katha (संकष्टी चतुर्थी व्रत कथा)";
          category = #vrat;
          deity = "Ganesha";
          hindiText = "गणेश जी की संकष्टी चतुर्थी व्रत कथा बाधाओं के निवारण और सौभाग्य को बढ़ाने के ..." #
          "महत्व के बारे में बताती है।";
          englishText = "";
          tags = ["Vrat", "Sankashti Chaturthi", "Ganesha", "Vrata", "Hindu"];
          createdAt = 10;
          status = #approved;
        },
      ),
      (
        10,
        {
          id = 10;
          title = "Sankashti Chaturthi Vrat Katha (संकष्टी चतुर्थी व्रत कथा)";
          category = #vrat;
          deity = "Ganesha";
          hindiText = "गणेश जी की संकष्टी चतुर्थी व्रत कथा बाधाओं के निवारण और सौभाग्य को बढ़ाने के ..." #
          "महत्व के बारे में बताती है।";
          englishText = "";
          tags = ["Vrat", "Sankashti Chaturthi", "Ganesha", "Vrata", "Hindu"];
          createdAt = 10;
          status = #approved;
        },
      ),
    ].values(),
  );
  var kathaCounter = 11; // Next ID after seeded entries

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
      # "\nकालिय नाग मर्दन...";
    },
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

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
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
};
