import { Transform, TransformError } from "./transforms";
import { escapeForRegex, multiByteStringReverse } from "../cryptopunk.utils";

class RemoveCharsTransform extends Transform
{
	constructor()
	{
		super();
		this.addInput("string", "String")
			.addOutput("string", "String")
			.addOption("allWhitespace", "All whitespace", false)
			.addOption("spaceAndTab", "Space and tab", false)
			.addOption("newlines", "Newlines", false)
			.addOption("digits", "ASCII digits", false)
			.addOption("uppercase", "ASCII upper case", false)
			.addOption("lowercase", "ASCII lower case", false)
			.addOption("symbols", "ASCII symbols", false)
			.addOption("allAscii", "All ASCII", false)
			.addOption("allNonAscii", "All non-ASCII", false)
			.addOption("chars", "Specific characters", "");
	}

	transform(str, options)
	{
		options = Object.assign({}, this.defaults, options);

		if (options.allWhitespace)
		{
			str = str.replace(/\s+/g, "");
		}
		if (options.spaceAndTab)
		{
			str = str.replace(/[\t ]+/g, "");
		}
		if (options.newlines)
		{
			str = str.replace(/[\r\n]+/g, "");
		}
		if (options.digits)
		{
			str = str.replace(/[0-9]+/g, "");
		}
		if (options.uppercase)
		{
			str = str.replace(/[A-Z]+/g, "");
		}
		if (options.lowercase)
		{
			str = str.replace(/[a-z]+/g, "");
		}
		if (options.symbols)
		{
			str = str.replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]/g, "");
		}
		/* eslint-disable no-control-regex */
		if (options.allAscii)
		{
			str = str.replace(/[\x00-\x7f]/g, "");
		}
		if (options.allNonAscii)
		{
			str = str.replace(/[^\x00-\x7f]/g, "");
		}
		/* eslint-enable no-control-regex */
		if (options.chars)
		{
			str = str.replace(new RegExp("[" + escapeForRegex(options.chars) + "]", "g"), "");
		}
		return str;
	}
}

class SimpleTranspositionTransform extends Transform
{
	constructor()
	{
		super();
		this.addInput("string", "String")
			.addOutput("string", "String")
			.addOption("reverse", "Reverse", false);
	}

	transform(str, options)
	{
		options = Object.assign({}, this.defaults, options);

		if (options.reverse)
		{
			str = multiByteStringReverse(str);
		}

		return str;
	}
}

export {
	RemoveCharsTransform,
	SimpleTranspositionTransform
};