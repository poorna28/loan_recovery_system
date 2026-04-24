/**
 * Logger Configuration
 * Implements file-based logging system with rotation support
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor(filename = 'application.log') {
    this.filename = filename;
    this.filepath = path.join(logsDir, filename);
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatLog(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const logData = data ? JSON.stringify(data) : '';
    return `[${timestamp}] [${level}] ${message} ${logData}\n`;
  }

  rotateLogIfNeeded() {
    try {
      if (fs.existsSync(this.filepath)) {
        const stats = fs.statSync(this.filepath);
        if (stats.size > this.maxFileSize) {
          const timestamp = new Date().toISOString().replace(/:/g, '-');
          const backupPath = path.join(
            logsDir,
            `${path.basename(this.filename, '.log')}-${timestamp}.log`
          );
          fs.renameSync(this.filepath, backupPath);
        }
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  writeLog(level, message, data = null) {
    try {
      this.rotateLogIfNeeded();
      const logEntry = this.formatLog(level, message, data);
      fs.appendFileSync(this.filepath, logEntry);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  info(message, data = null) {
    console.log(message, data || '');
    this.writeLog('INFO', message, data);
  }

  warn(message, data = null) {
    console.warn(message, data || '');
    this.writeLog('WARN', message, data);
  }

  error(message, data = null) {
    console.error(message, data || '');
    this.writeLog('ERROR', message, data);
  }

  debug(message, data = null) {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] ${message}`, data || '');
      this.writeLog('DEBUG', message, data);
    }
  }
}

module.exports = new Logger('application.log');
