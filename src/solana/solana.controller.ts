// import { Controller, Post, Body } from '@nestjs/common';
// import { SolanaService } from './solana.service';

// @Controller('solana')
// export class SolanaController {
//   constructor(private readonly solanaService: SolanaService) {}

//   @Post('swap')
//   async swapTokens(
//     @Body() body: { inputMint: string; outputMint: string; inputAmount: number; slippageBps?: number }
//   ): Promise<{ transaction: string }> {
//     console.log('Request body:', body);
//     const { inputMint, outputMint, inputAmount, slippageBps = 500 } = body;
    
//     // Call the service method with the parameters
//     const transaction = await this.solanaService.swapTokens(inputMint, outputMint, inputAmount, slippageBps);
//     return { transaction };
//   }
// }


import { Controller, Post, Body } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  @Post('swap')
  async swapTokens(
    @Body() body: { swaps: { inputMint: string; outputMint: string; inputAmount: number; slippageBps?: number }[] }
  ): Promise<{ transactions: { index: number; transaction?: string; error?: any }[] }> {
    console.log('Batch swap request:', body);
  
    const swaps = body.swaps;
    const results = [];
  
    for (const [index, swap] of swaps.entries()) {
      try {
        // Process each swap one by one
        const transaction = await this.solanaService.swapTokens(
          swap.inputMint,
          swap.outputMint,
          swap.inputAmount,
          swap.slippageBps
        );
        results.push({ index, transaction });
      } catch (error) {
        results.push({ index, error: error.message });
      }
    }
  
    return { transactions: results };
  }
  
}
