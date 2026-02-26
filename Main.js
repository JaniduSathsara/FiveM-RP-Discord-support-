import 'dotenv/config';
import {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionsBitField,
    ActivityType,
    Events,
    REST,
    Routes,
    SlashCommandBuilder,
    ChannelType
} from 'discord.js';

const {
    TICKET_CATEGORY_ID,
    BOOST_ROLE_ID,
    SUPPORT_ROLE_ID,
    MOD_ROLE_ID,
    ADMIN_ROLE_ID,
    TICKET_LOG_CHANNEL_ID,
    PENDING_ROLE_ID,
    GUILD_ID,
    STAFF_REVIEW_CHANNEL_ID,
    APPROVED_LOG_CHANNEL_ID,
    WELCOME_CHANNEL_ID,
    JOB_PUBLIC_CHANNEL_ID,
    JOB_STAFF_CHANNEL_ID,
    WHITELIST_ROLE_ID,
    PD_ROLE_ID,
    MD_ROLE_ID,
    BOOST_CHANNEL_ID,
    FRONT_CHANNEL_ID,
    JOIN_ROLE_ID,
    RULES_CHANNEL_ID,
    WHITELIST_CHANNEL_ID,
    LEAVE_CHANNEL_ID,
    LOG_CHANNEL_ID,
    AUTO_REPLY_CHANNEL_ID = "1466810370650931426",
    CLIENT_ID,
    TOKEN
} = process.env;

const WL_IMAGE    = "https://res.cloudinary.com/dzetdzeld/image/upload/v1770658387/whitelist_accept_zgca30.png";
const PD_IMAGE    = "https://res.cloudinary.com/dzetdzeld/image/upload/v1770658389/pd_welcome_uuspat.png";
const MD_IMAGE    = "https://res.cloudinary.com/dzetdzeld/image/upload/v1770658388/md_dqqqcb.png";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// ────────────────────────────────────────────────
//  Basic error logging
// ────────────────────────────────────────────────
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// ────────────────────────────────────────────────
//  Ready & presence
// ────────────────────────────────────────────────
client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setPresence({
        activities: [{ name: "Spectrum Role play", type: ActivityType.Watching }]
    });
});

// ────────────────────────────────────────────────
//  Data structures
// ────────────────────────────────────────────────
const whitelistApps = new Map();
const jobApps       = new Map();

const wlQuestions = [
    "What is your Discord username?",
    "How would you rate your roleplay skill level? (Beginner / Intermediate / Advanced)",
    "Explain Powergaming in your own words.",
    "Explain Metagaming in your own words",
    "What is New Life Rule (NLR)?"
];

const jobQuestions = {
    PD: [
        "What is the reason for applying as a Police Officer? | ඔබට පොලිස් නිලධාරියෙකු වීමට අවශ්‍ය ඇයි?",
        "Do you have any experience as a Police Officer? If \"Yes\" please give details. | පොලිස් නිලධාරියෙකු ලෙස ඔබට යම් අත්දැකීමක් තිබේද? \"ඔව්\" නම් කරුණාකර විස්තර දෙන්න.",
        "You are alone on a normal patrol. After stopping somewhere, you suddenly see five people affiliated with a gang. One of them pulls out a gun. What will you do?",
        "During a bank robbery situation, when police arrive at the bank where the robbery has taken place and hostages are inside, what is the first necessary action you will take?",
        "Assume you are pursuing a vehicle that was speeding and failed to stop at a traffic light. While you are in pursuit, you receive an emergency radio message instructing you to report as a backup officer for a bank robbery in progress. What would you do in this situation?"
    ],
    MD: [
        "What is the reason for applying as a doctor? | ඔබට වෛද්‍යවරයෙකු වීමට අවශ්‍ය ඇයි?",
        "Do you have any experience as a doctor? If yes, please give details. | වෛද්‍යවරයෙකු ලෙස ඔබට යම් අත්දැකීමක් තිබේද? ඔව් නම් කරුණාකර විස්තර දෙන්න.",
        "Imagine there is a gang fight between two major gangs, and one gang asks for your help to revive their members. What action should you take as an EMS?",
        "Imagine you are off duty and your friend is injured on the road. What action should you take as an EMS?",
        "When you are on duty alone, do you leave immediately when your shift ends, or do you wait until another staff member comes on duty?"
    ]
};

