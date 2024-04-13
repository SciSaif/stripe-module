import { PaypalService } from "./paypal.service";
import { PaypalRepository } from "./paypal.repository";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaymentEvent } from "./paypal.types";

@Controller("paypal")
export class PaypalController {
    constructor(
        private paypalService: PaypalService,
        private paypalRepository: PaypalRepository
    ) {}

    @Post("payment-intent")
    async createPaymentIntent(
        @Body() payload: { amount: number; currency: string }
    ) {
        const { amount, currency } = payload;
        const paymentIntent = await this.paypalService.createPayment({
            amount,
            currency,
        });
        console.log(paymentIntent);
        // return { clientSecret: paymentIntent.client_secret };
        return paymentIntent;
    }

    @Post("capture")
    async capturePayment(@Body() payload: { orderID: string }) {
        const { orderID } = payload;
        console.log(orderID);
        const paymentCapture = await this.paypalService.capturePayment(orderID);
        console.log(paymentCapture);
        return paymentCapture;
    }

    @Get("payment-events")
    async getPaymentEvents(): Promise<PaymentEvent[]> {
        return this.paypalRepository.getAllPaymentEvents();
    }
}
