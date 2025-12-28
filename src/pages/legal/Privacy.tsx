import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Doctic Medical OS</title>
                <meta name="description" content="Doctic Medical OS Privacy Policy" />
            </Helmet>

            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto prose prose-invert prose-headings:text-foreground prose-a:text-primary">
                    <h1>Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: December 27, 2025</p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect: (a) Account information (name, email, credentials); (b) Protected Health Information (PHI) you upload or enter; (c) Usage data (IP, browser, interactions); (d) Payment information (processed by Stripe).
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your information to provide the Service, improve features, communicate with you, and comply with legal obligations including HIPAA.
                    </p>

                    <h2>3. HIPAA Compliance</h2>
                    <p>
                        As a Business Associate, we implement administrative, physical, and technical safeguards to protect PHI. We do not use or disclose PHI except as permitted by our BAA or required by law.
                    </p>

                    <h2>4. Data Sharing</h2>
                    <p>
                        We do not sell PHI. We may share de-identified data for analytics or with subprocessors under strict agreements (e.g., AWS for hosting).
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You may request access, correction, or deletion of PHI (subject to HIPAA retention requirements). Contact us at privacy@doctic.com.
                    </p>

                    <h2>6. Security</h2>
                    <p>
                        We use encryption in transit and at rest, regular security audits, and access controls. No system is 100% secure.
                    </p>

                    <h2>7. Data Retention</h2>
                    <p>
                        We retain PHI according to HIPAA requirements (typically 6 years from the last date of service). Account data is retained while your account is active.
                    </p>

                    <h2>8. International Data Transfers</h2>
                    <p>
                        Your data may be processed in the United States. We comply with applicable data protection laws.
                    </p>

                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy. We will notify you of material changes via email or in-app notification.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        For privacy questions or to exercise your rights, contact us at: <a href="mailto:privacy@doctic.com">privacy@doctic.com</a>
                    </p>

                    <div className="mt-12">
                        <Link to="/" className="text-primary hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Privacy;
