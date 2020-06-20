# NPress - a NodeJS + Typescript CMS

This may very well fall under the 'yet another' category, but it's my take on CMSs and built with nodejs and typescript. The aim is to provide developers a starting project that only needs skinning, leaving the content management to someone else.

At the moment it isn't production ready since it hasn't been thoroughly tested, but you can clone it and have a look around.

If you're not in the mood for cloning the repo, you could always visit this little [Demo instance](http://ec2-18-130-83-127.eu-west-2.compute.amazonaws.com/) and it's [Admin](http://ec2-18-130-83-127.eu-west-2.compute.amazonaws.com/admin) (user: `admin@npess.com` and password: `123123`).

## "How it's made"

I'm using a standard MVC approach with the following backend tools:
- Expressjs
- Twigjs
- TypeORM + TypeDI

The enitities pretty much contain db table columns and before/after Insert/Update handlers

The controllers are slim and only call methods from services that basically do the heavy lifting in grabbing and processing data from the db.

Frontend-wise, bootstrap 4 is used for css and a handful of libraries with no js dependencies. jQuery is brought in though, only in the admin area, for the dashboard template.

You can find the full list of dependencies further down in the "Thanks" section.

## Getting started

```
git clone git@github.com:cstapetrei/npress.git
npm install
```
- copy env.sample.ts to env.ts and fill in your db info
- create a database with the name you typed in the 'database' field in env.ts

```
npm run migration:run
```
```
npm run dev
```
or
```
npm run prod
```
When developing, the sources will get recompiled and server restarted on any .ts or .twig file save.

In case you're using VSCode, here's a launch.json for debugging purposes:
```
{
    "type": "node",
    "request": "attach",
    "name": "Attach to Process",
    "port": 9300,
    "restart": true,
    "protocol": "inspector",
    "address": "localhost"
}
```
First start the server with "npm run dev" and afterwards click the 'attach to process' in VScode run configurations. If everything is in order, you'll see a "Debugger attached" message in the terminal.

Finally, visit http://localhost:3000/ for the public area. For the admin section go to http://localhost:3000/admin and login with user: `admin@npess.com` and password: `123123`

## A few details

Everything in the admin dashboard should be pretty much self explanatory.

The only "foreign" notion could be **Codeblocks**. In this section you define twig blocks that can be reused in the page editor section. Here's an example:
```
// let's say we have the following block
[[my-code-slug attr1=value1 attr2=value2]]

// defined with
<p>This is my code {{ attr1 }} {{ attr2 }}</p>
```

When rendering, every pair of  `[[` `]]` will get replaced by their corresponding definition (with attributes being replaced by their values).

If you use an undefined slug, the block will just be erased.

### Themes

You can add a custom theme to your build by adding another folder in src/views/themes that must include an index.twig. Inside you can either extend the default `layout.twig` and override it's blocks or go crazy with anything else :)

Due to the compiled nature of typescript, the non-twig assets in a theme folder (for example: css, js, images) are copied to the static folder on a server (re)start so that express can serve them. Also, the paths for these assets need to use the twig filter `theme_asset` and have their path relative to the current theme folder.

There is a barebones `my-theme` folder already created for inspiration, but please ignore it's esthetics since it's there only as a code sample. :)

### Requirements

Any modern browser should do just fine. Older browsers most likely won't work since they don't support javascript arrow functions and other ES6 features natively.

## Thanks
To the following (or, in other words, what this project is using) for their awesome work :)

### Backend
- [NodeJS](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [TypeDI](https://github.com/typestack/typedi)
- [class-validator](https://github.com/typestack/class-validator)
- [Formidable](https://github.com/node-formidable/formidable)
- [Node Mysql](https://github.com/mysqljs/mysql)
- [Node Postgres](https://node-postgres.com/)
- [TS Node](https://github.com/TypeStrong/ts-node)
- [GulpJS](https://gulpjs.com/)
- [gulp-newer](https://github.com/tschaub/gulp-newer)
- [gulp-typescript](https://github.com/ivogabe/gulp-typescript)
- [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)

### Frontend
- [AdminLTE](https://adminlte.io/) - v3 powers the admin area
- [jQuery](https://jquery.com/)
- [Bootstrap 4](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [CodeMirror](https://codemirror.net/)
- [Bootstrap Native](https://github.com/thednp/bootstrap.native)
- [DropzoneJS](https://www.dropzonejs.com/)
- [flatpickr](https://flatpickr.js.org/)
- [Jodit](https://xdsoft.net/jodit/)
- [Luminous](https://github.com/imgix/luminous)
- [Noty](https://ned.im/noty/)
- [Sortable](http://sortablejs.github.io/Sortable/)
- [v8n](https://github.com/imbrn/v8n)
- [window.fetch polyfill](https://github.com/github/fetch)
- [Font Awesome 5](https://fontawesome.com/icons?d=gallery&m=free)

### Both
- [TwigJS](https://github.com/twigjs/twig.js)