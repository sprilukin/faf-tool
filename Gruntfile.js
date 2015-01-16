module.exports = function(grunt) {
    var settings;

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    try {
        settings = grunt.file.readJSON('settings.json');
    } catch (e) {
        grunt.fatal("Can't read settings.json, use settings.json.example to create settings.json");
    }


    function getRepoPath (module, type) {
        return [
            "svn+ssh:/",
            settings["svn-server"],
            module,
            getBranchPath(type)
        ].join("/");
    }
    function getBranchPath(type) {
        if (!type) {
            return defineBranchName(settings["faf-target"]);
        } else {
            return defineBranchName(settings["jrs-" + type + "-target"]);
        }
    }
    function defineBranchName(branch) {
        if (!branch || branch === "trunk") {
            return "trunk";
        } else {
            return "branches/" + branch;
        }
    }


    grunt.registerTask('setup', 'Setup faf', [
        "load-settings",
        "svn_export",
        "resolve-deps",
        "shell"
    ]);

    grunt.registerTask('init', 'Setup faf', [
        "load-settings",
        "resolve-deps",
        "shell"
    ]);


    grunt.registerTask('load-settings', 'Load settings and create config', function(){
        var svn_config = {};
        settings["modules"].forEach(function(module) {
            var type = module === "jasperserver" ? "ce" : module === "jasperserver-pro" ? "pro" : null;
            svn_config[module] = {
                options: {
                    repository: getRepoPath(module, type),
                    output: module
                }
            };
        });
        grunt.config.set("svn_export", svn_config);

        var shell_config = {};
        settings["modules"].forEach(function(module) {
            if (module.search("jasperserver") !== -1) return;
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


    grunt.registerTask('resolve-deps', 'Resolve bower dependencies', function() {
        settings["modules"].forEach(function(module) {
            if (module.search("jasperserver") !== -1) return;
            var bowerConfPath = module + "/bower.json";

            grunt.log.subhead("Resolve bower dependencies for " + module + ": ");

            var bowerConfig = grunt.file.readJSON(bowerConfPath);
            bowerConfig.resolutions = bowerConfig.resolutions || {};

            for (var depName in bowerConfig.dependencies) {
                if (!bowerConfig.dependencies.hasOwnProperty(depName)) continue;
                if (settings["modules"].indexOf(depName) !== -1) {
                    bowerConfig.dependencies[depName] = bowerConfig.dependencies[depName].replace(/#(.+)$/, "#" + settings["faf-target"]);
                    bowerConfig.resolutions[depName] = settings["faf-target"];
                    grunt.log.writeln(depName + "#" + settings["faf-target"]);
                }
            }

            grunt.file.write(bowerConfPath, JSON.stringify(bowerConfig, null, " "));
        });


    });

    grunt.registerTask('default', 'Default tasks', [
        "check-config"
    ]);
};