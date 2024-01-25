Integration package for fletch widget

## To publish a new version

- make changes as needed
- run `npm run changeset`
- follow the steps:
  - select the kind of change (i.e. `patch`, `minor` or `major`)
  - enter the `"summary"` for the change
  - select `"yes"` after entering the details
  - commit the changes once done
  - create a pull request to `main` or push to `main`
- the changes will be picked up the changesets github action and a new version will be published to npm

## To run the examples

- install nodejs >= 18
- install the dependencies by running `npm i`
- build the package by running `npm run build`
- open the example html files using any live-server/browser
