import { connect } from '@ombori/ga-module';

// TODO: Update 'name' field in package.json with 'organisation-name.module-name' identifier
// TODO: Update 'description' field in package.json with module's descriptive name

const module = await connect();

// TODO: insert your code here
console.log('test_setting value is', module.getSetting('test_setting'));

// In this example we send TestModule.Event message every second
let seq = 0;
setInterval(() => {
  module.broadcast({ type: 'MyModule.Event', some: 'data', seq });
  seq += 1;
}, 1000);

// Example of module method
module.onMethod('someMethod', async (payload) => {
  console.log('Received method call', payload);
  return 'hello there';
})

// Example of an event coming from app or another module
module.onEvent('Test.Event', async (data) => {
  console.log('Received event', data);
});