import { MessageEmbed } from 'discord.js';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { Guild } from '../constants/Guild';
import { faqService } from '../services/FaqService';

export class FaqCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'faq',
            description: 'Provides information on frequently asked question',
            guildID: Guild.Wynntils,
            options: [
                {
                    name: 'value',
                    description: 'Name of FAQ entry',
                    type: CommandOptionType.STRING,
                    required: true,
                    choices: Array.from(faqService.cache.keys()).map(k => {
                        return { name: k, value: k }; 
                    })
                }
            ] 
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions | void> {
        const faq = (await faqService.get()).get(ctx.options.value.toString());
        
        if (faq) {
            const embed = new MessageEmbed();
            embed.setColor(7531934);
            embed.setAuthor('Wynntils FAQ', client.user?.avatarURL() ?? client.user?.defaultAvatarURL);
            embed.addField(faq.title, faq.value);
            embed.setFooter(`By: ${ctx.member.user.username}#${ctx.member.user.discriminator} - Please read #faq`);
            return { embeds: [embed] };
        }
        
        return;
    }
}
