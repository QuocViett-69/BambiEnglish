"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const trials_service_1 = require("./trials.service");
const trials_controller_1 = require("./trials.controller");
const trial_schema_1 = require("./trial.schema");
let TrialsModule = class TrialsModule {
};
exports.TrialsModule = TrialsModule;
exports.TrialsModule = TrialsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: trial_schema_1.Trial.name, schema: trial_schema_1.TrialSchema }])],
        controllers: [trials_controller_1.TrialsController],
        providers: [trials_service_1.TrialsService],
    })
], TrialsModule);
//# sourceMappingURL=trials.module.js.map