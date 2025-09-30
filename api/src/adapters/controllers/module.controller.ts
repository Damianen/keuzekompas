import type { Context } from "hono";
import type { ModuleService } from "@application/services/module.service.js";
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
        private moduleService: ModuleService
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
}
