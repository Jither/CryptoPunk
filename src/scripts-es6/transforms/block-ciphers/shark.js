import { BlockCipherTransform } from "./block-cipher";
import { int32sToBytesBE } from "../../cryptopunk.utils";
import { gfLog2Tables } from "../../cryptopunk.math";

const ROUNDS = 6;
const ROUND_KEYS = ROUNDS + 1;

// TODO: SHARK Affine

// Note: S-Boxes are same as SQUARE
const SBOX_ENC = [
	0xb1, 0xce, 0xc3, 0x95, 0x5a, 0xad, 0xe7, 0x02, 0x4d, 0x44, 0xfb, 0x91, 0x0c, 0x87, 0xa1, 0x50, 
	0xcb, 0x67, 0x54, 0xdd, 0x46, 0x8f, 0xe1, 0x4e, 0xf0, 0xfd, 0xfc, 0xeb, 0xf9, 0xc4, 0x1a, 0x6e, 
	0x5e, 0xf5, 0xcc, 0x8d, 0x1c, 0x56, 0x43, 0xfe, 0x07, 0x61, 0xf8, 0x75, 0x59, 0xff, 0x03, 0x22, 
	0x8a, 0xd1, 0x13, 0xee, 0x88, 0x00, 0x0e, 0x34, 0x15, 0x80, 0x94, 0xe3, 0xed, 0xb5, 0x53, 0x23, 
	0x4b, 0x47, 0x17, 0xa7, 0x90, 0x35, 0xab, 0xd8, 0xb8, 0xdf, 0x4f, 0x57, 0x9a, 0x92, 0xdb, 0x1b, 
	0x3c, 0xc8, 0x99, 0x04, 0x8e, 0xe0, 0xd7, 0x7d, 0x85, 0xbb, 0x40, 0x2c, 0x3a, 0x45, 0xf1, 0x42, 
	0x65, 0x20, 0x41, 0x18, 0x72, 0x25, 0x93, 0x70, 0x36, 0x05, 0xf2, 0x0b, 0xa3, 0x79, 0xec, 0x08, 
	0x27, 0x31, 0x32, 0xb6, 0x7c, 0xb0, 0x0a, 0x73, 0x5b, 0x7b, 0xb7, 0x81, 0xd2, 0x0d, 0x6a, 0x26, 
	0x9e, 0x58, 0x9c, 0x83, 0x74, 0xb3, 0xac, 0x30, 0x7a, 0x69, 0x77, 0x0f, 0xae, 0x21, 0xde, 0xd0, 
	0x2e, 0x97, 0x10, 0xa4, 0x98, 0xa8, 0xd4, 0x68, 0x2d, 0x62, 0x29, 0x6d, 0x16, 0x49, 0x76, 0xc7, 
	0xe8, 0xc1, 0x96, 0x37, 0xe5, 0xca, 0xf4, 0xe9, 0x63, 0x12, 0xc2, 0xa6, 0x14, 0xbc, 0xd3, 0x28, 
	0xaf, 0x2f, 0xe6, 0x24, 0x52, 0xc6, 0xa0, 0x09, 0xbd, 0x8c, 0xcf, 0x5d, 0x11, 0x5f, 0x01, 0xc5, 
	0x9f, 0x3d, 0xa2, 0x9b, 0xc9, 0x3b, 0xbe, 0x51, 0x19, 0x1f, 0x3f, 0x5c, 0xb2, 0xef, 0x4a, 0xcd, 
	0xbf, 0xba, 0x6f, 0x64, 0xd9, 0xf3, 0x3e, 0xb4, 0xaa, 0xdc, 0xd5, 0x06, 0xc0, 0x7e, 0xf6, 0x66, 
	0x6c, 0x84, 0x71, 0x38, 0xb9, 0x1d, 0x7f, 0x9d, 0x48, 0x8b, 0x2a, 0xda, 0xa5, 0x33, 0x82, 0x39, 
	0xd6, 0x78, 0x86, 0xfa, 0xe4, 0x2b, 0xa9, 0x1e, 0x89, 0x60, 0x6b, 0xea, 0x55, 0x4c, 0xf7, 0xe2
];

