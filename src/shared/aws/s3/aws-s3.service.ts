import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
  } from '@aws-sdk/client-s3';
  import { Injectable } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { v4 as uuid } from 'uuid';
  
  @Injectable()
  export class AwsS3Service {
    private s3: S3Client;
    private bucket: string;
  
    constructor(private readonly config: ConfigService) {
      this.s3 = new S3Client({
        region: this.config.get<string>('AWS_REGION'),
        credentials: {
          accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });
  
      this.bucket = this.config.get<string>('AWS_S3_BUCKET');
    }
  
    async uploadFile(buffer: Buffer, originalName: string): Promise<string> {
      const fileKey = `${uuid()}-${originalName}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: buffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
      });
  
      await this.s3.send(command);
  
      return `https://${this.bucket}.s3.${this.config.get<string>(
        'AWS_REGION',
      )}.amazonaws.com/${fileKey}`;
    }
    async getAllFiles(): Promise<string[]> {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
      });
      const response = await this.s3.send(command);
      return response.Contents?.map((item) => item.Key) || [];
    } 
  }
  