import * as ts from 'typescript';
import * as Lint from 'tslint';

/**
 * Rule that ensures that there are no multiple directory levels or `src/` in import paths.
 */
export class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile) {
        return this.applyWithFunction(sourceFile, walkContext, this.getOptions().ruleArguments);
    }
}

function walkContext(context: Lint.WalkContext<string[]>) {
    (function visitNode(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
            const importStatementText = node.getText();

            if (importStatementText.includes('\'../../')) {
                context.addFailureAtNode(node,
                    `Import path should not have multiple directory levels\n    ${importStatementText}`,
                );
            }

            if (importStatementText.includes('\'src/')) {
                context.addFailureAtNode(node,
                    `Import path should not have 'src/'\n    ${importStatementText}`,
                );
            }
        }

        ts.forEachChild(node, visitNode);
    })(context.sourceFile);
}
