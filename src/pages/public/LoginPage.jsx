import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../lib/api.js";
import { ArrowRight } from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton.jsx";
import { AuthLayout } from "../../components/SiteChrome.jsx";
import styles from "../../styles/AuthForms.module.css";

export default function LoginPage({ setIsLoggedIn, setUserRole }) {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setErrorMessage("");
		setIsSubmitting(true);
		try {
			const formData = new FormData(event.currentTarget);
			const result = await authApi.login({
				email: formData.get("email"),
				password: formData.get("password"),
			});
			if (result?.code === "EMAIL_NOT_VERIFIED") {
				navigate("/check-email");
				return;
			}
			if (!result?.success) {
				throw new Error(result?.message || "We couldn't sign you in.");
			}

			const role = String(result.data?.role ?? "").trim().toLowerCase();
			if (role !== "admin" && role !== "member") {
				throw new Error("Your account role could not be determined.");
			}

			setUserRole(role);
			setIsLoggedIn(true);
			navigate(role === "admin" ? "/admin/home" : "/member/home");
		} catch (error) {
			console.error(error);
			setErrorMessage(error.message || "We couldn't sign you in. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthLayout
			eyebrow="Welcome back"
			heading="There’s always room at our table."
			description="Log in to keep up with what’s growing, and stay close to the little farm you love."
		>
			<p className="eyebrow">Your farm account</p>
			<h2>Come on in.</h2>
			<p className={styles.formIntro}>Use your email and password to pick up where you left off.</p>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<label htmlFor="login-email">Email address</label>
				<input
					autoComplete="email"
					id="login-email"
					name="email"
					placeholder="you@example.com"
					required
					type="email"
				/>
				<label htmlFor="login-password">Password</label>
				<input
					autoComplete="current-password"
					id="login-password"
					name="password"
					placeholder="Enter your password"
					required
					type="password"
				/>
				{errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
				<button className="button button--primary button--wide" disabled={isSubmitting} type="submit">
					{isSubmitting ? "Opening the gate..." : <>Log in to your account <ArrowRight size={16} /></>}
				</button>
			</form>
			<p className={styles.authSwitch}><Link to="/forgot-password">Forgot your password?</Link></p>
			<div className={styles.authDivider}><span>or</span></div>
			<div className={styles.googleSignin}>
				<GoogleSignInButton
					setIsLoggedIn={setIsLoggedIn}
					setUserRole={setUserRole}
				/>
			</div>
			<p className={styles.authSwitch}>New around here? <Link to="/signup">Create an account</Link></p>
		</AuthLayout>
	);
}
