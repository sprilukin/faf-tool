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
        "shell"
    ]);

    grunt.registerTask('init', 'Setup faf', [
        "load-settings",
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



    grunt.registerTask('default', 'Default tasks', [
        "check-config"
    ]);
};