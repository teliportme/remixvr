# RemixVR

RemixVR is a tool to collaboratively build editable VR experiences.

The editable VR experiences are called VR templates. Anyone can create a VR template. Each VR template will have configurable options that can be selected by the user. These options allow the user to create custom VR experiences from a single VR template.

![RemixVR](https://media.giphy.com/media/KZfKUhK06Gc8KL0O6Y/giphy.gif)

For example, let's look at the [ObjectsVR](https://github.com/teliportme/remixVR/tree/master/packages/objectsvr) template. It has three options. You can change the object, the 360 background and the sound it creates when hovering on the object.

In the initial version, these options are updated by editing the code. However, as we continue to develop RemixVR, we'll be including a visual way to update the options.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Documentation

You can read [RemixVR docs](https://docs.remixvr.org/) to view all the documentation about the project.

### Prerequisites

To make sure the projects runs on your machine, you need to have the following items installed on your machine.

[Install node.js](https://nodejs.org/en/download/package-manager/) on your machine. We'll be using node.js for running our development server and building our project using [webpack](https://webpack.js.org/).

We'll use [yarn](https://yarnpkg.com/en/) as our dependency manager. If you don't have `yarn` on your machine, make sure to [install yarn](https://yarnpkg.com/en/docs/install).

### Installing

First, we need to clone this Github repo and open the folder.

```bash
git clone https://github.com/teliportme/remixVR.git
cd remixVR
```

Then we need to install the dependencies.

```bash
yarn install
```

Once the installation of is completed, you're ready to use the VR templates.

The repo is setup as a monorepo using [yarn workspaces](https://yarnpkg.com/en/docs/workspaces). This conserves disk space by sharing common dependencies across different packages.

### Running a VR template

Once you have installed all the dependencies, to start a VR template, go to the template folder and in the terminal run `yarn start`.

For example, to start the ObjectsVR template, go to the template folder.

```bash
cd packages/objectsvr
```

Once you're inside the template folder, then start the development server.

```bash
yarn start
```

You can view the template by going to `http://localhost:8080/` on your browser.

## Running the tests

To run the test, navigate to the root folder of remixVR. Then run:

```bash
yarn run test
```

The test files are present inside the template folder. The test files ends with *.test.js* in their file name. You can look at [ObjectsVR test](packages/objectsvr/objectsvr.test.js) file to see an example.

## Built With

- [a-frame](https://aframe.io/)
- [webpack](https://webpack.js.org/)
- [karma](https://karma-runner.github.io/)
- [mocha](https://mochajs.org/)
- [chai](http://www.chaijs.com/)
- [sinon](http://sinonjs.org/)

## Contributing

Please read [CODE OF CONDUCT](CODE_OF_CONDUCT.md) for details on our code of conduct. Please read [CONTRIBUTING GUIDE](CONTRIBUTING.md) before contributing.

## Versioning

We use [SemVer](http://semver.org/) for versioning the VR templates.

## Authors

- **[Rison Simon](https://risonsimon.com)**

See also the list of [contributors](https://github.com/teliportme/remixVR/contributors) who participated in this project.

## License

This project is licensed under the GPL v3 License - see the [LICENSE.md](LICENSE.md) file for details.