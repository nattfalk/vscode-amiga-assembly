//
// Tests of the extension
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'chai' provides assertion methods from node
import * as chai from 'chai';
import * as vscode from 'vscode';
import * as path from 'path';

var expect = chai.expect;

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    context("Formatting comand", function () {
        it("Should respond to command call", async () => {
            // Creating the relative path to find the test file
            const testFilesPath = path.join(__dirname, "..", "..", "test_files");
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "p.s"));
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            let editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor openned
                // Call the formatting command
                await vscode.commands.executeCommand("editor.action.formatDocument");
                expect(editor.document.lineAt(0).text).to.be.equal("42");
            }
        });
    });
});