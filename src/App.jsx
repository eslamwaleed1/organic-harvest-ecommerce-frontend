import { useState, Suspense, lazy } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from "react-router-dom";
import Cookies from "js-cookie";

import GuestHomePage from "./pages/public/GuestHomePage.jsx";
import VerifyEmailPage from "./pages/public/VerifyEmailPage.jsx";
import { CartProvider } from "./context/CartContext.jsx";
const LoginPage = lazy(() => import("./pages/public/LoginPage.jsx"));
const SignUpPage = lazy(() => import("./pages/public/SignUpPage.jsx"));
const CheckEmailPage = lazy(() => import("./pages/public/CheckEmailPage.jsx"));
const MemberHomePage = lazy(
	() => import("./pages/protected/MemberHomePage.jsx"),
);
const MemberOrdersPage = lazy(
	() => import("./pages/protected/MemberOrdersPage.jsx"),
);
const AdminHomePage = lazy(() => import("./pages/protected/AdminHomePage.jsx"));
const CartPage = lazy(() => import("./pages/protected/CartPage.jsx"));
const PaymentSuccessPage = lazy(() => import("./pages/protected/PaymentSuccessPage.jsx"));
const PaymentCancelPage = lazy(() => import("./pages/protected/PaymentCancelPage.jsx"));
const UserProfilePage = lazy(() => import("./pages/protected/UserProfilePage.jsx"));
const EnquiriesPage = lazy(() => import("./pages/protected/EnquiriesPage.jsx"));
const AdminProductsPage = lazy(() => import("./pages/protected/AdminProductsPage.jsx"));
const AdminOrdersPage = lazy(() => import("./pages/protected/AdminOrdersPage.jsx"));
const AdminEnquiriesPage = lazy(() => import("./pages/protected/AdminEnquiriesPage.jsx"));
const AdminInvitePage = lazy(() => import("./pages/protected/AdminInvitePage.jsx"));
const AdminUsersPage = lazy(() => import("./pages/protected/AdminUsersPage.jsx"));
const AdminSetPasswordPage = lazy(() => import("./pages/public/AdminSetPasswordPage.jsx"));
const ForgotPasswordPage = lazy(() => import("./pages/public/ForgotPasswordPage.jsx"));


const checkAuth = () => {
	return Cookies.get("is_logged_in") === "true";
};

const getStoredUserRole = () => {
	const rawData = Cookies.get("user_data");
	if (!rawData) return "";
	try {
		return String(JSON.parse(rawData).role ?? "").trim().toLowerCase();
	} catch (error) {
		console.error("Failed to parse user_data cookie:", error);
		return "";
	}
};

function GuestRoute({ isLoggedIn, redirectTo }) {
	if (isLoggedIn) return <Navigate to={redirectTo} replace />;
	return <Outlet />;
}

function MemberRoute({ isLoggedIn, userRole }) {
	if (!isLoggedIn) return <Navigate to="/login" replace />;
	if (userRole === "admin") return <Navigate to="/admin/home" replace />;
	return <Outlet />;
}

function AdminRoute({ isLoggedIn, userRole }) {
	if (!isLoggedIn) return <Navigate to="/login" replace />;
	if (userRole !== "admin") return <Navigate to="/member/home" replace />;
	return <Outlet />;
}

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(checkAuth);
	const [userRole, setUserRole] = useState(getStoredUserRole);

	const getUserHomePage = () => {
		if (userRole === "member") return "/member/home";
		if (userRole === "admin") return "/admin/home";
		return "/login";
	};

	return (
		<CartProvider>
			<BrowserRouter>
				<Suspense fallback={<div>Loading page...</div>}>
					<Routes>
						<Route
							element={
								<GuestRoute
									isLoggedIn={isLoggedIn}
									redirectTo={getUserHomePage()}
								/>
							}
						>
							<Route path="/" element={<GuestHomePage />} />
							<Route
								path="/login"
								element={
									<LoginPage
										setIsLoggedIn={setIsLoggedIn}
										setUserRole={setUserRole}
									/>
								}
							/>
							<Route
								path="/signup"
								element={
									<SignUpPage
										setIsLoggedIn={setIsLoggedIn}
										setUserRole={setUserRole}
									/>
								}
							/>
							<Route path="/check-email" element={<CheckEmailPage />} />
							<Route path="/verify-email" element={<VerifyEmailPage />} />
							<Route path="/admin/set-password" element={<AdminSetPasswordPage />} />
							<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						</Route>
						<Route path="/reset-password" element={<AdminSetPasswordPage />} />
						<Route element={<MemberRoute isLoggedIn={isLoggedIn} userRole={userRole} />}>
							<Route
								path="/member/home"
								element={
									<MemberHomePage
										setIsLoggedIn={setIsLoggedIn}
										setUserRole={setUserRole}
									/>
								}
							/>
							<Route path="/member/cart" element={<CartPage />} />
							<Route path="/member/profile" element={<UserProfilePage />} />
							<Route path="/member/enquiries" element={<EnquiriesPage />} />
							<Route
								path="/member/orders"
								element={<MemberOrdersPage />}
							/>
							<Route
								path="/payment/success"
								element={<PaymentSuccessPage />}
							/>
							<Route
								path="/payment/cancel"
								element={<PaymentCancelPage />}
							/>
						</Route>
						<Route element={<AdminRoute isLoggedIn={isLoggedIn} userRole={userRole} />}>
							<Route
								path="/admin/home"
								element={
									<AdminHomePage
										setIsLoggedIn={setIsLoggedIn}
										setUserRole={setUserRole}
									/>
								}
							/>
							<Route path="/admin/products" element={<AdminProductsPage />} />
							<Route path="/admin/orders" element={<AdminOrdersPage />} />
							<Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
							<Route path="/admin/invite" element={<AdminInvitePage />} />
							<Route path="/admin/users" element={<AdminUsersPage />} />
							<Route path="/admin/profile" element={<UserProfilePage />} />
						</Route>
					</Routes>
				</Suspense>
			</BrowserRouter>
		</CartProvider>
	);
}

export default App;
