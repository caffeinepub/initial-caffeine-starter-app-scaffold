import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  // The old post type may have had only #approved | #rejected status variants,
  // or may have included an isPublic field. We normalise everything on upgrade:
  // existing approved posts stay approved; everything else becomes pending.
  type OldCommunityPostStatus = {
    #approved;
    #rejected;
  };

  type OldCommunityPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Nat;
    likes : Nat;
    comments : Nat;
    status : OldCommunityPostStatus;
    reports : Nat;
    deityTag : ?Text;
    image : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    fileAttachment : ?{
      blob : Storage.ExternalBlob;
      filename : Text;
    };
  };

  type NewCommunityPostStatus = {
    #pending;
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
    fileAttachment : ?{
      blob : Storage.ExternalBlob;
      filename : Text;
    };
  };

  type OldActor = {
    communityPosts : Map.Map<Nat, OldCommunityPost>;
  };

  type NewActor = {
    communityPosts : Map.Map<Nat, NewCommunityPost>;
  };

  public func run(old : OldActor) : NewActor {
    let newCommunityPosts = old.communityPosts.map<Nat, OldCommunityPost, NewCommunityPost>(
      func(_id, post) {
        let newStatus : NewCommunityPostStatus = switch (post.status) {
          case (#approved) { #approved };
          // All non-approved legacy posts become 'pending'
          case (#rejected) { #pending };
        };
        {
          id = post.id;
          author = post.author;
          content = post.content;
          timestamp = post.timestamp;
          likes = post.likes;
          comments = post.comments;
          status = newStatus;
          reports = post.reports;
          deityTag = post.deityTag;
          image = post.image;
          video = post.video;
          fileAttachment = post.fileAttachment;
        };
      }
    );
    { communityPosts = newCommunityPosts };
  };
};
