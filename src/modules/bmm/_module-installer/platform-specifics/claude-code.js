const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('node:path');

/**
 * BMM Platform-specific installer for Claude Code
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from install-config.yaml
 * @param {Object} options.logger - Logger instance for output
 * @param {Object} options.platformInfo - Platform metadata from global config
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, logger, platformInfo } = options;

  try {
    const platformName = platformInfo ? platformInfo.name : 'Claude Code';
    logger.log(chalk.cyan(`  Installing BMM-${platformName} Specifics...`));

    // Define source directories (in BMAD repo)
    const bmadRoot = path.join(__dirname, '../../../../..');
    const sourceDirs = {
      hooks: path.join(bmadRoot, '.claude/hooks'),
      skills: path.join(bmadRoot, '.claude/skills/bmad'),
      agents: path.join(bmadRoot, '.claude/agents/bmad'),
      templates: path.join(__dirname, '../templates'),
    };

    // Define destination directories (in user's project)
    const destDirs = {
      hooks: path.join(projectRoot, '.claude/hooks'),
      skills: path.join(projectRoot, '.claude/skills/bmad'),
      agents: path.join(projectRoot, '.claude/agents/bmad'),
    };

    // 1. Install TDD Hooks
    if (await fs.pathExists(sourceDirs.hooks)) {
      await fs.ensureDir(destDirs.hooks);
      await fs.copy(sourceDirs.hooks, destDirs.hooks, { overwrite: true });

      // Make hook scripts executable
      const hookFiles = ['tdd-enforcer.js', 'tdd-manager.js'];
      for (const hookFile of hookFiles) {
        const hookPath = path.join(destDirs.hooks, hookFile);
        if (await fs.pathExists(hookPath)) {
          await fs.chmod(hookPath, 0o755);
        }
      }

      logger.log(chalk.green('  ✓ TDD enforcement hooks installed'));
    }

    // 2. Install Skills
    if (await fs.pathExists(sourceDirs.skills)) {
      await fs.ensureDir(destDirs.skills);
      await fs.copy(sourceDirs.skills, destDirs.skills, { overwrite: true });
      logger.log(chalk.green('  ✓ BMAD skills installed'));
    }

    // 3. Install Agents
    if (await fs.pathExists(sourceDirs.agents)) {
      await fs.ensureDir(destDirs.agents);
      await fs.copy(sourceDirs.agents, destDirs.agents, { overwrite: true });
      logger.log(chalk.green('  ✓ BMAD agents installed'));
    }

    // 4. Generate CLAUDE.md from template
    const claudeMdTemplate = path.join(sourceDirs.templates, 'CLAUDE.md.template');
    const claudeMdDest = path.join(projectRoot, 'CLAUDE.md');

    if (await fs.pathExists(claudeMdTemplate)) {
      // Check if CLAUDE.md already exists
      if (await fs.pathExists(claudeMdDest)) {
        logger.log(chalk.yellow('  ⚠ CLAUDE.md already exists, skipping...'));
      } else {
        // Read template and populate with config values
        let template = await fs.readFile(claudeMdTemplate, 'utf8');

        // Replace template variables
        template = template.replace('{project_name}', config.project_name || 'My Project');
        template = template.replace('{project_type}', config.project_type || 'Web Application');
        template = template.replace('{tech_stack}', config.tech_stack || 'Not specified');
        template = template.replace('{project_root}', projectRoot);
        template = template.replace('{code_style_conventions}', config.code_style || 'Follow existing patterns in the codebase');
        template = template.replace('{testing_standards}', config.testing_standards || 'Write unit and integration tests for all features');
        template = template.replace('{architecture_patterns}', config.architecture_patterns || 'Follow architecture documentation');
        template = template.replace('{error_handling_conventions}', config.error_handling || 'Use try-catch for async operations, return errors for sync');
        template = template.replace('{security_requirements}', config.security || 'Validate all inputs, use parameterized queries, no hardcoded secrets');
        template = template.replace('{timestamp}', new Date().toISOString());
        template = template.replace('{bmad_version}', '6.0');

        await fs.writeFile(claudeMdDest, template);
        logger.log(chalk.green('  ✓ CLAUDE.md generated from template'));
      }
    }

    logger.log(chalk.green(`  ✓ BMM-${platformName} Specifics installed`));
    logger.log(chalk.dim(`\n  TDD hooks, skills, and agents are now available in your project.`));
    logger.log(chalk.dim(`  See .claude/ directory for details.`));

    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM Claude Code specifics: ${error.message}`));
    return false;
  }
}

module.exports = { install };
