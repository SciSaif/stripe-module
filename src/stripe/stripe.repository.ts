import { Injectable } from "@nestjs/common";
import { PaymentEvent } from "./stripe.types";

@Injectable()
export class StripeRepository {
    private paymentEvents: Map<string, PaymentEvent> = new Map();

    async createPaymentEvent(paymentEvent: PaymentEvent): Promise<void> {
        this.paymentEvents.set(paymentEvent.id, paymentEvent);
    }

    async getPaymentEvent(
        paymentEventId: string
    ): Promise<PaymentEvent | undefined> {
        return this.paymentEvents.get(paymentEventId);
    }

    async getAllPaymentEvents(): Promise<PaymentEvent[]> {
        return Array.from(this.paymentEvents.values());
    }
}
