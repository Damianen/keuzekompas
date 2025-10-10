export interface IAiService {
    generateResponse(prompt: string, maxTokens?: number): Promise<string>;
}
