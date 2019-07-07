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

    if (this.ts) {
      files.push('tsconfig.json');
    }

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

  installDependencies() {
    const deps = [];
    const devDeps = [];

    if (this.ts) {
      devDeps.push('typescript');
    }

    this.yarnInstall(deps);
    this.yarnInstall(devDeps, { dev: true });
  }

  updateFiles() {
    if (this.ts && this.platform === 'browser') {
      const tsconfig = require(path.resolve('tsconfig.json'));
      tsconfig.compilerOptions.lib.push('dom');
      this.fs.writeJSON('tsconfig.json', tsconfig);
    }
  }
}

module.exports = ProjectGenerator;
