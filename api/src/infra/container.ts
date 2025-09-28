import mongoose from "mongoose";
import { createMongooseConnection } from "./db/connect.js";
import { testMongoConnection } from "./db/test-connection.js";

// Domain services
import { PasswordHasher } from "./services/PasswordHasher.js";
import { JwtService } from "./services/JwtService.js";

// Repositories
import { UserRepo } from "./repos/user.repo.js";
import { ModuleRepo } from "./repos/module.repo.js";

// Application services
import { UserService } from "@application/services/user.service.js";
import { ModuleService } from "@application/services/module.service.js";

// Use cases
import { RegisterUser } from "@application/usecases/user/user.register.js";
import { LoginUser } from "@application/usecases/user/user.login.js";
import { UpdateUser } from "@application/usecases/user/user.update.js";
import { GetUserById } from "@application/usecases/user/user.getById.js";
import { DeleteUser } from "@application/usecases/user/user.delete.js";
import { ListFavorites } from "@application/usecases/user/user.listfavorites.js";
import { AddFavorite } from "@application/usecases/user/user.addFavorite.js";
import { RemoveFavorite } from "@application/usecases/user/user.removeFavorite.js";

import { CreateModule } from "@application/usecases/module/module.create.js";
import { UpdateModule } from "@application/usecases/module/module.update.js";
import { GetModuleById } from "@application/usecases/module/module.getById.js";
import { ListModules } from "@application/usecases/module/module.list.js";
import { DeleteModule } from "@application/usecases/module/module.delete.js";

// Controllers
import { UserController } from "@adapters/controllers/user.controller.js";
import { ModuleController } from "@adapters/controllers/module.controller.js";

// Middlewares
import { AuthMiddleware } from "@adapters/middlewares/auth.middleware.js";
import { ErrorMiddleware } from "@adapters/middlewares/error.middleware.js";

export interface AppContainer {
    // Infrastructure
    dbConnection: mongoose.Connection;
    passwordHasher: PasswordHasher;
    jwtService: JwtService;

    // Repositories
    userRepo: UserRepo;
    moduleRepo: ModuleRepo;

    // Application Services
    userService: UserService;
    moduleService: ModuleService;

    // Controllers
    userController: UserController;
    moduleController: ModuleController;

    // Middlewares
    authMiddleware: AuthMiddleware;
    errorMiddleware: typeof ErrorMiddleware;
}

export async function createContainer(config: {
    mongoUri: string;
    dbName: string;
    jwtSecret: string;
    saltRounds?: number;
}): Promise<AppContainer> {
    // Test database connection first
    const connectionWorking = await testMongoConnection(config.mongoUri, config.dbName);
    if (!connectionWorking) {
        throw new Error('MongoDB connection test failed. Please check your connection settings.');
    }

    // Database connection
    const dbConnection = await createMongooseConnection(config.mongoUri, config.dbName);

    // Infrastructure services
    const passwordHasher = new PasswordHasher(config.saltRounds || 12);
    const jwtService = new JwtService(config.jwtSecret);

    // Repositories
    const userRepo = new UserRepo(dbConnection);
    const moduleRepo = new ModuleRepo(dbConnection);

    // Use cases
    const registerUser = new RegisterUser(userRepo, passwordHasher);
    const loginUser = new LoginUser(userRepo, passwordHasher);
    const updateUser = new UpdateUser(userRepo);
    const getUserById = new GetUserById(userRepo);
    const deleteUser = new DeleteUser(userRepo);
    const listFavorites = new ListFavorites(userRepo);
    const addFavorite = new AddFavorite(userRepo, moduleRepo);
    const removeFavorite = new RemoveFavorite(userRepo, moduleRepo);

    const createModule = new CreateModule(moduleRepo);
    const updateModule = new UpdateModule(moduleRepo);
    const getModuleById = new GetModuleById(moduleRepo);
    const listModules = new ListModules(moduleRepo);
    const deleteModule = new DeleteModule(moduleRepo);

    // Application services
    const userService = new UserService(
        deleteUser,
        updateUser,
        registerUser,
        loginUser,
        getUserById,
        listFavorites,
        addFavorite,
        removeFavorite
    );

    const moduleService = new ModuleService(
        deleteModule,
        updateModule,
        createModule,
        listModules,
        getModuleById
    );

    // Controllers
    const userController = new UserController(userService, jwtService);
    const moduleController = new ModuleController(moduleService);

    // Middlewares
    const authMiddleware = new AuthMiddleware(jwtService, userRepo);

    return {
        dbConnection,
        passwordHasher,
        jwtService,
        userRepo,
        moduleRepo,
        userService,
        moduleService,
        userController,
        moduleController,
        authMiddleware,
        errorMiddleware: ErrorMiddleware
    };
}
