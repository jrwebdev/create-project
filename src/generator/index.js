const path = require('path');
const Generator = require('yeoman-generator');

class ProjectGenerator extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
      },
      {
        type: 'list',
        name: 'platform',
        message: 'Platform',
        choices: ['Browser', 'Node'],
        default: 'Browser',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Language',
        choices: ['TypeScript', 'JavaScript'],
        default: 'TypeScript',
      },
    ]);

    this.ts = this.answers.language === 'TypeScript';
    this.platform = this.answers.platform.toLowerCase();
  }

  copyFiles() {
    const files = [
      'README.md',
      'package.json',
      ['template.gitignore', '.gitignore'],
    ];

    files.map(file => {
      let inFile, outFile;

      if (Array.isArray(file)) {
        inFile = file[0];
        outFile = file[1];
      } else {
        inFile = file;
        outFile = file;
      }

      this.fs.copyTpl(
        this.templatePath(inFile),
        this.destinationPath(outFile),
        this
      );
    });
  }

  createFiles() {
    if (this.ts) {
      const tsconfig = require(this.templatePath('tsconfig.json'));
      if (this.platform === 'browser') {
        tsconfig.compilerOptions.lib.push('dom');
      }
      this.fs.writeJSON('tsconfig.json', tsconfig);
    }
  }

  installDependencies() {
    const deps = [];
    const devDeps = [];

    if (this.ts) {
      devDeps.push('typescript');
    }

    if (this.platform === 'node') {
      devDeps.push('@types/node');
    }

    this.yarnInstall(deps);
    this.yarnInstall(devDeps, { dev: true });
  }
}

module.exports = ProjectGenerator;
