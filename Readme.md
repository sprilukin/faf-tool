# FAF setup tool

- checking out repositories
- resolve bower dependencies and save it in bower.json config file
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
Checkout, resolve bower dependencies, npm install (and prune) and grunt init
```
grunt setup
```

#### init
Resolve bower dependencies, npm install (and prune) and grunt init
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

### sample output

```
λ grunt setup
Running "load-settings" task
>> Settings loaded

Running "svn_export:bi-report" (svn_export) task
Exporting from svn+ssh://falcon.jaspersoft.com/bi-report/branches/amber2-tests-jsdoc-metrix
A    bi-report
A    bi-report\README

...


Done, without errors.


Execution Time (2015-01-16 08:40:45 UTC)
svn_export:bi-report         9.6s  ■■ 1%
svn_export:js-sdk           13.6s  ■■■ 2%
svn_export:visualize-js     10.5s  ■■ 2%
svn_export:jrs-ui           16.9s  ■■■ 3%
svn_export:jrs-ui-pro       13.7s  ■■■ 2%
shell:bi-report           2m 5.2s  ■■■■■■■■■■■■■■■■■■■■ 19%
shell:js-sdk             1m 37.8s  ■■■■■■■■■■■■■■■■ 14%
shell:visualize-js        2m 1.5s  ■■■■■■■■■■■■■■■■■■■ 18%
shell:jrs-ui              2m 6.7s  ■■■■■■■■■■■■■■■■■■■■ 19%
shell:jrs-ui-pro         2m 19.4s  ■■■■■■■■■■■■■■■■■■■■■■ 21%
Total 11m 14.9s

```