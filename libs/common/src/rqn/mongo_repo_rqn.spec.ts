import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InjectModel,
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { MongooseRQNRepository } from './mongo_repo.rqn';

@Schema()
class TestModel {
  static collName = 'test_model';
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

const TestSchema = SchemaFactory.createForClass(TestModel);

class TestEntity {
  id?: string;
  name: string;
  description: string;
}

@Injectable()
class TestRepo extends MongooseRQNRepository<TestEntity, TestModel> {
  protected filterable: string[] = ['name', 'description'];
  protected sortable: string[] = ['name', 'description'];
  constructor(
    @InjectModel(TestModel.collName)
    private testModel: Model<TestModel>,
  ) {
    super(testModel);
  }
}

const dummyTestData: TestEntity[] = [
  { name: 'test', description: 'desc' },
  { name: 'test2', description: 'desc 2' },
];

describe('Mongoose Repository RQN', () => {
  let repo: TestRepo;

  const createTestDatum = async (numOfData) => {
    const concurr = [];
    for (let i = 1; i <= numOfData; i++) {
      concurr.push(
        repo.create({ name: `test-${i}`, description: `desc-${i}` }),
      );
    }

    await Promise.all(concurr);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/taro-test'),
        MongooseModule.forFeature([
          { name: TestModel.collName, schema: TestSchema },
        ]),
      ],
      providers: [TestRepo],
    }).compile();

    repo = module.get<TestRepo>(TestRepo);
  });

  afterEach(async () => {
    await repo.destroyMany({});
  });

  it('Repo should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('func create', () => {
    it('data should created', async () => {
      const data: TestEntity = await repo.create(dummyTestData[0]);
      expect(data.name).toBe(dummyTestData[0].name);
    });

    it('data should error Bad Request when duplicate', async () => {
      try {
        await repo.create(dummyTestData[0]);
        await repo.create(dummyTestData[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
  describe('func find', () => {
    const numOfDataDummies = 15;
    beforeEach(async () => {
      await createTestDatum(numOfDataDummies);
    });

    it('data found then count with numOfDataDummies', async () => {
      const datum: any = await repo.find({});
      expect(datum.length).toBe(numOfDataDummies);
    });

    it('data found when use filter parameters', async () => {
      const filterCriteria = { name: 'test-1' };
      const datum: any = await repo.find({ filter: filterCriteria });
      expect(datum.map((el) => el.name)).toContain(filterCriteria.name);
      expect(datum.map((el) => el.description)).toContain('desc-1');
    });
  });
});
