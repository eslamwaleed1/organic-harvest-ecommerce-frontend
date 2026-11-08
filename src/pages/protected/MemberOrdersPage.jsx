import { ArrowLeft, CalendarDays, PackageCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../../components/SiteChrome.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import styles from "../../styles/MemberOrdersPage.module.css";

function formatPrice(price) {
	const amount = Number(price);
	return `RM${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

function formatOrderDate(date) {
	const parsedDate = new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(parsedDate);
}

export default function MemberOrdersPage() {
	const { data: orders, loading, error } = useBusinessData("userOrders");

	return (
		<div className="dashboard-page">
			<main className={`cart-page section-wrap ${styles.cartPage}`}>
				<Link className={`text-link ${styles.cartBackLink}`} to="/member/home#the-harvest">
					<ArrowLeft size={15} /> Back to the harvest
				</Link>
				<div className="section-heading">
					<div>
						<p className="eyebrow">Your farm-fresh history</p>
						<h1>Your orders</h1>
					</div>
					<p>
						{loading
							? "Loading your order history"
							: `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`}
					</p>
				</div>

				{loading ? (
					<div className={styles.ordersMessage} role="status">
						<p className="eyebrow">A moment, please</p>
						<h2>Gathering your orders...</h2>
					</div>
				) : error ? (
					<div className={`${styles.ordersMessage} ${styles.ordersMessageError}`} role="alert">
						<p className="eyebrow">We hit a little snag</p>
						<h2>We couldn’t load your orders.</h2>
						<p>{error}</p>
					</div>
				) : orders.length === 0 ? (
					<div className={styles.ordersMessage}>
						<span className={styles.ordersEmptyIcon}><ShoppingBag size={25} /></span>
						<p className="eyebrow">Nothing in the basket yet</p>
						<h2>Your next farm-fresh order starts here.</h2>
						<p>Explore what’s growing and find something lovely for your table.</p>
						<Link
							className="button button--primary"
							to="/member/home#the-harvest"
						>
							Browse the harvest
						</Link>
					</div>
				) : (
					<section className={styles.ordersList} aria-label="Your orders">
						{orders.map((order) => (
							<article className={styles.orderCard} key={order._id}>
								<header className={styles.orderCardHeader}>
									<div className={styles.orderCardTitle}>
										<span className={styles.ordersEmptyIcon} aria-hidden="true">
											<PackageCheck size={20} />
										</span>
										<div>
											<p className="eyebrow">Order</p>
											<h2>#{order._id?.slice(-8) ?? "Recent"}</h2>
										</div>
									</div>
									<p className={styles.orderDate}>
										<CalendarDays size={15} />
										<time dateTime={order.orderDate}>
											{formatOrderDate(order.orderDate)}
										</time>
									</p>
								</header>
								<ul className={styles.orderProducts}>
									{(Array.isArray(order.productData) ? order.productData : []).map(
										(item) => (
											<li key={item._id ?? `${item.productId?._id}-${item.quantity}`}>
												<div>
													<strong>
														{item.productId?.name ?? "Farm-fresh item"}
													</strong>
													<span>Qty {item.quantity}</span>
												</div>
												<span>{formatPrice(item.unitPrice * item.quantity)}</span>
											</li>
										),
									)}
								</ul>
								<footer className={styles.orderCardTotal}>
									<span>Order total</span>
									<strong>{formatPrice(order.totalAmount)}</strong>
								</footer>
							</article>
						))}
					</section>
				)}
			</main>
			<SiteFooter />
		</div>
	);
}
