import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  // Old Katha type without `audioBlob`
  type OldKatha = {
    id : Nat;
    title : Text;
    category : {
      #puranik;
      #vrat;
    };
    deity : Text;
    hindiText : Text;
    englishText : Text;
    tags : [Text];
    createdAt : Int;
  };

  // Old actor type
  type OldActor = {
    kathayen : Map.Map<Nat, OldKatha>;
  };

  // New Katha type with `audioBlob`
  type NewKatha = {
    id : Nat;
    title : Text;
    category : {
      #puranik;
      #vrat;
    };
    deity : Text;
    hindiText : Text;
    englishText : Text;
    tags : [Text];
    createdAt : Int;
    audioBlob : ?Storage.ExternalBlob;
  };

  // New actor type with updated Katha definition
  type NewActor = {
    kathayen : Map.Map<Nat, NewKatha>;
  };

  // Migration function transforms `OldActor` to `NewActor`
  public func run(old : OldActor) : NewActor {
    let newKathayen = old.kathayen.map<Nat, OldKatha, NewKatha>(
      func(_id, oldKatha) {
        {
          oldKatha with
          audioBlob = null;
        };
      }
    );
    { kathayen = newKathayen };
  };
};
