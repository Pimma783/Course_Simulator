import { TranscriptService } from './transcript.service';
import 'multer';
export declare class TranscriptController {
    private readonly transcriptService;
    constructor(transcriptService: TranscriptService);
    uploadTranscript(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            code: string;
            name: string;
            credits: number;
            grade: string;
        }[];
    }>;
}
