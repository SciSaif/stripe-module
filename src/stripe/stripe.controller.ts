import { StripeService } from "./stripe.service";
import { StripeRepository } from "./stripe.repository";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaymentEvent } from "./stripe.types";

@Controller("stripe")
export class StripeController {
    constructor(
        private stripeService: StripeService,
        private stripeRepository: StripeRepository
    ) {}

    @Post("payment-intent")
    async createPaymentIntent(
        @Body() payload: { amount: number; currency: string }
    ) {
        const { amount, currency } = payload;
        const paymentIntent = await this.stripeService.createPaymentIntent(
            amount,
            currency
        );
        return { clientSecret: paymentIntent.client_secret };
    }

    @Get("payment-events")
    async getPaymentEvents(): Promise<PaymentEvent[]> {
        return this.stripeRepository.getAllPaymentEvents();
    }
}
