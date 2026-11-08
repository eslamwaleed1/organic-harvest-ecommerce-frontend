import { useState } from "react";
import { apiRequest } from "../lib/api.js";

export default function CheckoutButton({ cartItems }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleCheckout() {
		setLoading(true);
		setError("");

		try {
			const result = await apiRequest("/api/payments/checkout", {
				method: "POST",
				body: JSON.stringify({
					cartItems: cartItems.map((item) => ({
						productId: item.product._id ?? item.productId,
						quantity: item.quantity,
					})),
				}),
			});

			if (!result?.success || !result?.data?.checkoutUrl) {
				throw new Error(result?.message || "Could not start checkout");
			}

			// Redirect to Stripe's hosted checkout page.
			window.location.assign(result.data.checkoutUrl);
		} catch (err) {
			setError(err.message || "Checkout failed. Please try again.");
			console.error(err)
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<button
				type="button"
				className="button button--primary button--wide cart-submit-button"
				onClick={handleCheckout}
				disabled={loading || cartItems.length === 0}
			>
				{loading ? "Redirecting..." : "Checkout"}
			</button>

			{error && <p role="alert">{error}</p>}
		</div>
	);
}
