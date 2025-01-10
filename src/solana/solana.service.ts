
import { Injectable } from '@nestjs/common';
import { SolanaAgentKit } from 'solana-agent-kit';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class SolanaService {
  private agent: SolanaAgentKit;
  private connection: Connection;

  constructor() {
  
    const privateKeyStr = process.env.PRIVATE_KEY

    const privateKeyArray = privateKeyStr
      .split(',')
      .map((num) => parseInt(num.trim(), 10));

    const privateKey = new Uint8Array(privateKeyArray);
    const base58PrivateKey = bs58.encode(privateKey);
    const rpcUrl = 'https://api.mainnet-beta.solana.com';
    
    this.connection = new Connection(rpcUrl);
    

    const openaiApiKey = process.env.OPEN_API_KEY;
    
    this.agent = new SolanaAgentKit(base58PrivateKey, rpcUrl, {
      OPENAI_API_KEY: openaiApiKey
    });
  }

  async swapTokens(
    inputMint: string,
    outputMint: string,
    inputAmount: number,
    slippageBps: number = 500
  ): Promise<string> {
    try {
      const inputPublicKey = new PublicKey(inputMint);
      const outputPublicKey = new PublicKey(outputMint);
      const walletPubkey = this.agent.wallet.publicKey;

      // Check balance before swap
      const balance = await this.connection.getBalance(walletPubkey);
      console.log('Current wallet balance (lamports):', balance);

      // Pass the amount directly without conversion
      // The trade method will handle the conversion internally
      console.log('Swap Parameters:', {
        inputMint,
        outputMint,
        inputAmount,
        slippageBps,
        currentBalance: balance,
        balanceInSOL: balance / LAMPORTS_PER_SOL
      });

      // // Check if we have enough balance (in SOL)
      // if (inputAmount > (balance / LAMPORTS_PER_SOL)) {
      //   throw new Error(
      //     `Insufficient SOL balance. Have ${(balance / LAMPORTS_PER_SOL).toFixed(8)} SOL, ` +
      //     `need ${inputAmount.toFixed(8)} SOL`
      //   );
      // }

      // // Make sure the agent is properly initialized
      // if (!this.agent || !this.agent.trade) {
      //   throw new Error('Solana Agent Kit not properly initialized');
      // }

      console.log('swapTransaction :', {
        outputPublicKey,
        inputAmount,
        inputPublicKey,
        slippageBps,
      });

      // Call trade with the original amount
      const swapTransaction = await this.agent.trade(
        outputPublicKey,   // Token to receive
        inputAmount,       // Amount in SOL (not lamports)
        inputPublicKey,    // Token to send
        slippageBps       // Slippage tolerance
      );
      console.log("🚀 ~ SolanaService ~ swapTransaction:", swapTransaction)

      console.log('Swap transaction created successfully');
      return swapTransaction;
    } catch (error) {
      console.error('Detailed swap error:', error);
      throw new Error(`Error swapping tokens: ${error.message}`);
    }
  }
}