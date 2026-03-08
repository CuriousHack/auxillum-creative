const Setting = require('../models/Setting');
const { logActivity } = require('../utils/activityLogger');

exports.getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            // Create default settings if none exist
            setting = await Setting.create({
                mission: "We are narrative architects and campaign engineers, dedicated to building unforgettable brand experiences in both digital and physical realms. Our mission is to illuminate brands through innovative creative strategies.",
                vision: "To be the leading visionary force in brand evolution across Africa and beyond.",
                founder: {
                    name: "Shine Begho",
                    role: "Founder & Creative Director",
                    about: "A visionary leader with over a decade of experience driving creative innovation and marketing excellence.",
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                    features: [
                        "10+ Years in Creative Media",
                        "50+ Global Projects Delivered",
                        "Award-winning Strategist"
                    ]
                },
                hero: {
                    title: "AMPLIFYING AFRICAN NARRATIVES",
                    subtitle: "Auxilum Creative Media is a full-spectrum creative powerhouse...",
                    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",
                },
                aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
                stats: [
                    { number: "100+", label: "Projects Delivered" },
                    { number: "50+", label: "Brand Partners" }
                ],
                clientRoster: [
                    { type: 'text', value: 'MTN' },
                    { type: 'text', value: 'AIRTEL' }
                ],
                logo: {
                    url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop", // placeholder logo
                    showDesktop: true,
                    showMobile: true
                }
            });
        }
        res.status(200).json(setting);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error while fetching settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const {
            mission, vision, founder, founderImageURL,
            hero, heroImageURL, aboutImageURL,
            stats, clientRoster,
            logo, logoImageURL
        } = req.body;
        let setting = await Setting.findOne();

        
        // Fallback to the dynamic host if the env variable isn't set
        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

        // 1. Process files into a map for easy lookup
        const fileMap = {};
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                fileMap[file.fieldname] = `${baseUrl}/uploads/settings/${file.filename}`;
            });
        }

        // 2. Safely parse JSON properties
        const parseJSON = (dataStr, defaultObj) => {
            if (!dataStr) return defaultObj;
            try { return typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr; }
            catch (e) { console.error("Error parsing JSON data", e); return defaultObj; }
        };

        const parsedFounder = parseJSON(founder, {});
        const parsedHero = parseJSON(hero, {});
        const parsedStats = parseJSON(stats, []);
        let parsedClientRoster = parseJSON(clientRoster, []);
        const parsedLogo = parseJSON(logo, {});

        // 3. Reconstruct client roster dynamically
        if (Array.isArray(parsedClientRoster)) {
            parsedClientRoster = parsedClientRoster.map((client, index) => {
                const imageFileUrl = fileMap[`clientRoster_image_${index}`];
                if (imageFileUrl) {
                    client.value = imageFileUrl; // Override the value with the new uploaded image
                }
                return client;
            });
        }

        // 4. Construct Image URLs safely
        const nextFounderImage = fileMap['founderImage'] || founderImageURL || parsedFounder.image || '';
        const nextHeroImage = fileMap['heroImage'] || heroImageURL || parsedHero.backgroundImage || '';
        const nextAboutImage = fileMap['aboutImage'] || aboutImageURL || '';
        const nextLogoImage = fileMap['logoImage'] || logoImageURL || parsedLogo.url || '';

        const completeFounder = { ...parsedFounder, image: nextFounderImage };
        const completeHero = { ...parsedHero, backgroundImage: nextHeroImage };
        const completeLogo = { ...parsedLogo, url: nextLogoImage };

        if (!setting) {
            setting = await Setting.create({
                mission,
                vision,
                founder: completeFounder,
                hero: completeHero,
                aboutImage: nextAboutImage,
                stats: parsedStats,
                clientRoster: parsedClientRoster,
                logo: completeLogo
            });
        } else {
            setting.mission = mission || setting.mission;
            setting.vision = vision || setting.vision;
            setting.aboutImage = nextAboutImage || setting.aboutImage;

            // Only update JSON fields if they were sent in the request
            if (founder) setting.founder = { ...(setting.founder || {}), ...completeFounder };
            if (hero) setting.hero = { ...(setting.hero || {}), ...completeHero };
            if (stats) setting.stats = parsedStats;
            if (clientRoster) setting.clientRoster = parsedClientRoster;
            if (logo) setting.logo = { ...(setting.logo || {}), ...completeLogo };

            // Explicitly tell Sequelize that JSON data stringified has changed or field has updated
            setting.changed('founder', true);
            setting.changed('hero', true);
            setting.changed('stats', true);
            setting.changed('clientRoster', true);
            setting.changed('logo', true);

            await setting.save();
        }

        // Log Activity
        await logActivity('Site Settings Updated (Mission/Vision/Founder/Hero/Stats/Roster/Logo)', 'System');

        res.status(200).json({ message: 'Settings updated successfully', data: setting });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error while updating settings' });
    }
};
