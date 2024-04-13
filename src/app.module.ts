import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StripeModule } from "./stripe/stripe.module";
import { ConfigModule } from "@nestjs/config";
@Module({
    imports: [ConfigModule.forRoot(), StripeModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
