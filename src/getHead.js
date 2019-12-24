const fs = require('fs');
const Head = require('./headLib.js');

const parseCmdLineArgs = function(cmdLineArgs) {
  const parsedCmdLineArgs = {};
  if (cmdLineArgs.includes('-n')) {
    parsedCmdLineArgs.requiredNoOfLines = cmdLineArgs[cmdLineArgs.indexOf('-n') + 1];
    parsedCmdLineArgs.filePath = cmdLineArgs.slice(cmdLineArgs.indexOf('-n') + 2);
  } else {
    parsedCmdLineArgs.filePath = cmdLineArgs;
  }
  return parsedCmdLineArgs;
};

const getHeadLinesOrError = function(cmdLineArgs, outLog, errorLog) {
  const parsedCmdLineArgs = parseCmdLineArgs(cmdLineArgs);
  const head = new Head(parsedCmdLineArgs.filePath, parsedCmdLineArgs.requiredNoOfLines);
  const fileContents = head.getFileContents(parsedCmdLineArgs.filePath[0], fs.readFileSync, fs.existsSync);
  if (fileContents.hasOwnProperty('lines')) {
    const result = performHeadOperation(head, fileContents);
    return [outLog, result];
  }
  const result = fileContents.error;
  return [errorLog, result];
};

const performHeadOperation = function(head, fileContents) {
  const separatedLines = head.separateAllLines(fileContents.lines);
  const requiredLines = head.extractFirstNLines(separatedLines);
  const formattedLines = head.formatLines(requiredLines);
  return formattedLines;
};

module.exports = { getHeadLinesOrError, performHeadOperation, parseCmdLineArgs };
