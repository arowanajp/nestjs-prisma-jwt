import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from '@prisma/client';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getTaskBySelf(@Req() req: Request): Promise<Task[]> {
    return this.taskService.getTasksBySelf(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.taskService.getTaskById(req.user.id, taskId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTask(
    @Req() req: Request,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return this.taskService.deleteTask(req.user.id, taskId);
  }
}
