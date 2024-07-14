"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioEinsDate = void 0;
class RadioEinsDate {
    constructor(radioEinsFormat) {
        this.radioEinsFormat = radioEinsFormat;
        const [datum, uhrzeit] = this.radioEinsFormat.split('_');
        const [date, month, year] = datum.split('-');
        const [hour] = uhrzeit.split('-');
        this.dateFormat = new Date(`${year}-${month}-${date}T${hour}:00:00.000Z`);
    }
}
exports.RadioEinsDate = RadioEinsDate;
//# sourceMappingURL=RadioEinsDate.js.map