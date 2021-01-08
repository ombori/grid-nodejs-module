const { Mqtt } = require("azure-iot-device-mqtt");
const { ModuleClient } = require("azure-iot-device");

const delay = n => new Promise(resolve => setTimeout(resolve, n));
async function main() {
  const client = await ModuleClient.Client.fromEnvironment(Mqtt.Transport);

  client.on("error", (err) => console.error('error', err));

  // connect to the Edge instance
  for (let i = 0; i < 10; i++) {
    try {
      await client.open();
      break;
    } catch (e) {
      console.error('Cant connect to iotedge', e.toString());
      await delay((1 + i) * 1000);
    }
  }
  console.log("IoT Hub module client initialized");

  // insert your code here

  client.onMethod('restart', async (req, res) => {
    console.log('Restart command received, exiting');
    res.send(200, 'Restarting');
    setInterval(() => process.exit(0), 1000);
  });

  client.onMethod('broadcast', async (req, res) => {
    console.log('recv broadcast', req.payload);
    res.send(200, 'ok');
  });
}

main();