import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api.js";
import AdminPageLayout from "../../components/AdminPageLayout.jsx";

export default function AdminEnquiriesPage() {
	const client = useQueryClient();
	const enquiries = useQuery({ queryKey: ["admin", "enquiries"], queryFn: adminApi.enquiries, select: (result) => result?.data ?? [] });
	const suggestions = useQuery({ queryKey: ["admin", "suggestions"], queryFn: adminApi.suggestions, select: (result) => result?.data ?? [] });
	const [answers, setAnswers] = useState({});
	const answer = useMutation({ mutationFn: ({ id, value }) => adminApi.updateEnquiryAnswer(id, value), onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "enquiries"] }) });
	const items = Array.isArray(enquiries.data) ? enquiries.data : [];
	const notes = Array.isArray(suggestions.data) ? suggestions.data : [];
	return <AdminPageLayout eyebrow="From the community" title="Enquiries" description="Answer member questions and review anonymous suggestions.">
		<div className="admin-feedback-columns admin-feedback-columns--page"><section className="admin-panel"><div className="admin-panel-heading"><h2>Member enquiries</h2><span>{items.length}</span></div>{enquiries.isPending ? <p className="profile-message">Loading enquiries...</p> : items.map((item) => <article className="admin-feedback-item" key={item._id}><small>{item.userId?.name || item.userId?.email || "Member"}</small><strong>{item.question}</strong><textarea rows="3" placeholder={item.answer} value={answers[item._id] ?? ""} onChange={(event) => setAnswers({ ...answers, [item._id]: event.target.value })} /><button className="button button--primary" disabled={!answers[item._id]?.trim() || answer.isPending} type="button" onClick={() => answer.mutate({ id: item._id, value: answers[item._id].trim() })}>Save answer</button></article>)}</section><section className="admin-panel"><div className="admin-panel-heading"><h2>Suggestions</h2><span>Anonymous</span></div>{suggestions.isPending ? <p className="profile-message">Loading suggestions...</p> : notes.map((item) => <article className="admin-feedback-item" key={item._id}><small>{new Date(item.createdAt).toLocaleDateString()}</small><strong>{item.text}</strong></article>)}</section></div>
	</AdminPageLayout>;
}
