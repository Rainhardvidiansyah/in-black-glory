import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { MinioBucket } from 'src/common/constants/minio-bucket.constant';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService implements OnModuleInit{

  private logger = new Logger(MinioService.name);

  private client: Client;


  constructor(){
    if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
    throw new Error('Missing MinIO credentials in environment variables');
  }
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  
  }


  async onModuleInit(){
    const allBuckets = Object.values(MinioBucket);

    for (const bucket of allBuckets) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket);
        this.logger.log(`Bucket "${bucket}" created`);
      } else {
        this.logger.log(`Bucket "${bucket}" already exists`);
      }
    }
  }




  async uploadFile(bucket: MinioBucket, file: Express.Multer.File): Promise<string>{

    const fileName = `${uuidv4()}-${file.originalname}`;

    await this.client.putObject(
      bucket,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
    //"http://localhost:9000/product-images/bdd0d8af-6e42-46bc-83a8-35bfa50af98e-myimages_example.jpeg
    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`;
  }




  async deleteFileFromMinioStorage(bucket: MinioBucket, fileNameOrUrl: string): Promise<void>{
    
    const fileName = fileNameOrUrl.split("/").pop();
    if(!fileName) return;

    await this.client.removeObject(bucket, fileName);
  }



  //Get image url Presigned
  async getImageUrl(bucket: MinioBucket, objectName: string) {

  const expiryInSeconds = 15 * 60; // URL will be automatically die in 15 minutes

  try {
    const url = await this.client.presignedGetObject(bucket, objectName, expiryInSeconds);
    return url;
  } catch (error) {
    console.error('Failed to make presigned URL:', error);
    throw error;
  }
}




}