// ────────────────────────────────────────────────
//  !apply  &  !jobs   panels
// ────────────────────────────────────────────────
client.on(Events.MessageCreate, async msg => {
    if (!msg.guild || msg.author.bot) return;

    if (msg.content === "!apply" && msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor('#4d0654')
            .setTitle('📋 WHITELIST APPLICATION')
            .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770659820/whitelist_e6gwuq.png')
            .setDescription('Press to start your whitelist application.')
            .setFooter({ text: 'D A R K TeaM' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('start_WL')
                .setLabel('Whitelist Apply')
                .setStyle(ButtonStyle.Primary)
        );

        await msg.channel.send({ embeds: [embed], components: [row] });
    }

    if (msg.content === "!jobs" && msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('💼 WELCOME TO JOB APPLICATION')
            .setDescription('Choose a department.')
            .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770658387/job_apply_gy0tlu.png')
            .setFooter({ text: 'D A R K TeaM' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('job_PD').setLabel('👮‍♂️ Police Department').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('job_MD').setLabel('🩺 Medical Department').setStyle(ButtonStyle.Success)
        );

        await msg.channel.send({ embeds: [embed], components: [row] });
    }
});

// ────────────────────────────────────────────────
//  Main interaction handler
// ────────────────────────────────────────────────
client.on(Events.InteractionCreate, async i => {
    if (!i.isButton() && !i.isModalSubmit()) return;

    // ─── Whitelist Start ───
    if (i.isButton() && i.customId === 'start_WL') {
        whitelistApps.set(i.user.id, { step: 0, answers: [] });
        await i.reply({ content: "📩 Check DMs.", ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#4d0654')
            .setTitle('Welcome to Whitelist Application')
            .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770659820/whitelist_e6gwuq.png');

        await i.user.send({ embeds: [embed] }).catch(() => {});
        await i.user.send(`**Question 1:** ${wlQuestions[0]}`).catch(() => {});
    }

    // ─── Job Start ───
    if (i.isButton() && i.customId.startsWith('job_')) {
        const dept = i.customId.split('_')[1];
        jobApps.set(i.user.id, { step: 0, dept, answers: [] });
        await i.reply({ content: "📩 Check DMs.", ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle(`Welcome to ${dept} Job Application`)
            .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770797823/job_apply_osbbf2.png');

        await i.user.send({ embeds: [embed] }).catch(() => {});
        await i.user.send(`**Question 1:** ${jobQuestions[dept][0]}`).catch(() => {});
    }

    // ─── APPROVE ───
    if (i.isButton() && i.customId.startsWith('approve_')) {
        await i.deferUpdate();

        const parts   = i.customId.split('_');
        const userId  = parts[1];
        const appType = parts.slice(2).join('_');   // WL / PD / MD

        const member = await i.guild.members.fetch(userId).catch(() => null);
        if (!member) return i.editReply({ content: "Member not found", components: [] });

        let roleId, imageUrl, channelId, title;

        if (appType === 'WL') {
            roleId   = WHITELIST_ROLE_ID;
            imageUrl = WL_IMAGE;
            channelId = WELCOME_CHANNEL_ID;
            title    = '🎉 Whitelist Approved!';
        } else if (appType === 'PD') {
            roleId   = PD_ROLE_ID;
            imageUrl = PD_IMAGE;
            channelId = JOB_PUBLIC_CHANNEL_ID;
            title    = '🚓 Police Approved!';
        } else if (appType === 'MD') {
            roleId   = MD_ROLE_ID;
            imageUrl = MD_IMAGE;
            channelId = JOB_PUBLIC_CHANNEL_ID;
            title    = '🚑 Medical Approved!';
        } else {
            return i.editReply({ content: "Unknown application type", components: [] });
        }

        // Role management
        if (PENDING_ROLE_ID) {
            await member.roles.remove(PENDING_ROLE_ID).catch(() => {});
        }
        await member.roles.add(roleId).catch(() => {});

        // Edit staff review message
        await i.message.edit({
            content: `Approved ✅ (${appType})`,
            components: []
        }).catch(() => {});

        // DM user
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🎉 Application Approved')
                    .setDescription(`Congratulations! Your **${appType}** application has been approved.`)
                    .setImage(imageUrl)
                    .setTimestamp()
            ]
        }).catch(() => {});

        // Public announcement
        if (channelId) {
            const ch = await client.channels.fetch(channelId).catch(() => null);
            if (ch) {
                await ch.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#4d0654')
                            .setTitle(title)
                            .setDescription(`<@${userId}> has been approved!`)
                            .setImage(imageUrl)
                            .setTimestamp()
                    ]
                }).catch(() => {});
            }
        }

        // Log
        const log = await client.channels.fetch(APPROVED_LOG_CHANNEL_ID).catch(() => null);
        if (log) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Application Approved')
                        .setDescription(`<@${userId}> approved for **${appType}**`)
                        .setTimestamp()
                ]
            });
        }

        await i.editReply({ content: "Approved ✅" });
    }

    // ─── REJECT (open modal) ───
    if (i.isButton() && i.customId.startsWith('deny_')) {
        const [, userId, type] = i.customId.split('_');

        const modal = new ModalBuilder()
            .setCustomId(`reject_${userId}_${type}`)
            .setTitle('Rejection Reason')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('reason')
                        .setLabel('Reason')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Enter rejection reason')
                        .setRequired(true)
                )
            );

        await i.showModal(modal);
    }

    // ─── REJECT (modal submit) ───
    if (i.isModalSubmit() && i.customId.startsWith('reject_')) {
        await i.deferReply({ ephemeral: true });

        const [, userId, type] = i.customId.split('_');
        const reason = i.fields.getTextInputValue('reason');

        const member = await i.guild.members.fetch(userId).catch(() => null);
        if (!member) return i.editReply({ content: "Member not found" });

        if (PENDING_ROLE_ID) {
            await member.roles.remove(PENDING_ROLE_ID).catch(() => {});
        }

        // DM rejection
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#4d0654')
                    .setTitle('❌ Application Rejected')
                    .setDescription(`Sorry, your **${type}** application was rejected.`)
                    .addFields({ name: "Reason", value: reason })
                    .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770567751/reject_k9hskj.png')
                    .setTimestamp()
            ]
        }).catch(() => {});

        // Log rejection
        const log = await client.channels.fetch(APPROVED_LOG_CHANNEL_ID).catch(() => null);
        if (log) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#4d0654')
                        .setTitle('Application Rejected')
                        .setDescription(`<@${userId}> rejected for **${type}**`)
                        .addFields({ name: "Reason", value: reason })
                        .setTimestamp()
                ]
            });
        }

        // Edit staff message
        await i.message.edit({
            content: `❌ Rejected (${type})`,
            components: []
        }).catch(() => {});

        await i.editReply({ content: "Rejection sent ✅" });
    }

    // ─── Ticket system ───
    if (i.isButton() && i.customId === 'create_ticket') {
        await i.deferReply({ ephemeral: true });

        const existing = i.guild.channels.cache.find(
            c => c.name.toLowerCase() === `ticket-${i.user.username.toLowerCase()}`
        );

        if (existing) {
            return i.editReply({ content: '❌ You already have an open ticket.' });
        }

        const overwrites = [
            { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            {
                id: i.user.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory
                ]
            }
        ];

        for (const rid of [SUPPORT_ROLE_ID, MOD_ROLE_ID, ADMIN_ROLE_ID]) {
            if (!rid) continue;
            const role = i.guild.roles.cache.get(rid);
            if (role) {
                overwrites.push({
                    id: role.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                });
            }
        }

        const channel = await i.guild.channels.create({
            name: `ticket-${i.user.username}`,
            type: ChannelType.GuildText,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: overwrites
        });

        const mentionText = [SUPPORT_ROLE_ID, MOD_ROLE_ID, ADMIN_ROLE_ID]
            .filter(Boolean)
            .map(id => `<@&${id}>`)
            .join(' ');

        const embed = new EmbedBuilder()
            .setColor('#4d0654')
            .setTitle('🎫 Ticket Opened')
            .setDescription(`Hello <@${i.user.id}>, support will be with you shortly.\nPress 🔒 to close this ticket.`)
            .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770800382/ticketssss_taho8o.jpg')
            .setFooter({ text: 'D A R K TeaM' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
        );

        const msg = await channel.send({
            content: `${mentionText}\n<@${i.user.id}>`,
            embeds: [embed],
            components: [row],
            allowedMentions: { roles: [SUPPORT_ROLE_ID, MOD_ROLE_ID, ADMIN_ROLE_ID].filter(Boolean) }
        });

        await msg.pin().catch(() => {});

        await i.editReply({ content: '✅ Ticket created!' });
    }

    if (i.isButton() && i.customId === 'close_ticket') {
        await i.deferReply({ ephemeral: true });

        const isStaff = i.member.roles.cache.hasAny(SUPPORT_ROLE_ID, MOD_ROLE_ID, ADMIN_ROLE_ID);
        const isOwner = i.user.username.toLowerCase() === i.channel.name.replace('ticket-', '').toLowerCase();

        if (!isStaff && !isOwner) {
            return i.editReply({ content: '❌ Only support staff or the ticket owner can close this ticket.' });
        }

        const log = await client.channels.fetch(TICKET_LOG_CHANNEL_ID).catch(() => null);
        if (log) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#790679')
                        .setTitle('🎟️ Ticket Closed')
                        .setDescription(`Ticket: **${i.channel.name}**\nClosed by <@${i.user.id}>`)
                        .setTimestamp()
                        .setFooter({ text: 'D A R K TeaM' })
                ]
            });
        }

        await i.editReply({ content: '🔒 Closing ticket...' });
        setTimeout(() => i.channel.delete().catch(() => {}), 3000);
    }
});

