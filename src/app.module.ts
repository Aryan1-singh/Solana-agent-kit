import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SolanaService } from './solana/solana.service';
import { SolanaController } from './solana/solana.controller';
import { SolanaModule } from './solana/solana.module';

@Module({
  imports: [SolanaModule],
  controllers: [AppController, SolanaController],
  providers: [AppService, SolanaService],
})
export class AppModule {}