const SBOX_DEC = [
	0x35, 0xbe, 0x07, 0x2e, 0x53, 0x69, 0xdb, 0x28, 0x6f, 0xb7, 0x76, 0x6b, 0x0c, 0x7d, 0x36, 0x8b, 
	0x92, 0xbc, 0xa9, 0x32, 0xac, 0x38, 0x9c, 0x42, 0x63, 0xc8, 0x1e, 0x4f, 0x24, 0xe5, 0xf7, 0xc9, 
	0x61, 0x8d, 0x2f, 0x3f, 0xb3, 0x65, 0x7f, 0x70, 0xaf, 0x9a, 0xea, 0xf5, 0x5b, 0x98, 0x90, 0xb1, 
	0x87, 0x71, 0x72, 0xed, 0x37, 0x45, 0x68, 0xa3, 0xe3, 0xef, 0x5c, 0xc5, 0x50, 0xc1, 0xd6, 0xca, 
	0x5a, 0x62, 0x5f, 0x26, 0x09, 0x5d, 0x14, 0x41, 0xe8, 0x9d, 0xce, 0x40, 0xfd, 0x08, 0x17, 0x4a, 
	0x0f, 0xc7, 0xb4, 0x3e, 0x12, 0xfc, 0x25, 0x4b, 0x81, 0x2c, 0x04, 0x78, 0xcb, 0xbb, 0x20, 0xbd, 
	0xf9, 0x29, 0x99, 0xa8, 0xd3, 0x60, 0xdf, 0x11, 0x97, 0x89, 0x7e, 0xfa, 0xe0, 0x9b, 0x1f, 0xd2, 
	0x67, 0xe2, 0x64, 0x77, 0x84, 0x2b, 0x9e, 0x8a, 0xf1, 0x6d, 0x88, 0x79, 0x74, 0x57, 0xdd, 0xe6, 
	0x39, 0x7b, 0xee, 0x83, 0xe1, 0x58, 0xf2, 0x0d, 0x34, 0xf8, 0x30, 0xe9, 0xb9, 0x23, 0x54, 0x15, 
	0x44, 0x0b, 0x4d, 0x66, 0x3a, 0x03, 0xa2, 0x91, 0x94, 0x52, 0x4c, 0xc3, 0x82, 0xe7, 0x80, 0xc0, 
	0xb6, 0x0e, 0xc2, 0x6c, 0x93, 0xec, 0xab, 0x43, 0x95, 0xf6, 0xd8, 0x46, 0x86, 0x05, 0x8c, 0xb0, 
	0x75, 0x00, 0xcc, 0x85, 0xd7, 0x3d, 0x73, 0x7a, 0x48, 0xe4, 0xd1, 0x59, 0xad, 0xb8, 0xc6, 0xd0, 
	0xdc, 0xa1, 0xaa, 0x02, 0x1d, 0xbf, 0xb5, 0x9f, 0x51, 0xc4, 0xa5, 0x10, 0x22, 0xcf, 0x01, 0xba, 
	0x8f, 0x31, 0x7c, 0xae, 0x96, 0xda, 0xf0, 0x56, 0x47, 0xd4, 0xeb, 0x4e, 0xd9, 0x13, 0x8e, 0x49, 
	0x55, 0x16, 0xff, 0x3b, 0xf4, 0xa4, 0xb2, 0x06, 0xa0, 0xa7, 0xfb, 0x1b, 0x6e, 0x3c, 0x33, 0xcd, 
	0x18, 0x5e, 0x6a, 0xd5, 0xa6, 0x21, 0xde, 0xfe, 0x2a, 0x1c, 0xf3, 0x0a, 0x1a, 0x19, 0x27, 0x2d
];

