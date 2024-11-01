import { Module } from '@nestjs/common'

import { DemoResolver } from './demo.resolver'

@Module({
  providers: [DemoResolver]
})
export class DemoModule {}
