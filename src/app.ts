import { connect } from '@ombori/ga-module';

import { Settings } from './schema.js';

// TODO: Update 'name' field in package.json with 'organisation-name.module-name' identifier
// TODO: Update 'description' field in package.json with module's descriptive name
// TODO: Update 'container-registry' field in package.json with your container registry hostname
// TODO: Create .env file with <your-registry>_USERNAME and <your-registry>_PASSWORD values

const module = await connect<Settings>();

// TODO: insert your code here
console.log('Module is started');

// Example of working with module settings
console.log(`testSetting value is ${module.settings.testSetting}`);
module.onSettings((settings: Settings) => {
  console.log('settings updated', settings);
});

// In this example we send TestModule.Event message every second
let seq = 0;
setInterval(() => {
  module.publish('MyModule.Event', { some: 'data', seq });
  seq += 1;

  // Example of module telemetry usage
  module.updateTelemetry({ messagesSent: seq });
}, 1000);

// Example of an event coming from app or another module
module.subscribe('MyModule.Event', async (data) => {
  console.log('Received event', data);
});

// Example of module method
module.onMethod('someMethod', async (payload) => {
  console.log('Received method call', payload);
  return 'hello there';
})

// Example of MQTT topic subscription
module.subscribeMqtt('ombori', (data, topic) => {
  console.log(`${topic}> `, data.toString());
});

// Example of publishing to MQTT topic
let mqttSeq = 0;
setInterval(() => {
  module.publishMqtt('ombori', `hello ${mqttSeq}`);
  mqttSeq += 1;

  // Another example of module telemetry
  module.updateTelemetry({ mqttMessagesSent: mqttSeq });
}, 1000);