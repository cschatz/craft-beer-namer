# craft-beer-namer

A simple Twitter bot. This needs a server with node and npm installed. Recommended setup and lunch steps
- In the project directory, run `npm install`
- Run `node server.js N &` where **N** is the number of minutes between tweets

This will generate/update two files while it is running:
- **.pid**: the process ID
- **.log**: a log containing messages about errors and which tweets are being sent
