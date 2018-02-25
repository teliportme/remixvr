## What does the VR template provide?

VR template contains all the necessary elements to initiate a VR enviornment in web browsers. It also provides the basic structure to create custom VR templates.

1. The template author can enter their VR enviornment logic inside the `init()` function in the `script.js` file.
2. The initial contents of the `script.js` file should not be deleted.
3. `index.html` file should not be edited unless you need to add extra scripts.
4. Only the scripts from the common folder should be included in the `index.html` page.
5. The main js file should be named `script.js`.
6. The options for the template will set using `options.json` in the template folder.
7. The customisable variables should be present inside the *variables* attribute inside the options object.
8. The options object will also provide the title, description and the author of the template.
9. Each *variable* inside the options object can be of approved types like text and dropdown. If the current types doesn't fit the need, new type can be submitted for approval.

## What does index.html do?

`index.html` provides the necessary files to create VR experiences. It imports `three.js` which makes it easier to write WebGL code to create 3D experience and `WebVR.js` which will be used to check for VR availablity and add an **Enter VR** button to the page.

It also contains `webvr-polyfill` script which provides keyboard and mouse controls when WebVR is not present on desktops and orientation controls on mobile.

In case, you need addional scripts that you need to run for creating your VR experience, the library can be loaded from the commons folder. If the library is not present in the common folder, it should be requested to be added or added in a pull request. If the script doesn't follow the security and data requirements of the project, it'll not be included.

## What does script.js do?

`script.js` contains the code that creates the VR experience. It also contains the code to initialize **Enter VR** button when WebVR is ready. It also contains function to create the WebGL renderer using `three.js` and also sets up the scene for the VR experience.

Template authors can write additional code to add custom logic on what to display on the scene.

## How to use

Open terminal on your computer and run the following.

1. Clone the repo to your machine by running `git clone https://github.com/teliportme/remixVR.git remixVR`.
2. Install [`node.js`](https://nodejs.org/) if you haven't done so already.
3. Run `npm install -g serve`.
4. Go inside the folder by running `cd remixVR`.
5. Run `serve .`
6. The application will be visible at `http://localhost:5000`.