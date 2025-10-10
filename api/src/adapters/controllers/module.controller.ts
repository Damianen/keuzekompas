import type { Context } from "hono";
import type { ModuleService } from "@application/services/module.service.js";
import type { IAiService } from "@domain/services/IAiService.js";
import type {
    CreateModuleDto,
    UpdateModuleDto,
    ModuleResponseDto,
    ModuleListDto
} from "@application/dtos/module.dto.js";
import type {
    CreateResponse
} from "@application/dtos/common.dto.js";
import { ResSuccess, ResError } from "@utils/response.js";

export class ModuleController {
    constructor(
        private moduleService: ModuleService,
        private aiService?: IAiService
    ) { }

    async create(c: Context) {
        try {
            const body: CreateModuleDto = await c.req.json();

            const moduleData = {
                ...body,
                createdAt: new Date()
            };

            const result = await this.moduleService.create.execute(moduleData);

            if (!result.ok) {
                return ResError(c, 'CREATE_FAILED', result.error.message, 400);
            }

            const responseData: CreateResponse = {
                id: result.value.id,
                message: 'Module created successfully'
            };

            return ResSuccess(c, responseData, 201);
        } catch (error) {
            console.error('Create module error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to create module', 500);
        }
    }

    async getById(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.moduleService.getById.execute(id);

            if (!result.ok) {
                return ResError(c, 'MODULE_NOT_FOUND', result.error.message, 404);
            }

            const module = result.value;
            const moduleResponse: ModuleResponseDto = {
                id: module.id!,
                name: module.name,
                location: module.location,
                period: module.period,
                provider: module.provider,
                duration: module.duration,
                language: module.language,
                level: module.level,
                description: module.description,
                information: module.information,
                createdAt: module.createdAt
            };

            return ResSuccess(c, moduleResponse);
        } catch (error) {
            console.error('Get module error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to retrieve module', 500);
        }
    }

    async list(c: Context) {
        try {
            const result = await this.moduleService.list.execute();

            if (!result.ok) {
                return ResError(c, 'LIST_FAILED', result.error.message, 400);
            }

            const modules: ModuleResponseDto[] = result.value.map(module => ({
                id: module.id!,
                name: module.name,
                location: module.location,
                period: module.period,
                provider: module.provider,
                duration: module.duration,
                language: module.language,
                level: module.level,
                description: module.description,
                information: module.information,
                createdAt: module.createdAt
            }));

            const moduleList: ModuleListDto = {
                modules,
                total: modules.length
            };

            return ResSuccess(c, moduleList);
        } catch (error) {
            console.error('List modules error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to retrieve modules', 500);
        }
    }

    async update(c: Context) {
        try {
            const id = c.req.param('id');
            const body: Partial<UpdateModuleDto> = await c.req.json();

            const updateData = { ...body, id };

            const result = await this.moduleService.update.execute(updateData as any);

            if (!result.ok) {
                return ResError(c, 'UPDATE_FAILED', result.error.message, 400);
            }

            const responseData: CreateResponse = {
                id: result.value.id,
                message: 'Module updated successfully'
            };

            return ResSuccess(c, responseData);
        } catch (error) {
            console.error('Update module error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to update module', 500);
        }
    }

    async delete(c: Context) {
        try {
            const id = c.req.param('id');

            await this.moduleService.deleteModule.execute(id);

            return ResSuccess(c, { message: 'Module deleted successfully' });
        } catch (error) {
            console.error('Delete module error:', error);
            return ResError(c, 'INTERNAL_ERROR', 'Failed to delete module', 500);
        }
    }

    async askQuestion(c: Context) {
        try {
            if (!this.aiService) {
                return ResError(c, 'AI_SERVICE_UNAVAILABLE', 'AI service is not configured', 503);
            }

            const body = await c.req.json();
            const { moduleId, question, conversationHistory = [] } = body;

            if (!moduleId || !question) {
                return ResError(c, 'INVALID_REQUEST', 'moduleId and question are required', 400);
            }

            // Get module details
            const moduleResult = await this.moduleService.getById.execute(moduleId);
            if (!moduleResult.ok) {
                return ResError(c, 'MODULE_NOT_FOUND', 'Module not found', 404);
            }

            const module = moduleResult.value;

            // Build context-aware prompt with only current question
            let prompt = `You are a helpful assistant answering questions about university modules. Keep your answers short, simple, and direct. Only provide essential information.\n\n`;
            prompt += `Module Information:\n`;
            prompt += `Name: ${module.name}\n`;
            prompt += `Provider: ${module.provider}\n`;
            prompt += `Level: ${module.level}\n`;
            prompt += `Duration: ${module.duration} weeks\n`;
            prompt += `Location: ${module.location}\n`;
            prompt += `Language: ${module.language}\n`;
            prompt += `Period: ${module.period}\n`;
            prompt += `Description: ${module.description}\n`;
            prompt += `Additional Information: ${module.information}\n\n`;

            // Add current question only (no conversation history)
            prompt += `Question: ${question}\n`;

            // Generate AI response
            const answer = await this.aiService.generateResponse(prompt, 50);

            return ResSuccess(c, {
                answer: answer.trim(),
                conversationHistory: [
                    ...conversationHistory,
                    { role: 'user', content: question, timestamp: new Date() },
                    { role: 'assistant', content: answer.trim(), timestamp: new Date() }
                ]
            });
        } catch (error) {
            console.error('AI question error:', error);
            return ResError(c, 'AI_ERROR', 'Failed to generate response', 500);
        }
    }
}
