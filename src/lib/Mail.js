import nodemailer from 'node-mailer';
import exphbs from 'express-handlebars';
import ndmexphbs from 'nodemailer-express-handlebars';

import { resolve } from 'path';
import mailConfig from '../app/config/mail';

class Main {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({ host, port, secure, auth });
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views');

    this.transporter.use(
      'compile',
      ndmexphbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
}

export default new Main();
