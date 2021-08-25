# Bull UI Repro

Job not stalled when the listener is terminated.

Steps to run: 
1. Run by running `docker-compose up`
2. Stop the listener service by running `docker-compose stop listener`
3. Wait a 5-10 seconds and see that stalled event **IS NOT** logged
4. Run the service again by `docker-compose start listener`
5. Wait a 5-10 seconds and see that the stalled event **LOGGED**
