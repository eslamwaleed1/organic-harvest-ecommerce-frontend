import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authApi } from "../../lib/api.js";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { Brand } from "../../components/SiteChrome.jsx";
import styles from "../../styles/MessagePages.module.css";

export default function VerifyEmailPage() {
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState("Verifying your email...");
	const [isVerified, setIsVerified] = useState(false);
	const [isVerifying, setIsVerifying] = useState(true);

	const token = searchParams.get("token");

	useEffect(() => {
		async function verify() {
			if (!token) {
				setStatus("Invalid or missing verification token.");
				setIsVerifying(false);
				return;
			}

			try {
				const result = await authApi.verifyEmail({ token });

				if (result?.success) {
					setStatus("Email verified successfully! You can now log in.");
					setIsVerified(true);
				} else {
					setStatus(
						result?.message ||
							"Verification failed. The token may be expired or invalid.",
					);
				}
			} catch {
				setStatus("Verification failed. The token may be expired or invalid.");
			} finally {
				setIsVerifying(false);
			}
		}

		verify();
	}, [token]);

	return (
		<main className={styles.messagePage}>
			<header className={styles.messageHeader}><Brand /></header>
			<section className={styles.messageCard} aria-live="polite">
				<div className={`${styles.messageArt}${isVerified ? ` ${styles.messageArtSuccess}` : ""}`}>
					{isVerifying ? <LoaderCircle className={styles.spin} size={48} /> : isVerified ? <CircleCheck size={49} /> : <CircleX size={49} />}
				</div>
				<p className="eyebrow">{isVerifying ? "Just a moment" : isVerified ? "You’re all set" : "A little hiccup"}</p>
				<h1>{isVerifying ? "Checking your email..." : isVerified ? "Welcome to the farm family." : "We couldn’t verify that link."}</h1>
				<p className={styles.messageDescription} role="status">{status}</p>
				<Link className="button button--primary" to="/login">Continue to log in <ArrowRight size={16} /></Link>
				{!isVerified && !isVerifying && <p className={styles.messageSmall}>Need a new link? <Link to="/signup">Create your account again</Link></p>}
			</section>
			<p className={styles.messageFooter}>A little goodness, grown close to home.</p>
		</main>
	);
}
