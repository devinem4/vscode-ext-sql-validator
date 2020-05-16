// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// https://github.com/lfittl/pg-query-emscripten
const PgQuery = require('pg-query-emscripten');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sql-validator.validateSql', () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('Could not find any SQL to validate.');
			return
		}

		const selection = editor.document.getText(editor.selection); 
		const sql = selection || editor.document.getText(); 
		console.log(`input = ${sql}`);

		let output = vscode.window.createOutputChannel('Validate SQL');

		output.show(true);
		output.appendLine("✨ SQL Validator ✨");
		output.appendLine("-----------------\n");

		const result = PgQuery.parse(sql);
		if (result.error) {
			const startLine = selection ? editor.selection.start.line : 0;
			const sqlLinesBeforeError = sql.substring(0, result.error.cursorpos).match(/\n/g);
			const errorLine = sqlLinesBeforeError ? sqlLinesBeforeError.length : 0 + startLine + 1;
			output.appendLine(`Error found on line ${errorLine}\n`)
			output.appendLine(result.error.message);
		} else {
			output.appendLine("🎂 looks good!")
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
