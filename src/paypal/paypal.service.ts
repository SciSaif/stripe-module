import { Injectable } from "@nestjs/common";
import { PaypalRepository } from "./paypal.repository";

interface PaypalConfig {
    clientId: string;
    clientSecret: string;
}

@Injectable()
export class PaypalService {
    private base = "https://api-m.sandbox.paypal.com";
    constructor(
        private config: PaypalConfig,
        private paypalRepository: PaypalRepository
    ) {}

    private generateAccessToken = async () => {
        try {
            if (!this.config.clientId || !this.config.clientSecret) {
                throw new Error("MISSING_API_CREDENTIALS");
            }
            const auth = Buffer.from(
                this.config.clientId + ":" + this.config.clientSecret
            ).toString("base64");
            const response = await fetch(`${this.base}/v1/oauth2/token`, {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Failed to generate Access Token:", error);
        }
    };

    createPayment = async ({
        amount,
        currency,
    }: {
        amount: number;
        currency: string;
    }) => {
        const accessToken = await this.generateAccessToken();
        const url = `${this.base}/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2),
                    },
                },
            ],
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        return this.handleResponse(response);
    };

    private async handleResponse(response) {
        try {
            console.log(response);
            const jsonResponse = await response.json();
            return {
                jsonResponse,
                httpStatusCode: response.status,
            };
        } catch (err) {
            console.log(err);
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }

    async capturePayment(orderID: string): Promise<any> {
        const accessToken = await this.generateAccessToken();
        const url = `${this.base}/v2/checkout/orders/${orderID}/capture`;
        // const url = `${this.base}/v2/payments/captures/${orderID}`;
        console.log(url);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        await this.paypalRepository.createPaymentEvent({
            id: orderID,
            type: "payment_intent.created",
            amount: 100,
            currency: "USD",
            created: new Date().getTime(),
        });

        return this.handleResponse(response);
    }
}
