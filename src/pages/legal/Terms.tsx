import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - Doctic Medical OS</title>
                <meta name="description" content="Doctic Medical OS Terms of Service" />
            </Helmet>

            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto prose prose-invert prose-headings:text-foreground prose-a:text-primary">
                    <h1>Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: December 27, 2025</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        These Terms of Service ("Terms") govern your access to and use of Doctic Medical OS ("Service"), provided by Doctic Inc. By accessing or using the Service, you agree to be bound by these Terms. If you are using the Service on behalf of an entity, you represent that you have authority to bind that entity.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        Doctic provides a cloud-based medical practice management platform for scheduling, patient records, billing, telemedicine, and related features. The Service is intended for licensed healthcare professionals and covered entities under HIPAA.
                    </p>

                    <h2>3. Accounts and Registration</h2>
                    <p>
                        You must register for an account to use the Service. You agree to provide accurate information and keep it updated. You are responsible for all activity under your account.
                    </p>

                    <h2>4. HIPAA Compliance and Business Associate Agreement</h2>
                    <p>
                        Doctic acts as a Business Associate under HIPAA. By using the Service, you agree to enter into our Business Associate Agreement (BAA), available at <Link to="/legal/baa">/legal/baa</Link>. You are responsible for obtaining patient consents and ensuring your use complies with HIPAA.
                    </p>

                    <h2>5. Payments and Billing</h2>
                    <p>
                        Certain features require payment. You authorize recurring charges. All fees are non-refundable except as stated. We may change pricing with 30 days' notice.
                    </p>

                    <h2>6. Prohibited Conduct</h2>
                    <p>
                        You may not: reverse engineer the Service, use it for unlawful purposes, upload malicious code, or violate any laws including HIPAA.
                    </p>

                    <h2>7. Termination</h2>
                    <p>
                        We may suspend or terminate your access for violation of these Terms. You may terminate your account at any time.
                    </p>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, DOCTIC SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE 12 MONTHS PRECEDING THE CLAIM.
                    </p>

                    <h2>9. Governing Law</h2>
                    <p>
                        These Terms are governed by the laws of the State of Delaware, without regard to conflict of laws principles.
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

export default Terms;
