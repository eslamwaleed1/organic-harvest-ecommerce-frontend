import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiRequest } from "../../lib/api.js";
import { useCart } from "../../hooks/useCart.js";
import { CircleCheck, CircleX, LoaderCircle, ArrowRight } from "lucide-react";
import styles from "../../styles/PaymentResultPage.module.css";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();

    const [state, setState] = useState("checking");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let stopped = false;
        let timeoutId;
        let attempts = 0;

        async function checkOrderStatus() {
            if (!sessionId) {
                setState("error");
                setError("The checkout session ID is missing.");
                return;
            }

            try {
                const result = await apiRequest(
                    `/api/payments/session/${encodeURIComponent(sessionId)}`
                );

                if (stopped) return;

                if (!result?.success || !result?.data) {
                    throw new Error(
                        result?.message || "Could not retrieve your order."
                    );
                }

                setOrder(result.data);

                if (result.data.status === "paid") {
                    setState("paid");
                    clearCart()
                    return;
                }

                if (result.data.status === "cancelled") {
                    setState("cancelled");
                    return;
                }

                attempts += 1;

                if (attempts >= 15) {
                    setState("pending");
                    return;
                }

                timeoutId = setTimeout(checkOrderStatus, 2000);
            } catch (err) {
                if (stopped) return;

                setState("error");
                setError(
                    err.message ||
                    "We couldn't verify your payment right now."
                );
            }
        }

        checkOrderStatus();

        return () => {
            stopped = true;
            clearTimeout(timeoutId);
        };
    }, [sessionId, clearCart]);

    if (state === "checking") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard} aria-live="polite">
                <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconPending}`}><LoaderCircle className={styles.spin} size={40} /></div>
                <p className="eyebrow">Just a moment</p>
                <h1>Confirming your payment...</h1>
                <p>
                    Your payment is being verified. Please wait a moment.
                </p>
                </section>
            </main>
        );
    }

    if (state === "paid") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard}>
                <div className={styles.paymentResultIcon}><CircleCheck size={42} /></div>
                <p className="eyebrow">You’re all set</p>
                <h1>Payment confirmed!</h1>
                <p>Thank you for shopping with Organic Harvest.</p>
                {order && (
                    <p>Order reference: {order.orderId}</p>
                )}
                <Link className="button button--primary" to="/">Continue shopping <ArrowRight size={16} /></Link>
                </section>
            </main>
        );
    }

    if (state === "cancelled") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard}>
                <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconCancelled}`}><CircleX size={42} /></div>
                <p className="eyebrow">Nothing was charged</p>
                <h1>Order cancelled</h1>
                <p>This order was cancelled and was not confirmed as paid.</p>
                <Link className="button button--outline" to="/">Return to shop <ArrowRight size={16} /></Link>
                </section>
            </main>
        );
    }

    if (state === "pending") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard}>
                <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconPending}`}><LoaderCircle size={42} /></div>
                <p className="eyebrow">Almost there</p>
                <h1>Payment is still processing</h1>
                <p>
                    We haven't received final confirmation yet.
                    Please check again shortly in your order history
                    or return to this page later.
                </p>
                <Link className="button button--primary" to="/">Continue shopping <ArrowRight size={16} /></Link>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.paymentResultPage}>
            <section className={`${styles.paymentResultCard} payment-result-card--error`}>
            <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconCancelled}`}><CircleX size={42} /></div>
            <p className="eyebrow">A little hiccup</p>
            <h1>We couldn't verify your payment</h1>
            <p role="alert">{error}</p>
            <p>
                Your payment status has not been confirmed on this page.
                Please don't pay again just because of this message.
            </p>
            <Link className="button button--outline" to="/">Return to shop <ArrowRight size={16} /></Link>
            </section>
        </main>
    );
}
