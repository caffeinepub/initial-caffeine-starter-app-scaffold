import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import Iter "mo:core/Iter";
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

  public type Panchang = {
    tithi : Text;
    nakshatra : Text;
    rahuKaal : Text;
    muhurat : Text;
    sunrise : Text;
    sunset : Text;
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
  let tithis = Map.empty<Nat, Text>();
  let muhurats = Map.empty<Nat, Text>();
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

  let kathayen = Map.empty<Nat, Katha>();
  var kathaCounter = 0;

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

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
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

  public shared ({ caller }) func addPanchang(day : Nat, tithi : Text, nakshatra : Text, rahuKaal : Text, muhurat : Text, sunrise : Text, sunset : Text) : async () {
    requireAdmin(caller);
    tithis.add(day, tithi);
    muhurats.add(day, muhurat);
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

  public query func getPanchang(day : Nat) : async {
    tithi : ?Text;
    muhurat : ?Text;
  } {
    { tithi = tithis.get(day); muhurat = muhurats.get(day) };
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
};
