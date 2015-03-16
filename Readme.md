# FAF setup tool

- Create feature branches and do preparation routine work.
    - create feature branches
    - checkout bower.json, package.json
    - update bower dependencies and overlay versions
    - commit changes (faf modules only)
- Checkout and setup all FAF and JRS feature repositories by one command
    - checkout full repositories for selected modules
    - run commands:
        - npm install
        - npm prune
        - grunt init

- Options
    - `--dry-run=true`
    - `--verbose`
    - `--no-time` - hide time report
    - `--username=<username>` - svn username
    - `--password=<password>` - svn password

### How to use

```
git clone https://github.com/Jaspersoft/faf-tool.git
npm install

// edit settings.json now !!!

// At first try to --dry-run !!!

// create new feature branches and setup it
grunt create-feature

// or just checkout necessary branches and init it
grunt setup
```

### Commands

command options can be used in these ways:
```
grunt create-feature --dry-run
grunt create-feature --dry-run=true --no-time
grunt create-feature --verbose=true --dry-run=true
```

#### create-feature

```
"create-branches", // create new branches from trunk for all modules specified in settings.json
"checkout-settings-files", // checkout branches
"resolve-deps", // resolve bower dependencies in bower.json
"update-overlay-versions", // update overlay versions in jrs-ui, jrs-ui-pro and JRS poms
"checkin-settings", // commit resolved dependencies
```

#### setup
Checkout selected modules and init it


### settings.json
Remove unnecessary modules, set branch names for faf, ce and pro
```
{
    // by default it uses "svn+ssh://" protocol but you can specify protocol in this property like "https://svnserver.jaspersoft.com"
  "svn-server": "falcon.jaspersoft.com",

    // branch name parts
  "release-cycle": "<release name>", // optional parameter for features without release cycle like bugfix
  "feature-name": "<feature name>",

    // optional JRS branch used for checkout and update faf overlays version in jasperserver-war/pom.xml
  "jasperserver-branch": "<existing jrs ce branch name>",
  "jasperserver-pro-branch": "<existing jrs pro branch name>",

    // optional JRS location (if already checked out) - used to update faf overlays version in jasperserver-war/pom.xml (requires manual commit)
  "jasperserver-path": "<path to local jrs>",
  "jasperserver-pro-path": "<path to local jrs-pro>",

  // optional svn credentials
  "username": "username",
  "password":"password",

  "modules": [
    "bi-charts",
    "bi-dashboard",
    "bi-report",
    "bi-repository",
    "js-sdk",
    "visualize-js",
    "jrs-ui",
    "jrs-ui-pro"
  ]

}
```

### sample output

```
λ grunt create-feature
Running "create-branches" task

...
Done, without errors.


Execution Time (2015-01-19 14:13:05 UTC)
create-branches           9.8s  ■■■■■■■■■■■■ 18%
checkout-settings-files  39.8s  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 72%
checkin-settings            6s  ■■■■■■■■ 11%
Total 55.7s
```

#### `--dry-run` option:

```
λ grunt create-feature --dry-run
Running "create-branches" task
Create svn branch for bi-control
Create svn branch for bi-dashboard
Create svn branch for bi-report
Create svn branch for bi-repository
Create svn branch for js-sdk
Create svn branch for visualize-js
Create svn branch for jrs-ui
Create svn branch for jrs-ui-pro

Running "checkout-settings-files" task
Checkout required files for bi-control
Checkout required files for bi-dashboard
Checkout required files for bi-report
Checkout required files for bi-repository
Checkout required files for js-sdk
Checkout required files for visualize-js
Checkout required files for jrs-ui
Checkout required files for jrs-ui-pro
Checkout required files for jasperserver
Checkout required files for jasperserver-pro

Running "resolve-deps" task

Running "update-overlay-versions" task

Running "checkin-settings" task
Checking in updated settings files for bi-control
Checking in updated settings files for bi-dashboard
Checking in updated settings files for bi-report
Checking in updated settings files for bi-repository
Checking in updated settings files for js-sdk
Checking in updated settings files for visualize-js
Checking in updated settings files for jrs-ui
Checking in updated settings files for jrs-ui-pro


Done, without errors.


Execution Time (2015-01-26 08:08:49 UTC)
loading tasks             3ms  ■■■■■■ 4%
create-branches          13ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■ 17%
checkout-settings-files  15ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 20%
resolve-deps              5ms  ■■■■■■■■■■ 7%
update-overlay-versions   1ms  ■■ 1%
checkin-settings         11ms  ■■■■■■■■■■■■■■■■■■■■■■ 15%

Total 75ms

```
