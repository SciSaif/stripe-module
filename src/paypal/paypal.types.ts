export interface PaymentEvent {
    id: string;
    type: string;
    amount: number;
    currency: string;
    created: number;
}
