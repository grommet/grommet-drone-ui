# grommet-drone-ui

This is an UI for [Drone](https://github.com/drone/drone) based on [Grommet](https://grommet.github.io).

To run this application, execute the following commands:

  1. Install NPM modules

    ```
    $ npm install (or yarn install)
    ```

  2. Make sure you have a Drone back-end running somewhere. Default is http://localhost:8050.

  3. Start the front-end dev server:

    ```
    $ npm run dev (or HOST=localhost:8000 npm run dev)
    ```
    
    This will start the UI server at http://localhost:3000/

  4. Create the app distribution to be used by a back-end server

    ```
    $ NODE_ENV=production grommet pack
    ```

  5. Test and run linters:

    ```
    $ npm test
    ```
    
The embed Drone Server with this UI is available as a docker image: https://hub.docker.com/r/grommet/drone/
