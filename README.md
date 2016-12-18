Task "ADFGX" for Alkindi-2015 competition.

### Installation

```
git clone https://github.com/France-ioi/alkindi-task-adfgx.git
cd alkindi-task-adfgx
npm install
jspm install
```

### Development

Run `npm run serve` to start a webserver on port 8080 then load
`http://localhost:8080/index-dev.html`.

To reduce load time, `npm run build-dev` builds a bundle containing
the dependencies.  Remember to re-run this command if you change (or
update) the dependencies.

### Production build

```
npm run build
```

Then point the platform to a location serving `index.html`.
