export declare class MailService {
    options: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
    };
    constructor(options: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
    });
    sendMail(options: {
        from?: string;
        to: string;
        subject: string;
        message: string;
    }): Promise<void>;
    template: (options: {
        type: "forgotPassword" | "signUpOrg" | "signUp";
        link: string;
        email: string;
    }) => string;
}
