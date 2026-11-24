import {
	ArrowLeft,
	Minus,
	Plus,
	ShoppingBag,
	Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardHeader, SiteFooter } from "../../components/SiteChrome.jsx";
import { useCart } from "../../hooks/useCart.js";
import CheckoutButton from "../../components/CheckoutButton.jsx"
import styles from "../../styles/CartPage.module.css";

function getPrice(product) {
	const price = Number(String(product.price ?? "").replace(/[^0-9.-]/g, ""));
	return Number.isFinite(price) ? price : 0;
}

function formatPrice(price) {
	return `RM${price.toFixed(2)}`;
}

function getCategoryName(category) {
	if (typeof category === "string") return category;
	return category?.name ?? category?.category_name ?? "Farm fresh";
}

export default function CartPage() {
	const { items, itemCount, setQuantity, removeItem } = useCart();

	const total = items.reduce(
		(sum, item) => sum + getPrice(item.product) * item.quantity,
		0,
	);

	return (
		<div className="dashboard-page">
			<DashboardHeader cartCount={itemCount} />
			<main className={`${styles.cartPage} section-wrap`}>
				<Link className={`text-link ${styles.cartBackLink}`} to="/member/home#the-harvest">
					<ArrowLeft size={15} /> Back to the harvest
				</Link>
				<div className="section-heading">
					<div>
						<p className="eyebrow">Your basket</p>
						<h1>Your farm-fresh cart</h1>
					</div>
					<p>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
				</div>
				{items.length ? (
					<div className={styles.cartLayout}>
						<div className={styles.cartItems}>
							{items.map(({ id, product, quantity }) => (
								<article className={styles.cartItem} key={id}>
									<div
										className={styles.cartItemImage}
										style={{ backgroundImage: `url("${product.image}")` }}
										role="img"
										aria-label={product.name}
									/>
									<div className={styles.cartItemInfo}>
										<p className="eyebrow">{getCategoryName(product.category)}</p>
										<h2>{product.name}</h2>
										<p>
											{formatPrice(getPrice(product))}
											{product.unit ? ` / ${product.unit}` : ""}
										</p>
									</div>
									<div className={styles.cartItemActions}>
										<div
											className={styles.quantityControl}
											aria-label={`Quantity for ${product.name}`}
										>
											<button
												type="button"
												aria-label={`Decrease ${product.name} quantity`}
												disabled={quantity <= 1}
												onClick={() => setQuantity(id, quantity - 1)}
											>
												<Minus size={15} />
											</button>
											<span aria-live="polite">{quantity}</span>
											<button
												type="button"
												aria-label={`Increase ${product.name} quantity`}
												onClick={() => setQuantity(id, quantity + 1)}
											>
												<Plus size={15} />
											</button>
										</div>
										<strong>{formatPrice(getPrice(product) * quantity)}</strong>
										<button
											className={styles.cartRemove}
											type="button"
											onClick={() => removeItem(id)}
										>
											<Trash2 size={14} /> Remove
										</button>
									</div>
								</article>
							))}
						</div>
						<aside className={styles.cartSummary}>
							<p className="eyebrow">A little total</p>
							<h2>Order summary</h2>
							<div>
								<span>Items</span>
								<span>{itemCount}</span>
							</div>
							<div className="cart-total">
								<strong>Total</strong>
								<strong>{formatPrice(total)}</strong>
							</div>
							<p className={styles.paymentTestNote} role="note">
								For testing, use 5555 5555 5555 4444, any future date and any csv.
							</p>
							<CheckoutButton cartItems={items} />
							<p>Fresh goodness, gathered with care.</p>
						</aside>
					</div>
				) : (
					<div className={styles.cartEmpty}>
						<span><ShoppingBag size={27} /></span>
						<h2>Your cart is waiting for something lovely.</h2>
						<p>Explore the harvest and add your favorites to the basket.</p>
						<Link className="button button--primary" to="/member/home#the-harvest">
							Browse the harvest
						</Link>
					</div>
				)}
			</main>
			<SiteFooter />
		</div>
	);
}