const G = [
	0xce, 0x95, 0x57, 0x82, 0x8a, 0x19, 0xb0, 0x01, 
	0xe7, 0xfe, 0x05, 0xd2, 0x52, 0xc1, 0x88, 0xf1, 
	0xb9, 0xda, 0x4d, 0xd1, 0x9e, 0x17, 0x83, 0x86, 
	0xd0, 0x9d, 0x26, 0x2c, 0x5d, 0x9f, 0x6d, 0x75, 
	0x52, 0xa9, 0x07, 0x6c, 0xb9, 0x8f, 0x70, 0x17, 
	0x87, 0x28, 0x3a, 0x5a, 0xf4, 0x33, 0x0b, 0x6c, 
	0x74, 0x51, 0x15, 0xcf, 0x09, 0xa4, 0x62, 0x09, 
	0x0b, 0x31, 0x7f, 0x86, 0xbe, 0x05, 0x83, 0x34
];

const G_INV = [
	0xe7, 0x30, 0x90, 0x85, 0xd0, 0x4b, 0x91, 0x41, 
	0x53, 0x95, 0x9b, 0xa5, 0x96, 0xbc, 0xa1, 0x68, 
	0x02, 0x45, 0xf7, 0x65, 0x5c, 0x1f, 0xb6, 0x52, 
	0xa2, 0xca, 0x22, 0x94, 0x44, 0x63, 0x2a, 0xa2, 
	0xfc, 0x67, 0x8e, 0x10, 0x29, 0x75, 0x85, 0x71, 
	0x24, 0x45, 0xa2, 0xcf, 0x2f, 0x22, 0xc1, 0x0e, 
	0xa1, 0xf1, 0x71, 0x40, 0x91, 0x27, 0x18, 0xa5, 
	0x56, 0xf4, 0xaf, 0x32, 0xd2, 0xa4, 0xdc, 0x71, 
];

let CBOX_ENC, CBOX_DEC;
let LOG, ALOG;

function precomputeCboxes(cboxes, sbox, g)
{
	for (let i = 0; i < 8; i++)
	{
		const cbox = cboxes[i] = new Array(512);
		for (let j = 0; j < 256; j++)
		{
			let cboxHi = 0;
			let cboxLo = 0;
			const sboxValue = sbox[j];
			if (sboxValue)
			{
				for (let k = 0; k < 4; k++)
				{
					cboxHi <<= 8;
					cboxHi |= gfMultiply(sboxValue, g[k * 8 + i]);
				}
				for (let k = 4; k < 8; k++)
				{
					cboxLo <<= 8;
					cboxLo |= gfMultiply(sboxValue, g[k * 8 + i]);
				}
			}
			cbox[j * 2] = cboxHi;
			cbox[j * 2 + 1] = cboxLo;
		}
	}
}

// Same as SQUARE (except OFFSETS not used)
function precompute()
{
	if (LOG)
	{
		return;
	}

	[LOG, ALOG] = gfLog2Tables(0x1f5);

	// Since the C-boxes are rather huge, we calculate them here, rather than
	// storing them in the JS
	CBOX_ENC = new Array(8);
	CBOX_DEC = new Array(8);

	precomputeCboxes(CBOX_ENC, SBOX_ENC, G);
	precomputeCboxes(CBOX_DEC, SBOX_DEC, G_INV);
}

function gfMultiply(a, b)
{
	if (a === 0 || b === 0)
	{
		return 0;
	}
	return ALOG[(LOG[a] + LOG[b]) % 255];
}

function transformKey(a)
{
	const
		t = new Uint8Array(8);

	for (let i = 0; i < 8; i++)
	{
		for (let j = 0; j < 8; j++)
		{
			t[i] ^= gfMultiply(G_INV[i * 8 + j], a[j]);
		}
	}

	a.set(t);
}

class SharkTransform extends BlockCipherTransform
{
	constructor(decrypt)
	{
		super(decrypt);
	}

