// aws.module.ts or wherever AwsS3Service is provided
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Service } from './s3/aws-s3.service';
import { WompiService } from '../wompi/wompi.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [ConfigModule,HttpModule], 
  providers: [AwsS3Service,{useClass:WompiService,provide:'WompiService'}],
  exports: [AwsS3Service,{useClass:WompiService,provide:'WompiService'}],
})
export class AwsModule {}