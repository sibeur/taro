import { Test, TestingModule } from '@nestjs/testing';
import { TaroAdminController } from './taro-admin.controller';
import { TaroAdminService } from './taro-admin.service';

describe('TaroAdminController', () => {
  let taroAdminController: TaroAdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaroAdminController],
      providers: [TaroAdminService],
    }).compile();

    taroAdminController = app.get<TaroAdminController>(TaroAdminController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(taroAdminController.getHello()).toBe('Hello World!');
    });
  });
});
