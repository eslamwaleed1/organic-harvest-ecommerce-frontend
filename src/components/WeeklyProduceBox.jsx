import { useMemo, useState } from "react";
import { ArrowRight, PackageOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../styles/WeeklyProduceBox.module.css";

const BOX_DISCOUNT = 0.15;

function getPrice(product) {
	const price = Number(String(product.price ?? "").replace(/[^0-9.-]/g, ""));
	return Number.isFinite(price) ? price : 0;
}

export default function WeeklyProduceBox({
	products,
	isMember = false,
	onAdd,
	variant = "supper",
}) {
	const [added, setAdded] = useState(false);
	const boxProducts = useMemo(() => {
		if (!products.length) return [];
		const selectionKey = products.map((product) => product._id ?? product.id ?? product.name).join("");
		const selectionSeed = [...selectionKey].reduce((total, character) => total + character.charCodeAt(0), 0);
		const start = (selectionSeed + (variant === "salad" ? 2 : 0)) % products.length;
		return products.slice(start, start + 3).concat(products.slice(0, Math.max(0, start + 3 - products.length))).slice(0, 3);
	}, [products, variant]);
	const regularTotal = boxProducts.reduce((total, product) => total + getPrice(product), 0);
	const discountedTotal = regularTotal * (1 - BOX_DISCOUNT);

	function addBox() {
		boxProducts.forEach((product) => onAdd(product));
		setAdded(true);
	}

	if (!boxProducts.length) return null;

	return (
		<section className={`${styles.produceBox} ${variant === "salad" ? styles.produceBoxSalad : ""}`} aria-labelledby={`produce-box-heading-${variant}`}>
			<div className={styles.produceBoxHeader}>
				<div>
					<p className="eyebrow"><Sparkles size={14} /> {variant === "salad" ? "A bright lunch from the patch" : "This week’s simple supper"}</p>
					<h2 id={`produce-box-heading-${variant}`}>{variant === "salad" ? "Garden Lunch Box" : "Weekly Produce Box"}</h2>
					<p>{variant === "salad" ? "A fresh trio for a quick, colorful lunch, bundled with 15% off." : "Three seasonal picks that belong together at the table, bundled with 15% off."}</p>
				</div>
				<span className={styles.produceBoxBadge}>15% off</span>
			</div>
			<div className={styles.produceBoxContent}>
				<ul className={styles.produceBoxList}>
					{boxProducts.map((product) => (
						<li key={product._id ?? product.id ?? product.name}>
							<span className={styles.produceBoxImage} style={{ backgroundImage: `url("${product.image}")` }} />
							<span><strong>{product.name}</strong><small>{product.unit ? `Fresh ${product.unit}` : "Seasonal farm pick"}</small></span>
							<strong>RM{getPrice(product).toFixed(2)}</strong>
						</li>
					))}
				</ul>
				<div className={styles.produceBoxTotal}>
					<span>Box total <del>RM{regularTotal.toFixed(2)}</del></span>
					<strong>RM{discountedTotal.toFixed(2)}</strong>
					{isMember ? (
						<button className="button button--primary" type="button" onClick={addBox}>
							{added ? "Box added" : <>Add the box <PackageOpen size={16} /></>}
						</button>
					) : (
						<Link className="button button--primary" to="/signup">Join to shop <ArrowRight size={16} /></Link>
					)}
				</div>
			</div>
		</section>
	);
}
