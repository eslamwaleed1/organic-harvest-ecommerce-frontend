import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Boxes, ClipboardList, MessageCircle, UserPlus, Users } from "lucide-react";
import { DashboardHeader, SiteFooter } from "./SiteChrome.jsx";

const links = [
	["/admin/home", "Overview"],
	["/admin/products", "Products", Boxes],
	["/admin/orders", "Orders", ClipboardList],
	["/admin/enquiries", "Enquiries", MessageCircle],
	["/admin/users", "Users", Users],
	["/admin/invite", "Invite admin", UserPlus],
];

export default function AdminPageLayout({ eyebrow, title, description, children }) {
	const location = useLocation();
	const navigationRef = useRef(null);

	useEffect(() => {
		const savedScrollLeft = Number(sessionStorage.getItem("admin-navigation-scroll-left"));
		if (!Number.isFinite(savedScrollLeft)) return;

		const frame = window.requestAnimationFrame(() => {
			if (navigationRef.current) {
				navigationRef.current.scrollLeft = savedScrollLeft;
			}
		});
		return () => window.cancelAnimationFrame(frame);
	}, [location.pathname]);

	function preserveNavigationPosition() {
		if (navigationRef.current) {
			sessionStorage.setItem(
				"admin-navigation-scroll-left",
				String(navigationRef.current.scrollLeft),
			);
		}
	}

	return (
		<div className="dashboard-page admin-shell">
			<DashboardHeader isAdmin />
			<main className="admin-page section-wrap">
				<Link className="text-link admin-back-link" to="/admin/home"><ArrowLeft size={15} /> Admin overview</Link>
				<header className="admin-page-header">
					<div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
					{description && <p>{description}</p>}
				</header>
				<nav className="admin-page-nav" aria-label="Admin pages" ref={navigationRef}>
					{links.map(([href, label, Icon]) => <Link className={href === location.pathname ? "is-active" : ""} key={href} to={href} onClick={preserveNavigationPosition}>{Icon && <Icon size={16} />}{label}</Link>)}
				</nav>
				{children}
			</main>
			<SiteFooter />
		</div>
	);
}
