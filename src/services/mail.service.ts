import * as nodemailer from "nodemailer";
import * as config from "../config/envs";

export class MailService {
  constructor(
    public options: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      password: string;
    },
  ) {}

  async sendMail(options: { from?: string; to: string; subject: string; message: string }) {
    const { MailService } = config;
    let mailOptions = {
      from: MailService.user,
      to: options.to,
      subject: options.subject,
      html: options.message,
    };
    const transporter = nodemailer.createTransport({
      host: MailService.host,
      port: MailService.port,
      secure: MailService.secure,
      auth: {
        user: MailService.user,
        pass: MailService.password,
      },
      tls: { rejectUnauthorized: true },
    });
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        return "E-mail enviado com sucesso!";
      }
    });
  }
  template = (options: { type: "forgotPassword" | "signUpOrg" | "signUp"; link: string; email: string }): string => {
    const { type, link, email } = options;
    let result = "";
    switch (type) {
      case "forgotPassword":
        result =
          `<h1>Thiết lập mật khẩu mới!</h1>` +
          `<p>Gần đây bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Leapic này:<div>${email}</div></p>` +
          `<p>Để cập nhật mật khẩu của bạn, nhấp vào link bên dưới:</p>` +
          `<div><a href="${link}">${link}</a></div>`;
        break;
      case "signUp":
        result =
          `<h1>Đăng kí tài khoản thành công !</h1>` +
          `<p>Bạn đã đăng kí tài khoản thành công tại Leapic <div>${email}</div></p>` +
          `<p>Để kích hoạt tài khoản và tiếp tục đăng kí tài khoản cho công ty của bạn, nhấp vào link bên dưới:</p>` +
          `<div><a href="${link}">${link}</a></div>`;
        break;
      default:
        break;
    }
    return result;
  };
}
