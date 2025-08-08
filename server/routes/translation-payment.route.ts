import { Request, Response } from "express";

import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createTranslationPaymentRoute = async (
  req: Request,
  res: Response
) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        message:
          "Payment system is not configured. Please contact support or check server configuration.",
      });
    }

    const { amount, customerEmail } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        service: "translation",
        customerEmail: customerEmail,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ message: "Error creating payment intent: " + error.message });
  }
};
