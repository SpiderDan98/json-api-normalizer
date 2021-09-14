let mix = require('laravel-mix');
const path = require("path");

mix.ts('src/index.ts', 'dist')
    .setPublicPath('dist')
    .disableNotifications()
    .alias({
        "@": path.resolve("src/"),
    });