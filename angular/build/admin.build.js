({
    //- paths are relative to this app.build.js file
    appDir: "../adminpanelclient",
    baseUrl: "app",
    //By default all the configuration for optimization happens from the command
    //line or by properties in the config file, and configuration that was
    //passed to requirejs as part of the app's runtime "main" JS file is *not*
    //considered. However, if you prefer the "main" JS file configuration
    //to be read for the build so that you do not have to duplicate the values
    //in a separate configuration, set this property to the location of that
    //main JS file. The first requirejs({}), require({}), requirejs.config({}),
    //or require.config({}) call found in that file will be used.
    mainConfigFile: '../adminpanelclient/app/settings.js',
    //- this is the directory that the new files will be. it will be created if it doesn't exist
    dir: "../server/admin",
    //    name: "settings",
    //    out: "main-built.js",
    optimizeCss: "standard.keepLines",
    modules: [
    {
        name: "settings"
    }
    ],
    
    fileExclusionRegExp: /\.git/
})


