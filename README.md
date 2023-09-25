# Titan Health App - Documentation
A comprehensive web application that seamlessly combines exercise and nutrition tracking while offering intelligent, personalized suggestions to guide users' health and fitness journeys 🍎🏋️. 

Specialized dining court integration features are included for students @ Purdue.

## Workspace Setup
To clone the repository onto your local machine, run `git clone https://github.com/yyu2002/Titan_Health_App.git` in the directory you want the repository to be cloned into.

We used [yarn](https://yarnpkg.com/) as the package manager for our application. Install yarn by running `npm install yarn`. We will be managing the versions of node modules separately for front and backend. Next, navigate to both the `/backend` and `/frontend` directories run `yarn` in both to install all the necessary node module dependencies. <ins>If you accidentally ran `yarn` in the root directory instead of in the `/backend` and `/frontend` directories, delete the `/node_modules` directory and `yarn.lock` files and make sure to run `yarn` in the proper directories.<ins>

## Running the Application

### Running the Backend (Server)
Navigate to the `/backend` directory. Before starting the server, run `yarn` to update existing node modules or install any missing node module dependencies. Then run `yarn start` to start the backend server. 

### Running the Frontend (Client)
Navigate to the `/frontend` directory. Before starting the server, run `yarn` to update existing node modules or install any missing node module dependencies. Then run `yarn start` to start the backend server. The default IP address and port number set by the application is `http://localhost:3000/`.

## Development

For more details on how to use yarn as a package manager, see the [yarn CLI documentation](https://classic.yarnpkg.com/lang/en/docs/cli/).

### Installing New Modules (Dependencies)
To install a new dependency required, navigate to either the frontend or backend directory, then run `yarn add <module_name>` to install the new module in its desired location. Make sure to not install dependencies in the project root directory, but rather in either the `/frontend` or `/backend` directories. If you accidentally ran installed a dependency in the root directory instead of in the `/backend` and `/frontend` directories, delete the `/node_modules` directory and yarn.lock files and make sure to run `yarn add ...` in the proper directory.

### Pushing New Changes
Before pushing any changes and making a pull request, run the following:
- `git config --global push.default current`: This will allow you to automatically push changes on your local branch to a remote branch of the same name using `git push` or `git push -u`. See [this](https://stackoverflow.com/questions/1519006/how-do-i-create-a-remote-git-branch/27185855#27185855) stack overflow post for more details if interested. Just make sure that if you are using this feature instead of specifying the remote branch, that there isn't already a remote branch with the same name or else there could be unintended conflicts.
- `git config --global pull.rebase true`: This will set git to default rebase when pulling.

Next, just run the following:
1. `git pull` to pull in any changes before committing. If the pull pull and rebase fails due to conflicting local changes run `git stash`, then `git pull`, then `git stash pop`. Fix any conflicts and commit when finished.
2. `git commit -m <message>` to commit your changes.
3. `git push` to push the changes to the remote branch that will be created by default based on the config set above.
4. Navigate to [Pull requests](https://github.com/yyu2002/Titan_Health_App/pulls) to create the pull request onto the `main` branch. Get the necessary approvals then merge and delete the branch.

<ins> Make sure not to push anything from `node_modules` when committing and pushing changes. We don't want tons of dependencies stored in our repository.<ins>

#### Pull Request Rules
The follow requirements must be met before pushing changes onto the `main` branch:
- Must be an invited contributor to the repository
- Must have 1 approval from another contributor
- Must have 1 approval from the repository owner (yyu2002)

### Personal Access Tokens
You may need to set up a personal access token for authentication due to GitHub's newer security guidelines. See [this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) documentation for how to do so (create a classic token), or follow the steps below:
1. Go to the [Tokens (classic)](https://github.com/settings/tokens) in **Developer settings**.
2. Click on **Generate new token**, then **Generate new token (classic)**.
3. Give the token a name, set the desired expiration, and check every check box for maximum permission access, then at the bottom click **Generate token**.
4. Save the access token somewhere safe and local since you will need it to authenticate.

Next time if you are prompted for your username and password when pushing, use your access token as the password. If you don't want to retype your credentials every time, run `git config credential.helper store` before you run `git push`, and once you enter your credentials, they will be stored locally (unencrypted) so you don't have to re-enter them repeatedly.

### MongoDB Setup (For Database Access)
We have set up a MongoDB cluster though MongoDB Atlas, hosted on AWS. Follow the below steps to make sure you are setup for development. The necessary credentials are contained in the [credentials document](https://docs.google.com/document/d/1XyIoMjj3yVY9TDJR9R39AVFLrzpDo_KEBhMqWR9ADTs/edit) which is private (must request access).

#### Setting Up Network Access for your IP Address
1. Navigate to [cloud.mongodb.com](https://cloud.mongodb.com/) and log into the Titan Health App account using the credentials in the [credentials document](https://docs.google.com/document/d/1XyIoMjj3yVY9TDJR9R39AVFLrzpDo_KEBhMqWR9ADTs/edit). Select the Titan Health App organization and project.
2. Under the `SECURITY` section on the left, go to `Quickstart`, and scroll down to `Add entries to your IP Access List`. Simply click `Add My Current IP Address`, and your device's IP will be granted access to the Database cluster. You can also add your IP in to the access list in the `Network Access` section but it's easier to do it through `Quickstart`.

#### Database Access (Users and Roles)
There already exists two users that each assume 1 default role. They're set up to be authenticated simply through credentials which are contained in the [credentials document](https://docs.google.com/document/d/1XyIoMjj3yVY9TDJR9R39AVFLrzpDo_KEBhMqWR9ADTs/edit).
1. ReadWriteUser - has read and write access to the database cluster. **(Stick with this user for development)**
2. AdminUser - has full administrator access to the database cluster

#### Connecting to the Database
The URI and credentials to connect to the database cluster are contained in the [credentials document](https://docs.google.com/document/d/1XyIoMjj3yVY9TDJR9R39AVFLrzpDo_KEBhMqWR9ADTs/edit). For ease of visualizing the data while working with it, we recommend downloading [MongoDB Compass](https://www.mongodb.com/products/tools/compass) and connecting through Compass to visualize the databases and collections during development.

