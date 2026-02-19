import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type AnswerOption = {
    text : Text;
    score : Int;
    feedbackText : ?Text;
  };

  type Question = {
    text : Text;
    scoreType : ?Text;
    options : [AnswerOption];
  };

  type Section = {
    heading : Text;
    questions : [Question];
  };

  type ClinicConfig = {
    title : Text;
    customFields : [Text];
    sections : [Section];
  };

  let clinicConfigs = Map.empty<Text, ClinicConfig>();
  let DEFAULT_CLINIC_ID = "apsp";

  type PatientAnswer = {
    optionIndex : Nat;
    text : Text;
    score : Int;
  };

  type QuestionResponse = {
    scoreType : ?Text;
    answer : PatientAnswer;
    feedbackText : ?Text;
  };

  type DemographicData = {
    age : ?Nat;
    unitOfMeasure : ?Text;
    gestationalAge : ?Int;
    gender : ?Text;
  };

  module PatientSubmission {
    public type TimestampType = Int;

    public type Timestamp = {
      submission : TimestampType;
      recorded : ?TimestampType;
      followUp : ?TimestampType;
    };

    public type PatientScore = {
      obstructiveScore : ?Int;
      centralScore : ?Int;
    };

    public type DetailedInfo = {
      date : ?Text;
      time : ?Text;
      context : ?Text;
    };

    public type PersonalInfo = {
      fullName : Text;
      country : Text;
      roomNumber : Text;
      whatsappNumber : Text;
      medicalConditions : Text;
      symptoms : Text;
    };

    public type SubmissionStatus = {
      #inProgress;
      #completed;
      #discarded;
    };

    public type Submission = {
      id : Nat;
      clinicId : Text;
      patientId : ?Text;
      demographic : DemographicData;
      personalInfo : PersonalInfo;
      submissionStatus : SubmissionStatus;
      initialScore : {
        obstructive : Int;
        central : Int;
      };
      responsesSectionA : [QuestionResponse];
      responsesSectionB : [QuestionResponse];
      feedbackCode : ?Int;
      timestamps : {
        submission : Timestamp;
        recorded : ?Timestamp;
        followUp : ?Timestamp;
      };
      detailedInfo : DetailedInfo;
      summary : {
        score : PatientScore;
        status : SubmissionStatus;
      };
      notes : ?Text;
      additionalInfo : ?Text;
    };
  };

  public type PatientSubmission = PatientSubmission.Submission;
  public type PersonalInfo = PatientSubmission.PersonalInfo;

  let patientSubmissions = Map.empty<Nat, PatientSubmission>();
  var lastSubmissionId = 0;

  type Professional = {
    name : Text;
    id : Text;
    role : Text;
    isActive : Bool;
  };

  let professionals = Map.empty<Text, Professional>();

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type ClinicMember = {
    id : Text;
    name : Text;
    contact : Text;
    isActive : Bool;
  };

  let clinics = Map.empty<Text, [ClinicMember]>();

  public shared ({ caller }) func addOrUpdateProfessional(id : Text, name : Text, role : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let professional = {
      id;
      name;
      role;
      isActive;
    };
    professionals.add(id, professional);
  };

  public query ({ caller }) func getProfessional(id : Text) : async ?Professional {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    professionals.get(id);
  };

  public query ({ caller }) func getAllProfessionals() : async [Professional] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    professionals.values().toArray();
  };

  public shared ({ caller }) func updateClinicMembers(clinicId : Text, members : [ClinicMember]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    clinics.add(clinicId, members);
  };

  public query ({ caller }) func getClinicMembers(clinicId : Text) : async [ClinicMember] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (clinics.get(clinicId)) {
      case (?members) { members };
      case (null) { [] : [ClinicMember] };
    };
  };

  public shared ({ caller }) func saveClinicConfig(clinicId : Text, config : ClinicConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    clinicConfigs.add(clinicId, config);
  };

  public query ({ caller }) func getClinicConfig(clinicId : Text) : async ?ClinicConfig {
    // Public access - needed for patient registration form
    clinicConfigs.get(clinicId);
  };

  public query ({ caller }) func getAllClinicConfigs() : async [ClinicConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    clinicConfigs.values().toArray();
  };

  public query ({ caller }) func getDefaultClinicConfig() : async ?ClinicConfig {
    // Public access - needed for patient registration form
    clinicConfigs.get(DEFAULT_CLINIC_ID);
  };

  public query ({ caller }) func getAllDefaultClinicConfigs() : async [(Text, ClinicConfig)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let filtered = clinicConfigs.filter(func(id, _) { id == DEFAULT_CLINIC_ID });
    filtered.entries().toArray();
  };

  public shared ({ caller }) func submitPatientForm(submission : PatientSubmission) : async Nat {
    // Public access - patient registration form is accessible to everyone (guests)
    // No authorization check needed per implementation plan

    lastSubmissionId += 1;
    let submissionWithServerAssignedId = {
      submission with id = lastSubmissionId;
    };

    patientSubmissions.add(lastSubmissionId, submissionWithServerAssignedId);
    lastSubmissionId;
  };

  public shared ({ caller }) func updatePatientSubmission(submissionId : Nat, updatedSubmission : PatientSubmission) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical team users can update patient submissions");
    };
    switch (patientSubmissions.get(submissionId)) {
      case (?existingSubmission) {
        // Ensure the ID matches to prevent ID tampering
        if (updatedSubmission.id != submissionId) {
          Runtime.trap("Submission ID mismatch");
        };
        patientSubmissions.add(submissionId, updatedSubmission);
      };
      case (null) {
        Runtime.trap("Submission not found");
      };
    };
  };

  public shared ({ caller }) func updatePatientPersonalInfo(submissionId : Nat, personalInfo : PersonalInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical team users can update patient info");
    };
    switch (patientSubmissions.get(submissionId)) {
      case (?existingSubmission) {
        let updatedSubmission = {
          existingSubmission with personalInfo
        };
        patientSubmissions.add(submissionId, updatedSubmission);
      };
      case (null) {
        Runtime.trap("Submission not found");
      };
    };
  };

  public query ({ caller }) func getPatientSubmission(id : Nat) : async ?PatientSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical team users can view patient submissions");
    };
    patientSubmissions.get(id);
  };

  public query ({ caller }) func getAllPatientSubmissions() : async [PatientSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical team users can view patient submissions");
    };
    patientSubmissions.values().toArray();
  };

  public query ({ caller }) func getFilteredPatientSubmissions(filterType : Text) : async [PatientSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated medical team users can view patient submissions");
    };
    switch (filterType) {
      case (_) {
        patientSubmissions.values().toArray();
      };
    };
  };
};
