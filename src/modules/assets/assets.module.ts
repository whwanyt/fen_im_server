import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';

@Module({
  providers: [],
  controllers: [AssetsController],
})
export class AssetsModule {}
