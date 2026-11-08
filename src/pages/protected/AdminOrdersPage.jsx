import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api.js";
import AdminPageLayout from "../../components/AdminPageLayout.jsx";

export default function AdminOrdersPage() {
	const client = useQueryClient();
	const query = useQuery({ queryKey: ["admin", "orders"], queryFn: adminApi.orders, select: (result) => result?.data ?? result ?? [] });
	const remove = useMutation({ mutationFn: adminApi.deleteOrder, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "orders"] }) });
	const orders = Array.isArray(query.data) ? query.data : [];
	return <AdminPageLayout eyebrow="From the community" title="Orders" description="Review order activity without mixing it with product administration.">
		<section className="admin-panel"><div className="admin-panel-heading"><h2>Customer orders</h2><span>{orders.length} orders</span></div>{query.isPending ? <p className="profile-message">Loading orders...</p> : query.isError ? <p className="profile-message profile-message--error" role="alert">{query.error.message}</p> : <div className="admin-table-wrap"><table className="admin-table admin-table--orders"><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Actions</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td>#{order._id?.slice(-8)}</td><td>{order.userId?.name || order.userId?.email || "Member"}</td><td>{order.status || "Pending"}</td><td>RM{order.totalAmount ?? 0}</td><td><button className="admin-table-action admin-table-action--danger" type="button" onClick={() => remove.mutate(order._id)}>Delete</button></td></tr>)}</tbody></table></div>}</section>
	</AdminPageLayout>;
}
