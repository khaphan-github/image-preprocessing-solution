// mongodb.provider.ts
import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const MongoDBProvider: Provider = {
  provide: 'MONGODB_CONNECTION',
  useFactory: async () => {
    try {
      const connection = await mongoose.connect(
        'mongodb://root:root@localhost:27017',
        {},
      );
      return connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  },
};