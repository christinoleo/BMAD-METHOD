const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('node:path');

/**
 * BMM Platform-specific installer for Windsurf
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from install-config.yaml
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, logger } = options;

  try {
    logger.log(chalk.cyan('  Installing BMM-Windsurf Specifics...'));

    // Define source and destination for TDD hooks
    const bmadRoot = path.join(__dirname, '../../../../..');
    const hooksSource = path.join(bmadRoot, '.claude/hooks');
    const hooksDest = path.join(projectRoot, '.windsurf/hooks');

    // Install TDD Hooks (Windsurf uses .windsurf/hooks)
    if (await fs.pathExists(hooksSource)) {
      await fs.ensureDir(hooksDest);
      await fs.copy(hooksSource, hooksDest, { overwrite: true });

      // Make hook scripts executable
      const hookFiles = ['tdd-enforcer.js', 'tdd-manager.js'];
      for (const hookFile of hookFiles) {
        const hookPath = path.join(hooksDest, hookFile);
        if (await fs.pathExists(hookPath)) {
          await fs.chmod(hookPath, 0o755);
        }
      }

      logger.log(chalk.green('  ✓ TDD enforcement hooks installed'));
    }

    logger.log(chalk.green('  ✓ BMM-Windsurf Specifics installed'));
    logger.log(chalk.dim('  Note: Skills and agents are Claude Code specific'));

    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM Windsurf specifics: ${error.message}`));
    return false;
  }
}

module.exports = { install };
