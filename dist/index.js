import { exec } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
// Function to generate directory tree with dashes and vertical bars
const generateDirectoryTree = (dir, prefix = '') => {
    const entries = readdirSync(dir);
    let result = '';
    for (const entry of entries) {
        // Exclude 'node_modules' and '.git' directories
        if (entry === 'node_modules' || entry === '.git')
            continue;
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        const isDirectory = stats.isDirectory();
        result += `${prefix}- ${entry}\n`;
        if (isDirectory) {
            result += generateDirectoryTree(fullPath, `${prefix}|   `);
        }
    }
    return result;
};
// Generate directory structure from current directory
const directoryTree = generateDirectoryTree(process.cwd());
// Command to copy to clipboard
const copyCommand = process.platform === 'win32' ? 'clip' : 'pbcopy';
// Execute the copy command
const child = exec(copyCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log('Directory structure copied to clipboard');
});
// Ensure stdin is not null before writing to it
child.stdin?.write(directoryTree, 'utf-8', (err) => {
    if (err) {
        console.error(`stdin write error: ${err.message}`);
    }
    child.stdin?.end();
}) ?? console.error('Failed to access stdin of the child process.');
