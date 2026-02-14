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

module.exports = { getAdminNotificationTemplate, getUserAutoReplyTemplate };
