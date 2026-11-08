import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCatalog.module.css";

function getCategoryName(category) {
	if (typeof category === "string") return category;
	return (
		category?.name ??
		category?.category_name ??
		category?.categoryName ??
		category?.label ??
		""
	);
}

function getCategoryId(category) {
	if (typeof category !== "object" || category === null) return "";
	return String(category._id ?? category.id ?? category.category_id ?? "");
}

function matchesCategory(product, category) {
	const productCategory =
		product.category ??
		product.category_name ??
		product.categoryName ??
		product.category_id ??
		product.categoryId;
	const categoryId = getCategoryId(category);
	const categoryName = getCategoryName(category).toLowerCase();

	if (typeof productCategory === "object" && productCategory !== null) {
		const productCategoryId = getCategoryId(productCategory);
		if (categoryId && productCategoryId === categoryId) return true;
		return getCategoryName(productCategory).toLowerCase() === categoryName;
	}

	const productCategoryValue = String(productCategory ?? "").toLowerCase();
	return (
		(categoryId && productCategoryValue === categoryId.toLowerCase()) ||
		productCategoryValue === categoryName
	);
}

function getProductCategory(product) {
	if (typeof product.category === "string") return product.category;
	return getCategoryName(product.category) || "Farm fresh";
}

export default function ProductCatalog({
	products,
	categories,
	loading,
	error,
	isMember = false,
	onBuy,
}) {
	const [activeCategory, setActiveCategory] = useState("all");
	const [loginPromptProduct, setLoginPromptProduct] = useState(null);
	const [cartMessage, setCartMessage] = useState("");
	const cartMessageTimeout = useRef();

	useEffect(() => {
		return () => window.clearTimeout(cartMessageTimeout.current);
	}, []);

	const categoryTabs = categories.map((category, index) => ({
		category,
		id:
			getCategoryId(category) ||
			getCategoryName(category) ||
			`category-${index}`,
		name: getCategoryName(category) || "Category",
	}));
	const selectedCategory = categoryTabs.find(({ id }) => id === activeCategory);
	const filteredProducts =
		activeCategory === "all"
			? products
			: products.filter((product) =>
					selectedCategory
						? matchesCategory(product, selectedCategory.category)
						: false,
				);
	const activeTabIndex = categoryTabs.findIndex(
		({ id }) => id === activeCategory,
	);

	function handleBuy(product) {
		if (isMember) {
			onBuy(product);
			setCartMessage("Added to your cart!");
			window.clearTimeout(cartMessageTimeout.current);
			cartMessageTimeout.current = window.setTimeout(
				() => setCartMessage(""),
				2000,
			);
			return;
		}
		setLoginPromptProduct(product);
	}

	return (
		<>
			{cartMessage && (
				<p
					className={`${styles.catalogMessage} ${styles.cartAddedMessage}`}
					role="status"
				>
					{cartMessage}
				</p>
			)}
			{error && (
				<p className={`form-error ${styles.catalogMessage}`} role="alert">
					{error}
				</p>
			)}
			<div
				className={styles.categoryTabs}
				role="tablist"
				aria-label="Product categories"
			>
				<button
					className={`${styles.categoryTab}${activeCategory === "all" ? ` ${styles["is-active"]}` : ""}`}
					id="category-tab-all"
					type="button"
					role="tab"
					aria-selected={activeCategory === "all"}
					aria-controls="category-products"
					onClick={() => setActiveCategory("all")}
				>
					All products
				</button>
				{categoryTabs.map(({ id, name }, index) => (
					<button
						className={`${styles.categoryTab}${activeCategory === id ? ` ${styles["is-active"]}` : ""}`}
						id={`category-tab-${index}`}
						key={id}
						type="button"
						role="tab"
						aria-selected={activeCategory === id}
						aria-controls="category-products"
						onClick={() => setActiveCategory(id)}
					>
						{name}
					</button>
				))}
			</div>
			<div
				className={styles.productGrid}
				id="category-products"
				role="tabpanel"
				aria-labelledby={
					activeCategory === "all"
						? "category-tab-all"
						: `category-tab-${activeTabIndex}`
				}
			>
				{loading ? (
					<p className={styles.catalogMessage} role="status">
						Loading products…
					</p>
				) : filteredProducts.length ? (
					filteredProducts.map((item) => (
						<article
							className={`${styles.productCard} ${styles.productCardCatalog}`}
							key={item._id ?? item.id ?? item.name}
						>
							<div
								className={styles.productImage}
								style={{ backgroundImage: `url("${item.image}")` }}
							>
								<span className={styles.productTag}>
									{getProductCategory(item)}
								</span>
							</div>
							<div className={styles.productDetails}>
								<div>
									<h3>{item.name}</h3>
									<p>{item.description}</p>
								</div>
								<strong>
									RM{item.price}
									{item.unit ? ` / ${item.unit}` : ""}
								</strong>
							</div>
							<button
								className={`button button--primary ${styles.productBuyButton}`}
								type="button"
								onClick={() => handleBuy(item)}
							>
								{isMember ? "Add to cart" : "Buy"}
							</button>
						</article>
					))
				) : (
					<p className={styles.catalogMessage}>
						{products.length
							? "No products in this category yet."
							: "There are no products to show right now."}
					</p>
				)}
			</div>
			{loginPromptProduct && (
				<div
					className={styles.authPromptBackdrop}
					onClick={() => setLoginPromptProduct(null)}
					onKeyDown={(event) => {
						if (event.key === "Escape") setLoginPromptProduct(null);
					}}
				>
					<section
						className={styles.authPrompt}
						role="dialog"
						aria-modal="true"
						aria-labelledby="auth-prompt-title"
						onClick={(event) => event.stopPropagation()}
					>
						<button
							className={styles.authPromptClose}
							type="button"
							aria-label="Close sign-in prompt"
							onClick={() => setLoginPromptProduct(null)}
						>
							<X size={19} />
						</button>
						<p className="eyebrow">Save a place in your basket</p>
						<h2 id="auth-prompt-title">
							Join us to bring {loginPromptProduct.name} home.
						</h2>
						<p>
							Create an account or log in to add farm-fresh favorites to your
							cart.
						</p>
						<div className={styles.authPromptActions}>
							<Link className="button button--primary" to="/signup">
								Sign up
							</Link>
							<Link className="button button--outline" to="/login">
								Log in
							</Link>
						</div>
					</section>
				</div>
			)}
		</>
	);
}

function ProductCard({item}) {
	return (
		<article
			className={`${styles.productCard} ${styles.productCardCatalog}`}
			key={item._id ?? item.id ?? item.name}
		>
			<div
				className={styles.productImage}
				style={{ backgroundImage: `url("${item.image}")` }}
			>
				<span className={styles.productTag}>{getProductCategory(item)}</span>
			</div>
			<div className={styles.productDetails}>
				<div>
					<h3>{item.name}</h3>
					<p>{item.description}</p>
				</div>
				<strong>
					RM{item.price}
					{item.unit ? ` / ${item.unit}` : ""}
				</strong>
			</div>
			<button
				className={`button button--primary ${styles.productBuyButton}`}
				type="button"
				onClick={() => handleBuy(item)}
			>
				{isMember ? "Add to cart" : "Buy"}
			</button>
		</article>
	);
}
