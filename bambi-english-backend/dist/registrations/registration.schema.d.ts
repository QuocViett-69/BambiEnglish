import { Document, Types } from 'mongoose';
export type RegistrationDocument = Registration & Document;
export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
export declare class Registration {
    studentName: string;
    parentPhone: string;
    courseId: Types.ObjectId;
    paymentStatus: PaymentStatus;
    orderId: string;
    momoTransId: string;
}
export declare const RegistrationSchema: import("mongoose").Schema<Registration, import("mongoose").Model<Registration, any, any, any, any, any, Registration>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Registration, Document<unknown, {}, Registration, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    studentName?: import("mongoose").SchemaDefinitionProperty<string, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentPhone?: import("mongoose").SchemaDefinitionProperty<string, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    courseId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<PaymentStatus, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orderId?: import("mongoose").SchemaDefinitionProperty<string, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    momoTransId?: import("mongoose").SchemaDefinitionProperty<string, Registration, Document<unknown, {}, Registration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Registration & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Registration>;
