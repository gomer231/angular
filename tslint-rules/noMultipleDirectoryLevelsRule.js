"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ts = require("typescript");
var Lint = require("tslint");
/**
 * Rule that ensures that there are no multiple directory levels or `src/` in import paths.
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walkContext, this.getOptions().ruleArguments);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walkContext(context) {
    (function visitNode(node) {
        if (ts.isImportDeclaration(node)) {
            var importStatementText = node.getText();
            if (importStatementText.includes('\'../../')) {
                context.addFailureAtNode(node, "Import path should not have multiple directory levels\n    " + importStatementText);
            }
            if (importStatementText.includes('\'src/')) {
                context.addFailureAtNode(node, "Import path should not have 'src/'\n    " + importStatementText);
            }
        }
        ts.forEachChild(node, visitNode);
    })(context.sourceFile);
}
