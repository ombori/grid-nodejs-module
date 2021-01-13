const { Mqtt } = require("azure-iot-device-mqtt");
const { ModuleClient } = require("azure-iot-device");

const { IOTEDGE_DEVICEID, MODULENAME_TEST_SETTING } = process.env;

if (!IOTEDGE_DEVICEID) {
  console.error('IOTEDGE_DEVICEID not set, m2a and m2m broadcasts will not work');
}

const delay = n => new Promise(resolve => setTimeout(resolve, n));

async function processTestMessage() {
  // TODO: process Test.Message
}

async function main() {
  const client = await ModuleClient.fromEnvironment(Mqtt.Transport);

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

  const broadcast = (payload) => {
    if (!IOTEDGE_DEVICEID) { return };
    return client.invokeMethod(IOTEDGE_DEVICEID, 'GdmAgent', {
      methodName: 'broadcast',
      payload
    });
  }

  // TODO: insert your code here
  console.log('test_setting value is', MODULENAME_TEST_SETTING);

  // In this example we send TestModule.Event message every second
  let seq = 0;
  setInterval(() => {
    broadcast({ type: 'TestModule.Event', some: 'data', seq });
    seq += 1;
  }, 1000);

  client.onMethod('restart', async (req, res) => {
    console.log('Restart command received, exiting');
    res.send(200, 'Restarting');
    setInterval(() => process.exit(0), 1000);
  });

  // TODO: insert your methods here

  client.onMethod('broadcast', async (req, res) => {
    try {
      const data = JSON.parse(req.payload);
      console.log('recv broadcast', data);

      switch (data.type) {
        case "Test.Message":
          processTestMessage(data);
          break;

        // TODO: insert your message handlers here
      }

      res.send(200, 'ok');
    } catch (e) {
      console.error('Cannot process broadcast', e.toString());
      res.send(500, 'error');
    }
  });
}

main();