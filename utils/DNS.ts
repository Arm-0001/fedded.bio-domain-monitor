/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@raci.sm>
 */

// Constants
const DNS_SERVER = "8.8.8.8";

// DNS Class
class DNS {
  public static getMXRecord = async (domain: string) => {
    try {
      const [ record ] = await Deno.resolveDns(domain, "MX", {
        nameServer: { ipAddr: DNS_SERVER, port: 53 }
      });
  
      return record;
    } catch {
      return null;
    }
  }
}

export default DNS;