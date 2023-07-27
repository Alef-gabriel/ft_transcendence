export interface SessionUser {
    id: number;
    username: string;
    displayName: string;
    profileUrl: string;
    email: string;
    otpEnabled?: boolean;
    otpValidated?: boolean;
    otpSecret?: string;
}