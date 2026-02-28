import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Int "mo:core/Int";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
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

  var adminInitialized : Bool = false;
  let adminToken = "vdHHsU40C6W3rU2dA4Ncu";

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

  public type CommunityPostStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type FileAttachment = {
    blob : Storage.ExternalBlob;
    filename : Text;
  };

  public type CommunityPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : CommunityPostStatus;
    reports : Nat;
    deityTag : ?Text;
    image : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    fileAttachment : ?FileAttachment;
  };

  public type UserProfile = {
    name : Text;
    selectedMantra : Mantra;
  };

  public type JapCounter = {
    daily : Nat;
    lifetime : Nat;
    mala : Nat;
    lastReset : Int;
    tempCount : Nat;
    streak : Nat;
    lastActiveDate : Int;
  };

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

  public type KrishnaLeela = {
    id : Nat;
    hindiText : Text;
  };

  public type Vrat = {
    id : Nat;
    name : Text;
    date : Text;
    description : Text;
  };

  public type Bhajan = {
    id : Nat;
    title : Text;
    lyrics : Text;
    language : { #hindi; #english };
  };

  public type Chalisa = {
    id : Nat;
    title : Text;
    fullText : Text;
    meaning : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let temples = Map.empty<Nat, Temple>();
  let communityPosts = Map.empty<Nat, CommunityPost>();
  let japCounters = Map.empty<Principal, JapCounter>();
  let dharmaQuotes = Map.empty<Nat, DharmaQuote>();
  let kathayen = Map.empty<Nat, Katha>();
  let vratDates = Map.empty<Nat, Vrat>();
  let bhajans = Map.empty<Nat, Bhajan>();
  let chalisaEntries = Map.empty<Nat, Chalisa>();
  var nextPostId = 0;
  var counter = 0;
  var kathaCounter = 1;
  var vratCounter = 0;
  var bhajanCounter = 0;
  var chalisaCounter = 0;

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

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func assignFirstUserAdmin(caller : Principal, userProvidedToken : Text) {
    if (not adminInitialized and not caller.isAnonymous()) {
      AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
      adminInitialized := true;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile, userProvidedToken : Text) : async () {
    assignFirstUserAdmin(caller, userProvidedToken);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func setUserProfile(profile : UserProfile, userProvidedToken : Text) : async () {
    assignFirstUserAdmin(caller, userProvidedToken);
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
            lifetime = stats.lifetime + count : Nat;
          };
        } else {
          {
            stats with
            daily = stats.daily + count : Nat;
            lifetime = stats.lifetime + count : Nat;
          };
        };
      };
      case (null) {
        { daily = count; lifetime = count; mala = 0; lastReset = now; tempCount = 0; streak = 0; lastActiveDate = 0 };
      };
    };
    japCounters.add(caller, currentStatsInternal);
  };

  public query ({ caller }) func getJapStats() : async JapCounter {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Jap stats");
    };
    switch (japCounters.get(caller)) {
      case (?stats) { stats };
      case (null) { { daily = 0; lifetime = 0; mala = 0; lastReset = 0; tempCount = 0; streak = 0; lastActiveDate = 0 } };
    };
  };

  public shared ({ caller }) func resetJapStats() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset Jap stats");
    };
    japCounters.remove(caller);
  };

  public query func getJapLeaderboard() : async [JapCounter] {
    let entries = japCounters.toArray().map(
      func((principal, statsInternal)) {
        statsInternal;
      }
    );

    entries.sort(
      func(a, b) {
        Nat.compare(b.lifetime, a.lifetime);
      }
    ).sliceToArray(0, Nat.min(entries.size(), 10 : Nat));
  };

  public shared ({ caller }) func addDharmaQuote(id : Nat, englishText : Text, hindiText : Text, author : Text) : async () {
    requireAdmin(caller);
    let quote = { id; englishText; hindiText; author };
    dharmaQuotes.add(id, quote);
  };

  public shared ({ caller }) func updateDharmaQuote(id : Nat, englishText : Text, hindiText : Text, author : Text) : async Bool {
    requireAdmin(caller);
    switch (dharmaQuotes.get(id)) {
      case (?quote) {
        let updated = { id; englishText; hindiText; author };
        dharmaQuotes.add(id, updated);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteDharmaQuote(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (dharmaQuotes.get(id)) {
      case (?quote) {
        dharmaQuotes.remove(id);
        true;
      };
      case (null) { false };
    };
  };

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

  public query func getAllVrats() : async [Vrat] {
    vratDates.values().toArray();
  };

  public shared ({ caller }) func addVrat(name : Text, date : Text, description : Text) : async Nat {
    requireAdmin(caller);

    let vrat : Vrat = {
      id = vratCounter;
      name;
      date;
      description;
    };

    vratDates.add(vratCounter, vrat);
    vratCounter += 1;
    vrat.id;
  };

  public shared ({ caller }) func updateVrat(id : Nat, name : Text, date : Text, description : Text) : async Bool {
    requireAdmin(caller);
    switch (vratDates.get(id)) {
      case (?vrat) {
        let updated = {
          id;
          name;
          date;
          description;
        };
        vratDates.add(id, updated);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteVrat(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (vratDates.get(id)) {
      case (?vrat) {
        vratDates.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  public query func getApprovedCommunityPosts() : async [CommunityPost] {
    let results = List.empty<CommunityPost>();
    for ((_, post) in communityPosts.entries()) {
      if (post.status == #approved) {
        results.add(post);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getAllCommunityPosts() : async [CommunityPost] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all posts");
    };
    communityPosts.values().toArray();
  };

  public shared ({ caller }) func createCommunityPost(
    content : Text,
    deityTag : ?Text,
    image : ?Storage.ExternalBlob,
    video : ?Storage.ExternalBlob,
    fileAttachment : ?FileAttachment,
  ) : async Nat {
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
      deityTag;
      image;
      video;
      fileAttachment;
    };
    communityPosts.add(postId, post);
    postId;
  };

  public shared ({ caller }) func likeCommunityPost(postId : Nat) : async Bool {
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

  public shared ({ caller }) func reportCommunityPost(postId : Nat) : async Bool {
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

  public shared ({ caller }) func deleteCommunityPost(postId : Nat) : async Bool {
    requireAdmin(caller);
    switch (communityPosts.get(postId)) {
      case (?post) {
        communityPosts.remove(postId);
        true;
      };
      case (null) { false };
    };
  };

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

  public query func getKrishnaLeelaStory() : async KrishnaLeela {
    switch (krishnaLeelaData.get(0)) {
      case (?story) { story };
      case (null) { Runtime.trap("Krishna Leela data not found") };
    };
  };

  public query func getAllBhajans() : async [Bhajan] {
    bhajans.values().toArray();
  };

  public query func getBhajan(id : Nat) : async ?Bhajan {
    bhajans.get(id);
  };

  public shared ({ caller }) func addBhajan(title : Text, lyrics : Text, language : { #hindi; #english }) : async Nat {
    requireAdmin(caller);

    let bhajan : Bhajan = {
      id = bhajanCounter;
      title;
      lyrics;
      language;
    };

    bhajans.add(bhajanCounter, bhajan);
    bhajanCounter += 1;
    bhajan.id;
  };

  public shared ({ caller }) func updateBhajan(id : Nat, title : Text, lyrics : Text, language : { #hindi; #english }) : async Bool {
    requireAdmin(caller);
    switch (bhajans.get(id)) {
      case (?bhajan) {
        let updated = {
          id;
          title;
          lyrics;
          language;
        };
        bhajans.add(id, updated);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteBhajan(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (bhajans.get(id)) {
      case (?bhajan) {
        bhajans.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  public query func getAllChalisa() : async [Chalisa] {
    chalisaEntries.values().toArray();
  };

  public query func getChalisa(id : Nat) : async ?Chalisa {
    chalisaEntries.get(id);
  };

  public shared ({ caller }) func addChalisa(title : Text, fullText : Text, meaning : Text) : async Nat {
    requireAdmin(caller);

    let chalisa : Chalisa = {
      id = chalisaCounter;
      title;
      fullText;
      meaning;
    };

    chalisaEntries.add(chalisaCounter, chalisa);
    chalisaCounter += 1;
    chalisa.id;
  };

  public shared ({ caller }) func updateChalisa(id : Nat, title : Text, fullText : Text, meaning : Text) : async Bool {
    requireAdmin(caller);
    switch (chalisaEntries.get(id)) {
      case (?chalisa) {
        let updated = {
          id;
          title;
          fullText;
          meaning;
        };
        chalisaEntries.add(id, updated);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteChalisa(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (chalisaEntries.get(id)) {
      case (?chalisa) {
        chalisaEntries.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.isAdmin(accessControlState, caller) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };
};