	transform(bytes, keyBytes)
	{
		this.checkKeySize(keyBytes, 128);

		precompute();

		const subKeys = this.generateSubKeys(keyBytes);

		return this.transformBlocks(bytes, 64, subKeys);
	}

	crypt(block, keys, sbox, cboxes)
	{
		const result = Uint8Array.from(block);
		const temp = new Uint8Array(8);

		for (let r = 0; r < ROUNDS - 1; r++)
		{
			const key = keys[r];
			for (let i = 0; i < 8; i++)
			{
				result[i] ^= key[i];
			}

			temp.fill(0);
			for (let i = 0; i < 8; i++)
			{
				const cbox = cboxes[i];
				const index = result[i] * 2;
				for (let j = 0; j < 4; j++)
				{
					temp[j] ^= (cbox[index] >>> (24 - 8 * j)) & 0xff;
				}
				for (let j = 4; j < 8; j++)
				{
					temp[j] ^= (cbox[index + 1] >>> (24 - 8 * (j - 4))) & 0xff;
				}
			}
			result.set(temp);
		}

		for (let i = 0; i < 8; i++)
		{
			result[i] ^= keys[ROUNDS - 1][i];
			result[i] = sbox[result[i]];
			result[i] ^= keys[ROUNDS][i];
		}

		return result;
	}

	generateSubKeys(keyBytes)
	{
		const keyWords = new Array(ROUND_KEYS);

		// Initial keys = alternating high and low 64-bit words
		for (let r = 0; r < ROUND_KEYS; r++)
		{
			keyWords[r] = r % 2 === 0 ? keyBytes.subarray(0, 8) : keyBytes.subarray(8, 16);
		}

		// Temporary keys for round key encryption: First values of CBOX 0
		const tempKeys = new Array(ROUND_KEYS);
		for (let r = 0; r < ROUND_KEYS; r++)
		{
			tempKeys[r] = int32sToBytesBE([ CBOX_ENC[0][r * 2], CBOX_ENC[0][r * 2 + 1] ]);
		}
		// ... Except the last one:
		transformKey(tempKeys[ROUNDS]);

		let result = new Array(ROUND_KEYS);

		// Generate encryption keys by encrypting the key words in Cipher FeedBack mode, with:
		// - The temporary keys
		// - Null IV 
		let iv = new Uint8Array(8);
		for (let r = 0; r < ROUND_KEYS; r++)
		{
			iv = this.crypt(iv, tempKeys, SBOX_ENC, CBOX_ENC);
			const keyWord = keyWords[r];
			for (let i = 0; i < 8; i++)
			{
				iv[i] ^= keyWord[i];
			}
			result[r] = iv;
		}
		// Transfrom the last key:
		transformKey(result[ROUNDS]);

		// Decryption uses reverse key order
		// and transforms the "middle" keys
		if (this.decrypt)
		{
			const decryptResult = new Array(ROUND_KEYS);
			decryptResult[0] = result[ROUNDS];
			decryptResult[ROUNDS] = result[0];
			for (let r = 1; r < ROUNDS; r++)
			{
				transformKey(result[ROUNDS - r]);
				decryptResult[r] = result[ROUNDS - r];
			}

			result = decryptResult;
		}

		return result;
	}
}

class SharkEncryptTransform extends SharkTransform
{
	constructor()
	{
		super(false);
	}

	transformBlock(block, dest, destOffset, subKeys)
	{
		const result = this.crypt(block, subKeys, SBOX_ENC, CBOX_ENC);
		dest.set(result, destOffset);
	}
}

class SharkDecryptTransform extends SharkTransform
{
	constructor()
	{
		super(true);
	}

	transformBlock(block, dest, destOffset, subKeys)
	{
		const result = this.crypt(block, subKeys, SBOX_DEC, CBOX_DEC);
		dest.set(result, destOffset);
	}
}

export {
	SharkEncryptTransform,
	SharkDecryptTransform
};