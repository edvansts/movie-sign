import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env';
import nodemailer from 'nodemailer';
import nodemailerMailgun, {
  MailgunTransport,
  MailOptions,
} from 'nodemailer-mailgun-transport';

import { User } from 'src/schemas/user.schema';

@Injectable()
export class MailService {
  private transporter: any;
  private mailUser: string;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.mailUser = configService.get('MAIL_USER');

    this.transporter = nodemailer.createTransport(
      nodemailerMailgun({
        auth: {
          domain: configService.get('MAILGUN_DOMAIN'),
          apiKey: configService.get('MAILGUN_API_KEY'),
        },
      }),
      {
        from: `"No Reply" ${this.mailUser}`,
      },
    );
  }

  async sendUserConfirmation(user: User, code: number) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: `Confirmation code: ${code}`,
        template: 'confirmation',
        'h:X-Mailgun-Variables': { code, email: user.email, name: user.name },
      } as MailOptions);
    } catch (err) {
      throw err;
    }
  }

  async sendToEdvan() {
    const code = `${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}`;

    const email = 'edvaned.mengo@gmail.com';
    const name = 'Edvan de Matos';

    try {
      const response = await this.transporter.sendMail({
        to: email,
        subject: `Confirmation code: ${code}`,
        template: 'confirmation',
        'h:X-Mailgun-Variables': { code, email, name },
      } as MailOptions);

      console.log(response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
