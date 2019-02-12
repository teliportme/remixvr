---
description: How to setup RemixVR
---

# Installation

## Steps to setup RemixVR on your computer

#### Prerequisites

To make sure the projects runs on your machine, you need to have the following items installed on your machine.

[Install node.js](https://nodejs.org/en/download/package-manager/) on your machine. We'll be using node.js for running our development server and building our project using [webpack](https://webpack.js.org/).

We'll use [yarn](https://yarnpkg.com/en/) as our dependency manager. If you don't have `yarn` on your machine, make sure to [install yarn](https://yarnpkg.com/en/docs/install).

#### Installing

First, we need to clone this Github repo and open the folder.

```bash
git clone https://github.com/teliportme/remixVR.git
cd remixVR
```

Then we need to install the dependencies.

```bash
yarn install
```

The repo is setup as a monorepo using [yarn workspaces](https://yarnpkg.com/en/docs/workspaces). This conserves disk space by sharing common dependencies across different packages.

## Before you start

There are couple of things you need to understand about how RemixVR is setup before you start.

There are 3 main parts to RemixVR.

1. Frontend
2. Backend
3. Templates

