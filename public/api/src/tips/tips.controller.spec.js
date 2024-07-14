"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tips_controller_1 = require("./tips.controller");
describe('TipsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tips_controller_1.TipsController],
        }).compile();
        controller = module.get(tips_controller_1.TipsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=tips.controller.spec.js.map