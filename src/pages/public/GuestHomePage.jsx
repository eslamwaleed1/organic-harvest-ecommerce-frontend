import {
	ArrowDown,
	ArrowRight,
	Heart,
	MapPin,
	Sprout,
	Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome.jsx";
import ProductCatalog from "../../components/ProductCatalog.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import WeeklyProduceBox from "../../components/WeeklyProduceBox.jsx";
import SuggestionForm from "../../components/SuggestionForm.jsx";

export default function GuestHomePage() {
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

	return (
		<div className="storefront">
			<SiteHeader />
			<main>
				<section className="hero" id="our-story">
					<div className="hero-copy">
						<p className="eyebrow"><span className="eyebrow-dot" /> From our little farm to your table</p>
						<h1>Good things grow <em>slowly.</em></h1>
						<p className="hero-description">
							We’re Michael and Maria Tan. We grow honest, seasonal food with
							our family, our hands, and a whole lot of heart.
						</p>
						<div className="hero-actions">
							<a className="button button--primary" href="#the-harvest">
								Meet this week’s harvest <ArrowRight size={16} />
							</a>
						</div>
						<div className="hero-note">
							<span className="note-icon"><Heart size={17} /></span>
							<span><strong>Picked by our family</strong><br />Never rushed, always seasonal</span>
						</div>
					</div>
					<div className="hero-photo" role="img" aria-label="Sunrise over a lush green farm">
						<div className="photo-badge"><Sun size={19} /><strong>Grown<br />with care</strong></div>
						<div className="harvest-note"><Sprout size={15} /> Harvested fresh, just for you</div>
					</div>
					<div className="hero-index"><span /> TAN FAMILY FARM · EST. WITH LOVE</div>
				</section>

				<section className="promise-strip" aria-label="Our promise">
					<div className="promise-item"><Sprout size={23} /><span><strong>Grown naturally</strong><small>Good soil, gentle hands</small></span></div>
					<div className="promise-item"><Sun size={23} /><span><strong>Picked in season</strong><small>At nature’s own pace</small></span></div>
					<div className="promise-item"><Heart size={22} /><span><strong>Family farmed</strong><small>From the Tans, with love</small></span></div>
					<div className="promise-item"><MapPin size={22} /><span><strong>Close to home</strong><small>Grown right in your community</small></span></div>
				</section>

				<section className="section-wrap" id="the-harvest">
					<div className="section-heading">
						<div>
							<p className="eyebrow">A little taste of the farm</p>
							<h2>Fresh from our patch</h2>
						</div>
						<p>Small batches, changing with the seasons.<br />Here’s what we’re loving right now.</p>
					</div>
					<ProductCatalog
						products={products}
						categories={categories}
						loading={productsLoading || categoriesLoading}
						error={productsError || categoriesError}
					/>
					<div className="produce-section-heading">
						<h2>Weekly Produce Boxes</h2>
					</div>
					<div className="produce-boxes">
						<WeeklyProduceBox products={products} />
						<WeeklyProduceBox products={products} variant="salad" />
					</div>
					<div className="market-cta">
						<p>Come as you are. Leave with something lovely.</p>
						<Link className="button button--outline" to="/signup">
							Get to know the farm <ArrowRight size={15} />
						</Link>
					</div>
				</section>
				<SuggestionForm />

				<section className="family-note">
					<div className="family-photo" role="img" aria-label="Fresh vegetables gathered in a basket" />
					<div className="family-copy">
						<p className="eyebrow">A note from Michael &amp; Maria</p>
						<h2>There’s a little more love in every bite.</h2>
						<p>Our farm is a family affair: muddy boots, sun-warmed tomatoes, and meals shared around a crowded table. We’re glad you’re here.</p>
						<Link className="text-link" to="/signup">Pull up a chair <ArrowRight size={15} /></Link>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
