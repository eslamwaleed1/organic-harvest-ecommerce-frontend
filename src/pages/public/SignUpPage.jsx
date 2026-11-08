import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../lib/api.js";
import { ArrowRight } from "lucide-react";
import Cookies from "js-cookie";
import GoogleSignInButton from "../../components/GoogleSignInButton.jsx";
import { AuthLayout } from "../../components/SiteChrome.jsx";
import styles from "../../styles/AuthForms.module.css";

export default function SignUpPage({ setIsLoggedIn, setUserRole }) {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setErrorMessage("");
		setIsSubmitting(true);
		try {
			const formData = new FormData(event.currentTarget);
			const result = await authApi.signup({
					name: formData.get("name"),
					email: formData.get("email"),
					password: formData.get("password"),
				});
			if (result) {
				setIsLoggedIn(Cookies.get("is_logged_in") === "true");
				navigate("/check-email");
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(error.message || "We couldn't create your account. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthLayout
			eyebrow="A seat at our table"
			heading="Good food is even better shared."
			description="Join our farm family for a little more freshness, a little more connection, and a lot of goodness."
		>
			<p className="eyebrow">Join the farm family</p>
			<h2>Let’s get to know you.</h2>
			<p className={styles.formIntro}>Make an account and stay in the loop with life on the farm.</p>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<label htmlFor="signup-name">Name</label>
				<input
					autoComplete="name"
					id="signup-name"
					name="name"
					placeholder="Your name"
					required
					type="text"
				/>
				<label htmlFor="signup-email">Email address</label>
				<input
					autoComplete="email"
					id="signup-email"
					name="email"
					placeholder="you@example.com"
					required
					type="email"
				/>
				<label htmlFor="signup-password">Password</label>
				<input
					autoComplete="new-password"
					id="signup-password"
					name="password"
					placeholder="Create a password"
					required
					type="password"
				/>
				{errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
				<button className="button button--primary button--wide" disabled={isSubmitting} type="submit">
					{isSubmitting ? "Planting the seeds..." : <>Create my account <ArrowRight size={16} /></>}
				</button>
			</form>
			<div className={styles.authDivider}><span>or</span></div>
			<div className={styles.googleSignin}>
				<GoogleSignInButton
					setIsLoggedIn={setIsLoggedIn}
					setUserRole={setUserRole}
				/>
			</div>
			<p className={styles.authSwitch}>Already part of the family? <Link to="/login">Log in</Link></p>
		</AuthLayout>
	);
}
