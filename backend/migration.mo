import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

module {
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

  public type OldActor = {
    nextPostId : Nat;
    counter : Nat;
    kathaCounter : Nat;
    vratCounter : Nat;
    bhajanCounter : Nat;
    chalisaCounter : Nat;
    accessControlState : AccessControl.AccessControlState;
    adminInitialized : Bool;
    approvalState : UserApproval.UserApprovalState;
    adminToken : Text;
    userProfiles : Map.Map<Principal, UserProfile>;
    temples : Map.Map<Nat, Temple>;
    communityPosts : Map.Map<Nat, CommunityPost>;
    japCounters : Map.Map<Principal, JapCounter>;
    dharmaQuotes : Map.Map<Nat, DharmaQuote>;
    kathayen : Map.Map<Nat, Katha>;
    vratDates : Map.Map<Nat, Vrat>;
    bhajans : Map.Map<Nat, Bhajan>;
    chalisaEntries : Map.Map<Nat, Chalisa>;
    krishnaLeelaData : Map.Map<Nat, KrishnaLeela>;
  };

  type NewCommunityPostStatus = {
    #approved;
    #rejected;
  };

  type NewCommunityPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : NewCommunityPostStatus;
    reports : Nat;
    deityTag : ?Text;
    image : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    fileAttachment : ?FileAttachment;
  };

  func convertCommunityPost(oldPost : CommunityPost) : NewCommunityPost {
    let newStatus = switch (oldPost.status) {
      case (#pending) { #approved };
      case (#approved) { #approved };
      case (#rejected) { #rejected };
    };
    {
      oldPost with status = newStatus;
    };
  };

  type NewKatha = {
    id : Nat;
    title : Text;
    category : KathaCategory;
    deity : Text;
    hindiText : Text;
    englishText : Text;
    tags : [Text];
    createdAt : Int;
  };

  func convertKatha(oldKatha : Katha) : NewKatha {
    {
      id = oldKatha.id;
      title = oldKatha.title;
      category = oldKatha.category;
      deity = oldKatha.deity;
      hindiText = oldKatha.hindiText;
      englishText = oldKatha.englishText;
      tags = oldKatha.tags;
      createdAt = oldKatha.createdAt;
    };
  };

  type NewActor = {
    nextPostId : Nat;
    counter : Nat;
    kathaCounter : Nat;
    vratCounter : Nat;
    bhajanCounter : Nat;
    chalisaCounter : Nat;
    accessControlState : AccessControl.AccessControlState;
    adminInitialized : Bool;
    approvalState : UserApproval.UserApprovalState;
    adminToken : Text;
    userProfiles : Map.Map<Principal, UserProfile>;
    temples : Map.Map<Nat, Temple>;
    communityPosts : Map.Map<Nat, NewCommunityPost>;
    japCounters : Map.Map<Principal, JapCounter>;
    dharmaQuotes : Map.Map<Nat, DharmaQuote>;
    kathayen : Map.Map<Nat, NewKatha>;
    vratDates : Map.Map<Nat, Vrat>;
    bhajans : Map.Map<Nat, Bhajan>;
    chalisaEntries : Map.Map<Nat, Chalisa>;
    krishnaLeelaData : Map.Map<Nat, KrishnaLeela>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      communityPosts = old.communityPosts.map<Nat, CommunityPost, NewCommunityPost>(func(_id, post) { convertCommunityPost(post) });
      kathayen = old.kathayen.map<Nat, Katha, NewKatha>(func(_id, katha) { convertKatha(katha) });
    };
  };
};
