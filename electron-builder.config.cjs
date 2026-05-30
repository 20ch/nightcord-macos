module.exports = {
    appId: "com.nightcord.app",
    productName: "Nightcord",
    copyright: "Copyright 2026 Nightcord",
    extraMetadata: {
        main: "dist/js/main.js",
        name: "nightcord"
    },
    asar: true,
    npmRebuild: false,
    files: [
        "package.json",
        "dist/js/**/*",
        "static/**/*",
        "!**/*.map",
        "!**/*.ts"
    ],
    extraResources: [
        {
            from: "dist/desktop.asar",
            to: "desktop.asar"
        },
        {
            from: "dist/nightcord.asar",
            to: "nightcord.asar"
        },
        {
            from: "ghost-server",
            to: "ghost-server",
            filter: [
                "server.js",
                "package.json"
            ]
        }
    ],
    directories: {
        output: "release",
        buildResources: "build"
    },
    mac: {
        target: ["dir"],
        icon: "build/icon.icns",
        category: "public.app-category.social-networking",
        identity: null,
        hardenedRuntime: false,
        gatekeeperAssess: false
    }
};
