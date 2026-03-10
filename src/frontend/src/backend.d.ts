import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    selectedMantra: Mantra;
    name: string;
}
export interface Katha {
    id: bigint;
    title: string;
    createdAt: bigint;
    tags: Array<string>;
    audioBlob?: ExternalBlob;
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
export interface Bhajan {
    id: bigint;
    title: string;
    lyrics: string;
    language: Variant_hindi_english;
}
export interface CommunityPost {
    id: bigint;
    status: CommunityPostStatus;
    content: string;
    video?: ExternalBlob;
    author: Principal;
    likes: bigint;
    fileAttachment?: FileAttachment;
    timestamp: bigint;
    reports: bigint;
    image?: ExternalBlob;
    comments: bigint;
    deityTag?: string;
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
export interface FileAttachment {
    blob: ExternalBlob;
    filename: string;
}
export interface Chalisa {
    id: bigint;
    title: string;
    meaning: string;
    fullText: string;
}
export interface KrishnaLeela {
    id: bigint;
    hindiText: string;
}
export interface Vrat {
    id: bigint;
    date: string;
    name: string;
    description: string;
}
export enum CommunityPostStatus {
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
export enum Variant_hindi_english {
    hindi = "hindi",
    english = "english"
}
export interface backendInterface {
    addBhajan(title: string, lyrics: string, language: Variant_hindi_english): Promise<bigint>;
    addChalisa(title: string, fullText: string, meaning: string): Promise<bigint>;
    addDharmaQuote(id: bigint, englishText: string, hindiText: string, author: string): Promise<void>;
    addKatha(title: string, category: KathaCategory, deity: string, hindiText: string, englishText: string, tags: Array<string>, audioBlob: ExternalBlob | null, adminToken: string): Promise<bigint>;
    addVrat(name: string, date: string, description: string): Promise<bigint>;
    approveCommunityPost(postId: bigint, adminToken: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCommunityPost(content: string, deityTag: string | null, image: ExternalBlob | null, video: ExternalBlob | null, fileAttachment: FileAttachment | null): Promise<bigint>;
    deleteBhajan(id: bigint): Promise<boolean>;
    deleteChalisa(id: bigint): Promise<boolean>;
    deleteCommunityPost(postId: bigint, adminToken: string): Promise<boolean>;
    deleteDharmaQuote(id: bigint): Promise<boolean>;
    deleteKatha(id: bigint, adminToken: string): Promise<boolean>;
    deleteVrat(id: bigint): Promise<boolean>;
    getAllBhajans(): Promise<Array<Bhajan>>;
    getAllChalisa(): Promise<Array<Chalisa>>;
    getAllCommunityPosts(): Promise<Array<CommunityPost>>;
    getAllKathayen(): Promise<Array<Katha>>;
    getAllVrats(): Promise<Array<Vrat>>;
    getBhajan(id: bigint): Promise<Bhajan | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChalisa(id: bigint): Promise<Chalisa | null>;
    getCommunityPosts(): Promise<Array<CommunityPost>>;
    getDharmaQuoteOfDay(): Promise<DharmaQuote | null>;
    getFestivals(): Promise<Array<Festival>>;
    getJapLeaderboard(): Promise<Array<JapCounter>>;
    getJapStats(): Promise<JapCounter>;
    getKatha(id: bigint): Promise<Katha | null>;
    getKathayen(): Promise<Array<Katha>>;
    getKrishnaLeelaStory(): Promise<KrishnaLeela>;
    getPendingCommunityPosts(): Promise<Array<CommunityPost>>;
    getUserMantra(): Promise<Mantra>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementJap(count: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    likeCommunityPost(postId: bigint): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listKathayenByCategory(category: KathaCategory): Promise<Array<Katha>>;
    rejectCommunityPost(postId: bigint, adminToken: string): Promise<boolean>;
    reportCommunityPost(postId: bigint): Promise<boolean>;
    requestApproval(): Promise<void>;
    resetJapStats(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchKathayenByDeity(deity: string): Promise<Array<Katha>>;
    searchKathayenByTitle(search: string): Promise<Array<Katha>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateBhajan(id: bigint, title: string, lyrics: string, language: Variant_hindi_english): Promise<boolean>;
    updateChalisa(id: bigint, title: string, fullText: string, meaning: string): Promise<boolean>;
    updateDharmaQuote(id: bigint, englishText: string, hindiText: string, author: string): Promise<boolean>;
    updateKatha(id: bigint, title: string, category: KathaCategory, deity: string, hindiText: string, englishText: string, tags: Array<string>, audioBlob: ExternalBlob | null, adminToken: string): Promise<boolean>;
    updateVrat(id: bigint, name: string, date: string, description: string): Promise<boolean>;
}
