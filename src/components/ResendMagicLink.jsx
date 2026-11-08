import { useState, useEffect, useRef } from "react";
import { authApi } from "../lib/api.js";
import styles from "../styles/MessagePages.module.css";

export default function ResendMagicLink() {
	const [cooldown, setCooldown] = useState(0);
	const [loading, setLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");

	// Use a ref to track the active timer interval for cleanups
	const timerRef = useRef(null);

	// Handle the countdown reduction every second
	useEffect(() => {
		if (cooldown > 0) {
			timerRef.current = setInterval(() => {
				setCooldown((prev) => prev - 1);
			}, 1000);
		} else if (cooldown === 0 && timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Clean up interval on component unmount
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [cooldown]);

	const handleResend = async () => {
		if (cooldown > 0 || loading) return;

		setLoading(true);
		setStatusMessage("");

		try {
			const response = await authApi.resendMagicLink();

			if (response) {
				setStatusMessage("A fresh magic link has been sent!");
				setCooldown(10); // Start the 60-second lockout "drill"
			} else {
				setStatusMessage("Failed to resend. Please try again later.");
			}
		} catch (error) {
			setStatusMessage(error.message || "A network error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.resendLink}>
			<button
				onClick={handleResend}
				disabled={cooldown > 0 || loading}
				type="button"
			>
				{loading
					? "Sending..."
					: cooldown > 0
						? `Resend link (${cooldown}s)`
						: "Didn't get the email? Resend it"}
			</button>

			{statusMessage && (
				<p role="status">
					{statusMessage}
				</p>
			)}
		</div>
	);
}
