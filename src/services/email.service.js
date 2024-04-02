const nodemailer = require('nodemailer');

async function sendEmail() {
  // Tạo transporter sử dụng SMTP của Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // email của bạn
      pass: 'your-password' // mật khẩu của bạn
    }
  });

  // Thiết lập thông tin email
  let mailOptions = {
    from: 'your-email@gmail.com', // email người gửi
    to: 'user-email@gmail.com', // email người nhận
    subject: 'Đăng ký thành công', // tiêu đề email
    text: 'Chúc mừng bạn đã đăng ký thành công!' // nội dung email
  };

  // Gửi email
  let info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
}

sendEmail().catch(console.error);
