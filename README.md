## ![header](./.github/images/header.png)

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

You just have to install **docker** and run the following commands:

```sh
docker compose build
docker compose up
```

## Demo

You can see a demo of the app in the following link: [Go to demo](https://youtu.be/hYKSo_WblS4), this demo doesn't include the job scheduling feature.

## Usage

1. Execute a query
   - Click "Query parameters" on the roadmap in the navbar
   - You will now be in the query parameters form, fill it
   - Execute the query with the button on form submission
2. Wait for the query to recollect data, **you can see unfinished scraping jobs data**
3. Go to analytics page and do your thing :)

## Screenshots

### Home

![home_screenshot](./.github/images/home_screenshot.png)

### Role form

![role_screenshot](./.github/images/role_screenshot.png)

### Parameter

![parameter_screenshot](./.github/images/parameter_screenshot.png)

### Execution summary

![execute_screenshot](./.github/images/execute_screenshot.png)

### Schedule

![schedule_screenshot](./.github/images/schedule_screenshot.png)

### Analytics

#### 1

![analytics_1_screenshot](./.github/images/analytics_1_screenshot.png)

#### 2

![analytics_2_screenshot](./.github/images/analytics_2_screenshot.png)

## Roadmap

### Milestones

- [ ] Add support for Prisma datasource
- [ ] Add support for Linkedin
- [ ] Add support for Indeed

### Features

- [ ] Scraping job stop
