

![header](./.github/images/header.png)
---
| Build                                                                                                                                                   |
|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![ci](https://github.com/jdaar/FsBuddy/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/jdaar/FsBuddy/actions/workflows/ci.yaml) |

An open-source platform for job data extraction in multiple plataforms and metric generator for datasources, it includes tag detection, with fuzzy search or ai.

It comes with an intuitive web ui that leets you manage all your scheduled jobs, datasources and analytics

## Features
- Hot-swap datasources
- MongoDb support
- Computrabajo support
- Tag detection
- Metric generation
    - Salary mean
    - Salary std deviation
    - Tag count

## How to run

The project includes a docker compose definition which runs the app with the required services (mongodb).

You just have to install **docker** and run the following commands

```sh
docker compose build
docker compose up
```

## Demo

You can see a demo of the app in the following link: [Go to demo](https://youtu.be/hYKSo_WblS4), this demo doesn't include the job scheduling feature.

## Screenshots

![main_screenshot](./.github/images/main_screenshot.png)

## Usage

The following pictures will show you the basic structure of the UI:

## Roadmap

### Milestones

- [ ] Todo: milestones

### Features

- [ ] Todo: features


 