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
export interface JapStatsInternal {
    lastReset: bigint;
    lifetime: bigint;
    daily: bigint;
    weekly: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface JapStats {
    lifetime: bigint;
    daily: bigint;
    weekly: bigint;
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
    approveKatha(kathaId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllKathayen(): Promise<Array<Katha>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDharmaQuoteOfDay(): Promise<DharmaQuote | null>;
    getFestivals(): Promise<Array<Festival>>;
    getJapLeaderboard(): Promise<Array<JapStats>>;
    getJapStats(): Promise<JapStatsInternal>;
    getKatha(id: bigint): Promise<Katha | null>;
    getKrishnaLeelaStory(): Promise<KrishnaLeela>;
    getUserMantra(): Promise<Mantra>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementJap(count: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listKathayenByCategory(category: KathaCategory): Promise<Array<Katha>>;
    requestApproval(): Promise<void>;
    resetJapStats(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchKathayenByDeity(deity: string): Promise<Array<Katha>>;
    searchKathayenByTitle(search: string): Promise<Array<Katha>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setUserProfile(profile: UserProfile): Promise<void>;
}
