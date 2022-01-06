<div align="center">
	<h1>Clean Node Login Api</h1>
  <br/>
  <img src="https://img.shields.io/github/languages/code-size/gftf2011/clean-node-login-api-js"/>
  <img src="https://img.shields.io/github/repo-size/gftf2011/clean-node-login-api-js"/>
  <img src="https://img.shields.io/github/license/gftf2011/clean-node-login-api-js"/>
  <img src="https://img.shields.io/github/package-json/v/gftf2011/clean-node-login-api-js"/>
  <img src="https://img.shields.io/github/last-commit/gftf2011/clean-node-login-api-js"/>
  <img src="https://snyk.io/test/github/gftf2011/clean-node-login-api-js/badge.svg"/>
  <img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103"/>
</div>

<br/>

<div align="center">
  <a href="#page_facing_up-about">About</a> •
  <a href="#large_blue_diamond-design-patterns">Design Patterns</a> •
  <a href="#clipboard-required-tools">Required Tools</a> •
  <a href="#racing_car-running-project">Running Project</a> •
  <a href="#test_tube-running-tests">Running Tests</a> •
  <a href="#file_cabinet-running-swagger">Running Swagger</a> •
  <a href="#memo-license">License</a>
</div>

<br/>

<div align="center">
  <img src="https://github.com/gftf2011/clean-node-login-api-js/blob/main/public/img/background.png" />
</div>

<br/>

## :page_facing_up: About

This a authentication API developed in pure Vanilla Javascript.

The objective from this project is to show how to create an API with a well-defined and decoupled architecture, using T.D.D. - (Test Driven Development) as a work methodology, building along with the Clean Architecture concept, dividing the layers responsibility !

<br/>

## :large_blue_diamond: Design Patterns

- Abstract Factory
- Factory Method
- Adapter
- Composition Root
- Builder
- Singleton

<br/>

## :clipboard: Required Tools

- [x] Node - [https://nodejs.org/](https://nodejs.org/)
  - Node version: 16.x.x
  - npm version: 8.x.x
- [x] Yarn - [https://yarnpkg.com/](https://yarnpkg.com/)
  - Yarn version: 1.22.5
- [x] Snyk - [https://snyk.io/](https://snyk.io/)
- [x] Husky - [https://typicode.github.io/](https://typicode.github.io/)
- [x] Docker - [https://www.docker.com/](https://www.docker.com/)

<br/>

## :racing_car: Running Project

1. Clone Repository
```sh
  $ git clone https://gitlab.com/gftf2011/proffy-backend.git
```
2. Install dependencies
```sh
  ################################################################################
  # YARN usage is recommended, or use the "npm install" to install dependencies. #
  ################################################################################
  $ yarn
```
3. Use command below to run development environment
```sh
  $ yarn docker:dev:run
```

### OBS.: Ensure to install all dependencies in <a href="#clipboard-required-tools">Required Tools</a>

<br/>

## :test_tube: Running Tests
```sh
  $ yarn docker:test:run
```

<br/>

## :file_cabinet: Running Swagger

1. Run command below
```sh
  $ yarn docs
```
2. Access the url - *localhost:3334/api-dosc*

<br/>

## :memo: License

This project is under MIT license. See the [LICENSE](https://github.com/gftf2011/clean-node-login-api-js/blob/main/LICENSE) file for more details.

---

Made with lots of :heart: by [Gabriel Ferrari Tarallo Ferraz](https://www.linkedin.com/in/gabriel-ferrari-tarallo-ferraz-7a4218135/)
