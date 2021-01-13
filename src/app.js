const gridos = require('./gridos');

const { MODULENAME_TEST_SETTING } = process.env;

async function main() {
  const client = await gridos.connect();

  // TODO: insert your code here

  console.log('test_setting value is', MODULENAME_TEST_SETTING);

  // In this example we send TestModule.Event message every second
  let seq = 0;
  setInterval(() => {
    client.broadcast({ type: 'TestModule.Event', some: 'data', seq });
    seq += 1;
  }, 1000);

  // TODO: insert your methods here
  client.onMethod('someMethod', (payload) => {
    console.log('Received method call', payload);
    return 'hello there';
  })

  client.onEvent('Test.Event', (data) => {
    console.log('Received event', data);
  });
}

main();