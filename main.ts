/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@raci.sm>
 */

// Dependencies
import { cron } from "@deps";

// Utils
import { Config, Logger, DNS, Webhook } from "@utils";

await Config.load("config.toml");
Logger.log(`Loaded ${Object.keys(Config.get()).length} item(s) into the config!`);

const webhook = new Webhook(Config.get("discord", "webhook_url"), Config.get("discord", "message_id"));

const main = async () => {
  const { domains, exchange, emojis } = Config.get("variables");

  Logger.log("Checking the current status!");

  const result = Object.fromEntries(
    await Promise.all(domains.map(async (domain: string) => [
      domain, 
      (await DNS.getMXRecord(domain))?.exchange === exchange
    ]))
  );

  const status = Object.keys(result).map((domain: string) => `• \`${domain}\` ${emojis[Number(result[domain])]}`);

  if(!await webhook.update(status))
    return Logger.error("Unable to update Discord webhook!");

  Logger.log("Succesfully updated Discord webhook!");
}

Logger.log("Setting up cronjob!");
new cron("*/30 * * * *", main);