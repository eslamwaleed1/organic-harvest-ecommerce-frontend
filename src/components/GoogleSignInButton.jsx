
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../lib/api.js";

export default function GoogleSignInButton({ setIsLoggedIn, setUserRole }) {
    async function handleSuccess(googleResponse) {
        try {
            if (!googleResponse.credential) {
                throw new Error("Google did not return a credential.");
            }

            const result = await authApi.google({
                credential: googleResponse.credential,
            });

            if (!result?.success) {
                throw new Error(
                    result?.message || "Google sign-in failed."
                );
            }

            const role = String(result.data?.role ?? "").trim().toLowerCase();
            if (role !== "admin" && role !== "member") {
                throw new Error("Your account role could not be determined.");
            }

            setUserRole(role);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert(error.message || "Google sign-in failed.");
        }

    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.error("Google sign-in was unsuccessful.");
            }}
        />
    );
}
