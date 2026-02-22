const getAdminNotificationTemplate = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 8px;">
      <h2 style="color: #29ABE2; border-bottom: 2px solid #29ABE2; padding-bottom: 10px;">New Contact Form Submission</h2>
      <p style="color: #ccc;">You have received a new message from the Auxilum website contact form.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #fff;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #333; color: #29ABE2; width: 120px;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #333;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #333; color: #29ABE2;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #333;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #333; color: #29ABE2;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #333;">${data.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #333; color: #29ABE2;">Service:</td>
          <td style="padding: 10px; border-bottom: 1px solid #333;">${data.service || 'General Inquiry'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #333; color: #29ABE2;">Message:</td>
          <td style="padding: 10px; border-bottom: 1px solid #333;">${data.message}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} Auxilum Creative Media</p>
      </div>
    </div>
  `;
};

const getUserAutoReplyTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #fff; letter-spacing: 2px;">AUXIL<span style="color: #29ABE2;">UM</span></h1>
      </div>
      
      <h2 style="color: #29ABE2;">We Received Your Message!</h2>
      <p style="color: #ccc; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="color: #ccc; line-height: 1.6;">
        Thank you for reaching out to Auxilum Creative Media. We have received your inquiry and our team is reviewing it.
      </p>
      
      <p style="color: #ccc; line-height: 1.6;">
        We typically respond within 24 hours. In the meantime, feel free to check out our latest work on our website or follow us on social media.
      </p>
      
      <div style="margin-top: 30px; padding: 20px; border: 1px solid #333; border-radius: 4px; text-align: center;">
        <p style="margin-bottom: 10px; color: #29ABE2; font-weight: bold;">Illuminating Brands</p>
        <p style="color: #666; font-size: 14px;">Full-Spectrum ATL & BTL Campaigns • Digital Content</p>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} Auxilum Creative Media</p>
      </div>
    </div>
  `;
};

const getOTPTemplate = (otp) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; background-color: #000; color: #fff;">
        <div style="background-color: #29ABE2; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase;">Security Verification</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; text-align: center;">
            <p style="color: #ccc;">Your 6-digit verification code is:</p>
            <div style="background-color: #111; padding: 20px; border: 1px solid #333; border-radius: 10px; display: inline-block; margin: 20px 0;">
                <h2 style="letter-spacing: 12px; margin: 0; font-size: 36px; padding-left: 12px; color: #29ABE2;">${otp}</h2>
            </div>
            <p style="font-size: 14px; color: #666;">This code is valid for 15 minutes. Do not share this code with anyone.</p>
            <p style="color: #ccc;">Best regards,<br>The Auxilium Tech Team</p>
        </div>
    </div>
    `;
};

module.exports = {
  getAdminNotificationTemplate,
  getUserAutoReplyTemplate,
  getOTPTemplate
};
