// aws.module.ts or wherever AwsS3Service is provided
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Service } from './s3/aws-s3.service';
import { WompiService } from '../wompi/wompi.service';
@Module({
  imports: [ConfigModule], 
  providers: [AwsS3Service,WompiService],
  exports: [AwsS3Service,WompiService],
})
export class AwsModule {}