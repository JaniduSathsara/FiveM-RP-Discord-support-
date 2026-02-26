const axios = require("axios");

const WEBHOOK_URL = "https://discord.com/api/webhooks/1469413498445500540/8RdXlwIC2V9ua2TiC6MzSKu7aIHvjcKsUdEvLBW2DGxAmZZwg0lqJJsJrqLjlpDTN556"

const messageDescription = `
**මචං, copy-paste FiveM servers නිසා එපා වෙලාද ඉන්නේ? 😤**

**Spectrum Roleplay** කියන්නේ නියම Sri Lankan realistic RP server එකක් 
**fake RP places නෙවෙයි **💯
━━━━━━━━━━━━━━━━━━━
✨ **Aluthma scripts & brand-new items**  
🔒100% fully purchased scripts — crack nam na🚫
⚙️ **Super optimized server** – low-end PC walatath smooth play 🔥 

🔴 **Real RP only** – **quality players, clean & realistic RP**
━━━━━━━━━━━━━━━━━━━

📶 **Lag නැති, stress නැති**

🇱🇰 **Pure Sri Lankan RP experience**

━━━━━━━━━━━━━━━━━━━  
🚀 **[Join Spectrum Roleplay](https://discord.gg/vVFxVNcb2e)** 🚀 
━━━━━━━━━━━━━━━━━━━
`;


axios.post(WEBHOOK_URL, {
  content: "@here 🚨 New Sri Lankan RP Experience Just Dropped!",
  username: "Spectrum Roleplay",
  avatar_url: "https://res.cloudinary.com/dzetdzeld/image/upload/v1770448926/Spectrum_icon__fldhxj.png",

  embeds: [
    {
      title: "Spectrum Roleplay 🇱🇰",
      description: messageDescription,
      color: 0x8A2BE2,

      thumbnail: {
        url: "https://res.cloudinary.com/dzetdzeld/image/upload/v1770448926/Spectrum_icon__fldhxj.png"
      },

      image: {
        url: "https://res.cloudinary.com/dzetdzeld/image/upload/v1770448927/Spectrum_Loding_banner_sifv92.png"
      },

      footer: {
        text: "Spectrum Roleplay • Sri Lanka"
      },

      timestamp: new Date().toISOString()
    }
  ]

})
.then(() => console.log("Webhook sent successfully with avatar + embed ✅"))
.catch(err => console.error("Webhook error ❌", err.response?.data || err.message));
