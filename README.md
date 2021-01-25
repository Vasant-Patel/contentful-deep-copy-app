# `Contentful Copy Content App`

App for copying contentful entries


## How to use

Install it and run:

```bash
npm install
npm start
# or
yarn
yarn start
```

To test, you can create an app definition in your Contentful organization settings pointing to `http://localhost:1234` and registering the `app-config` location:

![App definition](https://images.ctfassets.net/tz3n7fnw4ujc/6jjsBToDLY7OP9Yy4KXWGx/14813081b1ab56cf11aee903e474054e/Screenshot_2020-05-06_at_11.35.40.png?w=1800)

> Keep in mind that when you serve an app locally over `http`, you will get a warning about insecure content. You can ignore this during development.

## How to deploy?

npm run deploy => deploys and runs on github pages

## How to install this app to contentful?

Use the deployed url as SourceURL in the contentful app definition


> [Read the docs](https://www.contentful.com/developers/docs/extensibility/app-framework/) for more information.
