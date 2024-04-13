import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { StripeRepository } from "./stripe.repository";

@Module({
    imports: [ConfigModule],
    controllers: [StripeController],
    providers: [
        {
            provide: StripeService,
            useFactory: (
                configService: ConfigService,
                stripeRepository: StripeRepository
            ) =>
                new StripeService(
                    {
                        secretKey:
                            configService.get<string>("STRIPE_SECRET_KEY"),
                    },
                    stripeRepository
                ),
            inject: [ConfigService, StripeRepository],
        },
        StripeRepository,
    ],
    exports: [StripeService],
})
export class StripeModule {}
