import { ArrowLeft, ArrowRight, Leaf, ShoppingCart, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../styles/SiteChrome.module.css";
import authStyles from "../styles/AuthLayout.module.css";

export function Brand({ light = false }) {
	return (
		<Link className={`${styles.brand}${light ? ` ${styles.brandLight}` : ""}`} to="/">
			<span className={styles.brandMark} aria-hidden="true">
				<Sprout size={19} strokeWidth={1.8} />
			</span>
			<span>Organic Harvest</span>
		</Link>
	);
}

export function SiteHeader() {
	return (
		<>
			<div className={styles.announcementBar}>
				<Leaf size={14} aria-hidden="true" />
				<span>Grown with care, gathered with love</span>
			</div>
			<header className={styles.siteHeader}>
				<Brand />
				<nav className={styles.mainNav} aria-label="Main navigation">
					<a href="/#our-story">Our story</a>
					<a href="/#the-harvest">The harvest</a>
					<a href="/#visit-us">Visit the farm</a>
				</nav>
				<div className={styles.headerActions}>
					<Link className={styles.headerLogin} to="/login">Log in</Link>
					<Link aria-label="Join our table" className="button button--primary button--small" to="/signup">
						<span className={styles.headerCtaLabel}>Join our table</span> <ArrowRight size={15} />
					</Link>
				</div>
			</header>
		</>
	);
}

export function SiteFooter() {
	return (
		<footer className={styles.siteFooter} id="visit-us">
			<Brand light />
			<p>Small family farm. Big-hearted harvests.</p>
			<a href="mailto:hello@organicharvest.farm">Say hello <ArrowRight size={14} /></a>
		</footer>
	);
}

export function DashboardHeader({ email, onLogout, loggingOut, cartCount, isAdmin = false }) {
	return (
		<header className={styles.dashboardHeader}>
			<Brand />
			<div className={styles.dashboardAccount}>
				{email && <span className={styles.memberEmail}>{email}</span>}
				{isAdmin ? (
					<>
						<Link className="profile-header-link" to="/admin/profile">Profile</Link>
						<Link className="profile-header-link" to="/admin/home">Admin home</Link>
					</>
				) : (
					<>
						<Link className="profile-header-link" to="/member/profile">Profile</Link>
						<Link className="profile-header-link" to="/member/enquiries">Enquiries</Link>
					</>
				)}
				{cartCount !== undefined && (
					<Link
						className={styles.cartHeaderLink}
						to="/member/cart"
						aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
					>
						<ShoppingCart size={20} />
						<span>Cart</span>
						<span className={styles.cartCount} aria-hidden="true">{cartCount}</span>
					</Link>
				)}
				{onLogout && <button className={styles.logoutButton} disabled={loggingOut} onClick={onLogout} type="button">
					{loggingOut ? "Signing out..." : "Sign out"} <ArrowRight size={15} />
				</button>}
			</div>
		</header>
	);
}

export function AuthLayout({ eyebrow, heading, description, children }) {
	return (
		<main className={authStyles.authLayout}>
			<section className={authStyles.authStory}>
				<Brand light />
				<div className={authStyles.authStoryCopy}>
					<p className={`eyebrow ${authStyles.eyebrowLight}`}>{eyebrow}</p>
					<h1>{heading}</h1>
					<p>{description}</p>
				</div>
				<p className={authStyles.storySignoff}>With love from Michael &amp; Maria Tan</p>
			</section>
			<section className={authStyles.authFormPanel}>
				<Link className={authStyles.backLink} to="/">
					<ArrowLeft size={15} /> Back to the farm
				</Link>
				<div className={authStyles.authFormWrap}>{children}</div>
				<p className={authStyles.formFootnote}>A little goodness, grown close to home.</p>
			</section>
		</main>
	);
}
