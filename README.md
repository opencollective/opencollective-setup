# Open Collective Setup

CLI tool to setup Open Collective in repositories

## Install

    $ npm install -g opencollective-setup

Then run

    $ opencollective-setup

## Usage

```
opencollective-setup

  Setup a collective (from github or in current working directory)

Options:

  -i, --interactive               Interactive mode
  -r, --repo <org/repo>           Clone the repo, runs the setup in interactive mode and submits a pull request
  -gt, --github_token <token>     Authentication token from Github (see https://github.com/settings/tokens)
  -h, --help                      Output usage information

Additional commands:

  setup:readme [-f FILENAME]      Update the README FILENAME (defaults to README.md) with backers/sponsors badge and placeholders
  setup:template [-f FILENAME]    Prepend the default donate message to the template FILENAME (defaults to ISSUE_TEMPLATE.md)
  setup:postinstall               Add "opencollective-postinstall" as the postinstall script in package.json

Examples:

– Setup a github repo

    $ opencollective-setup --repo mochajs/mocha

– Add backers/sponsors to your README

    $ opencollective-setup setup:readme

– Add the donate message in the PULL_REQUEST_TEMPLATE.md of the project:

    $ opencollective-setup setup:template -f PULL_REQUEST_TEMPLATE.md
```
