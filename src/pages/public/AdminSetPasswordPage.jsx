import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../lib/api.js";
import { AuthLayout } from "../../components/SiteChrome.jsx";
import styles from "../../styles/AuthForms.module.css";

export default function AdminSetPasswordPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const isPasswordReset = searchParams.has("token") && searchParams.has("email");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		if (password.length < 8) {
			setError("Your password must be at least 8 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("The passwords do not match.");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				email: searchParams.get("email"),
				token: searchParams.get("token"),
				password,
			};
			if (isPasswordReset) await authApi.resetPassword(payload);
			else await authApi.setAdminPassword(payload);
			navigate("/login");
		} catch (requestError) {
			setError(requestError.message || "We couldn't create your password.");
		} finally {
			setSaving(false);
		}
	}

	return (
	<AuthLayout eyebrow={isPasswordReset ? "Password reset" : "Admin invitation"} heading={isPasswordReset ? "A fresh start for your account." : "A new chapter for the farm."} description={isPasswordReset ? "Choose a new password to get back to your Organic Harvest account." : "Set your password to finish creating your Organic Harvest administrator account."}>
		<p className="eyebrow">{isPasswordReset ? "Choose a new password" : "Create your password"}</p>
		<h2>{isPasswordReset ? "Welcome back to the farm." : "Welcome to the farm office."}</h2>
		<p className={styles.formIntro}>Use at least 8 characters.</p>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<label htmlFor="admin-password">Password</label>
				<input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
				<label htmlFor="admin-password-confirm">Confirm password</label>
				<input id="admin-password-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
				{error && <p className="form-error" role="alert">{error}</p>}
				<button className="button button--primary button--wide" disabled={saving} type="submit">{saving ? "Saving password..." : <>{isPasswordReset ? "Change my password" : "Finish setup"} <ArrowRight size={16} /></>}</button>
			</form>
			<p className={styles.authSwitch}><Link to="/login">Return to login</Link></p>
		</AuthLayout>
	);
}
