import { Config, Logger, DNS, Webhook } from "@utils";
import { cron } from "@deps";

await Config.load("config.toml");
Logger.log(`Loaded ${Object.keys(Config.get()).length} item(s) into the config!`);

const { webhook_url, message_id, defaults } = Config.get("discord");

const webhook = new Webhook(
  webhook_url,
  message_id,
  JSON.parse(Deno.readTextFileSync(defaults))
);

const main = () => {
  const { domains, exchange, emojis } = Config.get("variables");

  Logger.log("Checking the current status!");

  const result = Object.fromEntries(
    domains.map(async (domain: string) => [
      domain, 
      (await DNS.getMXRecord(domain))?.exchange === exchange
    ])
  );

  const status = Object.keys(result).map(async (domain: string) => {
    try {
      const response = await fetch(`http://${domain}`, { timeout: 10000 } as RequestInit);
      const status = response.status === 200 ? emojis[1] : emojis[0];
      return `• \`${domain}\` ${status}`;
    } catch (error) {
      return `• \`${domain}\` ${emojis[0]}`;
    }
  });

  Promise.all(status).then(async (statuses) => {
    if(!await webhook.update(statuses))
      return Logger.error("Unable to update Discord webhook!");

    Logger.log("Successfully updated Discord webhook!");
  });
}

Logger.log("Running main function!");
main();

Logger.log("Setting up cronjob!");
new cron("*/30 * * * *", main);