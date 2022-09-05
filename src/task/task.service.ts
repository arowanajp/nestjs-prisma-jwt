import { ForbiddenException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 全件のタスクを取得
   * @returns
   */
  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tasks;
  }

  /**
   * 自分のタスクのみ取得
   * @param userId
   * @returns
   */
  async getTasksBySelf(userId: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tasks;
  }

  /**
   * タスクIDからタスクを取得
   * @param userId
   * @param taskId
   * @returns
   */
  async getTaskById(userId: number, taskId: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
    if (!task) throw new ForbiddenException('タスクがありません');
    return task;
  }

  /**
   * タスク作成
   * @param userId
   * @param dto
   * @returns task
   */
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        userId,
        ...dto,
      },
    });
    return task;
  }

  /**
   * タスク更新
   * @param taskId
   * @param dto
   * @returns task
   */
  async updateTask(taskId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
    if (!task) throw new ForbiddenException('タスクがありません');
    return task;
  }

  /**
   * タスク削除
   * @param userId
   * @param taskId
   */
  async deleteTask(userId: number, taskId: number): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
    if (!task) throw new ForbiddenException('タスクがありません');
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
