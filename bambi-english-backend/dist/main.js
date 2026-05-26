"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });
    await app.listen(3000, '0.0.0.0');
    console.log('🚀 Bambi English API running at http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map