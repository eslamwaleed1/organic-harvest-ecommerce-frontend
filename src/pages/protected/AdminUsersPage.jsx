import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../lib/api.js";
import AdminPageLayout from "../../components/AdminPageLayout.jsx";

function getUserJoinedDate(user) {
	return user.dateJoined ?? user.createdAt ?? user.created_at ?? user.joinedAt;
}

function formatJoinedDate(user) {
	const value = getUserJoinedDate(user);
	if (!value) return "Not provided";
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "Invalid date"
		: new Intl.DateTimeFormat(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
			}).format(date);
}

export default function AdminUsersPage() {
	const query = useQuery({ queryKey: ["admin", "users"], queryFn: adminApi.users, select: (result) => result?.data ?? result?.users ?? result ?? [] });
	const users = Array.isArray(query.data) ? query.data : [];
	return <AdminPageLayout eyebrow="The farm family" title="Users" description="See the members and administrators in the system.">
	<section className="admin-panel"><div className="admin-panel-heading"><h2>All users</h2><span>{users.length} users</span></div>{query.isPending ? <p className="profile-message">Loading users...</p> : query.isError ? <p className="profile-message profile-message--error" role="alert">{query.error.message}</p> : <div className="admin-table-wrap"><table className="admin-table admin-table--users"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user._id ?? user.id}><td>{user.name || "Unnamed member"}</td><td>{user.email}</td><td>{user.role}</td><td>{formatJoinedDate(user)}</td></tr>)}</tbody></table></div>}</section>
	</AdminPageLayout>;
}
