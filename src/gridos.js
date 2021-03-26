const { Mqtt } = require("azure-iot-device-mqtt");
const { ModuleClient } = require("azure-iot-device");

const { IOTEDGE_DEVICEID, IOTEDGE_MODULEID } = process.env;

if (!IOTEDGE_DEVICEID) {
  console.error('IOTEDGE_DEVICEID not set, m2a and m2m broadcasts will not work');
}

const delay = n => new Promise(resolve => setTimeout(resolve, n));

class Module {
  async connect() {
    this.client = await ModuleClient.fromEnvironment(Mqtt);
    this.eventHandlers = {};

    this.client.on("error", (err) => console.error('error', err));

    // connect to the Edge instance
    for (let i = 0; i < 10; i++) {
      try {
        await this.client.open();
        break;
      } catch (e) {
        console.error('Cant connect to iotedge', e.toString());
        await delay((1 + i) * 1000);
      }
    }
    console.log("IoT Hub module client initialized");
  }

  broadcast(payload) {
    if (!IOTEDGE_DEVICEID) { return };
    return this.client.invokeMethod(IOTEDGE_DEVICEID, 'GdmAgent', {
      methodName: 'broadcast',
      payload
    });
  }

  onMethod(method, handler) {
    console.log('registering handler for', method);
    this.client.onMethod(method, async (req, res) => {
      try {
        const result = await handler(req.payload);
        res.send(200, result);
      } catch (e) {
        console.error(e.toString());
        res.send(500, 'error');
      }
    });
  }

  onEvent(type, handler) {
    this.eventHandlers[type] = handler;
  }

  getSetting(name) {
    return process.env[`${IOTEDGE_MODULEID.toUpperCase()}_${name.toUpperCase()}`];
  }
}

const connect = async () => {
  const module = new Module();
  await module.connect();

  module.onMethod('restart', async () => {
    console.log('Restart command received, exiting');
    setInterval(() => process.exit(0), 1000);
    return 'restarting';
  });

  module.onMethod('broadcast', async (data) => {
    console.log('Recv broadcast', data);

    if (module.eventHandlers[data.type]) {
      module.eventHandlers[data.type](data);
    }

    return 'ok';
  });

  return module;
}

module.exports = { connect };