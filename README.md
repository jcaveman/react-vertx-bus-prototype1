# Vert.x React Mongo Prototype

The purpose of this application is to experiment with and learn the Vert.x event bus with MongoDB persistence. It is unecessarily complex for the sake of demonstrating the distributed nature of the Vert.x event bus.

### Overview

This application uses 3 verticals which are packaged as Vert.x modules:
#### 1. A front end vertical which acts as the web server
com.helloelephant~react-fe~0.01
This is a JavaScript web server running a React web app. The web app is a result of this tutorial:
`http://facebook.github.io/react/docs/tutorial.html`

..using SockJS to send data from the browser to the Vert.x event bus, which is a result of this tutorial:
`http://www.superpumpup.com/reactjs-and-vertx`

#### 2. A middleware persistence API
com.helloelephant~mongo-persistor~0.01
This is a JavaScript middleware layer which provides an API for the front-end and contains all of the handlers for the event bus.

3. A 3rd party MongoDB persistor
io.vertx~mod-mongo-persistor~2.1.0
This is a Java module from the Vert.x module registry developed by the Vert.x team. This module gets auto-deployed by the middleware layer and should be install automatically.
`http://modulereg.vertx.io/`
`https://github.com/vert-x/mod-mongo-persistor`

### Dependencies

#### Vert.x
http://vertx.io/
http://vertx.io/downloads.html
http://vertx.io/install.html

Type `$ vertx version` to verify installation.

#### MongoDB
http://www.mongodb.org/
http://www.mongodb.org/downloads
http://docs.mongodb.org/manual/installation/

Type `$ mongo -version` to verify installation

#### MongoDB Persistor
https://github.com/vert-x/mod-mongo-persistor

*NOTE: This dependency is installed automatically during deployment of the middleware persistence vertical.

### Setup

Verify your MongoDB settings and modify server.conf in necessary.

`/mods/com.helloelephant~mongo-persistor~0.01/config/server.conf`

The defaults are:
{
  "address": "comments.persistor",
  "db_name": "vertx-persistor",
  "host": "localhost",
  "port": 27017
}

Verify your local hostname and port for the web server and modify if desired.

`/mods/com.helloelephant~react-fe~0.01/config/react-fe.conf`
The defaults are:
{
  "domain": "localhost",
  "port": 8080
}

### Running the application

Run Mongo.

`$ mongod`

In a new terminal tab, deploy persistence module.
*NOTE: this should install and deploy the mod-mongo-persistor dependency.

`$ ./scripts/deploy_persistor.sh`

In a third terminal tab, deploy the front end module.

`$ ./scripts/deploy_frontend.sh`

Point your browser to the hostname and port you configured above. If you didn't change anything, it's:

`http://localhost:8080`

