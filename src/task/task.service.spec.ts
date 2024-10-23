import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entitiy';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

const mockUser: UserEntity = {
  username: 'Ali',
  id: 'a99993c3-15d7-4871-9b70-1a36bcbe7bb1',
  securePassword: 'SecurePassword@999',
  tasks: [],
};

const mockTask = () => ({
  id: '339c0fec-9fed-4c1b-a4d9-4db20126cef1',
  title: 'Urgent Task',
  description: 'Clean your room!',
  status: 'open',
  user: mockUser,
});

const mockTaskRepository = {
  createQueryBuilder: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TaskService', () => {
  let tasksService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TaskService>(TaskService);
  });

  describe('getTasks', () => {
    it('calls TaskService.getTasks and returns the results', async () => {
      const mockTasks = [mockTask()];
      mockTaskRepository.getMany.mockResolvedValue(mockTasks);

      const filterDto = {
        status: null,
        search: 'Clean',
      };

      const result = await tasksService.getTasks(filterDto, mockUser);

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.getMany).toHaveBeenCalled();
    });
  });

  describe('getTask', () => {
    it('calls TaskService.getTask and returns the result', async () => {
      const mockTaskInstance = mockTask();
      mockTaskRepository.findOneOrFail.mockResolvedValue(mockTaskInstance);

      const result = await tasksService.getTask(mockTaskInstance.id, mockUser);

      expect(result).toEqual(mockTaskInstance);
      expect(mockTaskRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: mockTaskInstance.id, user: mockUser },
      });
    });

    it('throws an error if the task is not found', async () => {
      const mockTaskId = 'non-existing-id';
      mockTaskRepository.findOneOrFail.mockRejectedValue(
        new Error('Task not found'),
      );

      await expect(tasksService.getTask(mockTaskId, mockUser)).rejects.toThrow(
        'Task not found',
      );

      expect(mockTaskRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: mockTaskId, user: mockUser },
      });
    });
  });
});
