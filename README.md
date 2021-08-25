# Bull UI Repro

Job not stalled when the listener is terminated.

## Explain
There are 2 _states_ (let's call them services for the sake of the explanation) of the code:
1. Adding a job (you need to run the `index.js` file with `ADD=1` environment variable)
2. Listen to jobs

## Run

### `docker-compose`
Steps to run:
1. Run by running `docker-compose up`
2. Stop the listener service by running `docker-compose stop listener`
3. Wait a 5-10 seconds and see that stalled event **IS NOT** logged
4. Run the service again by `docker-compose start listener`
5. Wait a 5-10 seconds and see that the stalled event **LOGGED**

### Node and `docker-compse` for Redis
1. Run the redis service by `docker-compose start redis`
2. run the _listen_ service by running `npm run start:listen`
3. run the _add_ service by running `npm run start:add`
4. Stop the _listen_ service
5. Wait a 5-10 seconds and see that stalled event **IS NOT** logged
6. Run the service again (same as step 2)
7. Wait a 5-10 seconds and see that the stalled event **LOGGED**
