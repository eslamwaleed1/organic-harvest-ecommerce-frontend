import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../lib/api.js";
import AdminPageLayout from "../../components/AdminPageLayout.jsx";

export default function AdminInvitePage() {
	const [form, setForm] = useState({ name: "", email: "", secondaryEmail: "" });
	const invite = useMutation({ mutationFn: authApi.adminInvitation, onSuccess: () => setForm({ name: "", email: "", secondaryEmail: "" }) });
	return <AdminPageLayout eyebrow="Grow the team" title="Invite an administrator" description="Send a secure 24-hour invitation to a new farm administrator.">
		<section className="admin-panel admin-panel--narrow"><h2>Invitation details</h2><p className="admin-panel-intro">The local address must use the <strong>@organicharvest.com</strong> domain. The invitation link is sent to the real secondary email.</p><form className="admin-invite-form" onSubmit={(event) => { event.preventDefault(); invite.mutate(form); }}>{[["name", "Name", "text"], ["email", "Organic Harvest email", "email"], ["secondaryEmail", "Real secondary email", "email"]].map(([key, label, type]) => <label key={key}>{label}<input required type={type} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}<button className="button button--primary" disabled={invite.isPending} type="submit">{invite.isPending ? "Sending invitation..." : "Send invitation"}</button>{invite.isSuccess && <p className="form-success" role="status">Invitation sent successfully.</p>}{invite.isError && <p className="form-error" role="alert">{invite.error.message}</p>}</form></section>
	</AdminPageLayout>;
}
