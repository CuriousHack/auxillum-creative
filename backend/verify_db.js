const Contact = require('./models/Contact');
const sequelize = require('./config/database');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const contacts = await Contact.findAll();
        console.log('Contacts found:', contacts.length);
        contacts.forEach(c => console.log(JSON.stringify(c.toJSON(), null, 2)));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
})();
