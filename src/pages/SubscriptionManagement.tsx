import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CreditCard, Loader2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { OutlookLayout } from "@/components/layout/OutlookLayout";

interface Subscription {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
}

export default function SubscriptionManagement() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [portalLoading, setPortalLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Fetch subscription data from backend
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscription?userId=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setSubscription(data.subscription);
                setLoading(false);
            })
            .catch(() => {
                toast({ title: "Error loading subscription", variant: "destructive" });
                setLoading(false);
            });
    }, [user, toast]);

    const handleOpenPortal = async () => {
        setPortalLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-portal-session`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerId: "cus_mock_123", // In production, get from user.stripeCustomerId
                    }),
                }
            );

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to create portal session");
            }
        } catch (error) {
            console.error("Portal error:", error);
            toast({
                title: "Failed to open billing portal",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
            });
        } finally {
            setPortalLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.")) return;

        setCancelLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cancel-subscription`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user?.id || "demo-user",
                        subscriptionId: "sub_mock_123", // In production, get from subscription object
                    }),
                }
            );

            if (res.ok) {
                toast({
                    title: "Subscription Canceled",
                    description: "Your subscription will remain active until the end of the billing period.",
                });
                setSubscription((prev) => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
            } else {
                throw new Error();
            }
        } catch {
            toast({ title: "Failed to cancel subscription", variant: "destructive" });
        } finally {
            setCancelLoading(false);
        }
    };

    const handleUpgrade = () => {
        window.location.href = "/pricing?upgrade=true";
    };

    if (loading) {
        return (
            <OutlookLayout
                singlePane={
                    <div className="min-h-screen flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                }
            />
        );
    }

    if (!subscription || subscription.plan === "free") {
        return (
            <OutlookLayout
                singlePane={
                    <>
                        <Helmet>
                            <title>Manage Subscription - Doctic</title>
                        </Helmet>

                        <div className="min-h-screen py-12 px-4">
                            <div className="max-w-2xl mx-auto text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">No Active Subscription</h2>
                                    <p className="text-muted-foreground mb-8">
                                        You are currently on the Free plan.
                                    </p>
                                    <Button asChild size="lg" className="rounded-full">
                                        <a href="/pricing">Upgrade Now</a>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }

    return (
        <OutlookLayout
            singlePane={
                <>
                    <Helmet>
                        <title>Manage Subscription - Doctic</title>
                    </Helmet>

                    <div className="min-h-screen bg-background py-12 px-4">
                        <div className="max-w-3xl mx-auto">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold text-center mb-12"
                            >
                                Manage Your Subscription
                            </motion.h1>

                            <Card className="glass-card border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                        Current Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-2xl font-semibold capitalize flex items-center gap-2">
                                                {subscription.plan}
                                                {subscription.status === "active" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                                                        <Check className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Status: <span className="font-medium capitalize">{subscription.status}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {subscription.currentPeriodEnd && (
                                                <p className="text-sm text-muted-foreground">
                                                    Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                                </p>
                                            )}
                                            {subscription.cancelAtPeriodEnd && (
                                                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-medium">
                                                    ⚠️ Cancels at period end
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <h4 className="font-semibold mb-3">Included Features</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary" />
                                                Unlimited patient records
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary" />
                                                Advanced scheduling & reminders
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary" />
                                                Telemedicine integration
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary" />
                                                Priority support
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                                        <Button
                                            variant="default"
                                            onClick={handleOpenPortal}
                                            className="flex-1 rounded-full bg-primary"
                                            disabled={portalLoading}
                                        >
                                            {portalLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CreditCard className="mr-2 h-4 w-4" />
                                            )}
                                            Manage Billing (Stripe Portal)
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleUpgrade}
                                            className="flex-1 rounded-full"
                                        >
                                            Change Plan
                                        </Button>

                                        {!subscription.cancelAtPeriodEnd && subscription.plan !== "free" && (
                                            <Button
                                                variant="destructive"
                                                onClick={handleCancel}
                                                disabled={cancelLoading}
                                                className="flex-1 rounded-full"
                                            >
                                                {cancelLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    "Cancel Subscription"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mt-8 text-center text-sm text-muted-foreground">
                                <p>
                                    Need help?{" "}
                                    <a href="mailto:support@doctic.com" className="text-primary hover:underline">
                                        Contact support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}
