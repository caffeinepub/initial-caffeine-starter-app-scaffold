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


// Triggers the migration on upgrade.

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
    id : Nat;
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

  let kathayen = Map.empty<Nat, Katha>();
  var kathaCounter = 1;

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

  // Admin helpers
  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Approval helpers

  // Any authenticated user (non-guest) can check their own approval status
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  // Only authenticated users (non-guest) can request approval
  public shared ({ caller }) func requestApproval() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  // Only admins can set approval status
  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  // Only admins can list all approvals
  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // User profile - only authenticated users can get/set their own profile
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

  // Only the user themselves or an admin can view a specific user's profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Only authenticated users can view their selected mantra
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

  // Jap counter - only authenticated users
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

  // Only authenticated users can view their own Jap stats
  public query ({ caller }) func getJapStats() : async JapStatsInternal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Jap stats");
    };
    switch (japCounters.get(caller)) {
      case (?stats) { stats };
      case (null) { { daily = 0; weekly = 0; lifetime = 0; lastReset = 0 } };
    };
  };

  // Only authenticated users can reset their own Jap stats
  public shared ({ caller }) func resetJapStats() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset Jap stats");
    };
    japCounters.remove(caller);
  };

  // Leaderboard is public - no auth required
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

  // Admin-only: add a Dharma quote
  public shared ({ caller }) func addDharmaQuote(id : Nat, englishText : Text, hindiText : Text, author : Text) : async () {
    requireAdmin(caller);
    let quote = { id; englishText; hindiText; author };
    dharmaQuotes.add(id, quote);
  };

  // Admin-only: add an Aarti
  public shared ({ caller }) func addAarti(id : Nat, name : Text, hindiText : Text, englishText : Text) : async () {
    requireAdmin(caller);
  };

  // Public queries - no auth required
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

  // Community posts

  // Public: anyone can view approved posts (seed posts visible to all)
  public query func getApprovedCommunityPosts() : async [CommunityPost] {
    let results = List.empty<CommunityPost>();
    for ((_, post) in communityPosts.entries()) {
      if (post.status == #approved) {
        results.add(post);
      };
    };
    results.toArray();
  };

  // Admin-only: view all posts including pending/rejected
  public query ({ caller }) func getAllCommunityPosts() : async [CommunityPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all posts");
    };
    communityPosts.values().toArray();
  };

  // Authenticated users only: create a new community post (starts as pending)
  public shared ({ caller }) func createCommunityPost(content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create posts");
    };
    let postId = nextPostId;
    nextPostId += 1;
    let now = Int.abs(Time.now());
    let post : CommunityPost = {
      id = postId;
      author = caller;
      content;
      timestamp = now;
      likes = 0;
      comments = 0;
      status = #pending;
      reports = 0;
    };
    communityPosts.add(postId, post);
    postId;
  };

  // Authenticated users only: like an approved post
  public shared ({ caller }) func likeCommunityPost(postId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can like posts");
    };
    switch (communityPosts.get(postId)) {
      case (?post) {
        if (post.status != #approved) {
          Runtime.trap("Cannot like a post that is not approved");
        };
        let updated = { post with likes = post.likes + 1 };
        communityPosts.add(postId, updated);
        true;
      };
      case (null) { false };
    };
  };

  // Authenticated users only: report an approved post
  public shared ({ caller }) func reportCommunityPost(postId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can report posts");
    };
    switch (communityPosts.get(postId)) {
      case (?post) {
        if (post.status != #approved) {
          Runtime.trap("Cannot report a post that is not approved");
        };
        let updated = { post with reports = post.reports + 1 };
        communityPosts.add(postId, updated);
        true;
      };
      case (null) { false };
    };
  };

  // Admin-only: approve a community post
  public shared ({ caller }) func approveCommunityPost(postId : Nat) : async Bool {
    requireAdmin(caller);
    switch (communityPosts.get(postId)) {
      case (?post) {
        let updated = { post with status = #approved };
        communityPosts.add(postId, updated);
        true;
      };
      case (null) { false };
    };
  };

  // Admin-only: reject a community post
  public shared ({ caller }) func rejectCommunityPost(postId : Nat) : async Bool {
    requireAdmin(caller);
    switch (communityPosts.get(postId)) {
      case (?post) {
        let updated = { post with status = #rejected };
        communityPosts.add(postId, updated);
        true;
      };
      case (null) { false };
    };
  };

  // Katha management

  // Admin-only: add a new Katha
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

  // Admin-only: approve a Katha
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

  // Public: get a single Katha by id
  public query func getKatha(id : Nat) : async ?Katha {
    kathayen.get(id);
  };

  // Public: list approved Kathas by category
  public query func listKathayenByCategory(category : KathaCategory) : async [Katha] {
    let kathas = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.category == category and katha.status == #approved) {
        kathas.add(katha);
      };
    };

    kathas.toArray();
  };

  // Public: search approved Kathas by title
  public query func searchKathayenByTitle(search : Text) : async [Katha] {
    let results = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.title.contains(#text search) and katha.status == #approved) {
        results.add(katha);
      };
    };

    results.toArray();
  };

  // Public: search approved Kathas by deity
  public query func searchKathayenByDeity(deity : Text) : async [Katha] {
    let results = List.empty<Katha>();

    for ((_, katha) in kathayen.entries()) {
      if (katha.deity.contains(#text deity) and katha.status == #approved) {
        results.add(katha);
      };
    };

    results.toArray();
  };

  // Public: get all approved Kathas
  public query func getAllKathayen() : async [Katha] {
    let allKathaValues = kathayen.values().toArray();
    allKathaValues.filter(
      func(katha) {
        katha.status == #approved;
      }
    );
  };

  // Public: get Krishna Leela story
  public query func getKrishnaLeelaStory() : async KrishnaLeela {
    switch (krishnaLeelaData.get(0)) {
      case (?story) { story };
      case (null) { Runtime.trap("Krishna Leela data not found") };
    };
  };
};

