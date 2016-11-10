import { KeccakBaseTransform } from "./keccak";

const SHA3_VARIANT_NAMES = [
	"SHA3-224",
	"SHA3-256",
	"SHA3-384",
	"SHA3-512"
];

const SHAKE_VARIANT_NAMES = [
	"SHAKE-128",
	"SHAKE-256"
];

class Sha3Transform extends KeccakBaseTransform
{
	constructor()
	{
		super();
		this.addOption("variant", "Variant", "SHA3-256", { type: "select", texts: SHA3_VARIANT_NAMES });
	}

	transform(bytes, options)
	{
		options = Object.assign({}, this.defaults, options);
		const keccakOptions = { suffix: 0x06 };

		switch (options.variant)
		{
			case "SHA3-224":
				keccakOptions.capacity = 448;
				keccakOptions.size = 224;
				break;
			case "SHA3-256":
				keccakOptions.capacity = 512;
				keccakOptions.size = 256;
				break;
			case "SHA3-384":
				keccakOptions.capacity = 768;
				keccakOptions.size = 384;
				break;
			case "SHA3-512":
				keccakOptions.capacity = 1024;
				keccakOptions.size = 512;
				break;
		}
		return super.transform(bytes, keccakOptions);
	}
}

class ShakeTransform extends KeccakBaseTransform
{
	constructor()
	{
		super();
		this.addOption("variant", "Variant", "SHAKE-128", { type: "select", texts: SHAKE_VARIANT_NAMES })
			.addOption("size", "Size", 128, { min: 0, step: 8 });
	}

	transform(bytes, options)
	{
		options = Object.assign({}, this.defaults, options);
		const keccakOptions = { suffix: 0x1f, size: options.size };

		switch (options.variant)
		{
			case "SHAKE-128":
				keccakOptions.capacity = 256;
				break;
			case "SHAKE-256":
				keccakOptions.capacity = 512;
				break;
		}
		return super.transform(bytes, keccakOptions);
	}
}

export {
	Sha3Transform,
	ShakeTransform
};