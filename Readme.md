# FAF setup tool

- Create feature branches and do preparation routine work.
    - create feature branches
    - checkout bower.json, package.json
    - update bower dependencies and overlay versions
    - commit changes
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

// edit settings.json now!!

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
"checkin-settings" // commit resolved dependencies
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
