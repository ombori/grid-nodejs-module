import Module from '@ombori/ga-module';

const client = await Module.connect();

// TODO: insert your code here
console.log('test_setting value is', client.getSetting('test_setting'));

// In this example we send TestModule.Event message every second
let seq = 0;
setInterval(() => {
  client.broadcast({ type: 'TestModule.Event', some: 'data', seq });
  seq += 1;
}, 1000);

// TODO: insert your methods here
client.onMethod('someMethod', async (payload) => {
  console.log('Received method call', payload);
  return 'hello there';
})

client.onEvent('Test.Event', async (data) => {
  console.log('Received event', data);
});