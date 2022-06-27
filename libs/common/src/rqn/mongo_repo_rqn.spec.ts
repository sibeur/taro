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
    const numOfDataDummies = 9;
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

    it('data found when select field', async () => {
      const [samples1, samples2]: any[] = await Promise.all([
        repo.find({ select: 'name' }),
        repo.find({ select: 'description' }),
      ]);
      samples1.forEach((el) => {
        expect(el.description).toBeUndefined();
        expect(el.name).not.toBeUndefined();
      });
      samples2.forEach((el) => {
        expect(el.name).toBeUndefined();
        expect(el.description).not.toBeUndefined();
      });
    });

    it('data found when sort field', async () => {
      const [samples1, samples2]: any[] = await Promise.all([
        repo.find({ sort: { name: 'asc' } }),
        repo.find({ sort: { name: 'desc' } }),
      ]);
      expect(samples1[0].name).toBe('test-1');
      expect(samples2[0].name).toBe(`test-${numOfDataDummies}`);
    });

    it('data found when paginate', async () => {
      const perPage = 1;
      const [samples1, samples2]: any[] = await Promise.all([
        repo.find({ paginate: { page: 1, limit: perPage } }),
        repo.find({ paginate: { page: 2, limit: perPage } }),
      ]);
      expect(samples1.results.length).toBe(perPage);
      expect(samples2.results.length).toBe(perPage);
      expect(samples2.results[0].name).toBe('test-2');
    });
  });

  describe('func findById', () => {
    let data: TestEntity;
    beforeEach(async () => {
      data = await repo.create(dummyTestData[0]);
    });

    it('data found', async () => {
      const checkData = await repo.findById(data.id);
      expect(checkData).not.toBeNull();
    });
  });

  describe('func updateById', () => {
    let data: TestEntity;
    beforeEach(async () => {
      data = await repo.create(dummyTestData[0]);
    });

    it('data updated', async () => {
      const updateData: TestEntity = {
        name: 'testtest',
        description: 'testdesc',
      };
      const updated = await repo.updateById(data.id, updateData);
      expect(updated).toBe(true);
      const findOne = await repo.findById(data.id);
      expect(findOne.name).toBe(updateData.name);
      expect(findOne.description).toBe(updateData.description);
    });
  });

  describe('func findOneBy', () => {
    const numOfDataDummies = 9;
    beforeEach(async () => {
      await createTestDatum(numOfDataDummies);
    });

    it('data found', async () => {
      const checkData = await repo.findOneBy({ filter: { name: 'test-1' } });
      expect(checkData).not.toBeNull();
    });

    it('data found with selected field', async () => {
      const [sample1, sample2]: TestEntity[] = await Promise.all([
        repo.findOneBy({ filter: { name: 'test-1' }, select: 'name' }),
        repo.findOneBy({ filter: { name: 'test-1' }, select: 'description' }),
      ]);
      expect(sample1.name).not.toBeUndefined();
      expect(sample1.description).toBeUndefined();
      expect(sample2.name).toBeUndefined();
      expect(sample2.description).not.toBeUndefined();
    });
  });

  describe('func deleteMany', () => {
    const numOfDataDummies = 9;
    beforeEach(async () => {
      await createTestDatum(numOfDataDummies);
    });

    it('data should empty when destroyMany without condition', async () => {
      await repo.destroyMany({});
      const datum: any = await repo.find({});
      expect(datum.length).toBe(0);
    });

    it('data shoud deleted with where in condition', async () => {
      const $in = ['test-1', 'test-2'];
      await repo.destroyMany({ $in });
      const datum: any = await repo.find({});
      $in.forEach((el) => {
        expect(datum.map((e) => e.name)).not.toContain(el);
      });
    });
  });

  describe('func deleteById', () => {
    let data: TestEntity;
    beforeEach(async () => {
      data = await repo.create(dummyTestData[0]);
    });

    it('when data deleted', async () => {
      await repo.destroyById(data.id);
      const checkData = await repo.findById(data.id);
      expect(checkData).toBeNull();
    });
  });
});
