// # Deploying a Node Web Server to Heroku

// This guide walks through the necessary steps to deploy your full stack Node.js application to Heroku!

// ### Prerequisites

// To begin with, you'll need a git repository initialized locally with your basic web server code working and committed.

// 1. There are a couple of ways to do this.

//    * If you cloned from a remote repository and then wrote/committed your code to the local clone, you should be set and can skip these steps and go straight to deploying.

//    * If you haven't set up a git repository for your files yet (or didn't clone), proceed to the next step.

// 2. Run `git init` locally in the folder with your web server files.

//    * If you want to also push to GitHub in addition to hosting on Heroku (recommended), you can follow the [Adding Existing Projects to GitHub through the command line Guide](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

// 3. Commit all changes (if you haven't already with the above steps) using `git add .` and `git commit -am "<message>"`. If you haven't run into any errors at this point, you should be able to proceed to the next section.

//    * You may also want to create a `.gitignore` file if you don't have one already. This file will allow you to tell git to not track files such as those in the `node_modules` folder.

//    * The [GitHub gitignore Documentation](https://help.github.com/articles/ignoring-files/) and this [node gitignore example](https://github.com/github/gitignore/blob/master/Node.gitignore) are useful resources for this, though it is pretty much as simple as:

//      1. Before you commit, create a file called `.gitignore`. Inside of that file, add `node_modules/` as the first line and save the file. Now, git should no longer track `node_modules` files.

// ### Steps to Deploy

// 1. Log in to Heroku.
//    * If you are a windows user open the cmd.exe (NOT Git Bash) and type `heroku login`. Keep this command prompt open in the background. Then, open Git Bash and navigate to the folder with your code.

//    * If you are a mac open terminal and type the command `heroku login`. Enter your Heroku credentials and proceed with all the below steps in terminal. Navigate to the folder with your code.

// 2. Run the command: `git remote –v` .
//    * This is to show you that right now, you do not have heroku listed as a remote repository.

// 3. Run the command `heroku create`.
//    * This will create an app instance on the Heroku server and will add heroku as a remote for your local git repository.

// 4. Run `git remote –v` again.
//    * This isn't necessary, but helps to confirm that Heroku is now in your list of remotes. This time you should see the `heroku` remote.

// 5. Ensure that your `package.json` file is set up correctly. It must have a `start` script and all the project's dependencies defined. E.g.:
//    ```json
//    {
//      "name": "starwars",
//      "version": "1.0.0",
//      "description": "Helps you find the characters you are looking for",
//      "main": "server.js",
//      "dependencies": {
//         "express": "^4.16.3"
//      },
//      "scripts": {
//        "start": "node server.js"
//      }
//    }
//    ```

// 6. Ensure your web server is starting with a dynamic port.
//    * For an express app, the code for this would look like:

//    ```js
//    var PORT = process.env.PORT || 3000;
//    ...
//    app.listen(PORT, function() {
//    ```

//    * This allows you to get the port from the bound environment variable (using `process.env.PORT`) if it exists, so that when your app starts on heroku's machine it will start listening on the appropriate port.

//    * You app will still run on port 3000 locally if you haven't set an environment variable.

// 7. Ensure that you have at least one HTML page being served at the "/" route. Example:

// ```js
// app.get("/", function(req, res) {
//   res.json(path.join(__dirname, "public/index.html"));
// });
// ```

// 8. Make sure that the application actually works locally. If it doesn't work locally, it won't deploy.

// 9. Commit any changes you've made up until this point using `git commit -am "<message>"`

// 10. Run the command `git push heroku master`. A series of processes will be initiated. Once the process is complete note the name of the app.

// 11. Log in to your Heroku account at www.heroku.com . You will see a list or a (single) app. Note the one that has the same funky name as you saw in bash. Click on it.

// 12. Click on settings. Then, scroll down until you see the part that says: "Domains". Note the URL listed under Heroku Domain.

// 13. Finally, go in your browser to the URL listed under the Heroku Domain. If all went well you should see your website!

// ### Troubleshooting

// * If your Heroku app fails to deploy, run the following in your command-line:

//   ```
//   heroku logs
//   ```

//   * This should print all the logs produced by both Heroku and your application before the deployment failed. Look for the first indication of an error in the logs. If the error message isn't clear, Google it to learn more or ask an instructor or TA for help.

// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Star Wars Characters (DATA)
// =============================================================
var characters = [
  {
    routeName: "yoda",
    name: "Yoda",
    role: "Jedi Master",
    age: 900,
    forcePoints: 2000
  },
  {
    routeName: "darthmaul",
    name: "Darth Maul",
    role: "Sith Lord",
    age: 200,
    forcePoints: 1200
  },
  {
    routeName: "obiwankenobi",
    name: "Obi Wan Kenobi",
    role: "Jedi Master",
    age: 55,
    forcePoints: 1350
  }
];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "view.html"));
});

app.get("/add", function(req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});

// Displays all characters
app.get("/api/characters", function(req, res) {
  return res.json(characters);
});

// Displays a single character, or returns false
app.get("/api/characters/:character", function(req, res) {
  var chosen = req.params.character;

  console.log(chosen);

  for (var i = 0; i < characters.length; i++) {
    if (chosen === characters[i].routeName) {
      return res.json(characters[i]);
    }
  }

  return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/characters", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newcharacter = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newcharacter.routeName = newcharacter.name.replace(/\s+/g, "").toLowerCase();

  console.log(newcharacter);

  characters.push(newcharacter);

  res.json(newcharacter);
});

// Starts the server to begin listening
// =============================================================
app.listen(process.env.PORT, function() {
  console.log("App listening on PORT " + PORT);
});
