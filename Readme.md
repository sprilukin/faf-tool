# FAF setup tool

- checking out repositories
- installing npm dependencies and clean npm_modules from garbage
- initializing grunt


### How to use

```
git clone https://github.com/zigfred/faf-tool.git
npm install

// edit settings.json now!!

grunt setup
```

### Commands
#### setup
Checkout, npm install (and prune) and grunt init
```
grunt setup
```

#### init
Npm install (and prune) and grunt init
```
grunt init
```

### settings.json
Remove unnecessary modules, set branch names for faf, ce and pro
```
"faf-target": "amber2-tests-jsdoc-metrix",
"jrs-ce-target": "trunk",
"jrs-pro-target": "trunk",

"modules" : [
    "jrs-ui",
    "jrs-ui-pro",
    "js-sdk"
]
```