import { action } from "./_generated/server";
import { v } from "convex/values";

// Create Stripe checkout session
export const createCheckoutSession = action({
    args: {
        userId: v.string(),
        email: v.string(),
        priceId: v.optional(v.string()),
    },
    handler: async (_, args) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeKey) {
            // Return mock URL for testing
            return {
                url: `https://checkout.stripe.com/test?email=${encodeURIComponent(args.email)}&user=${args.userId}`,
                sessionId: "mock-session-id",
            };
        }

        try {
            // Dynamic import to avoid issues when Stripe is not configured
            const Stripe = (await import("stripe")).default;
            const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: args.priceId || process.env.STRIPE_PRICE_ID || "price_placeholder",
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/profile?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/profile?canceled=true`,
                customer_email: args.email,
                metadata: {
                    userId: args.userId,
                },
            });

            return {
                url: session.url,
                sessionId: session.id,
            };
        } catch (error) {
            console.error("Stripe error:", error);
            throw new Error("Failed to create checkout session");
        }
    },
});
