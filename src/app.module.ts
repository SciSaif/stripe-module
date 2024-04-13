import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StripeModule } from "./stripe/stripe.module";
import { ConfigModule } from "@nestjs/config";
import { PaypalModule } from "./paypal/paypal.module";
@Module({
    imports: [ConfigModule.forRoot(), StripeModule, PaypalModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
