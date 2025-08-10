import { Request, Response } from "express";
import { storage } from "../storage";

import Stripe from "stripe";

const stripe =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_your_stripe_secret_key_here"
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

export const createCreateGuideFormPaymentRoute = async (
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

    const { amount, formId, customerEmail } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card", "amazon_pay"],
      metadata: {
        service: "form_guide",
        formId: formId,
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

export const createGuidePaymentRoute = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        message:
          "Payment system is not configured. Please contact support or check server configuration.",
      });
    }

    const { guideId, customerEmail } = req.body;

    // Get guide details to determine price
    const guides = await storage.getAllGuides();
    const guide = guides.find((g) => g.id === guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const price = Number(guide.price);
    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid guide price" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      metadata: {
        service: "immigration_guide",
        guideId: guideId.toString(),
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
