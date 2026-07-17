import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscriptService } from './transcript.service';
import 'multer';
@Controller('api/transcript')
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTranscript(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.transcriptService.processTranscript(file.buffer);
  }
}
