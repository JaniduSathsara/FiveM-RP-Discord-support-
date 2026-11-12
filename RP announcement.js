const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"); 

const WEBHOOK_URL = ` ${"Paste your url here"}`;

const messageContent = `
🌌 ${"name of the server"}| WHITELIST UPDATE** 🌌

Welcome to **${"name of the server"}**. 
`;

const form = new FormData();
form.append("content", messageContent);
form.append("username",` ${"name of the server"}`);
form.append("file", fs.createReadStream("image"));

axios.post(WEBHOOK_URL, form, { headers: form.getHeaders() })
  .then(() => console.log("Webhook sent successfully "))
  .catch(err => console.error("Webhook error ", err.response?.data || err.message));
