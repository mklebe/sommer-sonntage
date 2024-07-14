"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cat_scheduler_service_1 = require("./cat-scheduler.service");
function createCategory(airingStartsAt, airingEndsAt) {
    return {
        airingStartsAt,
        airingEndsAt,
        board: [],
        id: 1,
        name: 'name',
        year: 2023,
        finishedListUrl: 'url',
    };
}
describe('CatSchedulerService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [cat_scheduler_service_1.CatSchedulerService],
        }).compile();
        service = module.get(cat_scheduler_service_1.CatSchedulerService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('isAiring', () => {
        it('must be airing when current time is between airing end and airing start', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() - 1000);
            const airingEndsAt = new Date(now.getTime() + 1000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isAiring(category)).toBe(true);
        });
        it('must not be airing when current time is before airing start', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() + 1000);
            const airingEndsAt = new Date(now.getTime() + 2000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isAiring(category)).toBe(false);
        });
    });
    describe('isUpcoming', () => {
        it('must be upcoming when current time is before airing start', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() + 1000);
            const airingEndsAt = new Date(now.getTime() + 2000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isUpcoming(category)).toBe(true);
        });
        it('must not be upcoming when current time is after airing start', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() - 1000);
            const airingEndsAt = new Date(now.getTime() + 1000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isUpcoming(category)).toBe(false);
        });
    });
    describe('isComplete', () => {
        it('must be complete when current time is after airing end', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() - 2000);
            const airingEndsAt = new Date(now.getTime() - 1000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isComplete(category)).toBe(true);
        });
        it('must not be complete when current time is before airing end', () => {
            const now = new Date();
            const airingStartsAt = new Date(now.getTime() - 1000);
            const airingEndsAt = new Date(now.getTime() + 1000);
            const category = createCategory(airingStartsAt, airingEndsAt);
            expect(service.isComplete(category)).toBe(false);
        });
    });
});
//# sourceMappingURL=cat-scheduler.service.spec.js.map