// ────────────────────────────────────────────────
//  DM → Application answers
// ────────────────────────────────────────────────
client.on(Events.MessageCreate, async msg => {
    if (msg.guild || msg.author.bot) return;

    // Whitelist
    const wl = whitelistApps.get(msg.author.id);
    if (wl) {
        wl.answers.push(msg.content);
        wl.step++;

        if (wl.step < wlQuestions.length) {
            return msg.reply(`**Question ${wl.step + 1}:** ${wlQuestions[wl.step]}`);
        }

        whitelistApps.delete(msg.author.id);
        await msg.reply("✅ Thanks for applying!");

        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(msg.author.id).catch(() => null);

        if (member && PENDING_ROLE_ID) {
            await member.roles.add(PENDING_ROLE_ID).catch(console.error);
        }

        const reviewChannel = await client.channels.fetch(STAFF_REVIEW_CHANNEL_ID).catch(() => null);
        if (reviewChannel) {
            await reviewChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Whitelist Application")
                        .setDescription(`<@${msg.author.id}>`)
                        .addFields(
                            wlQuestions.map((q, i) => ({
                                name: q,
                                value: wl.answers[i] || "—",
                                inline: false
                            }))
                        )
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`approve_${msg.author.id}_WL`)
                            .setLabel('Approve')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`deny_${msg.author.id}_WL`)
                            .setLabel('Deny')
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }
    }

    // Jobs
    const job = jobApps.get(msg.author.id);
    if (job) {
        job.answers.push(msg.content);
        job.step++;

        if (job.step < jobQuestions[job.dept].length) {
            return msg.reply(`**Question ${job.step + 1}:** ${jobQuestions[job.dept][job.step]}`);
        }

        jobApps.delete(msg.author.id);
        await msg.reply("✅ Job application submitted!");

        const reviewChannel = await client.channels.fetch(JOB_STAFF_CHANNEL_ID).catch(() => null);
        if (reviewChannel) {
            await reviewChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${job.dept} Job Application`)
                        .setDescription(`<@${msg.author.id}>`)
                        .addFields(
                            jobQuestions[job.dept].map((q, i) => ({
                                name: `Question ${i + 1}`,
                                value: `${q}\n\n**Answer:** ${job.answers[i] || "No answer provided."}`,
                                inline: false
                            }))
                        )
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`approve_${msg.author.id}_${job.dept}`)
                            .setLabel('Approve')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`deny_${msg.author.id}_${job.dept}`)
                            .setLabel('Deny')
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }
    }
});

// ────────────────────────────────────────────────
//  Boost, Join, Leave, Role logs, Voice logs ...
// ────────────────────────────────────────────────
client.on('guildMemberUpdate', async (old, neu) => {
    // Boost started
    if (!old.premiumSince && neu.premiumSince) {
        const ch = await client.channels.fetch(BOOST_CHANNEL_ID).catch(() => null);
        if (ch) {
            await ch.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff73fa')
                        .setTitle('🚀 Server Boosted!')
                        .setDescription(`💜 Thank you <@${neu.id}> for boosting **${neu.guild.name}**!`)
                        .setThumbnail(neu.user.displayAvatarURL({ dynamic: true }))
                        .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770658388/boost_thankyou_kq2n7k.png')
                        .setFooter({ text: 'D A R K TeaM' })
                        .setTimestamp()
                ]
            });
        }
        if (BOOST_ROLE_ID) await neu.roles.add(BOOST_ROLE_ID).catch(() => {});
    }

    // Boost ended
    if (old.premiumSince && !neu.premiumSince) {
        if (BOOST_ROLE_ID) await neu.roles.remove(BOOST_ROLE_ID).catch(() => {});

        const log = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
        if (log) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#790679')
                        .setTitle('💔 Boost Ended')
                        .setDescription(`<@${neu.id}> is no longer boosting the server.`)
                        .setTimestamp()
                ]
            });
        }
    }
});

client.on('guildMemberAdd', async member => {
    const ch = member.guild.channels.cache.get(FRONT_CHANNEL_ID);
    if (ch) {
        await ch.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#4d0654')
                    .setTitle('👋 Welcome to Spectrum Roleplay!')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(
                        `Hey <@${member.id}>!\nIts time to make your story become your spectrum!🚀\n\n` +
                        `📜 Read rules: <#${RULES_CHANNEL_ID}>\n📝 Apply here: <#${WHITELIST_CHANNEL_ID}>`
                    )
                    .setImage('https://res.cloudinary.com/dzetdzeld/image/upload/v1770471150/welcome_cajphk.png')
                    .setFooter({ text: 'D A R K TeaM' })
                    .setTimestamp()
            ]
        });
    }

    if (JOIN_ROLE_ID) {
        await member.roles.add(JOIN_ROLE_ID).catch(() => {});
    }
});

