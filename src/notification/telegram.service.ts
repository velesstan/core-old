import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private channel: string;
  constructor(private readonly configService: ConfigService) {
    this.bot = new Telegraf(
      this.configService.get<string>('APP_TELEGRAM_TOKEN'),
    );
    this.channel = this.configService.get<string>('APP_TELEGRAM_CHANNEL');
    this.boot();
  }

  private async boot(): Promise<void> {
    await this.bot.telegram.sendMessage(
      this.channel,
      'Приложение VelesServices запущено.',
    );
  }

  async sendMessage(message: string): Promise<void> {
    await this.bot.telegram.sendMessage(this.channel, message, {
      parse_mode: 'MarkdownV2',
    });
  }

  async throwError(error: unknown): Promise<void> {
    await this.bot.telegram.sendDocument(this.channel, {
      source: Buffer.from(error.toString()),
    });
  }
}
