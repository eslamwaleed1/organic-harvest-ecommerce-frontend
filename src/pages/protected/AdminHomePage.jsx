import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowRight,
	Boxes,
	ClipboardList,
	Leaf,
	Plus,
	Sprout,
} from "lucide-react";
import { authApi } from "../../lib/api.js";
import { DashboardHeader, SiteFooter } from "../../components/SiteChrome.jsx";
import { Link } from "react-router-dom";

export default function AdminHomePage({ setIsLoggedIn, setUserRole }) {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	async function handleLogout() {
		setErrorMessage("");
		setIsLoggingOut(true);
		try {
			const result = await authApi.logout();
			if (result) {
				setIsLoggedIn(false);
				setUserRole("");
				navigate("/login");
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(error.message || "We couldn't sign you out. Please try again.");
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<div className="dashboard-page">
			<DashboardHeader isAdmin onLogout={handleLogout} loggingOut={isLoggingOut} />
			<main>
				<section className="admin-welcome">
					<div className="admin-welcome-copy">
						<p className="eyebrow">The farm office</p>
						<h1>Organic Harvest Dashboard</h1>
						<p>Your little farm dashboard is ready. Here’s a sunny spot to keep the growing work organized.</p>
						<div className="admin-welcome-label"><span className="status-dot" /> Your Organic Harvest workspace</div>
					</div>
					<div className="admin-welcome-art" aria-hidden="true"><Sprout size={116} strokeWidth={1.1} /></div>
				</section>
				<section className="section-wrap admin-content">
					{errorMessage && <p className="form-error dashboard-error" role="alert">{errorMessage}</p>}
					<div className="section-heading">
						<div>
							<p className="eyebrow">A helping hand around the farm</p>
							<h2>Your farm workspace</h2>
						</div>
						<p>All the important bits, gathered<br />in one calm little corner.</p>
					</div>
					<div className="admin-cards">
						<article className="admin-card">
							<span className="admin-card-icon"><Boxes size={22} /></span>
							<div className="admin-card-title"><div><p className="eyebrow">The farm stand</p><h3>Products &amp; harvest</h3></div><span className="admin-status">Workspace</span></div>
							<p>Keep your seasonal produce and farm favorites in one place.</p>
							<Link className="admin-action" to="/admin/products">
								Manage products <Plus size={16} />
							</Link>
						</article>
						<article className="admin-card">
							<span className="admin-card-icon admin-card-icon--honey"><ClipboardList size={22} /></span>
							<div className="admin-card-title"><div><p className="eyebrow">From the community</p><h3>Customer orders</h3></div><span className="admin-status">Workspace</span></div>
							<p>Make room for the orders and notes coming in from your customers.</p>
							<Link className="admin-action" to="/admin/orders">
								Manage orders <ArrowRight size={16} />
							</Link>
						</article>
					</div>
					<div className="admin-quick-links">
						<Link to="/admin/enquiries">Review enquiries <ArrowRight size={15} /></Link>
						<Link to="/admin/users">View users <ArrowRight size={15} /></Link>
						<Link to="/admin/invite">Invite an admin <ArrowRight size={15} /></Link>
					</div>
					<div className="admin-note">
						<span className="member-card-icon"><Leaf size={19} /></span>
						<p><strong>Grown with care, grown together.</strong><br />Your farm tools are right here when you’re ready to use them.</p>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
