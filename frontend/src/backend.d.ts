import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Katha {
    id: bigint;
    status: KathaApprovalStatus;
    title: string;
    createdAt: bigint;
    tags: Array<string>;
    englishText: string;
    category: KathaCategory;
    hindiText: string;
    deity: string;
}
export interface DharmaQuote {
    id: bigint;
    author: string;
    englishText: string;
    hindiText: string;
}
export interface Festival {
    date: string;
    name: string;
    description: string;
}
export interface CommunityPost {
    id: bigint;
    status: KathaApprovalStatus;
    content: string;
    author: Principal;
    likes: bigint;
    timestamp: bigint;
    reports: bigint;
    comments: bigint;
}
export interface JapCounter {
    streak: bigint;
    lastReset: bigint;
    mala: bigint;
    lastActiveDate: bigint;
    lifetime: bigint;
    tempCount: bigint;
    daily: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface KrishnaLeela {
    id: bigint;
    hindiText: string;
}
export interface UserProfile {
    selectedMantra: Mantra;
    name: string;
}
export enum KathaApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum KathaCategory {
    vrat = "vrat",
    puranik = "puranik"
}
export enum Mantra {
    saiRam = "saiRam",
    hareKrishna = "hareKrishna",
    mahamrityunjayaMantra = "mahamrityunjayaMantra",
    omMantra = "omMantra",
    jaiShreeRamNamJap = "jaiShreeRamNamJap",
    sitaram = "sitaram",
    gayatriMantra = "gayatriMantra",
    omNamahShivaya = "omNamahShivaya",
    radhaNamJap = "radhaNamJap"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAarti(id: bigint, name: string, hindiText: string, englishText: string): Promise<void>;
    addDharmaQuote(id: bigint, englishText: string, hindiText: string, author: string): Promise<void>;
    addKatha(title: string, category: KathaCategory, deity: string, hindiText: string, englishText: string, tags: Array<string>): Promise<bigint>;
    approveCommunityPost(postId: bigint): Promise<boolean>;
    approveKatha(kathaId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCommunityPost(content: string): Promise<bigint>;
    getAllCommunityPosts(): Promise<Array<CommunityPost>>;
    getAllKathayen(): Promise<Array<Katha>>;
    getApprovedCommunityPosts(): Promise<Array<CommunityPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDharmaQuoteOfDay(): Promise<DharmaQuote | null>;
    getFestivals(): Promise<Array<Festival>>;
    getJapLeaderboard(): Promise<Array<JapCounter>>;
    getJapStats(): Promise<JapCounter>;
    getKatha(id: bigint): Promise<Katha | null>;
    getKrishnaLeelaStory(): Promise<KrishnaLeela>;
    getUserMantra(): Promise<Mantra>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementJap(count: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    likeCommunityPost(postId: bigint): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listKathayenByCategory(category: KathaCategory): Promise<Array<Katha>>;
    rejectCommunityPost(postId: bigint): Promise<boolean>;
    reportCommunityPost(postId: bigint): Promise<boolean>;
    requestApproval(): Promise<void>;
    resetJapStats(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchKathayenByDeity(deity: string): Promise<Array<Katha>>;
    searchKathayenByTitle(search: string): Promise<Array<Katha>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setUserProfile(profile: UserProfile): Promise<void>;
}
