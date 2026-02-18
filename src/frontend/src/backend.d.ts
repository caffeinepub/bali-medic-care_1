import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AnswerOption {
    text: string;
    feedbackText?: string;
    score: bigint;
}
export interface Timestamp {
    followUp?: TimestampType;
    recorded?: TimestampType;
    submission: TimestampType;
}
export interface PatientSubmission {
    id: bigint;
    additionalInfo?: string;
    patientId?: string;
    initialScore: {
        central: bigint;
        obstructive: bigint;
    };
    clinicId: string;
    demographic: DemographicData;
    feedbackCode?: bigint;
    timestamps: {
        followUp?: Timestamp;
        recorded?: Timestamp;
        submission: Timestamp;
    };
    submissionStatus: SubmissionStatus;
    summary: {
        status: SubmissionStatus;
        score: PatientScore;
    };
    responsesSectionA: Array<QuestionResponse>;
    responsesSectionB: Array<QuestionResponse>;
    notes?: string;
    detailedInfo: DetailedInfo;
}
export type TimestampType = bigint;
export interface DetailedInfo {
    context?: string;
    date?: string;
    time?: string;
}
export interface QuestionResponse {
    feedbackText?: string;
    answer: PatientAnswer;
    scoreType?: string;
}
export interface ClinicConfig {
    title: string;
    customFields: Array<string>;
    sections: Array<Section>;
}
export interface DemographicData {
    age?: bigint;
    unitOfMeasure?: string;
    gender?: string;
    gestationalAge?: bigint;
}
export interface PatientAnswer {
    text: string;
    optionIndex: bigint;
    score: bigint;
}
export interface Professional {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
}
export interface Section {
    heading: string;
    questions: Array<Question>;
}
export interface Question {
    text: string;
    scoreType?: string;
    options: Array<AnswerOption>;
}
export interface PatientScore {
    obstructiveScore?: bigint;
    centralScore?: bigint;
}
export interface UserProfile {
    name: string;
}
export interface ClinicMember {
    id: string;
    contact: string;
    name: string;
    isActive: boolean;
}
export enum SubmissionStatus {
    discarded = "discarded",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateProfessional(id: string, name: string, role: string, isActive: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllClinicConfigs(): Promise<Array<ClinicConfig>>;
    getAllDefaultClinicConfigs(): Promise<Array<[string, ClinicConfig]>>;
    getAllPatientSubmissions(): Promise<Array<PatientSubmission>>;
    getAllProfessionals(): Promise<Array<Professional>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClinicConfig(clinicId: string): Promise<ClinicConfig | null>;
    getClinicMembers(clinicId: string): Promise<Array<ClinicMember>>;
    getDefaultClinicConfig(): Promise<ClinicConfig | null>;
    getFilteredPatientSubmissions(filterType: string): Promise<Array<PatientSubmission>>;
    getPatientSubmission(id: bigint): Promise<PatientSubmission | null>;
    getProfessional(id: string): Promise<Professional | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveClinicConfig(clinicId: string, config: ClinicConfig): Promise<void>;
    submitPatientForm(submission: PatientSubmission): Promise<bigint>;
    updateClinicMembers(clinicId: string, members: Array<ClinicMember>): Promise<void>;
}
