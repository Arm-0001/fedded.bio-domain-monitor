/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@raci.sm>
 */

// Webhook Class
class Webhook {
  private webhook_url: string;
  private message_id: string;

  constructor(webhook_url: string, message_id: string) {
    this.webhook_url = webhook_url;
    this.message_id = message_id;
  }

  public update = async (status: string[]): Promise<boolean> => {
    const response = await(await fetch(`${this.webhook_url}/messages/${this.message_id}` , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ embeds: [{
        title: "domains >.<",
        description: `> There are currently a total of **${status.length}** domains connected to [catgir.ls](https://catgir.ls)\n\n> If you'd like your own domain added, feel free to open a ticket regarding this, please note that we're quite strict with the domains we allow.`,
        url: "https://catgir.ls",
        color: 14530013,
        fields: [{
          name: "Domains",
          value: status.join("\n")
        }],
        footer: {
          text: "catgir.ls",
          icon_url: "https://i.imgur.com/j8zZRSp.jpg"
        },
        timestamp: new Date(),
        thumbnail:  {
          url: "https://i.imgur.com/j8zZRSp.jpg"
        }
      }]})
    })).json();

    return !!response.id
  }
}

export default Webhook;