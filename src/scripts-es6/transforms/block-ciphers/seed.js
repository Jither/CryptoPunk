import { BlockCipherTransform } from "./block-cipher";
import { bytesToInt32sBE, int32sToBytesBE } from "../../cryptopunk.utils";

const ROUNDS = 16;

// Parts of Golden ratio ((SQRT(5) - 1) / 2)
const KC = [
	0x9e3779b9, 0x3c6ef373,
	0x78dde6e6, 0xf1bbcdcc,
	0xe3779b99, 0xc6ef3733,
	0x8dde6e67, 0x1bbcdccf,
	0x3779b99e, 0x6ef3733c,
	0xdde6e678, 0xbbcdccf1,
	0x779b99e3, 0xef3733c6,
	0xde6e678d, 0xbcdccf1b
];

// TODO: Compute
const SBOX_0 = [
	0xa9, 0x85, 0xd6, 0xd3, 0x54, 0x1d, 0xac, 0x25, 0x5d, 0x43, 0x18, 0x1e, 0x51, 0xfc, 0xca, 0x63,
	0x28, 0x44, 0x20, 0x9d, 0xe0, 0xe2, 0xc8, 0x17, 0xa5, 0x8f, 0x03, 0x7b, 0xbb, 0x13, 0xd2, 0xee,
	0x70, 0x8c, 0x3f, 0xa8, 0x32, 0xdd, 0xf6, 0x74, 0xec, 0x95, 0x0b, 0x57, 0x5c, 0x5b, 0xbd, 0x01,
	0x24, 0x1c, 0x73, 0x98, 0x10, 0xcc, 0xf2, 0xd9, 0x2c, 0xe7, 0x72, 0x83, 0x9b, 0xd1, 0x86, 0xc9,
	0x60, 0x50, 0xa3, 0xeb, 0x0d, 0xb6, 0x9e, 0x4f, 0xb7, 0x5a, 0xc6, 0x78, 0xa6, 0x12, 0xaf, 0xd5,
	0x61, 0xc3, 0xb4, 0x41, 0x52, 0x7d, 0x8d, 0x08, 0x1f, 0x99, 0x00, 0x19, 0x04, 0x53, 0xf7, 0xe1,
	0xfd, 0x76, 0x2f, 0x27, 0xb0, 0x8b, 0x0e, 0xab, 0xa2, 0x6e, 0x93, 0x4d, 0x69, 0x7c, 0x09, 0x0a,
	0xbf, 0xef, 0xf3, 0xc5, 0x87, 0x14, 0xfe, 0x64, 0xde, 0x2e, 0x4b, 0x1a, 0x06, 0x21, 0x6b, 0x66,
	0x02, 0xf5, 0x92, 0x8a, 0x0c, 0xb3, 0x7e, 0xd0, 0x7a, 0x47, 0x96, 0xe5, 0x26, 0x80, 0xad, 0xdf,
	0xa1, 0x30, 0x37, 0xae, 0x36, 0x15, 0x22, 0x38, 0xf4, 0xa7, 0x45, 0x4c, 0x81, 0xe9, 0x84, 0x97,
	0x35, 0xcb, 0xce, 0x3c, 0x71, 0x11, 0xc7, 0x89, 0x75, 0xfb, 0xda, 0xf8, 0x94, 0x59, 0x82, 0xc4,
	0xff, 0x49, 0x39, 0x67, 0xc0, 0xcf, 0xd7, 0xb8, 0x0f, 0x8e, 0x42, 0x23, 0x91, 0x6c, 0xdb, 0xa4,
	0x34, 0xf1, 0x48, 0xc2, 0x6f, 0x3d, 0x2d, 0x40, 0xbe, 0x3e, 0xbc, 0xc1, 0xaa, 0xba, 0x4e, 0x55,
	0x3b, 0xdc, 0x68, 0x7f, 0x9c, 0xd8, 0x4a, 0x56, 0x77, 0xa0, 0xed, 0x46, 0xb5, 0x2b, 0x65, 0xfa,
	0xe3, 0xb9, 0xb1, 0x9f, 0x5e, 0xf9, 0xe6, 0xb2, 0x31, 0xea, 0x6d, 0x5f, 0xe4, 0xf0, 0xcd, 0x88,
	0x16, 0x3a, 0x58, 0xd4, 0x62, 0x29, 0x07, 0x33, 0xe8, 0x1b, 0x05, 0x79, 0x90, 0x6a, 0x2a, 0x9a
];

