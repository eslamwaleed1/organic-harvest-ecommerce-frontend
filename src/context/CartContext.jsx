import { useCallback, useEffect, useState } from "react";
import { CartContext } from "./cartContext.js";

const CART_STORAGE_KEY = "organic-harvest-cart";

function readStoredCart() {
	try {
		const storedCart = localStorage.getItem(CART_STORAGE_KEY);
		if (!storedCart) return [];
		const parsedCart = JSON.parse(storedCart);
		return Array.isArray(parsedCart) ? parsedCart : [];
	} catch (error) {
		console.error("Failed to load the saved cart:", error);
		return [];
	}
}

export function CartProvider({ children }) {
	const [items, setItems] = useState(readStoredCart);

	useEffect(() => {
		try {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
		} catch (error) {
			console.error("Failed to save the cart:", error);
		}
	}, [items]);

	function addItem(product) {
		const id = String(product._id ?? product.id ?? product.name);
		setItems((currentItems) => {
			const existingItem = currentItems.find((item) => item.id === id);
			if (existingItem) {
				return currentItems.map((item) =>
					item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
				);
			}
			return [...currentItems, { id, product, quantity: 1 }];
		});
	}

	function setQuantity(id, quantity) {
		const nextQuantity = Math.floor(Number(quantity));
		if (!Number.isFinite(nextQuantity) || nextQuantity < 1) return;
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === id ? { ...item, quantity: nextQuantity } : item,
			),
		);
	}

	function removeItem(id) {
		setItems((currentItems) => currentItems.filter((item) => item.id !== id));
	}

	const clearCart = useCallback(() => {
		setItems([]);
	}, []);

	const itemCount = items.reduce((count, item) => count + item.quantity, 0);

	return (
		<CartContext.Provider
			value={{ items, itemCount, addItem, setQuantity, removeItem, clearCart }}
		>
			{children}
		</CartContext.Provider>
	);
}
