"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RegistrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const crypto = __importStar(require("crypto"));
const uuid_1 = require("uuid");
const registration_schema_1 = require("./registration.schema");
const courses_service_1 = require("../courses/courses.service");
const MOMO_PARTNER_CODE = 'MOMO';
const MOMO_ACCESS_KEY = 'F8BBA842ECF85';
const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create';
const MOMO_REDIRECT_URL = 'http://localhost:4200/payment-result';
const MOMO_IPN_URL = 'http://localhost:3000/api/registrations/payment/ipn';
const MOMO_REQUEST_TYPE = 'payWithMethod';
let RegistrationsService = RegistrationsService_1 = class RegistrationsService {
    registrationModel;
    httpService;
    coursesService;
    logger = new common_1.Logger(RegistrationsService_1.name);
    constructor(registrationModel, httpService, coursesService) {
        this.registrationModel = registrationModel;
        this.httpService = httpService;
        this.coursesService = coursesService;
    }
    async create(dto) {
        const course = await this.coursesService.findById(dto.courseId);
        if (!course) {
            throw new common_1.NotFoundException(`Không tìm thấy khóa học với ID: ${dto.courseId}`);
        }
        const amount = course.price;
        const orderId = `BAMBI-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const requestId = (0, uuid_1.v4)();
        const orderInfo = `Dang ky khoa hoc ${course.title}`;
        const extraData = '';
        const rawSignature = `accessKey=${MOMO_ACCESS_KEY}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${MOMO_IPN_URL}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${MOMO_PARTNER_CODE}` +
            `&redirectUrl=${MOMO_REDIRECT_URL}` +
            `&requestId=${requestId}` +
            `&requestType=${MOMO_REQUEST_TYPE}`;
        const signature = crypto
            .createHmac('sha256', MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex');
        this.logger.debug(`[MoMo] rawSignature: ${rawSignature}`);
        this.logger.debug(`[MoMo] signature: ${signature}`);
        const requestBody = {
            partnerCode: MOMO_PARTNER_CODE,
            partnerName: 'Bambi English',
            storeId: 'BambiEnglishStore',
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: MOMO_REDIRECT_URL,
            ipnUrl: MOMO_IPN_URL,
            lang: 'vi',
            requestType: MOMO_REQUEST_TYPE,
            autoCapture: true,
            extraData,
            signature,
        };
        let payUrl;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(MOMO_ENDPOINT, requestBody, {
                headers: { 'Content-Type': 'application/json' },
            }));
            const momoResponse = response.data;
            this.logger.log(`[MoMo] Response: ${JSON.stringify(momoResponse)}`);
            if (momoResponse.resultCode !== 0) {
                throw new common_1.InternalServerErrorException(`MoMo từ chối tạo thanh toán: ${momoResponse.message}`);
            }
            payUrl = momoResponse.payUrl;
        }
        catch (error) {
            this.logger.error('[MoMo] Lỗi kết nối tới MoMo API', error?.message);
            throw new common_1.InternalServerErrorException('Không thể kết nối cổng thanh toán MoMo');
        }
        const registration = new this.registrationModel({
            studentName: dto.studentName,
            parentPhone: dto.parentPhone,
            courseId: dto.courseId,
            paymentStatus: registration_schema_1.PaymentStatus.PENDING,
            orderId,
        });
        await registration.save();
        return {
            message: 'Đăng ký thành công! Đang chuyển tới cổng thanh toán MoMo...',
            orderId,
            paymentUrl: payUrl,
        };
    }
    async handleMomoIpn(body) {
        this.logger.log(`[MoMo IPN] Nhận callback: ${JSON.stringify(body)}`);
        const { orderId, resultCode, transId, amount, message, signature: receivedSignature, } = body;
        const rawSignature = `accessKey=${MOMO_ACCESS_KEY}` +
            `&amount=${amount}` +
            `&extraData=${body.extraData ?? ''}` +
            `&message=${message}` +
            `&orderId=${orderId}` +
            `&orderInfo=${body.orderInfo}` +
            `&orderType=${body.orderType}` +
            `&partnerCode=${MOMO_PARTNER_CODE}` +
            `&payType=${body.payType}` +
            `&requestId=${body.requestId}` +
            `&responseTime=${body.responseTime}` +
            `&resultCode=${resultCode}` +
            `&transId=${transId}`;
        const expectedSignature = crypto
            .createHmac('sha256', MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex');
        if (receivedSignature !== expectedSignature) {
            this.logger.warn('[MoMo IPN] Chữ ký không hợp lệ! Bỏ qua request.');
            return { resultCode: 99, message: 'Invalid signature' };
        }
        const registration = await this.registrationModel.findOne({ orderId });
        if (!registration) {
            this.logger.warn(`[MoMo IPN] Không tìm thấy đơn: ${orderId}`);
            return { resultCode: 99, message: 'Order not found' };
        }
        if (Number(resultCode) === 0) {
            registration.paymentStatus = registration_schema_1.PaymentStatus.SUCCESS;
            registration.momoTransId = String(transId);
            this.logger.log(`[MoMo IPN] ✅ Thanh toán thành công: ${orderId}`);
        }
        else {
            registration.paymentStatus = registration_schema_1.PaymentStatus.FAILED;
            this.logger.warn(`[MoMo IPN] ❌ Thanh toán thất bại (${resultCode}): ${message}`);
        }
        await registration.save();
        return { resultCode: 0, message: 'Received' };
    }
    async getPaymentStatus(orderId) {
        const registration = await this.registrationModel
            .findOne({ orderId })
            .populate('courseId');
        if (!registration) {
            throw new common_1.NotFoundException(`Không tìm thấy đơn đăng ký: ${orderId}`);
        }
        return {
            orderId,
            paymentStatus: registration.paymentStatus,
            momoTransId: registration.momoTransId ?? null,
            studentName: registration.studentName,
        };
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = RegistrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(registration_schema_1.Registration.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService,
        courses_service_1.CoursesService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map