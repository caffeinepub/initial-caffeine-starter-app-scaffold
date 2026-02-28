import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldCommunityPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : { #pending; #approved; #rejected };
    reports : Nat;
    deityTag : ?Text;
  };

  type OldActor = {
    communityPosts : Map.Map<Nat, OldCommunityPost>;
    nextPostId : Nat;
  };

  type NewCommunityPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : { #pending; #approved; #rejected };
    reports : Nat;
    deityTag : ?Text;
    image : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    fileAttachment : ?{ blob : Storage.ExternalBlob; filename : Text };
  };

  type NewActor = {
    communityPosts : Map.Map<Nat, NewCommunityPost>;
    nextPostId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newCommunityPosts = old.communityPosts.map<Nat, OldCommunityPost, NewCommunityPost>(
      func(_id, oldPost) {
        {
          oldPost with
          image = null;
          video = null;
          fileAttachment = null;
        };
      }
    );
    {
      old with
      communityPosts = newCommunityPosts;
    };
  };
};
