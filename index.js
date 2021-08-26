const Queue = require('bull');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const testQueue = new Queue('test', process.env.REDIS_URL || 'redis://localhost:6379', {
  settings: {
    // Speed up stalled interval so we don't need to wait long
    // If you remove this the error persist, I did it only for the convenience of the debugging
    stalledInterval: 5000
  }
});

const shouldAdd = !!process.env.ADD;

async function nonBlockingLoop() {
  while (true) {
    await sleep(100);
  }
}

testQueue.on('global:error', (error) => console.error('global:error | an error occurred', error));

testQueue.on('global:waiting', (jobId) => console.log('global:waiting | A Job is waiting to be processed as soon as a worker is idling.', jobId));

testQueue.on('global:active', (job) => console.log('global:active | A job has started ', job.id));

// A job has been marked as stalled. This is useful for debugging job
// workers that crash or pause the event loop.
testQueue.on('global:stalled', (job) => console.log('global:stalled | A job has been marked as stalled. ', job));

testQueue.on('global:completed', (job, result) => console.log('global:completed | A job successfully completed with a `result`. ', job.id, result));

testQueue.on('global:failed', (job, err) => console.error('global:failed | A job failed with reason `err`! ', job.id, err));

testQueue.on('global:drained', () => console.log('global:drained | Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)'));

testQueue.on('global:removed', (job) => console.log('global:removed | A job successfully removed. ', job.id));

async function run() {
  if (shouldAdd) {
    console.log('Adding');

    testQueue.add({hello: 'world'});

    await nonBlockingLoop();
  } else {
    console.log('Start listening');

    testQueue.process(async (job) => {
      console.log('process 1 | Job received ', job.id, job.data);

      // Doing this so it won't **actually** get _stalled_ so we can stop this while it's running
      await nonBlockingLoop();
    });
  }
}

run();
