const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"); // we need this to send files

const WEBHOOK_URL = "https://discord.com/api/webhooks287030935616/FVKykPGr2podGr6U-RpuwIeBw158th-UP-nc4GsB2BKN35wer1sEvw2Ar44KF5HIx9jz";

const messageContent = `
🌌 **SPECTRUM ROLEPLAY | WHITELIST UPDATE** 🌌

Welcome to **Spectrum Roleplay**. 
`;

// Create a form-data object to send the message + file
const form = new FormData();
form.append("content", messageContent);
form.append("username", "Spectrum Roleplay");
form.append("file", fs.createReadStream("C:/Users/Jayasiri/Downloads/Spectrum Role Play/images/banner.png"));

axios.post(WEBHOOK_URL, form, { headers: form.getHeaders() })
  .then(() => console.log("Webhook sent successfully ✅"))
  .catch(err => console.error("Webhook error ❌", err.response?.data || err.message));
