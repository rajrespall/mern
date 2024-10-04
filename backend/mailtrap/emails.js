import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender, 
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log("Email sent successfully: ", response); 
    } catch (error) {
        console.error("Error sending verification email: ", error);
        throw new Error("Error sending verification email: ", error);
    }

}

export const SendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender, 
            to: recipient,
            template_uuid: "3cd0cb6e-050b-4659-a9e0-63e0b123d15b",
            template_variables: {
                "company_info_name": "miaw miaw miaw miaw",
                "name": name
              },
        });
        console.log("Welcome Email sent successfully: ", response); 
    } catch (error) {
        console.error("Error sending welcome email: ", error);
        throw new Error("Error sending welcome email: ", error);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender, 
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
    } catch (error) {
        console.error("Error sending password reset email: ", error);
        throw new Error("Error sending password reset email: ", error);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender, 
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        })

        console.log("Password reset email sent successfully: ", response);
    } catch (error) {
        console.error("Error sending password reset email: ", error);
        throw new Error("Error sending password reset email: ", error);
    }
}