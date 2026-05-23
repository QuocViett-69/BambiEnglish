import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { RegistrationDocument, PaymentStatus } from './registration.schema';
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
    }>;
    mockPaymentSuccess(orderId: string): Promise<{
        success: boolean;
    }>;
    handleMomoIpn(body: any): Promise<{
        resultCode: number;
        message: string;
    }>;
    getPaymentStatus(orderId: string): Promise<{
        orderId: string;
        paymentStatus: PaymentStatus;
        momoTransId: string;
        studentName: string;
    }>;
}
