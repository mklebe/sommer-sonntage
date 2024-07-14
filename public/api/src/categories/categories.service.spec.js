"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const categories_service_1 = require("./categories.service");
const axios_1 = require("@nestjs/axios");
const cat_scheduler_module_1 = require("../cat-scheduler/cat-scheduler.module");
describe('CategoriesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [axios_1.HttpModule, cat_scheduler_module_1.CatSchedulerModule],
            providers: [categories_service_1.CategoriesService],
        }).compile();
        service = module.get(categories_service_1.CategoriesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=categories.service.spec.js.map