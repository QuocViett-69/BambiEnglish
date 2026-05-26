import { Document } from 'mongoose';
export type TrialDocument = Trial & Document;
export declare enum TrialStatus {
    NEW = "M\u1EDBi",
    CONTACTED = "\u0110\u00E3 li\u00EAn h\u1EC7",
    DONE = "\u0110\u00E3 xong"
}
export declare class Trial {
    parentName: string;
    phone: string;
    studentName?: string;
    studentAge?: string;
    email?: string;
    content?: string;
    status: TrialStatus;
    note?: string;
}
export declare const TrialSchema: import("mongoose").Schema<Trial, import("mongoose").Model<Trial, any, any, any, any, any, Trial>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Trial, Document<unknown, {}, Trial, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    parentName?: import("mongoose").SchemaDefinitionProperty<string, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    studentName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    studentAge?: import("mongoose").SchemaDefinitionProperty<string | undefined, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string | undefined, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<TrialStatus, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, Trial, Document<unknown, {}, Trial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Trial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Trial>;
