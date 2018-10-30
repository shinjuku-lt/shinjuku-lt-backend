# shinjuku-lt-backend [![CircleCI](https://circleci.com/gh/shinjuku-lt/shinjuku-lt-backend/tree/master.svg?style=svg)](https://circleci.com/gh/shinjuku-lt/shinjuku-lt-backend/tree/master)

shinjuku-lt-backend is backend service of [our website](https://shinjukult.tk/). 
shinjuku-lt-backend provides REST API.
* for more details. show our [API DOC](https://shinjukult.docs.apiary.io/)

## Quick Start

shinjuku-lt-backend generally works like other [express](https://expressjs.com/) apps.
So only you need is [node.js LTS](https://nodejs.org/ja/).


```shell
$ node -v
> v10.13.0

$ git clone git@github.com:{YOUR_FORKED_REPOSITORY}/shinjuku-lt-backend.git

$ cd shinjuku-lt-backend

$ npm install

# run with environment variables
$ env DB_USER={DB_USER} DB_PASS={DB_PASS} DB_PORT={DB_PORT} DB_HOST={DB_HOST} DB_NAME={DB_NAME} npm start

# health check
$ curl http://localhost:3000/health
> {"message":"woooooooooooo."}⏎
```

note: If node.js is not yet installed. Prease install it first.