const SBOX_1 = [
	0x38, 0xe8, 0x2d, 0xa6, 0xcf, 0xde, 0xb3, 0xb8, 0xaf, 0x60, 0x55, 0xc7, 0x44, 0x6f, 0x6b, 0x5b,
	0xc3, 0x62, 0x33, 0xb5, 0x29, 0xa0, 0xe2, 0xa7, 0xd3, 0x91, 0x11, 0x06, 0x1c, 0xbc, 0x36, 0x4b,
	0xef, 0x88, 0x6c, 0xa8, 0x17, 0xc4, 0x16, 0xf4, 0xc2, 0x45, 0xe1, 0xd6, 0x3f, 0x3d, 0x8e, 0x98,
	0x28, 0x4e, 0xf6, 0x3e, 0xa5, 0xf9, 0x0d, 0xdf, 0xd8, 0x2b, 0x66, 0x7a, 0x27, 0x2f, 0xf1, 0x72,
	0x42, 0xd4, 0x41, 0xc0, 0x73, 0x67, 0xac, 0x8b, 0xf7, 0xad, 0x80, 0x1f, 0xca, 0x2c, 0xaa, 0x34,
	0xd2, 0x0b, 0xee, 0xe9, 0x5d, 0x94, 0x18, 0xf8, 0x57, 0xae, 0x08, 0xc5, 0x13, 0xcd, 0x86, 0xb9,
	0xff, 0x7d, 0xc1, 0x31, 0xf5, 0x8a, 0x6a, 0xb1, 0xd1, 0x20, 0xd7, 0x02, 0x22, 0x04, 0x68, 0x71,
	0x07, 0xdb, 0x9d, 0x99, 0x61, 0xbe, 0xe6, 0x59, 0xdd, 0x51, 0x90, 0xdc, 0x9a, 0xa3, 0xab, 0xd0,
	0x81, 0x0f, 0x47, 0x1a, 0xe3, 0xec, 0x8d, 0xbf, 0x96, 0x7b, 0x5c, 0xa2, 0xa1, 0x63, 0x23, 0x4d,
	0xc8, 0x9e, 0x9c, 0x3a, 0x0c, 0x2e, 0xba, 0x6e, 0x9f, 0x5a, 0xf2, 0x92, 0xf3, 0x49, 0x78, 0xcc,
	0x15, 0xfb, 0x70, 0x75, 0x7f, 0x35, 0x10, 0x03, 0x64, 0x6d, 0xc6, 0x74, 0xd5, 0xb4, 0xea, 0x09,
	0x76, 0x19, 0xfe, 0x40, 0x12, 0xe0, 0xbd, 0x05, 0xfa, 0x01, 0xf0, 0x2a, 0x5e, 0xa9, 0x56, 0x43,
	0x85, 0x14, 0x89, 0x9b, 0xb0, 0xe5, 0x48, 0x79, 0x97, 0xfc, 0x1e, 0x82, 0x21, 0x8c, 0x1b, 0x5f,
	0x77, 0x54, 0xb2, 0x1d, 0x25, 0x4f, 0x00, 0x46, 0xed, 0x58, 0x52, 0xeb, 0x7e, 0xda, 0xc9, 0xfd,
	0x30, 0x95, 0x65, 0x3c, 0xb6, 0xe4, 0xbb, 0x7c, 0x0e, 0x50, 0x39, 0x26, 0x32, 0x84, 0x69, 0x93,
	0x37, 0xe7, 0x24, 0xa4, 0xcb, 0x53, 0x0a, 0x87, 0xd9, 0x4c, 0x83, 0x8f, 0xce, 0x3b, 0x4a, 0xb7
];

const
	M0 = 0xfc,
	M1 = 0xf3,
	M2 = 0xcf,
	M3 = 0x3f;

function G(x)
{
	const
		x3 = SBOX_1[ x >>> 24],
		x2 = SBOX_0[(x >>> 16) & 0xff],
		x1 = SBOX_1[(x >>>  8) & 0xff],
		x0 = SBOX_0[ x         & 0xff];

	const
		z0 = (x0 & M0) ^ (x1 & M1) ^ (x2 & M2) ^ (x3 & M3),
		z1 = (x0 & M1) ^ (x1 & M2) ^ (x2 & M3) ^ (x3 & M0),
		z2 = (x0 & M2) ^ (x1 & M3) ^ (x2 & M0) ^ (x3 & M1),
		z3 = (x0 & M3) ^ (x1 & M0) ^ (x2 & M1) ^ (x3 & M2);

	return (z3 << 24) | (z2 << 16) | (z1 << 8) | z0;
}

function F(x0, x1, k0, k1)
{
	x0 ^= k0;
	x1 ^= k1;

	const g = G(x0 ^ x1);
	const g0 = G((g + x0) & 0xffffffff);
	const r1 = G((g0 + g) & 0xffffffff);
	const r0 = (r1 + g0) & 0xffffffff;

	return [r0, r1];
}

class SeedTransform extends BlockCipherTransform
{
	constructor(decrypt)
	{
		super(decrypt);
	}

	transform(bytes, keyBytes)
	{
		this.checkBytesSize("Key", keyBytes, 128);

		const keys = this.generateKeys(keyBytes);

		return this.transformBlocks(bytes, 128, keys);
	}

	transformBlock(block, dest, destOffset, keys)
	{
		let [l0, l1, r0, r1] = bytesToInt32sBE(block);

		let t0, t1, key;
		for (let i = 0; i < ROUNDS - 1; i++)
		{
			key = keys[i];
			[t0, t1] = [r0, r1];
			[r0, r1] = F(r0, r1, key[0], key[1]);
			r0 ^= l0; r1 ^= l1;
			[l0, l1] = [t0, t1];
		}
		key = keys[ROUNDS - 1];
		[t0, t1] = F(r0, r1, key[0], key[1]);
		l0 ^= t0; l1 ^= t1;

		dest.set(int32sToBytesBE([l0, l1, r0, r1]), destOffset);
	}

	generateKeys(keyBytes)
	{
		let [a, b, c, d] = bytesToInt32sBE(keyBytes);

		const keys = new Array(ROUNDS);

		for (let i = 0; i < ROUNDS; i++)
		{
			keys[i] = [
				G((a + c - KC[i]) & 0xffffffff),
				G((b - d + KC[i]) & 0xffffffff)
			];

			if ((i & 1) === 0)
			{
				[a, b] = [(a >>> 8) | (b << 24), (b >>> 8) | (a << 24)];
			}
			else
			{
				[c, d] = [(c << 8) | (d >>> 24), (d << 8) | (c >>> 24)];
			}
		}
		return keys;
	}
}

class SeedEncryptTransform extends SeedTransform
{
	constructor()
	{
		super(false);
	}
}

class SeedDecryptTransform extends SeedTransform
{
	constructor()
	{
		super(true);
	}

	generateKeys(keyBytes)
	{
		const keys = super.generateKeys(keyBytes);
		keys.reverse();
		return keys;
	}
}

export {
	SeedEncryptTransform,
	SeedDecryptTransform
};