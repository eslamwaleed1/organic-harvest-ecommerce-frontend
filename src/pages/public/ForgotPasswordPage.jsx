import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../lib/api.js";
import { AuthLayout } from "../../components/SiteChrome.jsx";
import styles from "../../styles/AuthForms.module.css";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [sending, setSending] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setMessage("");
		setSending(true);
		try {
			const result = await authApi.forgotPassword({ email });
			setMessage(result.message);
		} catch (requestError) {
			setError(requestError.message || "We couldn't send the password reset email.");
		} finally {
			setSending(false);
		}
	}

	return (
		<AuthLayout eyebrow="Password help" heading="Let’s find your way back." description="Enter your account email and we’ll send a secure link to choose a new password.">
			<p className="eyebrow">Forgot your password?</p>
			<h2>Check your inbox.</h2>
			<p className={styles.formIntro}>For administrators, the link is sent to your secondary email.</p>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<label htmlFor="forgot-email">Email address</label>
				<input id="forgot-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
				{error && <p className="form-error" role="alert">{error}</p>}
				{message && <p className="form-success" role="status">{message}</p>}
				<button className="button button--primary button--wide" disabled={sending} type="submit">
					{sending ? "Sending email..." : "Send password reset link"}
				</button>
			</form>
			<p className={styles.authSwitch}><Link to="/login">Return to login</Link></p>
		</AuthLayout>
	);
}
