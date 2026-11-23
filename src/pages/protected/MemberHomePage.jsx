import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	Apple,
	ArrowRight,
	Heart,
	Leaf,
	PackageCheck,
	ShoppingCart,
	Sprout,
} from "lucide-react";
import { authApi } from "../../lib/api.js";
import { DashboardHeader, SiteFooter } from "../../components/SiteChrome.jsx";
import ProductCatalog from "../../components/ProductCatalog.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import { useCart } from "../../hooks/useCart.js";
import WeeklyProduceBox from "../../components/WeeklyProduceBox.jsx";
import SuggestionForm from "../../components/SuggestionForm.jsx";
import styles from "../../styles/MemberHomePage.module.css";

export default function MemberHomePage({ setIsLoggedIn, setUserRole }) {
	const navigate = useNavigate();
	const { itemCount, addItem } = useCart();
	const {
		data: products,
		loading: productsLoading,
		error: productsError,
	} = useBusinessData("products");
	const {
		data: categories,
		loading: categoriesLoading,
		error: categoriesError,
	} = useBusinessData("categories");
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
			setErrorMessage(
				error.message || "We couldn't sign you out. Please try again.",
			);
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<div className="dashboard-page">
			<DashboardHeader
				onLogout={handleLogout}
				loggingOut={isLoggingOut}
				cartCount={itemCount}
			/>
			<main>
				<section className={styles.memberWelcome}>
					<div className={styles.memberWelcomeCopy}>
						<Link className={styles.memberOrdersLink} to="/member/orders">
							<PackageCheck size={16} />
							See your orders
							<ArrowRight size={15} aria-hidden="true" />
						</Link>
						<p className="eyebrow">A warm welcome back</p>
						<h1>There’s always something good growing.</h1>
						<p>
							Your little corner of Organic Harvest is ready. Take a peek at
							what’s fresh and follow along with life on the farm.
						</p>
					</div>
					<div className={styles.memberWelcomeArt} aria-hidden="true">
						<span className={styles.artSun} />
						<span className={styles.artStem}>
							<Sprout size={74} strokeWidth={1.25} />
						</span>
						<span className={styles.artCaption}>
							A little care
							<br />
							goes a long way
						</span>
					</div>
				</section>
				<section className="section-wrap" id="the-harvest">
					<div className="section-heading">
						<div>
							<p className="eyebrow">A little taste of the farm</p>
							<h2>Fresh from our patch</h2>
						</div>
						<p>
							Small batches, changing with the seasons.
							<br />
							Here’s what we’re loving right now.
						</p>
					</div>
					<ProductCatalog
						products={products}
						categories={categories}
						loading={productsLoading || categoriesLoading}
						error={productsError || categoriesError}
						isMember
						onBuy={addItem}
					/>
					<div className="produce-section-heading">
						<h2>Weekly Produce Boxes</h2>
					</div>
					<div className="produce-boxes">
						<WeeklyProduceBox products={products} isMember onAdd={addItem} />
						<WeeklyProduceBox products={products} variant="salad" isMember onAdd={addItem} />
					</div>
				</section>
				<SuggestionForm />
				<section className={`section-wrap ${styles.memberContent}`}>
					{errorMessage && (
						<p className={`form-error ${styles.dashboardError}`} role="alert">
							{errorMessage}
						</p>
					)}
					<div className="section-heading">
						<div>
							<p className="eyebrow">Your farm notes</p>
							<h2>Good things, close to home.</h2>
						</div>
						<p>
							A few ways to feel a little closer
							<br />
							to our family farm.
						</p>
					</div>
					<div className={styles.memberCards}>
						<article className={`${styles.memberCard} ${styles.memberCardGreen}`}>
							<span className={styles.memberCardIcon}>
								<Apple size={19} />
							</span>
							<p className="eyebrow">In season</p>
							<h3>Follow the harvest</h3>
							<p>
								See what Michael and Maria are gathering from the garden this
								week.
							</p>
						</article>
						<article className={styles.memberCard}>
							<span className={styles.memberCardIcon}>
								<Heart size={19} />
							</span>
							<p className="eyebrow">From the Tans</p>
							<h3>Meet your farmers</h3>
							<p>
								Get to know the family, the soil, and the little moments behind
								every harvest.
							</p>
						</article>
						<article className={styles.memberCard}>
							<span className={styles.memberCardIcon}>
								<PackageCheck size={19} />
							</span>
							<p className="eyebrow">Farm-fresh goodness</p>
							<h3>Make it a farm day</h3>
							<p>
								Drop by, say hello, and find something lovely to bring home to
								your table.
							</p>
						</article>
						<article className={`${styles.memberCard} ${styles.memberCardNote}`}>
							<span className={styles.memberCardIcon}>
								<Leaf size={19} />
							</span>
							<p className="eyebrow">A little reminder</p>
							<h3>Good food takes its time.</h3>
							<p>
								We grow with the seasons, so each week brings something new from
								our patch.
							</p>
						</article>
					</div>
				</section>
			</main>
			<SiteFooter />
			<Link
				className="floating-cart-button"
				to="/member/cart"
				aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
			>
				<ShoppingCart size={23} aria-hidden="true" />
				<span className="floating-cart-count" aria-hidden="true">
					{itemCount}
				</span>
			</Link>
		</div>
	);
}