client.on('guildMemberRemove', async member => {
    const ch = member.guild.channels.cache.get(LEAVE_CHANNEL_ID);
    if (ch) {
        await ch.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#4d0654')
                    .setTitle('📤 Member Left')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**${member.user.tag}** has left the server.\nWe hope to see them again someday 💔`)
                    .setFooter({ text: 'D A R K TeaM' })
                    .setTimestamp()
            ]
        });
    }
});

// Role change logging
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const log = newMember.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!log) return;

    // Added roles
    for (const role of newMember.roles.cache.values()) {
        if (!oldMember.roles.cache.has(role.id)) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🟢 Role Added')
                        .setDescription(`<@${newMember.id}> was given <@&${role.id}>`)
                        .setTimestamp()
                        .setFooter({ text: 'D A R K TeaM' })
                ]
            });
        }
    }

    // Removed roles
    for (const role of oldMember.roles.cache.values()) {
        if (!newMember.roles.cache.has(role.id)) {
            await log.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🔴 Role Removed')
                        .setDescription(`<@${newMember.id}> lost <@&${role.id}>`)
                        .setTimestamp()
                        .setFooter({ text: 'D A R K TeaM' })
                ]
            });
        }
    }
});

// Voice state logging
client.on('voiceStateUpdate', (oldState, newState) => {
    const log = newState.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!log) return;

    const member = newState.member;

    if (!oldState.channel && newState.channel) {
        log.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🎤 Voice Channel Joined')
                    .setDescription(`<@${member.id}> joined **${newState.channel.name}**`)
                    .setTimestamp()
                    .setFooter({ text: 'D A R K TeaM' })
            ]
        });
    } else if (oldState.channel && !newState.channel) {
        log.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('📤 Voice Channel Left')
                    .setDescription(`<@${member.id}> left **${oldState.channel.name}**`)
                    .setTimestamp()
                    .setFooter({ text: 'D A R K TeaM' })
            ]
        });
    } else if (oldState.channel?.id !== newState.channel?.id) {
        log.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('🔁 Voice Channel Moved')
                    .setDescription(`<@${member.id}> moved from **${oldState.channel?.name}** ➜ **${newState.channel?.name}**`)
                    .setTimestamp()
                    .setFooter({ text: 'D A R K TeaM' })
            ]
        });
    }
});

/// ────────────────────────────────────────────────
//  Funny auto-reply with spam trigger
// ────────────────────────────────────────────────
const funnyReplies = [
    "E E E EEEEE moanda me danneeeee?? 🤔",
    "Ado ado me Staff eka mention karapn dev ekei management ekai nathuwa 🙃",
    "Eka digata masg danna epa yakow un wada athi 😒",
    "ai heal wenna barida hospital palayn 🤣",
    "Wali case ekkda ambboo api nm naaa 🤒"
];

let lastFunnyIndex = -1;

// track last user & streak per channel
const userSpamTracker = new Map();

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channel.id !== AUTO_REPLY_CHANNEL_ID) return;

    const userId = message.author.id;
    const channelId = message.channel.id;

    const key = `${channelId}_${userId}`;
    const lastData = userSpamTracker.get(key);

    let streak = 1;

    if (lastData) {
        streak = lastData.streak + 1;
    }

    userSpamTracker.set(key, { streak, lastMsgTime: Date.now() });

    // reset streak after 2 minutes of silence
    setTimeout(() => {
        const data = userSpamTracker.get(key);
        if (data && Date.now() - data.lastMsgTime > 120000) {
            userSpamTracker.delete(key);
        }
    }, 120000);

    const words = message.content.trim().split(/\s+/);

    let shouldReply = false;

    // 🔹 Condition 1: User spamming (3+ messages in a row)
    if (streak >= 3) {
        shouldReply = true;
        userSpamTracker.delete(key); // reset after reply
    }

    // 🔹 Condition 2: Normal random funny reply
    else if (words.length >= 3 && Math.random() <= 0.25) {
        shouldReply = true;
    }

    if (!shouldReply) return;

    let idx;
    do {
        idx = Math.floor(Math.random() * funnyReplies.length);
    } while (idx === lastFunnyIndex);

    lastFunnyIndex = idx;

    await message.reply({
        content: funnyReplies[idx],
        allowedMentions: { repliedUser: true }
    }).catch(() => {});
});

// ────────────────────────────────────────────────
//  Slash commands (very minimal right now)
// ────────────────────────────────────────────────
const commands = [
    new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bot says a message')
        .addStringOption(opt =>
            opt.setName('text')
                .setDescription('Message to send')
                .setRequired(true)
        )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered.');
    } catch (err) {
        console.error(err);
    }
})();

client.login(TOKEN);