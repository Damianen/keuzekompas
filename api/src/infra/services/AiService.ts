import type { IAiService } from '@domain/services/IAiService.js';

export class AiService implements IAiService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async generateResponse(prompt: string, maxTokens: number = 500): Promise<string> {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    n_predict: maxTokens,
                }),
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Extract the generated text from the response
            // Adjust this based on the actual API response format
            return data.content || data.text || data.completion || String(data);
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }
}
