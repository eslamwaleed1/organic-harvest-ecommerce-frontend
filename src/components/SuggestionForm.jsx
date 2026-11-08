import { useState } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { feedbackApi } from "../lib/api.js";
import styles from "../styles/SuggestionForm.module.css";

export default function SuggestionForm() {
	const [text, setText] = useState("");
	const mutation = useMutation({
		mutationFn: feedbackApi.submitSuggestion,
		onSuccess: () => setText(""),
	});

	function handleSubmit(event) {
		event.preventDefault();
		const value = text.trim();
		if (value) mutation.mutate(value);
	}

	return (
		<section className={`${styles.feedbackSection} section-wrap`} aria-labelledby="suggestion-heading">
			<div className={styles.feedbackCard}>
				<div className={styles.feedbackCopy}>
					<span className={styles.feedbackIcon}><Lightbulb size={21} /></span>
					<p className="eyebrow">Help us grow</p>
					<h2 id="suggestion-heading">Have a thought for the farm?</h2>
					<p>Share an idea anonymously. No account or personal details needed.</p>
				</div>
				<form className={styles.feedbackForm} onSubmit={handleSubmit}>
					<label htmlFor="suggestion-text">Your suggestion</label>
					<textarea
						id="suggestion-text"
						value={text}
						onChange={(event) => setText(event.target.value)}
						placeholder="What would make your Organic Harvest experience better?"
						rows="4"
						maxLength="1000"
						required
					/>
					{mutation.isSuccess && <p className="form-success" role="status">Thanks for helping us grow.</p>}
					{mutation.isError && <p className="form-error" role="alert">{mutation.error.message}</p>}
					<button className="button button--primary" disabled={mutation.isPending} type="submit">
						{mutation.isPending ? "Sending..." : <>Send anonymously <ArrowRight size={16} /></>}
					</button>
				</form>
			</div>
		</section>
	);
}
