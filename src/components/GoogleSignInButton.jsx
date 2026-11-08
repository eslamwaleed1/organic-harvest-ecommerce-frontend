
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
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

            const role = String(
                result.data?.role || getStoredUserRole() || "",
            ).trim().toLowerCase();
            if (role !== "admin" && role !== "member") {
                throw new Error("Your account role could not be determined.");
            }

            setUserRole(role);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert(error.message || "Google sign-in failed.");
        }

        function getStoredUserRole() {
            const rawData = Cookies.get("user_data");
            if (!rawData) return "";

            try {
                return JSON.parse(rawData).role;
            } catch (error) {
                console.error("Failed to parse user_data cookie:", error);
                return "";
            }
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
