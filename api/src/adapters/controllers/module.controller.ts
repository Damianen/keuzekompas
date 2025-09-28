import type { Context } from "hono";
import type { ModuleService } from "@application/services/module.service.js";
import type {
    CreateModuleDto,
    UpdateModuleDto,
    ModuleResponseDto,
    ModuleListDto
} from "@application/dtos/module.dto.js";
import type {
    ApiSuccessResponse,
    ApiErrorResponse,
    CreateResponse
} from "@application/dtos/common.dto.js";

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
                return c.json({
                    success: false,
                    error: {
                        code: 'CREATE_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<CreateResponse> = {
                success: true,
                data: {
                    id: result.value.id,
                    message: 'Module created successfully'
                }
            };

            return c.json(response, 201);
        } catch (error) {
            console.error('Create module error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to create module'
                }
            }, 500);
        }
    }

    async getById(c: Context) {
        try {
            const id = c.req.param('id');

            const result = await this.moduleService.getById.execute(id);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'MODULE_NOT_FOUND',
                        message: result.error.message
                    }
                }, 404);
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

            const response: ApiSuccessResponse<ModuleResponseDto> = {
                success: true,
                data: moduleResponse
            };

            return c.json(response);
        } catch (error) {
            console.error('Get module error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to retrieve module'
                }
            }, 500);
        }
    }

    async list(c: Context) {
        try {
            const result = await this.moduleService.list.execute();

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'LIST_FAILED',
                        message: result.error.message
                    }
                }, 400);
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

            const response: ApiSuccessResponse<ModuleListDto> = {
                success: true,
                data: moduleList
            };

            return c.json(response);
        } catch (error) {
            console.error('List modules error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to retrieve modules'
                }
            }, 500);
        }
    }

    async update(c: Context) {
        try {
            const id = c.req.param('id');
            const body: Partial<UpdateModuleDto> = await c.req.json();

            const updateData = { ...body, id };

            const result = await this.moduleService.update.execute(updateData as any);

            if (!result.ok) {
                return c.json({
                    success: false,
                    error: {
                        code: 'UPDATE_FAILED',
                        message: result.error.message
                    }
                }, 400);
            }

            const response: ApiSuccessResponse<CreateResponse> = {
                success: true,
                data: {
                    id: result.value.id,
                    message: 'Module updated successfully'
                }
            };

            return c.json(response);
        } catch (error) {
            console.error('Update module error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update module'
                }
            }, 500);
        }
    }

    async delete(c: Context) {
        try {
            const id = c.req.param('id');

            await this.moduleService.deleteModule.execute(id);

            const response: ApiSuccessResponse<{ message: string }> = {
                success: true,
                data: { message: 'Module deleted successfully' }
            };

            return c.json(response);
        } catch (error) {
            console.error('Delete module error:', error);
            return c.json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to delete module'
                }
            }, 500);
        }
    }
}
