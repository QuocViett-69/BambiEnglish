"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialsController = void 0;
const common_1 = require("@nestjs/common");
const trials_service_1 = require("./trials.service");
const create_trial_dto_1 = require("./dto/create-trial.dto");
const update_trial_dto_1 = require("./dto/update-trial.dto");
let TrialsController = class TrialsController {
    trialsService;
    constructor(trialsService) {
        this.trialsService = trialsService;
    }
    create(createTrialDto) {
        return this.trialsService.create(createTrialDto);
    }
    findAll() {
        return this.trialsService.findAll();
    }
    findOne(id) {
        return this.trialsService.findOne(id);
    }
    update(id, updateTrialDto) {
        return this.trialsService.update(id, updateTrialDto);
    }
    remove(id) {
        return this.trialsService.remove(id);
    }
};
exports.TrialsController = TrialsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trial_dto_1.CreateTrialDto]),
    __metadata("design:returntype", void 0)
], TrialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_trial_dto_1.UpdateTrialDto]),
    __metadata("design:returntype", void 0)
], TrialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrialsController.prototype, "remove", null);
exports.TrialsController = TrialsController = __decorate([
    (0, common_1.Controller)('trials'),
    __metadata("design:paramtypes", [trials_service_1.TrialsService])
], TrialsController);
//# sourceMappingURL=trials.controller.js.map