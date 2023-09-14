# Titan Health App
A comprehensive web application that seamlessly combines exercise and nutrition tracking while offering intelligent, personalized suggestions to guide users' health and fitness journeys. 

## Workspace Setup
To clone the repository onto your local machine, run `git clone https://github.com/yyu2002/Titan_Health_App.git` in the directory you want the repository to be cloned into.

We used [yarn](https://yarnpkg.com/) as the package manager for our application and recommend it. Install yarn by running `npm install yarn`. We will be managing the versions of node modules separately for front and backend.

## Running the Application

#### Running the Backend (Server)
Navigate to the `/backend/` directory. Before starting the server, run `yarn` to update existing node modules or install any missing node module dependencies. Then run `yarn start` to start the backend server. 

#### Running the Frontend (Client)
Navigate to the `/frontend/` directory. Before starting the server, run `yarn` to update existing node modules or install any missing node module dependencies. Then run `yarn start` to start the backend server. 

## Development

For more details on how to use yarn as a package manager, see the [yarn CLI documentation](https://classic.yarnpkg.com/lang/en/docs/cli/).

#### Installing New Modules (Dependencies)
To install a new dependency required, navigate to either the frontend or backend directory, then run `yarn add <module_name>` to install the new module in its desired location.

#### Pushing New Changes
Before pushing any changes and making a pull request, run the following:
- `git config --global push.default current`. This will allow you to automatically push changes on your local branch to a remote branch of the same name using `git push` or `git push -u`. See [this](https://stackoverflow.com/questions/1519006/how-do-i-create-a-remote-git-branch/27185855#27185855) stack overflow post for more details if interested.
- `git config --global pull.rebase true`. This will set git to default rebase when pulling.

Next, just run the following:
- `git pull` to pull in any local changes before committing. If the pull pull and rebase fails due to conflicting local changes run `git stash`, then `git pull`, then `git stash pop`. Fix any conflicts and commit when finished.
- `git commit -m <message>` to commit your changes.
- `git push` to push the changes to the remote branch that will be created by default based on the config set above.
- Navigate to [Pull requests](https://github.com/yyu2002/Titan_Health_App/pulls) to create the pull request onto the `main` branch. Get the necessary approvals then merge and delete the branch. 

#### Pull Request Rules
The follow requirements must be met before pushing changes onto the `main` branch:
- Must be an invited contributor to the repository
- Must have 1 approval from another contributor
- Must have 1 approval from the repository owner (yyu2002)


