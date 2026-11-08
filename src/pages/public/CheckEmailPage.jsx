import { ArrowRight, MailCheck, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import ResendMagicLink from "../../components/ResendMagicLink.jsx";
import { Brand } from "../../components/SiteChrome.jsx";
import styles from "../../styles/MessagePages.module.css";

export default function CheckEmailPage() {
	return (
		<main className={styles.messagePage}>
			<header className={styles.messageHeader}><Brand /></header>
			<section className={styles.messageCard}>
				<div className={styles.messageArt}><span className={styles.messageArtSun} /><MailCheck size={49} strokeWidth={1.25} /></div>
				<p className="eyebrow">One little thing before you come in</p>
				<h1>Check your inbox, friend.</h1>
				<p className={styles.messageDescription}>We’ve sent you an email with a link to verify your address. Give it a moment to find its way to you.</p>
				<ResendMagicLink />
				<div className={styles.messageDivider} />
				<p className={styles.messageSmall}>Already verified your email?</p>
				<Link className="button button--primary" to="/login">Log in to your account <ArrowRight size={16} /></Link>
				<Link className={styles.messageBack} to="/signup"><Sprout size={15} /> Back to sign up</Link>
			</section>
			<p className={styles.messageFooter}>A little goodness, grown close to home.</p>
		</main>
	);
}
