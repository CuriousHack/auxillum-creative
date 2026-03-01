const fs = require('fs');
const path = require('path');
const { getAdminNotificationTemplate } = require('./utils/emailTemplates');

const mockData = {
    name: 'Jane Doe UI Tester',
    email: 'jane@example.com',
    phone: '+1 234 567 8900',
    service: 'Email Template Design Review',
    message: 'Testing the layout of the dynamic Logo paired alongside the Auxilum text header.'
};

const mockLogoUrl = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop';

const htmlOutput = getAdminNotificationTemplate(mockData, mockLogoUrl);

const outputPath = path.join(__dirname, 'test_email_output.html');
fs.writeFileSync(outputPath, htmlOutput);

console.log('Email template rendered successfully to:', outputPath);
