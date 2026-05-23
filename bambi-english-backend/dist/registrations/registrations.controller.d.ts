import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    create(dto: CreateRegistrationDto): Promise<{
        message: string;
        orderId: string;
        paymentUrl: string;
    }>;
    handleMomoIpn(body: any): Promise<{
        resultCode: number;
        message: string;
    }>;
    mockPayment(body: {
        orderId: string;
    }): Promise<{
        success: boolean;
    }>;
    getPaymentStatus(orderId: string): Promise<{
        orderId: string;
        paymentStatus: import("./registration.schema").PaymentStatus;
        momoTransId: string;
        studentName: string;
    }>;
}
