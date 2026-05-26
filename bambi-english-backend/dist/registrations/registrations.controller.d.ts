import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    create(dto: CreateRegistrationDto): Promise<{
        message: string;
        orderId: string;
        paymentUrl: string;
        paymentMethod: string;
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
    mockVnpayPayment(body: {
        orderId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleVnpayReturn(query: Record<string, string>): Promise<{
        isVerified: boolean;
        isSuccess: boolean;
        orderId: string;
        message: string;
    } | {
        isVerified: boolean;
        isSuccess: boolean;
        message: string;
        orderId?: undefined;
    }>;
    getPaymentStatus(orderId: string): Promise<{
        orderId: string;
        paymentStatus: import("./registration.schema").PaymentStatus;
        paymentMethod: import("./registration.schema").PaymentMethod;
        momoTransId: string;
        vnpayTransId: string;
        studentName: string;
    }>;
    getAllRegistrations(): Promise<(import("mongoose").Document<unknown, {}, import("./registration.schema").RegistrationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./registration.schema").Registration & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
