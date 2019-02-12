---
description: How to setup RemixVR
---

# Installation

## Before you start

There are couple of things you need to understand about how RemixVR is setup before you start.

There are 3 main parts to RemixVR.

1. [Frontend](installation.md#frontend)
2. Backend
3. Templates

In the next section, you can see how to setup each part of RemixVR on your computer.

## Steps to setup RemixVR on your computer

### Prerequisites

To make sure the projects runs on your machine, you need to have the following items installed on your machine.

#### Downloading RemixVR

First, we need to clone this Github repo and open the folder.

```bash
git clone https://github.com/teliportme/remixVR.git
cd remixVR
```

Once you're inside this folder, you can see 3 main folders which you should be aware of.

1. Frontend
2. Backend
3. Templates

#### Frontend

* Node.js
* Yarn

[Install node.js](https://nodejs.org/en/download/package-manager/) on your machine. We'll be using node.js for running our development server and building our project using [webpack](https://webpack.js.org/).

We'll use [yarn](https://yarnpkg.com/en/) as our [dependency manager](https://yarnpkg.com/lang/en/docs/managing-dependencies/). If you don't have `yarn` on your machine, make sure to [install yarn](https://yarnpkg.com/en/docs/install).

Once these are installed, go into the frontend folder.

```bash
cd frontend
```

Here we have to install the dependencies.

```bash
yarn install
```

This will download the project dependencies to `node_modules` folder. Once it is complete, you can use the following command to start the frontend.

```bash
yarn start
```

The frontend part of RemixVR will now be available at [http://localhost:3000/](http://localhost:3000/).

#### Backend

* Python 3
* Virtualenv

For RemixVR backend, we're using [Flask](http://flask.pocoo.org/) framework. To install flask and all the dependencies, make sure you have Python 3 installed on your computer. If you're not sure you have Python installed, you can run the following command in your terminal.

```bash
python --version
```

If you have Python 3 installed, you'll get something like `3.x.x` as the result. If you get an error saying Python is not installed or if the Python version is `2.x.x`, then [install Python 3](https://realpython.com/installing-python/).

Once you're ready with Python on your computer, you can go to the _backend_ folder inside RemixVR directory.

```bash
cd backend
```

Once here, we'll first setup [`virtualenv`](https://virtualenv.pypa.io/en/latest/) for our project. To install `virtualenv`, run the following command.

```bash
pip install virtualenv
```

Once you've installed `virtualenv`, create a new environment inside the `backend` directory.

```text
virtualenv env
```

This will create a new folder called _env_ which will save all the python dependencies there. Once the setup is complete, you'll need to run the following command to start using the correct dependencies in _env_ folder.

```bash
source env/bin/activate
```

Now you're ready to install the rest of Python dependencies. Since we're using `virtualenv`, Python will use the version of dependency specified in _env_ folder for our project.

When we finish working with backend, we can stop using the dependency versions in _env_ folder by running the following command.

```bash
deactivate
```

If we didn't use `virtualenv`, then all the dependencies will be shared with rest of the python projects, which makes it difficult to use correct version of dependency for your project.

Inside _requirements_ folder, you can see there are two files, called _dev.txt_  for development environment and _prod.txt_ for __production __environment. 

For our local machine, we'll download the dependencies in _dev.txt._ This includes additional packages used  for development, compared to production environment.

```bash
pip install -r requirements/dev.txt 
```

Once the installation is complete, all the backend dependencies for your project are installed.

There are couple more steps needed before we start our application.

First, set your app's secret key as an environment variable. For example, add the following to `.bashrc` or `.bash_profile`.

```bash
export remixvr_SECRET='something-really-secret'
```

Before running shell commands, set the `FLASK_APP` and `FLASK_DEBUG` environment variables

```bash
export FLASK_APP=/path/to/autoapp.py
export FLASK_DEBUG=1
```

{% hint style="warning" %}
In the above command, make sure FLASK\_APP points to _autoapp.py_ in your backend folder. For example, `/projects/remixVR/backend/autoapp.py`
{% endhint %}

Run the following commands to create your app's database tables and perform the initial migration

```text
flask db init
flask db migrate
flask db upgrade
```

To run the web application use:

```text
flask run --with-threads
```

This will start the backend at [http://localhost:5000/](http://localhost:5000/)

