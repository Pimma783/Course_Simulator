export declare class User {
    id: string;
    username: string;
    passwordHash: string;
    role: 'student' | 'advisor';
    fullName: string;
    advisor: User;
    advisees: User[];
}
