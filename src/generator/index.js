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
        type: 'input',
        name: 'platform',
        message: 'Platform',
        choices: ['Browser', 'Node'],
        default: 'Browser',
      },
      {
        type: 'input',
        name: 'language',
        message: 'language',
        choices: ['TypeScript', 'JavaScript'],
        default: 'TypeScript',
      },
    ]);
  }

  copyFiles() {
    const files = ['package.json', ['template.gitignore', '.gitignore']];

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

    if (this.answers.typescript) {
      devDeps.push('typescript');
    }

    this.yarnInstall(deps);
    this.yarnInstall(devDeps, { dev: true });
  }
}

module.exports = ProjectGenerator;
