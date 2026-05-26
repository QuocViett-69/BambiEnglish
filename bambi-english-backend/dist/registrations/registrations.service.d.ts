import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Registration, RegistrationDocument, PaymentStatus, PaymentMethod } from './registration.schema';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CoursesService } from '../courses/courses.service';
export declare class RegistrationsService {
    private registrationModel;
    private readonly httpService;
    private readonly coursesService;
    private readonly logger;
    constructor(registrationModel: Model<RegistrationDocument>, httpService: HttpService, coursesService: CoursesService);
    create(dto: CreateRegistrationDto): Promise<{
        message: string;
        orderId: string;
        paymentUrl: string;
        paymentMethod: string;
    }>;
    private _createMomoPayment;
    private _createVnpayPayment;
    mockPaymentSuccess(orderId: string): Promise<{
        success: boolean;
    }>;
    mockVnpaySuccess(orderId: string): Promise<{
        success: boolean;
    }>;
    handleMomoIpn(body: any): Promise<{
        resultCode: number;
        message: string;
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
        paymentStatus: PaymentStatus;
        paymentMethod: PaymentMethod;
        momoTransId: string;
        vnpayTransId: string;
        studentName: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, RegistrationDocument, {}, import("mongoose").DefaultSchemaOptions> & Registration & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
