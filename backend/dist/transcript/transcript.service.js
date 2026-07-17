"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptService = void 0;
const common_1 = require("@nestjs/common");
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule);
let TranscriptService = class TranscriptService {
    async processTranscript(fileBuffer) {
        try {
            const data = await pdfParse(fileBuffer);
            const text = data.text;
            const extractedCourses = [];
            const addedCodes = new Set();
            const simRegex = /([ก-๙a-zA-Z]{2,3}\d{3}(?:-\d)?)\s+([^:]+):\s*ลงแก้ได้เร็วที่สุดใน/g;
            let match;
            while ((match = simRegex.exec(text)) !== null) {
                const code = match[1].trim();
                if (!addedCodes.has(code)) {
                    extractedCourses.push({
                        code: code,
                        name: match[2].trim(),
                        credits: 3,
                        grade: 'F',
                    });
                    addedCodes.add(code);
                }
            }
            const uniRegex = /([ก-๙a-zA-Z]{2,3}\d{3}(?:-\d)?)\s+(.+?)\s+(\d(?:\.\d)?)\s+([F,U,W]{1,2})/g;
            while ((match = uniRegex.exec(text)) !== null) {
                const code = match[1].trim();
                if (!addedCodes.has(code)) {
                    extractedCourses.push({
                        code: code,
                        name: match[2].trim(),
                        credits: parseFloat(match[3].trim()),
                        grade: match[4].trim(),
                    });
                    addedCodes.add(code);
                }
            }
            return {
                success: true,
                data: extractedCourses,
            };
        }
        catch (error) {
            console.error('PDF Parse Error:', error);
            throw new common_1.BadRequestException('ไม่สามารถอ่านไฟล์ PDF ได้ โปรดตรวจสอบว่าเป็นไฟล์ Transcript ที่ถูกต้อง');
        }
    }
};
exports.TranscriptService = TranscriptService;
exports.TranscriptService = TranscriptService = __decorate([
    (0, common_1.Injectable)()
], TranscriptService);
//# sourceMappingURL=transcript.service.js.map