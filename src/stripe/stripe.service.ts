import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeRepository } from "./stripe.repository";

interface StripeConfig {
    secretKey: string;
}

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private config: StripeConfig,
        private stripeRepository: StripeRepository
    ) {
        this.stripe = new Stripe(this.config.secretKey);
    }

    async createCustomer(email: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({ email });
    }

    async createPaymentIntent(
        amount: number,
        currency: string = "inr"
    ): Promise<Stripe.PaymentIntent> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
        });

        await this.stripeRepository.createPaymentEvent({
            id: paymentIntent.id,
            type: "payment_intent.created",
            amount: amount,
            currency,
            created: paymentIntent.created,
        });

        return paymentIntent;
    }
}
