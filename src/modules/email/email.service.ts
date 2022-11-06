import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import nodemailer = require('nodemailer');
import randomString = require('random-string');

@Injectable()
export class EmailService {
  async send(email: string) {
    if (!email) {
      throw new HttpException('email not found', HttpStatus.FORBIDDEN);
    }
    // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
    // {
    //   // host: "smtp.qq.com", // 第三方邮箱的主机地址
    //   service: 'QQ',
    //   port: 587,
    //   secureConnection: true,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: "2956860463@qq.com",
    //     pass: "cqjalqmjaiopdebb"
    //   },
    // }
    let transporter = nodemailer.createTransport(
      {
        service: 'QQ',
        port: 587,
        auth: {
          user: '2956860463@qq.com',
          pass: 'cqjalqmjaiopdebb',
        },
        secure:false
      },
    );
    const random = randomString({ length: 6 });
    // 定义transport对象并发送邮件
    await transporter.sendMail({
      from: '"Fen 👻" <2956860463@qq.com>', // 发送方邮箱的账号
      to: email, // 邮箱接受者的账号
      subject: 'Hello Fen', // Subject line
      text: 'Fen?', // 文本内容
      html: `欢迎注册Fen, 您的邮箱验证码是:<b>${random}</b></hr>5分钟内有效`, // html 内容, 如果设置了html内容, 将忽略text内容
    });
    return random;
  }
}
