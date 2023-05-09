const withPlugins = require('next-compose-plugins'),
    css = require('@zeit/next-css'),
    withAssetsImport = require('next-assets-import'),
    graphql = require('next-plugin-graphql');

module.exports = withPlugins([
    [graphql],
    [withAssetsImport],
]);
