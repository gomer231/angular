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
var path = require("path");
var ts = require("typescript");
var Lint = require("tslint");
var minimatch = require("minimatch");
/**
 * Rule that enforces certain decorator properties to be defined and to match a pattern.
 * Properties can be forbidden by prefixing their name with a `!`. Supports whitelisting
 * files via the third argument, as well as validating all the arguments by passing in a regex. E.g.
 *
 * ```
 * "validate-decorators": [true, {
 *   "Component": {
 *     "argument": 0,
 *     "properties": {
 *       "encapsulation": "\\.None$",
 *       "!styles": ".*"
 *     }
 *   },
 *   "NgModule": {
 *      "argument": 0,
 *      "properties": "^(?!\\s*$).+"
 *    }
 * }, "src/material"]
 * ```
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walkContext, this.getOptions());
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
/**
 * Token used to indicate that all properties of an object
 * should be linted against a single pattern.
 */
var ALL_PROPS_TOKEN = '*';
function walkContext(context) {
    var options = context.options, sourceFile = context.sourceFile;
    // Rules that will be used to validate the decorators.
    var globalRules = generateRules(options.ruleArguments[0]);
    // Relative path for the current TypeScript source file.
    var relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);
    // Globs that are used to determine which files to lint.
    var fileGlobs = options.ruleArguments.slice(1) || [];
    // Whether the file should be checked at all.
    var enabled = Object.keys(globalRules).length > 0 &&
        fileGlobs.some(function (p) { return minimatch(relativeFilePath, p); });
    (function visitNode(node) {
        if (ts.isClassDeclaration(node) && enabled) {
            if (node.decorators) {
                node.decorators.forEach(function (decorator) { return validateDecorator(context, decorator, globalRules); });
            }
            node.members.forEach(function (member) {
                if (member.decorators) {
                    member.decorators.forEach(function (decorator) { return validateDecorator(context, decorator, globalRules); });
                }
            });
        }
        ts.forEachChild(node, visitNode);
    })(sourceFile);
}
/**
 * Cleans out the blank rules that are passed through the tslint.json
 * and converts the string patterns into regular expressions.
 * @param config Config object passed in via the tslint.json.
 * @returns Sanitized rules.
 */
function generateRules(config) {
    var output = {};
    if (config) {
        var decorators = Object.keys(config);
        var _loop_1 = function (index) {
            var _a;
            var decoratorName = decorators[index];
            var decoratorConfig = config[decoratorName];
            var argument = decoratorConfig.argument, properties = decoratorConfig.properties, required = decoratorConfig.required;
            // * is a special token which means to run the pattern across the entire object.
            var allProperties = properties[ALL_PROPS_TOKEN];
            if (allProperties) {
                output[decoratorName] = {
                    argument: argument,
                    required: !!required,
                    requiredProps: (_a = {}, _a[ALL_PROPS_TOKEN] = new RegExp(allProperties), _a),
                    forbiddenProps: {}
                };
            }
            else {
                output[decoratorName] = Object.keys(decoratorConfig.properties).reduce(function (rules, prop) {
                    var isForbidden = prop.startsWith('!');
                    var cleanName = isForbidden ? prop.slice(1) : prop;
                    var pattern = new RegExp(properties[prop]);
                    if (isForbidden) {
                        rules.forbiddenProps[cleanName] = pattern;
                    }
                    else {
                        rules.requiredProps[cleanName] = pattern;
                    }
                    return rules;
                }, {
                    argument: argument,
                    required: !!required,
                    requiredProps: {},
                    forbiddenProps: {}
                });
            }
        };
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < decorators.length; index++) {
            _loop_1(index);
        }
    }
    return output;
}
/**
 * Validates that a decorator matches all of the defined rules.
 * @param decorator Decorator to be checked.
 */
function validateDecorator(context, decorator, globalRules) {
    var expression = decorator.expression;
    if (!expression || !ts.isCallExpression(expression)) {
        return;
    }
    // Get the rules that are relevant for the current decorator.
    var rules = globalRules[expression.expression.getText()];
    var args = expression.arguments;
    // Don't do anything if there are no rules.
    if (!rules) {
        return;
    }
    var allPropsRequirement = rules.requiredProps[ALL_PROPS_TOKEN];
    // If we have a rule that applies to all properties, we just run it through once and we exit.
    if (allPropsRequirement) {
        var argumentText = args[rules.argument] ? args[rules.argument].getText() : '';
        if (!allPropsRequirement.test(argumentText)) {
            context.addFailureAtNode(expression.parent, "Expected decorator argument " + rules.argument + " " +
                ("to match \"" + allPropsRequirement + "\""));
        }
        return;
    }
    if (!args[rules.argument]) {
        if (rules.required) {
            context.addFailureAtNode(expression.parent, "Missing required argument at index " + rules.argument);
        }
        return;
    }
    if (!ts.isObjectLiteralExpression(args[rules.argument])) {
        return;
    }
    // Extract the property names and values.
    var props = [];
    args[rules.argument].properties.forEach(function (prop) {
        if (ts.isPropertyAssignment(prop) && prop.name && prop.initializer) {
            props.push({
                name: prop.name.getText(),
                value: prop.initializer.getText(),
                node: prop
            });
        }
    });
    // Find all of the required rule properties that are missing from the decorator.
    var missing = Object.keys(rules.requiredProps)
        .filter(function (key) { return !props.find(function (prop) { return prop.name === key; }); });
    if (missing.length) {
        // Exit early if any of the properties are missing.
        context.addFailureAtNode(expression.expression, 'Missing required properties: ' + missing.join(', '));
    }
    else {
        // If all the necessary properties are defined, ensure that
        // they match the pattern and aren't in the forbidden list.
        props
            .filter(function (prop) { return rules.requiredProps[prop.name] || rules.forbiddenProps[prop.name]; })
            .forEach(function (prop) {
            var name = prop.name, value = prop.value, node = prop.node;
            var requiredPattern = rules.requiredProps[name];
            var forbiddenPattern = rules.forbiddenProps[name];
            if (requiredPattern && !requiredPattern.test(value)) {
                context.addFailureAtNode(node, "Invalid value for property. " +
                    ("Expected value to match \"" + requiredPattern + "\"."));
            }
            else if (forbiddenPattern && forbiddenPattern.test(value)) {
                context.addFailureAtNode(node, "Property value not allowed. " +
                    ("Value should not match \"" + forbiddenPattern + "\"."));
            }
        });
    }
}
