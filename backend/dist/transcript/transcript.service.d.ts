export declare class TranscriptService {
    processTranscript(fileBuffer: Buffer): Promise<{
        success: boolean;
        data: {
            code: string;
            name: string;
            credits: number;
            grade: string;
        }[];
    }>;
}
