module.exports = function(grunt) {
    var settings,
        async = require("async");

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    try {
        settings = grunt.file.readJSON('settings.json');
    } catch (e) {
        grunt.fatal("Can't read settings.json, use settings.json.example to create settings.json");
    }


    // Public tasks

    // This task only for buildomatic usage
    grunt.registerTask('create-feature', 'Create new feature branches and setup it.', [
        "create-branches",
        "checkout-settings-files",
        "resolve-deps",
        "update-overlay-versions",
        "checkin-settings"
    ]);

    // This task for developers
    grunt.registerTask('setup', 'Checkout feature branches and setup FAF.', [
        "checkout-full",
        "init"
    ]);

    grunt.registerTask('default', 'Default task.', [

    ]);


    // Private tasks

    grunt.registerTask('create-branches', 'Creates svn branches for modules.', function() {
        var tasks = [],
            done = this.async();

        settings["modules"].forEach(function(module) {
            tasks.push(async.apply(createBranch, module));
        });

        async.series(tasks, done);
    });

    grunt.registerTask('checkout-settings-files', 'Checkout bower.json and package.json for modules for updating it.', function() {
        var tasks = [],
            done = this.async();

        settings["modules"].forEach(function(module) {
            tasks.push(async.apply(checkoutSettingsFiles, module));
        });
        if (settings["jasperserver-branch"]) {
            tasks.push(async.apply(checkoutSettingsFilesJrs));
        }
        if (settings["jasperserver-pro-branch"]) {
            tasks.push(async.apply(checkoutSettingsFilesJrsPro));
        }

        async.series(tasks, done);
    });

    grunt.registerTask('resolve-deps', 'Resolve bower dependencies.', function() {
        settings["modules"].forEach(function(module) {
            var bowerConfPath = module + "/bower.json",
                branchName = getBranchName();

            grunt.log.subhead("Resolve bower dependencies for " + module + ": ");

            var bowerConfig = grunt.file.readJSON(bowerConfPath);
            bowerConfig.resolutions = bowerConfig.resolutions || {};

            for (var depName in bowerConfig.dependencies) {
                if (!bowerConfig.dependencies.hasOwnProperty(depName)) continue;
                if (settings["modules"].indexOf(depName) !== -1) {
                    bowerConfig.dependencies[depName] = bowerConfig.dependencies[depName].replace(/#(.+)$/, "#" + branchName);
                    bowerConfig.resolutions[depName] = branchName;
                    grunt.log.writeln(depName + "#" + branchName);
                }
            }

            grunt.file.write(bowerConfPath, JSON.stringify(bowerConfig, null, " "));
        });
    });

    grunt.registerTask('update-overlay-versions', 'Update overlay versions in jrs-ui, jrs-ui-pro and in JRS poms.', function() {
        if (!settings.overlayVersion) {
            return false;
        }
        var fileContent, filePath;

        grunt.log.subhead("Update overlay versions");

        if (settings.modules.hasOwnProperty("jrs-ui")) {
            grunt.log.writeln("Update jrs-ui overlay version");
            fileContent = grunt.file.readJSON("jrs-ui/package.json");
            fileContent.overlayVersion = settings.overlayVersion;
            grunt.file.write("jrs-ui/package.json", JSON.stringify(fileContent, null, " "));
        }

        if (settings.modules.hasOwnProperty("jrs-ui-pro")) {
            grunt.log.writeln("Update jrs-ui-pro overlay version");
            fileContent = grunt.file.readJSON("jrs-ui-pro/package.json");
            fileContent.overlayVersion = settings.overlayVersion;
            grunt.file.write("jrs-ui-pro/package.json", JSON.stringify(fileContent, null, " "));
        }

        if (settings["jasperserver-branch"] || settings["jasperserver-path"]) {
            filePath = (settings["jasperserver-path"] || "jasperserver") + "/jasperserver-war/pom.xml";
            fileContent = grunt.file.read(filePath); // this is jasperserver/jasperserver-war/pom.xml file!
            fileContent = fileContent.replace(/(jrs-ui<\/artifactId>\s+<version>)[^<]+(<\/version>)/, "$1" + settings.overlayVersion + "$2");
            grunt.file.write(filePath, fileContent);
        }

        if (settings["jasperserver-pro-branch"] || settings["jasperserver-pro-path"]) {
            filePath = (settings["jasperserver-pro-path"] || "jasperserver-pro") + "/jasperserver-war/pom.xml";
            fileContent = grunt.file.read(filePath); // this is jasperserver-pro/jasperserver-war/pom.xml file!
            fileContent = fileContent.replace(/(jrs-ui-pro<\/artifactId>\s+<version>)[^<]+(<\/version>)/, "$1" + settings.overlayVersion + "$2");
            grunt.file.write(filePath, fileContent);
        }

    });

    grunt.registerTask('checkin-settings', 'Checking in updated settings files to repos.', function() {
        var tasks = [],
            done = this.async();

        settings["modules"].forEach(function(module) {
            tasks.push(async.apply(checkinSettings, null, module));
        });

        // disable commits for JRS
        /*
        if (settings["jasperserver-branch"]) {
            tasks.push(async.apply(checkinSettings, true, "jasperserver"));
        }
        if (settings["jasperserver-pro-branch"]) {
            tasks.push(async.apply(checkinSettings, true, "jasperserver-pro"));
        }*/

        async.series(tasks, done);
    });

    grunt.registerTask('init', 'Setup FAF. Install npm modules, init grunt.', [
        "load-init-settings",
        "shell"
    ]);

    grunt.registerTask('checkout-full', 'Checkout full selected repos', function() {
        var tasks = [],
            done = this.async();

        settings["modules"].forEach(function(module) {
            tasks.push(async.apply(checkoutFull, module));
        });

        if (settings["jasperserver-branch"]) {
            tasks.push(async.apply(checkoutFull, "jasperserver"));
        }
        if (settings["jasperserver-pro-branch"]) {
            tasks.push(async.apply(checkoutFull, "jasperserver-pro"));
        }
        async.series(tasks, done);
    });

    grunt.registerTask('load-init-settings', 'Load settings and create config for initialization commands.', function(){

        var shell_config = {};
        settings["modules"].forEach(function(module) {
            shell_config[module] = {
                command: "npm install && npm prune && grunt init",
                options: {
                    execOptions: {
                        cwd: "./" + module
                    }
                }
            };
        });

        grunt.config.set("shell", shell_config);

        grunt.log.ok("Settings loaded");
    });


    function getSettingsBranchPath(module) {
        if (module === "jasperserver") {
            return getRepoPath(module, "branches/" + settings["jasperserver-branch"]);
        }
        if (module === "jasperserver-pro") {
            return getRepoPath(module, "branches/" + settings["jasperserver-pro-branch"]);
        }
        return getRepoPath(module, "branches/" + getBranchName());
    }
    function getTrunkBranchPath(module) {
        return getRepoPath(module, "trunk");
    }

    function getRepoPath(module, path) {
        return [
            "svn+ssh:/",
            settings["svn-server"],
            module,
            path
        ].join("/");
    }

    function getBranchName() {
        return settings["branch-name"] || settings["release-cycle"] + "-" + settings["feature-name"];
    }

    function createBranch(module, callback) {
        execSvn([
            "copy",
            getTrunkBranchPath(module),
            getSettingsBranchPath(module),
            "-m",
            "Created a feature branch from Jenkins with name: " + getBranchName()
        ], callback);
    }

    function checkoutFull(module, callback) {
        execSvn([
            "checkout",
            getSettingsBranchPath(module),
            module
        ], callback);
    }

    function checkoutSettingsFiles(module, callback) {
        execSvn([
            "checkout",
            getSettingsBranchPath(module),
            module,
            "--depth",
            "files"
        ], callback);
    }

    function checkoutSettingsFilesJrs(callback) {
        execSvn([
            "checkout",
            getRepoPath("jasperserver", "branches/" + settings["jasperserver-branch"]),
            "jasperserver",
            "--depth",
            "immediates"
        ], function() {
            execSvn([
                "up",
                "jasperserver/jasperserver-war",
                "--set-depth",
                "files"
            ], callback);
        });
    }
    function checkoutSettingsFilesJrsPro(callback) {
        execSvn([
            "checkout",
            getRepoPath("jasperserver-pro", "branches/" + settings["jasperserver-pro-branch"]),
            "jasperserver-pro",
            "--depth",
            "immediates"
        ], function() {
            execSvn([
                "up",
                "jasperserver-pro/jasperserver-war",
                "--set-depth",
                "files"
            ], callback);
        });
    }

    function checkinSettings(jrs, module, callback) {
        execSvn([
            "commit",
            module,
            "-m",
            jrs ? "Resolved bower dependencies and updated overlay version" : "Updated overlay version"
        ], callback);
    }


    function execSvn(args, callback) {
        grunt.util.spawn({
            cmd: "svn",
            args: args
        }, function(error, result, code) {
            if (error) grunt.log.error(error);
            grunt.log.writeln(result);
            callback(error, result);
        });
    }
};

