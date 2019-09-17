import Bee from 'bee-queue';

import redisConfig from '../app/config/redis';
import SubscriptionMail from '../app/jobs/SubscriptionMail';

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  process() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.failuredHandle).process(handle);
    });
  }

  failuredHandle(job, err) {
    console.log(`QUEUE PROCESS FAILED - PROCESS: ${job}, ERROR: ${err}`);
  }
}

export default new Queue();
