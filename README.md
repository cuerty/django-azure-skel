# ChangeMe

ChangeMe application.

## Development

Running the project locally is achieved by using [Docker](https://www.docker.com/). Please refer to Docker documentation on how to install it locally.

If you are using either MacOS X or Windows you shall use docker machine in order to host a Linux environment on your computer.

Once docker is installed, you can build and run the project using docker-compose:

```
$ docker-compose build
$ docker-compose up
```

That will start a webserver running the application.

## Settings

The configuration of the project set via environment variables, this are the ones read from the project:



Environment Variable|Example value|Description|
--------------------|-------------|-----------|
``DEBUG``|true|If debug messages should be enabled.|
``DATABASE_URL``|mysql://USER:PASSWORD@HOST:PORT/NAME|Connection to the database (MySQL).|
``SECRET_KEY``|Any random and secure text.|Key used to sign coockies.|
``AZURE_ACCOUNT_NAME``||Azure Storage Account name.|
``AZURE_ACCOUNT_KEY``||Private key that gives your Django app access to your Azure Account.|
``AZURE_CONTAINER``|static|This is where the files uploaded through your Django app will be uploaded. .|
``CACHE_URL``|rediscache://[USER:PASSWORD@]HOST:PORT[/DB]|Connection to the cache (Redis).|
``BROKER_URL``|redis://[USER:PASSWORD@]HOST:PORT[/DB]|Connection to the celery broker (Redis).|

## Dependencies

### OS dependencies

OS dependencies are documented in the Dockerfile file.

Check the line containing the big ``apt-get install`` and add your dependencies there.

### Python dependencies

Python dependencies are registered in 4 different files:

|File|Description|
|----|-----------|
|``requirements/base.txt``|Common dependencies used in all the environments.|
|``requirements/local.txt``|Dependencies used only in local development.|
|``requirements/remote.txt``|Dependencies used in remote environments like staging or production.|

## Coding style and guidelines

In order to keep the codebase as standard as possible we use two tools to control the file formats, one is flake8:

    $ flake8
    
Running it by itself in the root of the project checks for formatting using the configuration found in the setup.cfg file.

YAPF is a formatter for Python files.

To keep a style and sort things with it we use the following line before commits:

    $ find . -name "*.py" -exec echo {} \; -exec yapf -i {} \;

Both packages are installed by ``requirements/local.txt``. If you want to install them locally on your OS use the versions listed in that file.
