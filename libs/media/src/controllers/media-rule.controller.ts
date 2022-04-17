import { Auth } from '@core/simple-auth/decorators/auth.decorator';
import { Role } from '@core/simple-auth/typesAndInterface/role';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RQNDataListParams } from '@core/common/rqn/rqn.base';
import { RQNParams } from '@core/common/decorators/rqn.decorator';
import { MutateMediaRuleDto } from '../dtos/media_rule.dto';
import { HttpOkResponseInterceptor } from '@core/common/interceptors/http.interceptor';
import { RuleService } from '../services/rule.service';

@UseInterceptors(HttpOkResponseInterceptor)
@Controller({
  path: 'rules',
  version: '1',
})
export class MediaRuleController {
  constructor(private ruleService: RuleService) {}

  @Get()
  @Auth(Role.ADMIN, Role.UPLOADER)
  async index(@RQNParams() params: RQNDataListParams) {
    return {
      data: await this.ruleService.find(params),
    };
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async show(@Param('id') id: string) {
    const data = await this.ruleService.findById(id);
    if (!data) throw new NotFoundException();
    return { data };
  }

  @Post()
  @Auth(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: MutateMediaRuleDto) {
    const { id } = await this.ruleService.create(body);
    return {
      message: 'Success to create media rule.',
      data: id,
    };
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() body: MutateMediaRuleDto) {
    await this.ruleService.updateById(id, body);
    return {
      message: 'Success to update media rule.',
    };
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async delete(@Param('id') id: string) {
    await this.ruleService.destroyById(id);
    return {
      message: 'Success to delete media rule.',
    };
  }
}
