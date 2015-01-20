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


### How to use

```
git clone https://github.com/zigfred/faf-tool.git
npm install

// edit settings.json now !!!

// At first try to --dry-run !!!

// create new feature branches and setup it
grunt create-feature

// or just checkout necessary branches and init it
grunt setup
```

### Commands
#### create-feature

```
"create-branches", // create new branches from trunk for all modules specified in settings.json
"checkout-settings-files", // checkout branches
"resolve-deps", // resolve bower dependencies in bower.json
"update-overlay-versions", // update overlay versions in jrs-ui, jrs-ui-pro and JRS poms
"checkin-settings", // commit resolved dependencies
"clean" // clean all local repo folders after finish
```

#### setup
Checkout selected modules and init it


### settings.json
Remove unnecessary modules, set branch names for faf, ce and pro
```
{
  "svn-server": "falcon.jaspersoft.com",

  "overlayVersion": "test-release-name-tests-feature-name-SNAPSHOT",

    // branch name parts
  "release-cycle": "<release name>",
  "feature-name": "<feature name>",
  // or full branch name. This will override release-cycle and release-name options. Optional
  "branch-name": "<specific feature name>",

    // optional JRS branch used for checkout and update faf overlays version in jasperserver-war/pom.xml
  "jasperserver-branch": "<existed jrs ce branch name>",
  "jasperserver-pro-branch": "<existed jrs pro branch name>",

    // optional JRS location (if already checked out) - used to update faf overlays version in jasperserver-war/pom.xml (requires manual commit)
  "jasperserver-path": "<path to local jrs>",
  "jasperserver-pro-path": "<path to local jrs-pro>",
  

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

Resolve bower dependencies for bi-control:

Resolve bower dependencies for bi-dashboard:

Resolve bower dependencies for bi-report:

Resolve bower dependencies for bi-repository:

Resolve bower dependencies for js-sdk:

Resolve bower dependencies for visualize-js:

Resolve bower dependencies for jrs-ui:

Resolve bower dependencies for jrs-ui-pro:

Running "update-overlay-versions" task

Update overlay versions

Running "checkin-settings" task
Checking in updated settings files for bi-control
Checking in updated settings files for bi-dashboard
Checking in updated settings files for bi-report
Checking in updated settings files for bi-repository
Checking in updated settings files for js-sdk
Checking in updated settings files for visualize-js
Checking in updated settings files for jrs-ui
Checking in updated settings files for jrs-ui-pro

Running "clean:0" (clean) task

Running "clean:1" (clean) task

Running "clean:2" (clean) task

Running "clean:3" (clean) task

Running "clean:4" (clean) task

Running "clean:5" (clean) task

Running "clean:6" (clean) task

Running "clean:7" (clean) task

Running "clean:8" (clean) task

Running "clean:9" (clean) task

Done, without errors.


Execution Time (2015-01-20 12:34:47 UTC)
loading tasks            10ms  ■■■■■■■■■■■■■■■■■■■ 13%
create-branches          20ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 25%
checkout-settings-files  10ms  ■■■■■■■■■■■■■■■■■■■ 13%
checkin-settings         20ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 25%
clean:4                  10ms  ■■■■■■■■■■■■■■■■■■■ 13%
clean:8                  10ms  ■■■■■■■■■■■■■■■■■■■ 13%
Total 80ms

```