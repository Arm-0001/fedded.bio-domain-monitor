/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@raci.sm>
 */

// Types
import type { TRet } from "@types";

// Webhook Class
class Webhook {
  private webhook_url: string;
  private message_id: string;
  private defaults: Record<string, TRet>

  constructor(webhook_url: string, message_id: string, defaults: Record<string, TRet>) {
    this.webhook_url = webhook_url;
    this.message_id = message_id;
    this.defaults = defaults;
  }

  public update = async (status: string[]): Promise<boolean> => {
    const response = await(await fetch(`${this.webhook_url}/messages/${this.message_id}` , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ embeds: [{
        description: `> There are currently a total of **${status.length}** domains connected to [fedded.bio](https://fedded.bio)\n\n`,
        fields: [{
          name: "Domains",
          value: status.join("\n")
        }],
        timestamp: new Date(),
        ...this.defaults
      }]})
    })).json();

    return !!response.id
  }
}

export default Webhook;