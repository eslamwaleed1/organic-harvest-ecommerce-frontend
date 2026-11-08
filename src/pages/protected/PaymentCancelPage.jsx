
import { ArrowRight, CircleX } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../../styles/PaymentResultPage.module.css";

export default function PaymentCancelPage() {
    return (
        <main className={styles.paymentResultPage}>
            <section className={styles.paymentResultCard}>
                <div className={`${styles.paymentResultIcon} ${styles.paymentResultIconCancelled}`}><CircleX size={42} /></div>
                <p className="eyebrow">No worries</p>
                <h1>Checkout cancelled</h1>
                <p>Your payment was not completed, and nothing was charged.</p>
                <Link className="button button--primary" to="/member/cart">Return to your basket <ArrowRight size={16} /></Link>
            </section>
        </main>
    );
}
