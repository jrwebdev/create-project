#!/usr/bin/env node

const path = require('path');
const yeoman = require('yeoman-environment');

const env = yeoman.createEnv();

env.register(path.resolve(__dirname, 'generator'), '@jrweb/project');
env.run('@jrweb/project');
