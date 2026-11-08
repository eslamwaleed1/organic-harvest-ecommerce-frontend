import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, authApi } from "../../lib/api.js";
import { DashboardHeader, SiteFooter } from "../../components/SiteChrome.jsx";
import authStyles from "../../styles/AuthForms.module.css";
import styles from "../../styles/ProfilePage.module.css";

function getProfile(result) {
	return result?.data ?? result;
}

function formatDate(value) {
	if (!value) return "Not available";
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "Not available"
		: new Intl.DateTimeFormat(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			}).format(date);
}

export default function UserProfilePage() {
	const queryClient = useQueryClient();
	const [formState, setFormState] = useState(null);
	const [message, setMessage] = useState("");
	const profileQuery = useQuery({
		queryKey: ["user-profile"],
		queryFn: userApi.profile,
		select: getProfile,
		staleTime: 60_000,
	});
	const updateProfile = useMutation({
		mutationFn: userApi.updateProfile,
		onSuccess: (result) => {
			queryClient.setQueryData(["user-profile"], result);
			setMessage("Your profile has been updated.");
		},
		onError: (error) =>
			setMessage(error.message || "We couldn't update your profile."),
	});

	const profile = profileQuery.data;
	const isAdmin = profile?.role === "Admin";
	const passwordChange = useMutation({
		mutationFn: authApi.changePassword,
		onSuccess: (result) => setMessage(result.message),
		onError: (error) =>
			setMessage(error.message || "We couldn't send a password change email."),
	});
	const form = formState ?? {
		name: profile?.name ?? "",
		email: profile?.email ?? "",
		address: profile?.address ?? "",
	};

	function handleChange(event) {
		setFormState((current) => ({
			...(current ?? form),
			[event.target.name]: event.target.value,
		}));
		setMessage("");
	}

	function handleSubmit(event) {
		event.preventDefault();
		setMessage("");
		updateProfile.mutate({
			name: form.name.trim(),
			email: form.email.trim(),
			address: form.address.trim() || null,
		});
	}

	return (
		<div className="dashboard-page">
			<DashboardHeader email={profile?.email} isAdmin={isAdmin} />
			<main className={`${styles.profilePage} section-wrap`}>
				<Link
					className="text-link cart-back-link"
					to={isAdmin ? "/admin/home" : "/member/home"}
				>
					<ArrowLeft size={15} /> Back to your harvest
				</Link>
				<div className="section-heading">
					<div>
						<p className="eyebrow">Your farm account</p>
						<h1>Your profile</h1>
					</div>
					<p>
						Keep your details fresh
						<br />
						for every visit.
					</p>
				</div>

				{profileQuery.isPending ? (
					<div className={styles.profileMessage} role="status">
						Gathering your profile...
					</div>
				) : profileQuery.isError ? (
					<div
						className={`${styles.profileMessage} ${styles.profileMessageError}`}
						role="alert"
					>
						We couldn’t load your profile. {profileQuery.error.message}
					</div>
				) : (
					<div className={styles.profileGrid}>
						<section className={styles.profileSummary}>
							<span className={styles.profileIcon}>
								<UserRound size={25} />
							</span>
							<h2>{profile.name || "Your account"}</h2>
							<p>{profile.email}</p>
							{!isAdmin && (
								<div className={styles.profileStat}>
									<strong>{profile.orderCount ?? 0}</strong>
									<span>
										{profile.orderCount === 1
											? "order placed"
											: "orders placed"}
									</span>
								</div>
							)}
							<p className={styles.profileJoined}>
								Joined {formatDate(profile.dateJoined)}
							</p>
						</section>
						<section className={styles.profileFormCard}>
							<p className="eyebrow">Personal details</p>
							<h2>Edit your profile</h2>
							<form
								className={`${authStyles.authForm} ${styles.profileForm}`}
								onSubmit={handleSubmit}
							>
								<label htmlFor="profile-name">Name</label>
								<input
									id="profile-name"
									name="name"
									value={form.name}
									onChange={handleChange}
									autoComplete="name"
									required
								/>
								<label htmlFor="profile-email">Email address</label>
								<input
									id="profile-email"
									name="email"
									value={form.email}
									onChange={handleChange}
									autoComplete="email"
									required
									type="email"
								/>
								{!isAdmin && (
									<>
										<label htmlFor="profile-address">Delivery address</label>
										<div className={styles.profileAddressField}>
											<MapPin size={17} aria-hidden="true" />
											<textarea
												id="profile-address"
												name="address"
												value={form.address}
												onChange={handleChange}
												autoComplete="street-address"
												placeholder="Add your full delivery address"
												rows="3"
											/>
										</div>
										<p className={styles.profileHelp}>
											Use your full street address so your orders can be
											prepared for the right place. You can leave this blank and
											add it later.
										</p>
									</>
								)}
								{message && (
									<p
										className={
											updateProfile.isError ? "form-error" : styles.formSuccess
										}
										role={updateProfile.isError ? "alert" : "status"}
									>
										{message}
									</p>
								)}
								<button
									className="button button--primary"
									disabled={updateProfile.isPending}
									type="submit"
								>
									{updateProfile.isPending ? (
										"Saving your details..."
									) : (
										<>
											Save profile <ArrowRight size={16} />
										</>
									)}
								</button>
								<button
									className="button button--primary"
									disabled={passwordChange.isPending}
									onClick={() => passwordChange.mutate()}
									type="button"
								>
									{passwordChange.isPending
										? "Sending email..."
										: "Change my password"}
								</button>
							</form>
						</section>
					</div>
				)}
			</main>
			<SiteFooter />
		</div>
	);
}
