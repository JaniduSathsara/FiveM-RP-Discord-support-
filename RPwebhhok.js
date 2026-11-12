const axios = require("axios");

const WEBHOOK_URL = ` ${"WEBHOOK URL"}`
const messageDescription = `
**මචං, copy-paste FiveM servers නිසා එපා වෙලාද ඉන්නේ? 😤**

** ${"name of the server"}** Sri Lankan realistic RP server💯
━━━━━━━━━━━━━━━━━━━
✨ **Aluthma scripts & brand-new items**  
🔒100% fully purchased scripts — crack nam na🚫
⚙️ **Super optimized server** – low-end PC walatath smooth play 🔥 

🔴 **Real RP only** – **quality players, clean & realistic RP**
━━━━━━━━━━━━━━━━━━━

🇱🇰 **Pure Sri Lankan RP experience**

━━━━━━━━━━━━━━━━━━━  
🚀 **[${"name of the server"}] ${"SERVER Discord Link"}** 🚀 
━━━━━━━━━━━━━━━━━━━
`;


axios.post(WEBHOOK_URL, {
  content: "@here 🚨 New Sri Lankan RP Experience Just Dropped!",
  username: ` ${"name of the server"}`,
  avatar_url: ` ${"Image URL"}`,

  embeds: [
    {
      title: "Spectrum Roleplay 🇱🇰",
      description: messageDescription,
      color: 0x8A2BE2,

      thumbnail: {
        url: ` ${"Image URL"}`
      },

      image: {
        url: ` ${"Image URL"}`
      },

      footer: {
        text: "Spectrum Roleplay • Sri Lanka"
      },

      timestamp: new Date().toISOString()
    }
  ]

})
.then(() => console.log("Webhook sent successfully with avatar + embed "))
.catch(err => console.error("Webhook error ", err.response?.data || err.message));
