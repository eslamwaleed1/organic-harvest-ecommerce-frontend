import { useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedbackApi } from "../../lib/api.js";
import { SiteFooter } from "../../components/SiteChrome.jsx";
import styles from "../../styles/EnquiriesPage.module.css";

function formatDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat(undefined, {
		year: "numeric", month: "long", day: "numeric",
	}).format(date);
}

export default function EnquiriesPage() {
	const queryClient = useQueryClient();
	const [question, setQuestion] = useState("");
	const [status, setStatus] = useState("");
	const enquiriesQuery = useQuery({
		queryKey: ["user-enquiries"],
		queryFn: feedbackApi.enquiries,
		select: (result) => result?.data ?? [],
	});
	const submitMutation = useMutation({
		mutationFn: feedbackApi.submitEnquiry,
		onSuccess: () => {
			setQuestion("");
			setStatus("Your enquiry has been sent to the farm team.");
			queryClient.invalidateQueries({ queryKey: ["user-enquiries"] });
		},
		onError: (error) => setStatus(error.message || "We couldn't send your enquiry."),
	});

	function handleSubmit(event) {
		event.preventDefault();
		const value = question.trim();
		if (value) submitMutation.mutate(value);
	}

	const enquiries = enquiriesQuery.data ?? [];

	return (
		<div className="dashboard-page">
			<main className={`${styles.enquiriesPage} section-wrap`}>
				<Link className="text-link cart-back-link" to="/member/home">
					<ArrowLeft size={15} /> Back to your harvest
				</Link>
				<div className="section-heading">
					<div><p className="eyebrow">A direct line to the farm</p><h1>Your enquiries</h1></div>
					<p>Ask a question and<br />we’ll get back to you.</p>
				</div>
				<section className={styles.enquiryCompose}>
					<p className="eyebrow">Ask us anything</p>
					<h2>How can we help?</h2>
					<form className={styles.enquiryForm} onSubmit={handleSubmit}>
						<label htmlFor="enquiry-question">Your question</label>
						<textarea id="enquiry-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about an order, the harvest, or anything else..." rows="4" maxLength="1000" required />
						{status && <p className={submitMutation.isError ? "form-error" : "form-success"} role={submitMutation.isError ? "alert" : "status"}>{status}</p>}
						<button className="button button--primary" disabled={submitMutation.isPending} type="submit">
							{submitMutation.isPending ? "Sending..." : <>Send enquiry <ArrowRight size={16} /></>}
						</button>
					</form>
				</section>
				<section className={styles.enquiryList} aria-labelledby="enquiry-list-heading">
					<div className="section-heading"><div><p className="eyebrow">Your conversations</p><h2 id="enquiry-list-heading">Questions you’ve asked</h2></div></div>
					{enquiriesQuery.isPending ? <p className="profile-message">Gathering your enquiries...</p> : enquiriesQuery.isError ? <p className="profile-message profile-message--error" role="alert">{enquiriesQuery.error.message}</p> : enquiries.length === 0 ? <div className="profile-message"><MessageCircle size={22} /><p>No enquiries yet. We’re here when you need us.</p></div> : (
						<div className={styles.enquiryCards}>
							{enquiries.map((enquiry) => (
								<article className={styles.enquiryCard} key={enquiry._id}>
									<header><time dateTime={enquiry.createdAt}>{formatDate(enquiry.createdAt)}</time><span className={enquiry.answer && enquiry.answer !== "Waiting for answer." ? `${styles.enquiryStatus} ${styles.enquiryStatusAnswered}` : styles.enquiryStatus}>{enquiry.answer && enquiry.answer !== "Waiting for answer." ? <><CircleCheck size={14} /> Answered</> : "Awaiting an answer"}</span></header>
									<h3>{enquiry.question}</h3>
									{enquiry.answer && enquiry.answer !== "Waiting for answer." && <div className={styles.enquiryAnswer}><strong>From the farm team</strong><p>{enquiry.answer}</p></div>}
								</article>
							))}
						</div>
					)}
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
