"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const config = require("../config/envs");
class MailService {
    constructor(options) {
        this.options = options;
        this.template = (options) => {
            const { type, link, email } = options;
            let result = '';
            switch (type) {
                case 'forgotPassword':
                    result = `<h1>Thiết lập mật khẩu mới!</h1>` +
                        `<p>Gần đây bạn đã yêu cầu đặt lại mật khẩu cho tài khoản HRM này:<div>${email}</div></p>` +
                        `<p>Để cập nhật mật khẩu của bạn, nhấp vào link bên dưới:</p>` +
                        `<div><a href="${link}">${link}</a></div>`;
                    break;
                case 'signUpOrg':
                    result = `<h1>Đăng kí tài khoản công ty tại hệ thống CRM SOLAZU !</h1>` +
                        `<p>Bạn đã đăng kí tài khoản công ty trong hệ thống  CRM SOLAZU <div>${email}</div></p>` +
                        `<p>Để kích hoạt tài khoản và tiếp tục đăng kí tài khoản cho công ty của bạn, nhấp vào link bên dưới:</p>` +
                        `<div><a href="${link}">${link}</a></div>`;
                    break;
                case 'signUp':
                    result = `<h1>Đăng kí tài khoản công ty tại hệ thống CRM SOLAZU !</h1>` +
                        `<p>Bạn đã đăng kí tài khoản công ty trong hệ thống  CRM SOLAZU <div>${email}</div></p>` +
                        `<p>Để kích hoạt tài khoản và tiếp tục đăng kí tài khoản cho công ty của bạn, nhấp vào link bên dưới:</p>` +
                        `<div><a href="${link}">${link}</a></div>`;
                    break;
                default:
                    break;
            }
            return result;
        };
    }
    sendMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { MailService } = config;
            let mailOptions = {
                from: MailService.user,
                to: options.to,
                subject: options.subject,
                html: options.message
            };
            const transporter = nodemailer.createTransport({
                host: MailService.host,
                port: MailService.port,
                secure: MailService.secure,
                auth: {
                    user: MailService.user,
                    pass: MailService.password
                },
                tls: { rejectUnauthorized: true }
            });
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                }
                else {
                    return 'E-mail enviado com sucesso!';
                }
            });
        });
    }
}
exports.MailService = MailService;
