import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule);

@Injectable()
export class TranscriptService {
  async processTranscript(fileBuffer: Buffer) {
    try {
      const data = await pdfParse(fileBuffer);
      const text = data.text;
      
      const extractedCourses = [];
      const addedCodes = new Set();

      // 1. Simulator Export Format (e.g. "ศท141-1 ภาษาอังกฤษพื้นฐาน 1: ลงแก้ได้เร็วที่สุดใน")
      const simRegex = /([ก-๙a-zA-Z]{2,3}\d{3}(?:-\d)?)\s+([^:]+):\s*ลงแก้ได้เร็วที่สุดใน/g;
      let match;
      while ((match = simRegex.exec(text)) !== null) {
        const code = match[1].trim();
        if (!addedCodes.has(code)) {
          extractedCourses.push({
            code: code,
            name: match[2].trim(),
            credits: 3, // mock
            grade: 'F',
          });
          addedCodes.add(code);
        }
      }

      // 2. Traditional University Format (e.g. "ศท141-1 ภาษาอังกฤษ 3.0 F")
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
    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw new BadRequestException('ไม่สามารถอ่านไฟล์ PDF ได้ โปรดตรวจสอบว่าเป็นไฟล์ Transcript ที่ถูกต้อง');
    }
  }
}
