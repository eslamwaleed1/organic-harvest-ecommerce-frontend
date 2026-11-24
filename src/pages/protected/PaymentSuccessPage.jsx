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

        function applyStatus(data) {
            setOrder(data);

            if (data.status === "paid") {
                clearCart();
                setState("paid");
                return true;
            }

            if (data.status === "failed" || data.status === "cancelled") {
                setState(data.status);
                return true;
            }

            return false;
        }

        async function finalizeOrder() {
            const result = await apiRequest(
                `/api/payments/session/${encodeURIComponent(sessionId)}/finalize`,
                { method: "POST" }
            );

            if (stopped) return;
            if (!result?.success || !result?.data) {
                throw new Error(result?.message || "Could not finalize your payment.");
            }

            if (!applyStatus(result.data)) setState("pending");
        }

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

                if (applyStatus(result.data)) return;

                attempts += 1;
                if (attempts >= 5) {
                    await finalizeOrder();
                    return;
                }

                timeoutId = setTimeout(checkOrderStatus, 1000);
            } catch (err) {
                if (stopped) return;

                if (err.status === 404) {
                    setState("failed");
                    return;
                }

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

    if (state === "failed") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard}>
                    <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconCancelled}`}><CircleX size={42} /></div>
                    <p className="eyebrow">Payment not completed</p>
                    <h1>Payment failed</h1>
                    <p>The payment was not completed and the pending order was removed. Please try again.</p>
                    <Link className="button button--primary" to="/member/cart">Return to your basket <ArrowRight size={16} /></Link>
                </section>
            </main>
        );
    }

    if (state === "pending") {
        return (
            <main className={styles.paymentResultPage}>
                <section className={styles.paymentResultCard}>
                <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconPending}`}><LoaderCircle size={42} /></div>
                <p className="eyebrow">Payment status</p>
                <h1>Payment is still processing</h1>
                <p>
                    Stripe has not confirmed the payment yet. Please don't submit another payment while this one is processing.
                </p>
                <Link className="button button--outline" to="/member/orders">View your orders <ArrowRight size={16} /></Link>
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
