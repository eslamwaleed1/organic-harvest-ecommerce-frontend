import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api.js";
import AdminPageLayout from "../../components/AdminPageLayout.jsx";

const blank = { name: "", price: "", category: "", unit: "", image: "", description: "", inventory: "" };
const editableProductFields = ["name", "price", "category", "unit", "image", "description", "inventory"];
const unwrap = (result) => result?.data ?? result ?? [];

function getEditableProduct(product) {
	return editableProductFields.reduce((editable, field) => {
		editable[field] = product[field] ?? "";
		return editable;
	}, { ...blank });
}

export default function AdminProductsPage() {
	const client = useQueryClient();
	const query = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products, select: unwrap });
	const [form, setForm] = useState(blank);
	const [editingId, setEditingId] = useState("");
	const save = useMutation({
		mutationFn: ({ id, payload }) => id ? adminApi.updateProduct(id, payload) : adminApi.createProduct(payload),
		onSuccess: () => { setForm(blank); setEditingId(""); client.invalidateQueries({ queryKey: ["admin", "products"] }); },
	});
	const remove = useMutation({ mutationFn: adminApi.deleteProduct, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "products"] }) });
	const products = Array.isArray(query.data) ? query.data : [];
	function submit(event) {
		event.preventDefault();
		const payload = {
			...form,
			price: Number(form.price),
			inventory: Number(form.inventory),
		};
		if (!payload.image.trim()) delete payload.image;
		save.mutate({ id: editingId, payload });
	}
	return <AdminPageLayout eyebrow="The farm stand" title="Products" description="Keep seasonal produce, prices, and inventory in one clear place.">
		<section className="admin-panel">
			<div className="admin-panel-heading"><h2>{editingId ? "Edit product" : "Add a product"}</h2><span>{products.length} products</span></div>
			<form className="admin-product-form" onSubmit={submit}>
				{["name", "price", "category", "unit", "image", "inventory"].map((field) => <label key={field}>{field[0].toUpperCase() + field.slice(1)}<input required={field !== "image"} type={["price", "inventory"].includes(field) ? "number" : "text"} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}
				<label className="admin-form-wide">Description<textarea required rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
				<div className="admin-form-actions"><button className="button button--primary" disabled={save.isPending} type="submit">{save.isPending ? "Saving..." : editingId ? "Save changes" : "Add product"}</button>{editingId && <button className="button button--outline" type="button" onClick={() => { setEditingId(""); setForm(blank); }}>Cancel</button>}</div>
				{save.isError && <p className="form-error" role="alert">{save.error.message}</p>}
			</form>
		</section>
		<section className="admin-panel">
			<div className="admin-panel-heading"><h2>Product list</h2></div>
			{query.isPending ? <p className="profile-message">Loading products...</p> : query.isError ? <p className="profile-message profile-message--error" role="alert">{query.error.message}</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Inventory</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><strong>{product.name}</strong><small>{product.category}</small></td><td>RM{product.price}</td><td>{product.inventory ?? 0}</td><td><button className="admin-table-action" type="button" onClick={() => { setEditingId(product._id); setForm(getEditableProduct(product)); }}>Edit</button><button className="admin-table-action admin-table-action--danger" type="button" onClick={() => remove.mutate(product._id)}>Delete</button></td></tr>)}</tbody></table></div>}
		</section>
	</AdminPageLayout>;
}
