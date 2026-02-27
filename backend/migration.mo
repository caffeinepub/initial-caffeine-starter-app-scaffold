import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

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

  // Old actor type
  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    temples : Map.Map<Nat, Temple>;
    communityPosts : Map.Map<Nat, CommunityPost>;
    japCounters : Map.Map<Principal, JapStatsInternal>;
    dharmaQuotes : Map.Map<Nat, DharmaQuote>;
    kathaCounter : Nat;
    kathayen : Map.Map<Nat, Katha>;
    krishnaLeelaData : Map.Map<Nat, KrishnaLeela>;
    nextPostId : Nat;
    counter : Nat;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    temples : Map.Map<Nat, Temple>;
    communityPosts : Map.Map<Nat, CommunityPost>;
    japCounters : Map.Map<Principal, JapStatsInternal>;
    dharmaQuotes : Map.Map<Nat, DharmaQuote>;
    kathaCounter : Nat;
    kathayen : Map.Map<Nat, Katha>;
    krishnaLeelaData : Map.Map<Nat, KrishnaLeela>;
    nextPostId : Nat;
    counter : Nat;
  };

  func getUpdatedKathayen(oldKathayen : Map.Map<Nat, Katha>) : Map.Map<Nat, Katha> {
    if (oldKathayen.size() > 1) {
      let kathaArray = oldKathayen.toArray();
      let oldRamayan = kathaArray[0];
      Map.fromIter<Nat, Katha>(
        [
          oldRamayan,
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
        ].values()
      );
    } else {
      oldKathayen;
    };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      kathayen = getUpdatedKathayen(old.kathayen);
      kathaCounter = 11;
    };
  };
};
