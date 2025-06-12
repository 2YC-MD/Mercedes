const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

cmd({
    pattern: "repo",
    alias: ["sc", "code"],
    desc: "Show detailed repository information with video",
    category: "info",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Extract owner and repo name from the URL
        const repoUrl = config.REPO_LINK;
        const matches = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!matches) return reply("❌ Invalid repository URL in config");
        
        const [_, owner, repo] = matches;
        const apiUrl = `https://api.github.com/repos/betingrich4/Mercedes`;

        // Fetch repository data
        const { data } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': `${config.BOT_NAME}-WhatsApp-Bot`
            }
        });

        // Format dates
        const lastUpdated = new Date(data.updated_at).toLocaleDateString();
        const createdAt = new Date(data.created_at).toLocaleDateString();

        // Create repository info message
        const repoInfo = `*╭┈───────────────•*
*〈 ${config.BOT_NAME} Repository 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 📦 *Repository:* ${data.full_name}
*│  ◦* 🌟 *Stars:* ${data.stargazers_count}
*│  ◦* 🍴 *Forks:* ${data.forks_count}
*│  ◦* ⚠️ *Issues:* ${data.open_issues_count}
*│  ◦* 🔀 *PRs:* ${data.open_issues_count}
*│  ◦* 📝 *License:* ${data.license?.name || 'None'}
*│  ◦* 📅 *Created:* ${createdAt}
*│  ◦* 🔄 *Updated:* ${lastUpdated}
*│  ◦* 👨‍💻 *Owner:* ${data.owner.login}
*│  ◦* ⚙️ *Language:* ${data.language}
*╰┈───────────────•*`;

        await conn.sendMessage(from, { 
            video: { url: 'https://files.catbox.moe/6zh63g.mp4' },
            caption: envMessage,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || config.BOT_NAME,
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `${config.BOT_NAME} Configuration`,
                    body: `Owner: ${config.OWNER_NAME}`,
                    mediaType: 2,
                    thumbnailUrl: 'https://files.catbox.moe/tpzqtm.jpg',
                    sourceUrl: "https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Repo Error:", e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Repo Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
