/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@raci.sm>
 * @author Arm-0001 <armzero001@proton.me>
 */

// Dependencies
import { cron } from "@deps";


import { Config, Logger, DNS, Webhook } from "@utils";

await Config.load("config.toml");
Logger.log(`Loaded ${Object.keys(Config.get()).length} item(s) into the config!`);

const { webhook_url, message_id, defaults } = Config.get("discord");

const webhook = new Webhook(
  webhook_url,
  message_id,
  JSON.parse(Deno.readTextFileSync(defaults))
);

const main = async () => {
  const { domains, exchange, emojis } = Config.get("variables");

  Logger.log("Checking the current status!");

  const result = Object.fromEntries(
    await Promise.all(domains.map(async (domain: string) => [
      domain, 
      (await DNS.getMXRecord(domain))?.exchange === exchange
    ]))
  );

  const status = Object.keys(result).map(async (domain: string) => {
    try {
      const response = await fetch(`http://${domain}`, { timeout: 10000 });
      const status = response.status === 200 ? emojis[1] : emojis[0];
      return `• \`${domain}\` ${status}`;
    } catch (error) {
      return `• \`${domain}\` ${emojis[0]}`;
    }
  });

  if(!await webhook.update(await Promise.all(status)))
    return Logger.error("Unable to update Discord webhook!");

  Logger.log("Successfully updated Discord webhook!");
}

Logger.log("Running main function!");
await main();

Logger.log("Setting up cronjob!");
new cron("*/30 * * * *", main);