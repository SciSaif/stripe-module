import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { PaypalService } from "./paypal.service";
import { PaypalController } from "./paypal.controller";
import { PaypalRepository } from "./paypal.repository";

@Module({
    imports: [ConfigModule],
    controllers: [PaypalController],
    providers: [
        {
            provide: PaypalService,
            useFactory: (
                configService: ConfigService,
                paypalRepository: PaypalRepository
            ) =>
                new PaypalService(
                    {
                        clientId: configService.get<string>("PAYPAL_CLIENT_ID"),
                        clientSecret: configService.get<string>(
                            "PAYPAL_CLIENT_SECRET"
                        ),
                    },
                    paypalRepository
                ),
            inject: [ConfigService, PaypalRepository],
        },
        PaypalRepository,
    ],
    exports: [PaypalService],
})
export class PaypalModule {}
