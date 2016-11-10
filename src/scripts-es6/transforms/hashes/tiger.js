import { Transform } from "../transforms";
import { bytesToInt32sLE, int32sToBytesLE, bytesToInt64sLE, int64sToBytesLE, int64sToHex } from "../../cryptopunk.utils";
import { add64, not64, shl64, shr64, sub64, xor64, mul64 } from "../../cryptopunk.bitarith";

// TODO: UNFINISHED

const VARIANT_NAMES = [
	"Tiger",
	"Tiger2"
];

const VARIANT_VALUES = [
	"tiger",
	"tiger2"
];

const KEY_SCHEDULE_CONST_1 = { hi: 0xa5a5a5a5, lo: 0xa5a5a5a5 };
const KEY_SCHEDULE_CONST_2 = { hi: 0x01234567, lo: 0x89abcdef };
const MUL_5 = { hi: 0x00000000, lo: 0x00000005 };
const MUL_7 = { hi: 0x00000000, lo: 0x00000007 };
const MUL_9 = { hi: 0x00000000, lo: 0x00000009 };

// TODO: Yeah, this can certainly be optimized...
const T1 = [
	{ hi: 0x02aab17c, lo: 0xf7e90c5e }, { hi: 0xac424b03, lo: 0xe243a8ec },	{ hi: 0x72cd5be3, lo: 0x0dd5fcd3 }, { hi: 0x6d019b93, lo: 0xf6f97f3a },
	{ hi: 0xcd9978ff, lo: 0xd21f9193 }, { hi: 0x7573a1c9, lo: 0x708029e2 },	{ hi: 0xb164326b, lo: 0x922a83c3 }, { hi: 0x46883eee, lo: 0x04915870 },
	{ hi: 0xeaace305, lo: 0x7103ece6 }, { hi: 0xc54169b8, lo: 0x08a3535c },	{ hi: 0x4ce75491, lo: 0x8ddec47c }, { hi: 0x0aa2f4df, lo: 0xdc0df40c },
	{ hi: 0x10b76f18, lo: 0xa74dbefa }, { hi: 0xc6ccb623, lo: 0x5ad1ab6a },	{ hi: 0x13726121, lo: 0x572fe2ff }, { hi: 0x1a488c6f, lo: 0x199d921e },
	{ hi: 0x4bc9f9f4, lo: 0xda0007ca }, { hi: 0x26f5e6f6, lo: 0xe85241c7 },	{ hi: 0x859079db, lo: 0xea5947b6 }, { hi: 0x4f1885c5, lo: 0xc99e8c92 },
	{ hi: 0xd78e761e, lo: 0xa96f864b }, { hi: 0x8e36428c, lo: 0x52b5c17d },	{ hi: 0x69cf6827, lo: 0x373063c1 }, { hi: 0xb607c93d, lo: 0x9bb4c56e },
	{ hi: 0x7d820e76, lo: 0x0e76b5ea }, { hi: 0x645c9cc6, lo: 0xf07fdc42 },	{ hi: 0xbf38a078, lo: 0x243342e0 }, { hi: 0x5f6b343c, lo: 0x9d2e7d04 },
	{ hi: 0xf2c28aeb, lo: 0x600b0ec6 }, { hi: 0x6c0ed85f, lo: 0x7254bcac },	{ hi: 0x71592281, lo: 0xa4db4fe5 }, { hi: 0x1967fa69, lo: 0xce0fed9f },
	{ hi: 0xfd5293f8, lo: 0xb96545db }, { hi: 0xc879e9d7, lo: 0xf2a7600b },	{ hi: 0x86024892, lo: 0x0193194e }, { hi: 0xa4f9533b, lo: 0x2d9cc0b3 },
	{ hi: 0x9053836c, lo: 0x15957613 }, { hi: 0xdb6dcf8a, lo: 0xfc357bf1 },	{ hi: 0x18beea7a, lo: 0x7a370f57 }, { hi: 0x037117ca, lo: 0x50b99066 },
	{ hi: 0x6ab30a97, lo: 0x74424a35 }, { hi: 0xf4e92f02, lo: 0xe325249b },	{ hi: 0x7739db07, lo: 0x061ccae1 }, { hi: 0xd8f3b49c, lo: 0xeca42a05 },
	{ hi: 0xbd56be3f, lo: 0x51382f73 }, { hi: 0x45faed58, lo: 0x43b0bb28 },	{ hi: 0x1c813d5c, lo: 0x11bf1f83 }, { hi: 0x8af0e4b6, lo: 0xd75fa169 },
	{ hi: 0x33ee18a4, lo: 0x87ad9999 }, { hi: 0x3c26e8ea, lo: 0xb1c94410 },	{ hi: 0xb510102b, lo: 0xc0a822f9 }, { hi: 0x141eef31, lo: 0x0ce6123b },
	{ hi: 0xfc65b900, lo: 0x59ddb154 }, { hi: 0xe0158640, lo: 0xc5e0e607 },	{ hi: 0x884e0798, lo: 0x26c3a3cf }, { hi: 0x930d0d95, lo: 0x23c535fd },
	{ hi: 0x35638d75, lo: 0x4e9a2b00 }, { hi: 0x4085fccf, lo: 0x40469dd5 },	{ hi: 0xc4b17ad2, lo: 0x8be23a4c }, { hi: 0xcab2f0fc, lo: 0x6a3e6a2e },
	{ hi: 0x2860971a, lo: 0x6b943fcd }, { hi: 0x3dde6ee2, lo: 0x12e30446 },	{ hi: 0x6222f32a, lo: 0xe01765ae }, { hi: 0x5d550bb5, lo: 0x478308fe },
	{ hi: 0xa9efa98d, lo: 0xa0eda22a }, { hi: 0xc351a716, lo: 0x86c40da7 },	{ hi: 0x1105586d, lo: 0x9c867c84 }, { hi: 0xdcffee85, lo: 0xfda22853 },
	{ hi: 0xccfbd026, lo: 0x2c5eef76 }, { hi: 0xbaf294cb, lo: 0x8990d201 },	{ hi: 0xe69464f5, lo: 0x2afad975 }, { hi: 0x94b013af, lo: 0xdf133e14 },
	{ hi: 0x06a7d1a3, lo: 0x2823c958 }, { hi: 0x6f95fe51, lo: 0x30f61119 },	{ hi: 0xd92ab34e, lo: 0x462c06c0 }, { hi: 0xed7bde33, lo: 0x887c71d2 },
	{ hi: 0x79746d6e, lo: 0x6518393e }, { hi: 0x5ba41938, lo: 0x5d713329 },	{ hi: 0x7c1ba6b9, lo: 0x48a97564 }, { hi: 0x31987c19, lo: 0x7bfdac67 },
	{ hi: 0xde6c23c4, lo: 0x4b053d02 }, { hi: 0x581c49fe, lo: 0xd002d64d },	{ hi: 0xdd474d63, lo: 0x38261571 }, { hi: 0xaa4546c3, lo: 0xe473d062 },
	{ hi: 0x928fce34, lo: 0x9455f860 }, { hi: 0x48161bba, lo: 0xcaab94d9 },	{ hi: 0x63912430, lo: 0x770e6f68 }, { hi: 0x6ec8a5e6, lo: 0x02c6641c },
	{ hi: 0x87282515, lo: 0x337ddd2b }, { hi: 0x2cda6b42, lo: 0x034b701b },	{ hi: 0xb03d37c1, lo: 0x81cb096d }, { hi: 0xe1084382, lo: 0x66c71c6f },
	{ hi: 0x2b3180c7, lo: 0xeb51b255 }, { hi: 0xdf92b82f, lo: 0x96c08bbc },	{ hi: 0x5c68c8c0, lo: 0xa632f3ba }, { hi: 0x5504cc86, lo: 0x1c3d0556 },
	{ hi: 0xabbfa4e5, lo: 0x5fb26b8f }, { hi: 0x41848b0a, lo: 0xb3baceb4 },	{ hi: 0xb334a273, lo: 0xaa445d32 }, { hi: 0xbca696f0, lo: 0xa85ad881 },
	{ hi: 0x24f6ec65, lo: 0xb528d56c }, { hi: 0x0ce1512e, lo: 0x90f4524a },	{ hi: 0x4e9dd79d, lo: 0x5506d35a }, { hi: 0x258905fa, lo: 0xc6ce9779 },
	{ hi: 0x2019295b, lo: 0x3e109b33 }, { hi: 0xf8a9478b, lo: 0x73a054cc },	{ hi: 0x2924f2f9, lo: 0x34417eb0 }, { hi: 0x3993357d, lo: 0x536d1bc4 },
	{ hi: 0x38a81ac2, lo: 0x1db6ff8b }, { hi: 0x47c4fbf1, lo: 0x7d6016bf },	{ hi: 0x1e0faadd, lo: 0x7667e3f5 }, { hi: 0x7abcff62, lo: 0x938beb96 },
	{ hi: 0xa78dad94, lo: 0x8fc179c9 }, { hi: 0x8f1f98b7, lo: 0x2911e50d },	{ hi: 0x61e48eae, lo: 0x27121a91 }, { hi: 0x4d62f7ad, lo: 0x31859808 },
	{ hi: 0xeceba345, lo: 0xef5ceaeb }, { hi: 0xf5ceb25e, lo: 0xbc9684ce },	{ hi: 0xf633e20c, lo: 0xb7f76221 }, { hi: 0xa32cdf06, lo: 0xab8293e4 },
	{ hi: 0x985a202c, lo: 0xa5ee2ca4 }, { hi: 0xcf0b8447, lo: 0xcc8a8fb1 },	{ hi: 0x9f765244, lo: 0x979859a3 }, { hi: 0xa8d516b1, lo: 0xa1240017 },
	{ hi: 0x0bd7ba3e, lo: 0xbb5dc726 }, { hi: 0xe54bca55, lo: 0xb86adb39 },	{ hi: 0x1d7a3afd, lo: 0x6c478063 }, { hi: 0x519ec608, lo: 0xe7669edd },
	{ hi: 0x0e5715a2, lo: 0xd149aa23 }, { hi: 0x177d4571, lo: 0x848ff194 },	{ hi: 0xeeb55f32, lo: 0x41014c22 }, { hi: 0x0f5e5ca1, lo: 0x3a6e2ec2 },
	{ hi: 0x8029927b, lo: 0x75f5c361 }, { hi: 0xad139fab, lo: 0xc3d6e436 },	{ hi: 0x0d5df1a9, lo: 0x4ccf402f }, { hi: 0x3e8bd948, lo: 0xbea5dfc8 },
	{ hi: 0xa5a0d357, lo: 0xbd3ff77e }, { hi: 0xa2d12e25, lo: 0x1f74f645 },	{ hi: 0x66fd9e52, lo: 0x5e81a082 }, { hi: 0x2e0c90ce, lo: 0x7f687a49 },
	{ hi: 0xc2e8bcbe, lo: 0xba973bc5 }, { hi: 0x000001bc, lo: 0xe509745f },	{ hi: 0x423777bb, lo: 0xe6dab3d6 }, { hi: 0xd1661c7e, lo: 0xaef06eb5 },
	{ hi: 0xa1781f35, lo: 0x4daacfd8 }, { hi: 0x2d11284a, lo: 0x2b16affc },	{ hi: 0xf1fc4f67, lo: 0xfa891d1f }, { hi: 0x73ecc25d, lo: 0xcb920ada },
	{ hi: 0xae610c22, lo: 0xc2a12651 }, { hi: 0x96e0a810, lo: 0xd356b78a },	{ hi: 0x5a9a381f, lo: 0x2fe7870f }, { hi: 0xd5ad62ed, lo: 0xe94e5530 },
	{ hi: 0xd225e5e8, lo: 0x368d1427 }, { hi: 0x65977b70, lo: 0xc7af4631 },	{ hi: 0x99f889b2, lo: 0xde39d74f }, { hi: 0x233f30bf, lo: 0x54e1d143 },
	{ hi: 0x9a9675d3, lo: 0xd9a63c97 }, { hi: 0x5470554f, lo: 0xf334f9a8 },	{ hi: 0x166acb74, lo: 0x4a4f5688 }, { hi: 0x70c74caa, lo: 0xb2e4aead },
	{ hi: 0xf0d09164, lo: 0x6f294d12 }, { hi: 0x57b82a89, lo: 0x684031d1 },	{ hi: 0xefd95a5a, lo: 0x61be0b6b }, { hi: 0x2fbd12e9, lo: 0x69f2f29a },
	{ hi: 0x9bd37013, lo: 0xfeff9fe8 }, { hi: 0x3f9b0404, lo: 0xd6085a06 },	{ hi: 0x4940c1f3, lo: 0x166cfe15 }, { hi: 0x09542c4d, lo: 0xcdf3defb },
	{ hi: 0xb4c52183, lo: 0x85cd5ce3 }, { hi: 0xc935b7dc, lo: 0x4462a641 },	{ hi: 0x3417f8a6, lo: 0x8ed3b63f }, { hi: 0xb8095929, lo: 0x5b215b40 },
	{ hi: 0xf99cdaef, lo: 0x3b8c8572 }, { hi: 0x018c0614, lo: 0xf8fcb95d },	{ hi: 0x1b14accd, lo: 0x1a3acdf3 }, { hi: 0x84d471f2, lo: 0x00bb732d },
	{ hi: 0xc1a3110e, lo: 0x95e8da16 }, { hi: 0x430a7220, lo: 0xbf1a82b8 },	{ hi: 0xb77e090d, lo: 0x39df210e }, { hi: 0x5ef4bd9f, lo: 0x3cd05e9d },
	{ hi: 0x9d4ff6da, lo: 0x7e57a444 }, { hi: 0xda1d60e1, lo: 0x83d4a5f8 },	{ hi: 0xb287c384, lo: 0x17998e47 }, { hi: 0xfe3edc12, lo: 0x1bb31886 },
	{ hi: 0xc7fe3ccc, lo: 0x980ccbef }, { hi: 0xe46fb590, lo: 0x189bfd03 },	{ hi: 0x3732fd46, lo: 0x9a4c57dc }, { hi: 0x7ef700a0, lo: 0x7cf1ad65 },
	{ hi: 0x59c64468, lo: 0xa31d8859 }, { hi: 0x762fb0b4, lo: 0xd45b61f6 },	{ hi: 0x155baed0, lo: 0x99047718 }, { hi: 0x68755e4c, lo: 0x3d50baa6 },
	{ hi: 0xe9214e7f, lo: 0x22d8b4df }, { hi: 0x2addbf53, lo: 0x2eac95f4 },	{ hi: 0x32ae3909, lo: 0xb4bd0109 }, { hi: 0x834df537, lo: 0xb08e3450 },
	{ hi: 0xfa209da8, lo: 0x4220728d }, { hi: 0x9e691d9b, lo: 0x9efe23f7 },	{ hi: 0x0446d288, lo: 0xc4ae8d7f }, { hi: 0x7b4cc524, lo: 0xe169785b },
	{ hi: 0x21d87f01, lo: 0x35ca1385 }, { hi: 0xcebb400f, lo: 0x137b8aa5 },	{ hi: 0x272e2b66, lo: 0x580796be }, { hi: 0x36122641, lo: 0x25c2b0de },
	{ hi: 0x057702bd, lo: 0xad1efbb2 }, { hi: 0xd4babb8e, lo: 0xacf84be9 },	{ hi: 0x91583139, lo: 0x641bc67b }, { hi: 0x8bdc2de0, lo: 0x8036e024 },
	{ hi: 0x603c8156, lo: 0xf49f68ed }, { hi: 0xf7d236f7, lo: 0xdbef5111 },	{ hi: 0x9727c459, lo: 0x8ad21e80 }, { hi: 0xa08a0896, lo: 0x670a5fd7 },
	{ hi: 0xcb4a8f43, lo: 0x09eba9cb }, { hi: 0x81af564b, lo: 0x0f7036a1 },	{ hi: 0xc0b99aa7, lo: 0x78199abd }, { hi: 0x959f1ec8, lo: 0x3fc8e952 },
	{ hi: 0x8c505077, lo: 0x794a81b9 }, { hi: 0x3acaaf8f, lo: 0x056338f0 },	{ hi: 0x07b43f50, lo: 0x627a6778 }, { hi: 0x4a44ab49, lo: 0xf5eccc77 },
	{ hi: 0x3bc3d6e4, lo: 0xb679ee98 }, { hi: 0x9cc0d4d1, lo: 0xcf14108c },	{ hi: 0x4406c00b, lo: 0x206bc8a0 }, { hi: 0x82a18854, lo: 0xc8d72d89 },
	{ hi: 0x67e366b3, lo: 0x5c3c432c }, { hi: 0xb923dd61, lo: 0x102b37f2 },	{ hi: 0x56ab2779, lo: 0xd884271d }, { hi: 0xbe83e1b0, lo: 0xff1525af },
	{ hi: 0xfb7c65d4, lo: 0x217e49a9 }, { hi: 0x6bdbe0e7, lo: 0x6d48e7d4 },	{ hi: 0x08df8287, lo: 0x45d9179e }, { hi: 0x22ea6a9a, lo: 0xdd53bd34 },
	{ hi: 0xe36e141c, lo: 0x5622200a }, { hi: 0x7f805d1b, lo: 0x8cb750ee },	{ hi: 0xafe5c7a5, lo: 0x9f58e837 }, { hi: 0xe27f996a, lo: 0x4fb1c23c },
	{ hi: 0xd3867dfb, lo: 0x0775f0d0 }, { hi: 0xd0e673de, lo: 0x6e88891a },	{ hi: 0x123aeb9e, lo: 0xafb86c25 }, { hi: 0x30f1d5d5, lo: 0xc145b895 },
	{ hi: 0xbb434a2d, lo: 0xee7269e7 }, { hi: 0x78cb67ec, lo: 0xf931fa38 },	{ hi: 0xf33b0372, lo: 0x323bbf9c }, { hi: 0x52d66336, lo: 0xfb279c74 },
	{ hi: 0x505f33ac, lo: 0x0afb4eaa }, { hi: 0xe8a5cd99, lo: 0xa2cce187 },	{ hi: 0x53497480, lo: 0x1e2d30bb }, { hi: 0x8d2d5711, lo: 0xd5876d90 },
	{ hi: 0x1f1a4128, lo: 0x91bc038e }, { hi: 0xd6e2e71d, lo: 0x82e56648 },	{ hi: 0x74036c3a, lo: 0x497732b7 }, { hi: 0x89b67ed9, lo: 0x6361f5ab },
	{ hi: 0xffed95d8, lo: 0xf1ea02a2 }, { hi: 0xe72b3bd6, lo: 0x1464d43d },	{ hi: 0xa6300f17, lo: 0x0bdc4820 }, { hi: 0xebc18760, lo: 0xed78a77a }
];

const T2 = [
	{ hi: 0xe6a6be5a, lo: 0x05a12138 }, { hi: 0xb5a122a5, lo: 0xb4f87c98 },	{ hi: 0x563c6089, lo: 0x140b6990 }, { hi: 0x4c46cb2e, lo: 0x391f5dd5 },
	{ hi: 0xd932addb, lo: 0xc9b79434 }, { hi: 0x08ea70e4, lo: 0x2015aff5 },	{ hi: 0xd765a667, lo: 0x3e478cf1 }, { hi: 0xc4fb757e, lo: 0xab278d99 },
	{ hi: 0xdf11c686, lo: 0x2d6e0692 }, { hi: 0xddeb84f1, lo: 0x0d7f3b16 },	{ hi: 0x6f2ef604, lo: 0xa665ea04 }, { hi: 0x4a8e0f0f, lo: 0xf0e0dfb3 },
	{ hi: 0xa5edeef8, lo: 0x3dbcba51 }, { hi: 0xfc4f0a2a, lo: 0x0ea4371e },	{ hi: 0xe83e1da8, lo: 0x5cb38429 }, { hi: 0xdc8ff882, lo: 0xba1b1ce2 },
	{ hi: 0xcd45505e, lo: 0x8353e80d }, { hi: 0x18d19a00, lo: 0xd4db0717 },	{ hi: 0x34a0cfed, lo: 0xa5f38101 }, { hi: 0x0be77e51, lo: 0x8887caf2 },
	{ hi: 0x1e341438, lo: 0xb3c45136 }, { hi: 0xe05797f4, lo: 0x9089ccf9 },	{ hi: 0xffd23f9d, lo: 0xf2591d14 }, { hi: 0x543dda22, lo: 0x8595c5cd },
	{ hi: 0x661f81fd, lo: 0x99052a33 }, { hi: 0x8736e641, lo: 0xdb0f7b76 },	{ hi: 0x15227725, lo: 0x418e5307 }, { hi: 0xe25f7f46, lo: 0x162eb2fa },
	{ hi: 0x48a8b212, lo: 0x6c13d9fe }, { hi: 0xafdc5417, lo: 0x92e76eea },	{ hi: 0x03d912bf, lo: 0xc6d1898f }, { hi: 0x31b1aafa, lo: 0x1b83f51b },
	{ hi: 0xf1ac2796, lo: 0xe42ab7d9 }, { hi: 0x40a3a7d7, lo: 0xfcd2ebac },	{ hi: 0x1056136d, lo: 0x0afbbcc5 }, { hi: 0x7889e1dd, lo: 0x9a6d0c85 },
	{ hi: 0xd3352578, lo: 0x2a7974aa }, { hi: 0xa7e25d09, lo: 0x078ac09b },	{ hi: 0xbd4138b3, lo: 0xeac6edd0 }, { hi: 0x920abfbe, lo: 0x71eb9e70 },
	{ hi: 0xa2a5d0f5, lo: 0x4fc2625c }, { hi: 0xc054e36b, lo: 0x0b1290a3 },	{ hi: 0xf6dd59ff, lo: 0x62fe932b }, { hi: 0x35373545, lo: 0x11a8ac7d },
	{ hi: 0xca845e91, lo: 0x72fadcd4 }, { hi: 0x84f82b60, lo: 0x329d20dc },	{ hi: 0x79c62ce1, lo: 0xcd672f18 }, { hi: 0x8b09a2ad, lo: 0xd124642c },
	{ hi: 0xd0c1e96a, lo: 0x19d9e726 }, { hi: 0x5a786a9b, lo: 0x4ba9500c },	{ hi: 0x0e020336, lo: 0x634c43f3 }, { hi: 0xc17b474a, lo: 0xeb66d822 },
	{ hi: 0x6a731ae3, lo: 0xec9baac2 }, { hi: 0x8226667a, lo: 0xe0840258 },	{ hi: 0x67d45676, lo: 0x91caeca5 }, { hi: 0x1d94155c, lo: 0x4875adb5 },
	{ hi: 0x6d00fd98, lo: 0x5b813fdf }, { hi: 0x51286efc, lo: 0xb774cd06 },	{ hi: 0x5e883447, lo: 0x1fa744af }, { hi: 0xf72ca0ae, lo: 0xe761ae2e },
	{ hi: 0xbe40e4cd, lo: 0xaee8e09a }, { hi: 0xe9970bbb, lo: 0x5118f665 },	{ hi: 0x726e4beb, lo: 0x33df1964 }, { hi: 0x703b0007, lo: 0x29199762 },
	{ hi: 0x4631d816, lo: 0xf5ef30a7 }, { hi: 0xb880b5b5, lo: 0x1504a6be },	{ hi: 0x641793c3, lo: 0x7ed84b6c }, { hi: 0x7b21ed77, lo: 0xf6e97d96 },
	{ hi: 0x77630631, lo: 0x2ef96b73 }, { hi: 0xae528948, lo: 0xe86ff3f4 },	{ hi: 0x53dbd7f2, lo: 0x86a3f8f8 }, { hi: 0x16cadce7, lo: 0x4cfc1063 },
	{ hi: 0x005c19bd, lo: 0xfa52c6dd }, { hi: 0x68868f5d, lo: 0x64d46ad3 },	{ hi: 0x3a9d512c, lo: 0xcf1e186a }, { hi: 0x367e62c2, lo: 0x385660ae },
	{ hi: 0xe359e7ea, lo: 0x77dcb1d7 }, { hi: 0x526c0773, lo: 0x749abe6e },	{ hi: 0x735ae5f9, lo: 0xd09f734b }, { hi: 0x493fc7cc, lo: 0x8a558ba8 },
	{ hi: 0xb0b9c153, lo: 0x3041ab45 }, { hi: 0x321958ba, lo: 0x470a59bd },	{ hi: 0x852db00b, lo: 0x5f46c393 }, { hi: 0x91209b2b, lo: 0xd336b0e5 },
	{ hi: 0x6e604f7d, lo: 0x659ef19f }, { hi: 0xb99a8ae2, lo: 0x782ccb24 },	{ hi: 0xccf52ab6, lo: 0xc814c4c7 }, { hi: 0x4727d9af, lo: 0xbe11727b },
	{ hi: 0x7e950d0c, lo: 0x0121b34d }, { hi: 0x756f4356, lo: 0x70ad471f },	{ hi: 0xf5add442, lo: 0x615a6849 }, { hi: 0x4e87e099, lo: 0x80b9957a },
	{ hi: 0x2acfa1df, lo: 0x50aee355 }, { hi: 0xd898263a, lo: 0xfd2fd556 },	{ hi: 0xc8f4924d, lo: 0xd80c8fd6 }, { hi: 0xcf99ca3d, lo: 0x754a173a },
	{ hi: 0xfe477bac, lo: 0xaf91bf3c }, { hi: 0xed5371f6, lo: 0xd690c12d },	{ hi: 0x831a5c28, lo: 0x5e687094 }, { hi: 0xc5d3c90a, lo: 0x3708a0a4 },
	{ hi: 0x0f7f9037, lo: 0x17d06580 }, { hi: 0x19f9bb13, lo: 0xb8fdf27f },	{ hi: 0xb1bd6f1b, lo: 0x4d502843 }, { hi: 0x1c761ba3, lo: 0x8fff4012 },
	{ hi: 0x0d1530c4, lo: 0xe2e21f3b }, { hi: 0x8943ce69, lo: 0xa7372c8a },	{ hi: 0xe5184e11, lo: 0xfeb5ce66 }, { hi: 0x618bdb80, lo: 0xbd736621 },
	{ hi: 0x7d29bad6, lo: 0x8b574d0b }, { hi: 0x81bb613e, lo: 0x25e6fe5b },	{ hi: 0x071c9c10, lo: 0xbc07913f }, { hi: 0xc7beeb79, lo: 0x09ac2d97 },
	{ hi: 0xc3e58d35, lo: 0x3bc5d757 }, { hi: 0xeb017892, lo: 0xf38f61e8 },	{ hi: 0xd4effb9c, lo: 0x9b1cc21a }, { hi: 0x99727d26, lo: 0xf494f7ab },
	{ hi: 0xa3e063a2, lo: 0x956b3e03 }, { hi: 0x9d4a8b9a, lo: 0x4aa09c30 },	{ hi: 0x3f6ab7d5, lo: 0x00090fb4 }, { hi: 0x9cc0f2a0, lo: 0x57268ac0 },
	{ hi: 0x3dee9d2d, lo: 0xedbf42d1 }, { hi: 0x330f49c8, lo: 0x7960a972 },	{ hi: 0xc6b27202, lo: 0x87421b41 }, { hi: 0x0ac59ec0, lo: 0x7c00369c },
	{ hi: 0xef4eac49, lo: 0xcb353425 }, { hi: 0xf450244e, lo: 0xef0129d8 },	{ hi: 0x8acc46e5, lo: 0xcaf4deb6 }, { hi: 0x2ffeab63, lo: 0x989263f7 },
	{ hi: 0x8f7cb9fe, lo: 0x5d7a4578 }, { hi: 0x5bd8f764, lo: 0x4e634635 },	{ hi: 0x427a7315, lo: 0xbf2dc900 }, { hi: 0x17d0c4aa, lo: 0x2125261c },
	{ hi: 0x3992486c, lo: 0x93518e50 }, { hi: 0xb4cbfee0, lo: 0xa2d7d4c3 },	{ hi: 0x7c75d620, lo: 0x2c5ddd8d }, { hi: 0xdbc295d8, lo: 0xe35b6c61 },
	{ hi: 0x60b369d3, lo: 0x02032b19 }, { hi: 0xce42685f, lo: 0xdce44132 },	{ hi: 0x06f3ddb9, lo: 0xddf65610 }, { hi: 0x8ea4d21d, lo: 0xb5e148f0 },
	{ hi: 0x20b0fce6, lo: 0x2fcd496f }, { hi: 0x2c1b9123, lo: 0x58b0ee31 },	{ hi: 0xb28317b8, lo: 0x18f5a308 }, { hi: 0xa89c1e18, lo: 0x9ca6d2cf },
	{ hi: 0x0c6b1857, lo: 0x6aaadbc8 }, { hi: 0xb65deaa9, lo: 0x1299fae3 },	{ hi: 0xfb2b794b, lo: 0x7f1027e7 }, { hi: 0x04e4317f, lo: 0x443b5beb },
	{ hi: 0x4b852d32, lo: 0x5939d0a6 }, { hi: 0xd5ae6bee, lo: 0xfb207ffc },	{ hi: 0x309682b2, lo: 0x81c7d374 }, { hi: 0xbae309a1, lo: 0x94c3b475 },
	{ hi: 0x8cc3f97b, lo: 0x13b49f05 }, { hi: 0x98a9422f, lo: 0xf8293967 },	{ hi: 0x244b16b0, lo: 0x1076ff7c }, { hi: 0xf8bf571c, lo: 0x663d67ee },
	{ hi: 0x1f0d6758, lo: 0xeee30da1 }, { hi: 0xc9b611d9, lo: 0x7adeb9b7 },	{ hi: 0xb7afd588, lo: 0x7b6c57a2 }, { hi: 0x6290ae84, lo: 0x6b984fe1 },
	{ hi: 0x94df4cde, lo: 0xacc1a5fd }, { hi: 0x058a5bd1, lo: 0xc5483aff },	{ hi: 0x63166cc1, lo: 0x42ba3c37 }, { hi: 0x8db8526e, lo: 0xb2f76f40 },
	{ hi: 0xe1088003, lo: 0x6f0d6d4e }, { hi: 0x9e0523c9, lo: 0x971d311d },	{ hi: 0x45ec2824, lo: 0xcc7cd691 }, { hi: 0x575b8359, lo: 0xe62382c9 },
	{ hi: 0xfa9e400d, lo: 0xc4889995 }, { hi: 0xd1823ecb, lo: 0x45721568 },	{ hi: 0xdafd983b, lo: 0x8206082f }, { hi: 0xaa7d2908, lo: 0x2386a8cb },
	{ hi: 0x269fcd44, lo: 0x03b87588 }, { hi: 0x1b91f5f7, lo: 0x28bdd1e0 },	{ hi: 0xe4669f39, lo: 0x040201f6 }, { hi: 0x7a1d7c21, lo: 0x8cf04ade },
	{ hi: 0x65623c29, lo: 0xd79ce5ce }, { hi: 0x23684490, lo: 0x96c00bb1 },	{ hi: 0xab9bf187, lo: 0x9da503ba }, { hi: 0xbc23ecb1, lo: 0xa458058e },
	{ hi: 0x9a58df01, lo: 0xbb401ecc }, { hi: 0xa070e868, lo: 0xa85f143d },	{ hi: 0x4ff18830, lo: 0x7df2239e }, { hi: 0x14d565b4, lo: 0x1a641183 },
	{ hi: 0xee133374, lo: 0x52701602 }, { hi: 0x950e3dcf, lo: 0x3f285e09 },	{ hi: 0x59930254, lo: 0xb9c80953 }, { hi: 0x3bf29940, lo: 0x8930da6d },
	{ hi: 0xa955943f, lo: 0x53691387 }, { hi: 0xa15edeca, lo: 0xa9cb8784 },	{ hi: 0x29142127, lo: 0x352be9a0 }, { hi: 0x76f0371f, lo: 0xff4e7afb },
	{ hi: 0x0239f450, lo: 0x274f2228 }, { hi: 0xbb073af0, lo: 0x1d5e868b },	{ hi: 0xbfc80571, lo: 0xc10e96c1 }, { hi: 0xd2670885, lo: 0x68222e23 },
	{ hi: 0x9671a3d4, lo: 0x8e80b5b0 }, { hi: 0x55b5d38a, lo: 0xe193bb81 },	{ hi: 0x693ae2d0, lo: 0xa18b04b8 }, { hi: 0x5c48b4ec, lo: 0xadd5335f },
	{ hi: 0xfd743b19, lo: 0x4916a1ca }, { hi: 0x25770181, lo: 0x34be98c4 },	{ hi: 0xe77987e8, lo: 0x3c54a4ad }, { hi: 0x28e11014, lo: 0xda33e1b9 },
	{ hi: 0x270cc59e, lo: 0x226aa213 }, { hi: 0x71495f75, lo: 0x6d1a5f60 },	{ hi: 0x9be853fb, lo: 0x60afef77 }, { hi: 0xadc786a7, lo: 0xf7443dbf },
	{ hi: 0x09044561, lo: 0x73b29a82 }, { hi: 0x58bc7a66, lo: 0xc232bd5e },	{ hi: 0xf306558c, lo: 0x673ac8b2 }, { hi: 0x41f639c6, lo: 0xb6c9772a },
	{ hi: 0x216defe9, lo: 0x9fda35da }, { hi: 0x11640cc7, lo: 0x1c7be615 },	{ hi: 0x93c43694, lo: 0x565c5527 }, { hi: 0xea038e62, lo: 0x46777839 },
	{ hi: 0xf9abf3ce, lo: 0x5a3e2469 }, { hi: 0x741e768d, lo: 0x0fd312d2 },	{ hi: 0x0144b883, lo: 0xced652c6 }, { hi: 0xc20b5a5b, lo: 0xa33f8552 },
	{ hi: 0x1ae69633, lo: 0xc3435a9d }, { hi: 0x97a28ca4, lo: 0x088cfdec },	{ hi: 0x8824a43c, lo: 0x1e96f420 }, { hi: 0x37612fa6, lo: 0x6eeea746 },
	{ hi: 0x6b4cb165, lo: 0xf9cf0e5a }, { hi: 0x43aa1c06, lo: 0xa0abfb4a },	{ hi: 0x7f4dc26f, lo: 0xf162796b }, { hi: 0x6cbacc8e, lo: 0x54ed9b0f },
	{ hi: 0xa6b7ffef, lo: 0xd2bb253e }, { hi: 0x2e25bc95, lo: 0xb0a29d4f },	{ hi: 0x86d6a58b, lo: 0xdef1388c }, { hi: 0xded74ac5, lo: 0x76b6f054 },
	{ hi: 0x8030bdbc, lo: 0x2b45805d }, { hi: 0x3c81af70, lo: 0xe94d9289 },	{ hi: 0x3eff6dda, lo: 0x9e3100db }, { hi: 0xb38dc39f, lo: 0xdfcc8847 },
	{ hi: 0x12388552, lo: 0x8d17b87e }, { hi: 0xf2da0ed2, lo: 0x40b1b642 },	{ hi: 0x44cefadc, lo: 0xd54bf9a9 }, { hi: 0x1312200e, lo: 0x433c7ee6 },
	{ hi: 0x9ffcc84f, lo: 0x3a78c748 }, { hi: 0xf0cd1f72, lo: 0x248576bb },	{ hi: 0xec697405, lo: 0x3638cfe4 }, { hi: 0x2ba7b67c, lo: 0x0cec4e4c },
	{ hi: 0xac2f4df3, lo: 0xe5ce32ed }, { hi: 0xcb33d143, lo: 0x26ea4c11 },	{ hi: 0xa4e9044c, lo: 0xc77e58bc }, { hi: 0x5f513293, lo: 0xd934fcef },
	{ hi: 0x5dc96455, lo: 0x06e55444 }, { hi: 0x50de418f, lo: 0x317de40a },	{ hi: 0x388cb31a, lo: 0x69dde259 }, { hi: 0x2db4a834, lo: 0x55820a86 },
	{ hi: 0x9010a91e, lo: 0x84711ae9 }, { hi: 0x4df7f0b7, lo: 0xb1498371 },	{ hi: 0xd62a2eab, lo: 0xc0977179 }, { hi: 0x22fac097, lo: 0xaa8d5c0e }
];

const T3 = [
	{ hi: 0xf49fcc2f, lo: 0xf1daf39b }, { hi: 0x487fd5c6, lo: 0x6ff29281 },	{ hi: 0xe8a30667, lo: 0xfcdca83f }, { hi: 0x2c9b4be3, lo: 0xd2fcce63 },
	{ hi: 0xda3ff74b, lo: 0x93fbbbc2 }, { hi: 0x2fa165d2, lo: 0xfe70ba66 },	{ hi: 0xa103e279, lo: 0x970e93d4 }, { hi: 0xbecdec77, lo: 0xb0e45e71 },
	{ hi: 0xcfb41e72, lo: 0x3985e497 }, { hi: 0xb70aaa02, lo: 0x5ef75017 },	{ hi: 0xd42309f0, lo: 0x3840b8e0 }, { hi: 0x8efc1ad0, lo: 0x35898579 },
	{ hi: 0x96c6920b, lo: 0xe2b2abc5 }, { hi: 0x66af4163, lo: 0x375a9172 },	{ hi: 0x2174abdc, lo: 0xca7127fb }, { hi: 0xb33ccea6, lo: 0x4a72ff41 },
	{ hi: 0xf04a4933, lo: 0x083066a5 }, { hi: 0x8d970acd, lo: 0xd7289af5 },	{ hi: 0x8f96e8e0, lo: 0x31c8c25e }, { hi: 0xf3fec022, lo: 0x76875d47 },
	{ hi: 0xec7bf310, lo: 0x056190dd }, { hi: 0xf5adb0ae, lo: 0xbb0f1491 },	{ hi: 0x9b50f885, lo: 0x0fd58892 }, { hi: 0x49754883, lo: 0x58b74de8 },
	{ hi: 0xa3354ff6, lo: 0x91531c61 }, { hi: 0x0702bbe4, lo: 0x81d2c6ee },	{ hi: 0x89fb2405, lo: 0x7deded98 }, { hi: 0xac307513, lo: 0x8596e902 },
	{ hi: 0x1d2d3580, lo: 0x172772ed }, { hi: 0xeb738fc2, lo: 0x8e6bc30d },	{ hi: 0x5854ef8f, lo: 0x63044326 }, { hi: 0x9e5c5232, lo: 0x5add3bbe },
	{ hi: 0x90aa53cf, lo: 0x325c4623 }, { hi: 0xc1d24d51, lo: 0x349dd067 },	{ hi: 0x2051cfee, lo: 0xa69ea624 }, { hi: 0x13220f0a, lo: 0x862e7e4f },
	{ hi: 0xce393994, lo: 0x04e04864 }, { hi: 0xd9c42ca4, lo: 0x7086fcb7 },	{ hi: 0x685ad223, lo: 0x8a03e7cc }, { hi: 0x066484b2, lo: 0xab2ff1db },
	{ hi: 0xfe9d5d70, lo: 0xefbf79ec }, { hi: 0x5b13b9dd, lo: 0x9c481854 },	{ hi: 0x15f0d475, lo: 0xed1509ad }, { hi: 0x0bebcd06, lo: 0x0ec79851 },
	{ hi: 0xd58c6791, lo: 0x183ab7f8 }, { hi: 0xd1187c50, lo: 0x52f3eee4 },	{ hi: 0xc95d1192, lo: 0xe54e82ff }, { hi: 0x86eea14c, lo: 0xb9ac6ca2 },
	{ hi: 0x3485beb1, lo: 0x53677d5d }, { hi: 0xdd191d78, lo: 0x1f8c492a },	{ hi: 0xf60866ba, lo: 0xa784ebf9 }, { hi: 0x518f643b, lo: 0xa2d08c74 },
	{ hi: 0x8852e956, lo: 0xe1087c22 }, { hi: 0xa768cb8d, lo: 0xc410ae8d },	{ hi: 0x38047726, lo: 0xbfec8e1a }, { hi: 0xa67738b4, lo: 0xcd3b45aa },
	{ hi: 0xad16691c, lo: 0xec0dde19 }, { hi: 0xc6d43193, lo: 0x80462e07 },	{ hi: 0xc5a5876d, lo: 0x0ba61938 }, { hi: 0x16b9fa1f, lo: 0xa58fd840 },
	{ hi: 0x188ab117, lo: 0x3ca74f18 }, { hi: 0xabda2f98, lo: 0xc99c021f },	{ hi: 0x3e0580ab, lo: 0x134ae816 }, { hi: 0x5f3b05b7, lo: 0x73645abb },
	{ hi: 0x2501a2be, lo: 0x5575f2f6 }, { hi: 0x1b2f7400, lo: 0x4e7e8ba9 },	{ hi: 0x1cd75803, lo: 0x71e8d953 }, { hi: 0x7f6ed895, lo: 0x62764e30 },
	{ hi: 0xb15926ff, lo: 0x596f003d }, { hi: 0x9f65293d, lo: 0xa8c5d6b9 },	{ hi: 0x6ecef04d, lo: 0xd690f84c }, { hi: 0x4782275f, lo: 0xff33af88 },
	{ hi: 0xe4143308, lo: 0x3f820801 }, { hi: 0xfd0dfe40, lo: 0x9a1af9b5 },	{ hi: 0x4325a334, lo: 0x2cdb396b }, { hi: 0x8ae77e62, lo: 0xb301b252 },
	{ hi: 0xc36f9e9f, lo: 0x6655615a }, { hi: 0x85455a2d, lo: 0x92d32c09 },	{ hi: 0xf2c7dea9, lo: 0x49477485 }, { hi: 0x63cfb4c1, lo: 0x33a39eba },
	{ hi: 0x83b040cc, lo: 0x6ebc5462 }, { hi: 0x3b9454c8, lo: 0xfdb326b0 },	{ hi: 0x56f56a9e, lo: 0x87ffd78c }, { hi: 0x2dc2940d, lo: 0x99f42bc6 },
	{ hi: 0x98f7df09, lo: 0x6b096e2d }, { hi: 0x19a6e01e, lo: 0x3ad852bf },	{ hi: 0x42a99ccb, lo: 0xdbd4b40b }, { hi: 0xa59998af, lo: 0x45e9c559 },
	{ hi: 0x366295e8, lo: 0x07d93186 }, { hi: 0x6b48181b, lo: 0xfaa1f773 },	{ hi: 0x1fec57e2, lo: 0x157a0a1d }, { hi: 0x4667446a, lo: 0xf6201ad5 },
	{ hi: 0xe615ebca, lo: 0xcfb0f075 }, { hi: 0xb8f31f4f, lo: 0x68290778 },	{ hi: 0x22713ed6, lo: 0xce22d11e }, { hi: 0x3057c1a7, lo: 0x2ec3c93b },
	{ hi: 0xcb46acc3, lo: 0x7c3f1f2f }, { hi: 0xdbb893fd, lo: 0x02aaf50e },	{ hi: 0x331fd92e, lo: 0x600b9fcf }, { hi: 0xa498f961, lo: 0x48ea3ad6 },
	{ hi: 0xa8d8426e, lo: 0x8b6a83ea }, { hi: 0xa089b274, lo: 0xb7735cdc },	{ hi: 0x87f6b373, lo: 0x1e524a11 }, { hi: 0x118808e5, lo: 0xcbc96749 },
	{ hi: 0x9906e4c7, lo: 0xb19bd394 }, { hi: 0xafed7f7e, lo: 0x9b24a20c },	{ hi: 0x6509eade, lo: 0xeb3644a7 }, { hi: 0x6c1ef1d3, lo: 0xe8ef0ede },
	{ hi: 0xb9c97d43, lo: 0xe9798fb4 }, { hi: 0xa2f2d784, lo: 0x740c28a3 },	{ hi: 0x7b849647, lo: 0x6197566f }, { hi: 0x7a5be3e6, lo: 0xb65f069d },
	{ hi: 0xf96330ed, lo: 0x78be6f10 }, { hi: 0xeee60de7, lo: 0x7a076a15 },	{ hi: 0x2b4bee4a, lo: 0xa08b9bd0 }, { hi: 0x6a56a63e, lo: 0xc7b8894e },
	{ hi: 0x02121359, lo: 0xba34fef4 }, { hi: 0x4cbf99f8, lo: 0x283703fc },	{ hi: 0x39807135, lo: 0x0caf30c8 }, { hi: 0xd0a77a89, lo: 0xf017687a },
	{ hi: 0xf1c1a9eb, lo: 0x9e423569 }, { hi: 0x8c797628, lo: 0x2dee8199 },	{ hi: 0x5d1737a5, lo: 0xdd1f7abd }, { hi: 0x4f53433c, lo: 0x09a9fa80 },
	{ hi: 0xfa8b0c53, lo: 0xdf7ca1d9 }, { hi: 0x3fd9dcbc, lo: 0x886ccb77 },	{ hi: 0xc040917c, lo: 0xa91b4720 }, { hi: 0x7dd00142, lo: 0xf9d1dcdf },
	{ hi: 0x8476fc1d, lo: 0x4f387b58 }, { hi: 0x23f8e7c5, lo: 0xf3316503 },	{ hi: 0x032a2244, lo: 0xe7e37339 }, { hi: 0x5c87a5d7, lo: 0x50f5a74b },
	{ hi: 0x082b4cc4, lo: 0x3698992e }, { hi: 0xdf917bec, lo: 0xb858f63c },	{ hi: 0x3270b8fc, lo: 0x5bf86dda }, { hi: 0x10ae72bb, lo: 0x29b5dd76 },
	{ hi: 0x576ac94e, lo: 0x7700362b }, { hi: 0x1ad112da, lo: 0xc61efb8f },	{ hi: 0x691bc30e, lo: 0xc5faa427 }, { hi: 0xff246311, lo: 0xcc327143 },
	{ hi: 0x3142368e, lo: 0x30e53206 }, { hi: 0x71380e31, lo: 0xe02ca396 },	{ hi: 0x958d5c96, lo: 0x0aad76f1 }, { hi: 0xf8d6f430, lo: 0xc16da536 },
	{ hi: 0xc8ffd13f, lo: 0x1be7e1d2 }, { hi: 0x7578ae66, lo: 0x004ddbe1 },	{ hi: 0x05833f01, lo: 0x067be646 }, { hi: 0xbb34b5ad, lo: 0x3bfe586d },
	{ hi: 0x095f34c9, lo: 0xa12b97f0 }, { hi: 0x247ab645, lo: 0x25d60ca8 },	{ hi: 0xdcdbc6f3, lo: 0x017477d1 }, { hi: 0x4a2e14d4, lo: 0xdecad24d },
	{ hi: 0xbdb5e6d9, lo: 0xbe0a1eeb }, { hi: 0x2a7e70f7, lo: 0x794301ab },	{ hi: 0xdef42d8a, lo: 0x270540fd }, { hi: 0x01078ec0, lo: 0xa34c22c1 },
	{ hi: 0xe5de511a, lo: 0xf4c16387 }, { hi: 0x7ebb3a52, lo: 0xbd9a330a },	{ hi: 0x77697857, lo: 0xaa7d6435 }, { hi: 0x004e8316, lo: 0x03ae4c32 },
	{ hi: 0xe7a21020, lo: 0xad78e312 }, { hi: 0x9d41a70c, lo: 0x6ab420f2 },	{ hi: 0x28e06c18, lo: 0xea1141e6 }, { hi: 0xd2b28cbd, lo: 0x984f6b28 },
	{ hi: 0x26b75f6c, lo: 0x446e9d83 }, { hi: 0xba47568c, lo: 0x4d418d7f },	{ hi: 0xd80badbf, lo: 0xe6183d8e }, { hi: 0x0e206d7f, lo: 0x5f166044 },
	{ hi: 0xe258a439, lo: 0x11cbca3e }, { hi: 0x723a1746, lo: 0xb21dc0bc },	{ hi: 0xc7caa854, lo: 0xf5d7cdd3 }, { hi: 0x7cac3288, lo: 0x3d261d9c },
	{ hi: 0x7690c264, lo: 0x23ba942c }, { hi: 0x17e55524, lo: 0x478042b8 },	{ hi: 0xe0be4776, lo: 0x56a2389f }, { hi: 0x4d289b5e, lo: 0x67ab2da0 },
	{ hi: 0x44862b9c, lo: 0x8fbbfd31 }, { hi: 0xb47cc804, lo: 0x9d141365 },	{ hi: 0x822c1b36, lo: 0x2b91c793 }, { hi: 0x4eb14655, lo: 0xfb13dfd8 },
	{ hi: 0x1ecbba07, lo: 0x14e2a97b }, { hi: 0x6143459d, lo: 0x5cde5f14 },	{ hi: 0x53a8fbf1, lo: 0xd5f0ac89 }, { hi: 0x97ea04d8, lo: 0x1c5e5b00 },
	{ hi: 0x622181a8, lo: 0xd4fdb3f3 }, { hi: 0xe9bcd341, lo: 0x572a1208 },	{ hi: 0x14112586, lo: 0x43cce58a }, { hi: 0x9144c5fe, lo: 0xa4c6e0a4 },
	{ hi: 0x0d33d065, lo: 0x65cf620f }, { hi: 0x54a48d48, lo: 0x9f219ca1 },	{ hi: 0xc43e5eac, lo: 0x6d63c821 }, { hi: 0xa9728b3a, lo: 0x72770daf },
	{ hi: 0xd7934e7b, lo: 0x20df87ef }, { hi: 0xe35503b6, lo: 0x1a3e86e5 },	{ hi: 0xcae321fb, lo: 0xc819d504 }, { hi: 0x129a50b3, lo: 0xac60bfa6 },
	{ hi: 0xcd5e68ea, lo: 0x7e9fb6c3 }, { hi: 0xb01c9019, lo: 0x9483b1c7 },	{ hi: 0x3de93cd5, lo: 0xc295376c }, { hi: 0xaed52edf, lo: 0x2ab9ad13 },
	{ hi: 0x2e60f512, lo: 0xc0a07884 }, { hi: 0xbc3d86a3, lo: 0xe36210c9 },	{ hi: 0x35269d9b, lo: 0x163951ce }, { hi: 0x0c7d6e2a, lo: 0xd0cdb5fa },
	{ hi: 0x59e86297, lo: 0xd87f5733 }, { hi: 0x298ef221, lo: 0x898db0e7 },	{ hi: 0x55000029, lo: 0xd1a5aa7e }, { hi: 0x8bc08ae1, lo: 0xb5061b45 },
	{ hi: 0xc2c31c2b, lo: 0x6c92703a }, { hi: 0x94cc596b, lo: 0xaf25ef42 },	{ hi: 0x0a1d73db, lo: 0x22540456 }, { hi: 0x04b6a0f9, lo: 0xd9c4179a },
	{ hi: 0xeffdafa2, lo: 0xae3d3c60 }, { hi: 0xf7c8075b, lo: 0xb49496c4 },	{ hi: 0x9cc5c714, lo: 0x1d1cd4e3 }, { hi: 0x78bd1638, lo: 0x218e5534 },
	{ hi: 0xb2f11568, lo: 0xf850246a }, { hi: 0xedfabcfa, lo: 0x9502bc29 },	{ hi: 0x796ce5f2, lo: 0xda23051b }, { hi: 0xaae128b0, lo: 0xdc93537c },
	{ hi: 0x3a493da0, lo: 0xee4b29ae }, { hi: 0xb5df6b2c, lo: 0x416895d7 },	{ hi: 0xfcabbd25, lo: 0x122d7f37 }, { hi: 0x70810b58, lo: 0x105dc4b1 },
	{ hi: 0xe10fdd37, lo: 0xf7882a90 }, { hi: 0x524dcab5, lo: 0x518a3f5c },	{ hi: 0x3c9e8587, lo: 0x8451255b }, { hi: 0x40298281, lo: 0x19bd34e2 },
	{ hi: 0x74a05b6f, lo: 0x5d3ceccb }, { hi: 0xb6100215, lo: 0x42e13eca },	{ hi: 0x0ff979d1, lo: 0x2f59e2ac }, { hi: 0x6037da27, lo: 0xe4f9cc50 },
	{ hi: 0x5e92975a, lo: 0x0df1847d }, { hi: 0xd66de190, lo: 0xd3e623fe },	{ hi: 0x5032d6b8, lo: 0x7b568048 }, { hi: 0x9a36b7ce, lo: 0x8235216e },
	{ hi: 0x80272a7a, lo: 0x24f64b4a }, { hi: 0x93efed8b, lo: 0x8c6916f7 },	{ hi: 0x37ddbff4, lo: 0x4cce1555 }, { hi: 0x4b95db5d, lo: 0x4b99bd25 },
	{ hi: 0x92d3fda1, lo: 0x69812fc0 }, { hi: 0xfb1a4a9a, lo: 0x90660bb6 },	{ hi: 0x730c1969, lo: 0x46a4b9b2 }, { hi: 0x81e289aa, lo: 0x7f49da68 },
	{ hi: 0x64669a0f, lo: 0x83b1a05f }, { hi: 0x27b3ff7d, lo: 0x9644f48b },	{ hi: 0xcc6b615c, lo: 0x8db675b3 }, { hi: 0x674f20b9, lo: 0xbcebbe95 },
	{ hi: 0x6f312382, lo: 0x75655982 }, { hi: 0x5ae48871, lo: 0x3e45cf05 },	{ hi: 0xbf619f99, lo: 0x54c21157 }, { hi: 0xeabac460, lo: 0x40a8eae9 },
	{ hi: 0x454c6fe9, lo: 0xf2c0c1cd }, { hi: 0x419cf649, lo: 0x6412691c },	{ hi: 0xd3dc3bef, lo: 0x265b0f70 }, { hi: 0x6d0e60f5, lo: 0xc3578a9e }
];

const T4 = [
	{ hi: 0x5b0e6085, lo: 0x26323c55 }, { hi: 0x1a46c1a9, lo: 0xfa1b59f5 },	{ hi: 0xa9e245a1, lo: 0x7c4c8ffa }, { hi: 0x65ca5159, lo: 0xdb2955d7 },
	{ hi: 0x05db0a76, lo: 0xce35afc2 }, { hi: 0x81eac77e, lo: 0xa9113d45 },	{ hi: 0x528ef88a, lo: 0xb6ac0a0d }, { hi: 0xa09ea253, lo: 0x597be3ff },
	{ hi: 0x430ddfb3, lo: 0xac48cd56 }, { hi: 0xc4b3a67a, lo: 0xf45ce46f },	{ hi: 0x4ececfd8, lo: 0xfbe2d05e }, { hi: 0x3ef56f10, lo: 0xb39935f0 },
	{ hi: 0x0b22d682, lo: 0x9cd619c6 }, { hi: 0x17fd460a, lo: 0x74df2069 },	{ hi: 0x6cf8cc8e, lo: 0x8510ed40 }, { hi: 0xd6c824bf, lo: 0x3a6ecaa7 },
	{ hi: 0x61243d58, lo: 0x1a817049 }, { hi: 0x048bacb6, lo: 0xbbc163a2 },	{ hi: 0xd9a38ac2, lo: 0x7d44cc32 }, { hi: 0x7fddff5b, lo: 0xaaf410ab },
	{ hi: 0xad6d495a, lo: 0xa804824b }, { hi: 0xe1a6a74f, lo: 0x2d8c9f94 },	{ hi: 0xd4f78512, lo: 0x35dee8e3 }, { hi: 0xfd4b7f88, lo: 0x6540d893 },
	{ hi: 0x247c2004, lo: 0x2aa4bfda }, { hi: 0x096ea1c5, lo: 0x17d1327c },	{ hi: 0xd56966b4, lo: 0x361a6685 }, { hi: 0x277da5c3, lo: 0x1221057d },
	{ hi: 0x94d59893, lo: 0xa43acff7 }, { hi: 0x64f0c51c, lo: 0xcdc02281 },	{ hi: 0x3d33bcc4, lo: 0xff6189db }, { hi: 0xe005cb18, lo: 0x4ce66af1 },
	{ hi: 0xff5ccd1d, lo: 0x1db99bea }, { hi: 0xb0b854a7, lo: 0xfe42980f },	{ hi: 0x7bd46a6a, lo: 0x718d4b9f }, { hi: 0xd10fa8cc, lo: 0x22a5fd8c },
	{ hi: 0xd3148495, lo: 0x2be4bd31 }, { hi: 0xc7fa975f, lo: 0xcb243847 },	{ hi: 0x4886ed1e, lo: 0x5846c407 }, { hi: 0x28cddb79, lo: 0x1eb70b04 },
	{ hi: 0xc2b00be2, lo: 0xf573417f }, { hi: 0x5c959045, lo: 0x2180f877 },	{ hi: 0x7a6bddff, lo: 0xf370eb00 }, { hi: 0xce509e38, lo: 0xd6d9d6a4 },
	{ hi: 0xebeb0f00, lo: 0x647fa702 }, { hi: 0x1dcc06cf, lo: 0x76606f06 },	{ hi: 0xe4d9f28b, lo: 0xa286ff0a }, { hi: 0xd85a305d, lo: 0xc918c262 },
	{ hi: 0x475b1d87, lo: 0x32225f54 }, { hi: 0x2d4fb516, lo: 0x68ccb5fe },	{ hi: 0xa679b9d9, lo: 0xd72bba20 }, { hi: 0x53841c0d, lo: 0x912d43a5 },
	{ hi: 0x3b7eaa48, lo: 0xbf12a4e8 }, { hi: 0x781e0e47, lo: 0xf22f1ddf },	{ hi: 0xeff20ce6, lo: 0x0ab50973 }, { hi: 0x20d261d1, lo: 0x9dffb742 },
	{ hi: 0x16a12b03, lo: 0x062a2e39 }, { hi: 0x1960eb22, lo: 0x39650495 },	{ hi: 0x251c16fe, lo: 0xd50eb8b8 }, { hi: 0x9ac0c330, lo: 0xf826016e },
	{ hi: 0xed152665, lo: 0x953e7671 }, { hi: 0x02d63194, lo: 0xa6369570 },	{ hi: 0x5074f083, lo: 0x94b1c987 }, { hi: 0x70ba598c, lo: 0x90b25ce1 },
	{ hi: 0x794a1581, lo: 0x0b9742f6 }, { hi: 0x0d5925e9, lo: 0xfcaf8c6c },	{ hi: 0x3067716c, lo: 0xd868744e }, { hi: 0x910ab077, lo: 0xe8d7731b },
	{ hi: 0x6a61bbdb, lo: 0x5ac42f61 }, { hi: 0x93513efb, lo: 0xf0851567 },	{ hi: 0xf494724b, lo: 0x9e83e9d5 }, { hi: 0xe887e198, lo: 0x5c09648d },
	{ hi: 0x34b1d3c6, lo: 0x75370cfd }, { hi: 0xdc35e433, lo: 0xbc0d255d },	{ hi: 0xd0aab842, lo: 0x34131be0 }, { hi: 0x08042a50, lo: 0xb48b7eaf },
	{ hi: 0x9997c4ee, lo: 0x44a3ab35 }, { hi: 0x829a7b49, lo: 0x201799d0 },	{ hi: 0x263b8307, lo: 0xb7c54441 }, { hi: 0x752f95f4, lo: 0xfd6a6ca6 },
	{ hi: 0x92721740, lo: 0x2c08c6e5 }, { hi: 0x2a8ab754, lo: 0xa795d9ee },	{ hi: 0xa442f755, lo: 0x2f72943d }, { hi: 0x2c31334e, lo: 0x19781208 },
	{ hi: 0x4fa98d7c, lo: 0xeaee6291 }, { hi: 0x55c3862f, lo: 0x665db309 },	{ hi: 0xbd061017, lo: 0x5d53b1f3 }, { hi: 0x46fe6cb8, lo: 0x40413f27 },
	{ hi: 0x3fe03792, lo: 0xdf0cfa59 }, { hi: 0xcfe70037, lo: 0x2eb85e8f },	{ hi: 0xa7be29e7, lo: 0xadbce118 }, { hi: 0xe544ee5c, lo: 0xde8431dd },
	{ hi: 0x8a781b1b, lo: 0x41f1873e }, { hi: 0xa5c94c78, lo: 0xa0d2f0e7 },	{ hi: 0x39412e28, lo: 0x77b60728 }, { hi: 0xa1265ef3, lo: 0xafc9a62c },
	{ hi: 0xbcc2770c, lo: 0x6a2506c5 }, { hi: 0x3ab66dd5, lo: 0xdce1ce12 },	{ hi: 0xe65499d0, lo: 0x4a675b37 }, { hi: 0x7d8f5234, lo: 0x81bfd216 },
	{ hi: 0x0f6f64fc, lo: 0xec15f389 }, { hi: 0x74efbe61, lo: 0x8b5b13c8 },	{ hi: 0xacdc82b7, lo: 0x14273e1d }, { hi: 0xdd40bfe0, lo: 0x03199d17 },
	{ hi: 0x37e99257, lo: 0xe7e061f8 }, { hi: 0xfa526269, lo: 0x04775aaa },	{ hi: 0x8bbbf63a, lo: 0x463d56f9 }, { hi: 0xf0013f15, lo: 0x43a26e64 },
	{ hi: 0xa8307e9f, lo: 0x879ec898 }, { hi: 0xcc4c27a4, lo: 0x150177cc },	{ hi: 0x1b432f2c, lo: 0xca1d3348 }, { hi: 0xde1d1f8f, lo: 0x9f6fa013 },
	{ hi: 0x606602a0, lo: 0x47a7ddd6 }, { hi: 0xd237ab64, lo: 0xcc1cb2c7 },	{ hi: 0x9b938e72, lo: 0x25fcd1d3 }, { hi: 0xec4e0370, lo: 0x8e0ff476 },
	{ hi: 0xfeb2fbda, lo: 0x3d03c12d }, { hi: 0xae0bced2, lo: 0xee43889a },	{ hi: 0x22cb8923, lo: 0xebfb4f43 }, { hi: 0x69360d01, lo: 0x3cf7396d },
	{ hi: 0x855e3602, lo: 0xd2d4e022 }, { hi: 0x073805ba, lo: 0xd01f784c },	{ hi: 0x33e17a13, lo: 0x3852f546 }, { hi: 0xdf487405, lo: 0x8ac7b638 },
	{ hi: 0xba92b29c, lo: 0x678aa14a }, { hi: 0x0ce89fc7, lo: 0x6cfaadcd },	{ hi: 0x5f9d4e09, lo: 0x08339e34 }, { hi: 0xf1afe929, lo: 0x1f5923b9 },
	{ hi: 0x6e3480f6, lo: 0x0f4a265f }, { hi: 0xeebf3a2a, lo: 0xb29b841c },	{ hi: 0xe21938a8, lo: 0x8f91b4ad }, { hi: 0x57dfeff8, lo: 0x45c6d3c3 },
	{ hi: 0x2f006b0b, lo: 0xf62caaf2 }, { hi: 0x62f479ef, lo: 0x6f75ee78 },	{ hi: 0x11a55ad4, lo: 0x1c8916a9 }, { hi: 0xf229d290, lo: 0x84fed453 },
	{ hi: 0x42f1c27b, lo: 0x16b000e6 }, { hi: 0x2b1f7674, lo: 0x9823c074 },	{ hi: 0x4b76eca3, lo: 0xc2745360 }, { hi: 0x8c98f463, lo: 0xb91691bd },
	{ hi: 0x14bcc93c, lo: 0xf1ade66a }, { hi: 0x8885213e, lo: 0x6d458397 },	{ hi: 0x8e177df0, lo: 0x274d4711 }, { hi: 0xb49b73b5, lo: 0x503f2951 },
	{ hi: 0x10168168, lo: 0xc3f96b6b }, { hi: 0x0e3d963b, lo: 0x63cab0ae },	{ hi: 0x8dfc4b56, lo: 0x55a1db14 }, { hi: 0xf789f135, lo: 0x6e14de5c },
	{ hi: 0x683e68af, lo: 0x4e51dac1 }, { hi: 0xc9a84f9d, lo: 0x8d4b0fd9 },	{ hi: 0x3691e03f, lo: 0x52a0f9d1 }, { hi: 0x5ed86e46, lo: 0xe1878e80 },
	{ hi: 0x3c711a0e, lo: 0x99d07150 }, { hi: 0x5a0865b2, lo: 0x0c4e9310 },	{ hi: 0x56fbfc1f, lo: 0xe4f0682e }, { hi: 0xea8d5de3, lo: 0x105edf9b },
	{ hi: 0x71abfdb1, lo: 0x2379187a }, { hi: 0x2eb99de1, lo: 0xbee77b9c },	{ hi: 0x21ecc0ea, lo: 0x33cf4523 }, { hi: 0x59a4d752, lo: 0x1805c7a1 },
	{ hi: 0x3896f5eb, lo: 0x56ae7c72 }, { hi: 0xaa638f3d, lo: 0xb18f75dc },	{ hi: 0x9f39358d, lo: 0xabe9808e }, { hi: 0xb7defa91, lo: 0xc00b72ac },
	{ hi: 0x6b5541fd, lo: 0x62492d92 }, { hi: 0x6dc6dee8, lo: 0xf92e4d5b },	{ hi: 0x353f57ab, lo: 0xc4beea7e }, { hi: 0x735769d6, lo: 0xda5690ce },
	{ hi: 0x0a234aa6, lo: 0x42391484 }, { hi: 0xf6f95080, lo: 0x28f80d9d },	{ hi: 0xb8e319a2, lo: 0x7ab3f215 }, { hi: 0x31ad9c11, lo: 0x51341a4d },
	{ hi: 0x773c22a5, lo: 0x7bef5805 }, { hi: 0x45c7561a, lo: 0x07968633 },	{ hi: 0xf913da9e, lo: 0x249dbe36 }, { hi: 0xda652d9b, lo: 0x78a64c68 },
	{ hi: 0x4c27a97f, lo: 0x3bc334ef }, { hi: 0x76621220, lo: 0xe66b17f4 },	{ hi: 0x96774389, lo: 0x9acd7d0b }, { hi: 0xf3ee5bca, lo: 0xe0ed6782 },
	{ hi: 0x409f7536, lo: 0x00c879fc }, { hi: 0x06d09a39, lo: 0xb5926db6 },	{ hi: 0x6f83aeb0, lo: 0x317ac588 }, { hi: 0x01e6ca4a, lo: 0x86381f21 },
	{ hi: 0x66ff3462, lo: 0xd19f3025 }, { hi: 0x72207c24, lo: 0xddfd3bfb },	{ hi: 0x4af6b6d3, lo: 0xe2ece2eb }, { hi: 0x9c994dbe, lo: 0xc7ea08de },
	{ hi: 0x49ace597, lo: 0xb09a8bc4 }, { hi: 0xb38c4766, lo: 0xcf0797ba },	{ hi: 0x131b9373, lo: 0xc57c2a75 }, { hi: 0xb1822cce, lo: 0x61931e58 },
	{ hi: 0x9d7555b9, lo: 0x09ba1c0c }, { hi: 0x127fafdd, lo: 0x937d11d2 },	{ hi: 0x29da3bad, lo: 0xc66d92e4 }, { hi: 0xa2c1d571, lo: 0x54c2ecbc },
	{ hi: 0x58c5134d, lo: 0x82f6fe24 }, { hi: 0x1c3ae351, lo: 0x5b62274f },	{ hi: 0xe907c82e, lo: 0x01cb8126 }, { hi: 0xf8ed0919, lo: 0x13e37fcb },
	{ hi: 0x3249d8f9, lo: 0xc80046c9 }, { hi: 0x80cf9bed, lo: 0xe388fb63 },	{ hi: 0x1881539a, lo: 0x116cf19e }, { hi: 0x5103f3f7, lo: 0x6bd52457 },
	{ hi: 0x15b7e6f5, lo: 0xae47f7a8 }, { hi: 0xdbd7c6de, lo: 0xd47e9ccf },	{ hi: 0x44e55c41, lo: 0x0228bb1a }, { hi: 0xb647d425, lo: 0x5edb4e99 },
	{ hi: 0x5d11882b, lo: 0xb8aafc30 }, { hi: 0xf5098bbb, lo: 0x29d3212a },	{ hi: 0x8fb5ea14, lo: 0xe90296b3 }, { hi: 0x677b9421, lo: 0x57dd025a },
	{ hi: 0xfb58e7c0, lo: 0xa390acb5 }, { hi: 0x89d3674c, lo: 0x83bd4a01 },	{ hi: 0x9e2da4df, lo: 0x4bf3b93b }, { hi: 0xfcc41e32, lo: 0x8cab4829 },
	{ hi: 0x03f38c96, lo: 0xba582c52 }, { hi: 0xcad1bdbd, lo: 0x7fd85db2 },	{ hi: 0xbbb442c1, lo: 0x6082ae83 }, { hi: 0xb95fe86b, lo: 0xa5da9ab0 },
	{ hi: 0xb22e0467, lo: 0x3771a93f }, { hi: 0x845358c9, lo: 0x493152d8 },	{ hi: 0xbe2a4886, lo: 0x97b4541e }, { hi: 0x95a2dc2d, lo: 0xd38e6966 },
	{ hi: 0xc02c11ac, lo: 0x923c852b }, { hi: 0x2388b199, lo: 0x0df2a87b },	{ hi: 0x7c8008fa, lo: 0x1b4f37be }, { hi: 0x1f70d0c8, lo: 0x4d54e503 },
	{ hi: 0x5490adec, lo: 0x7ece57d4 }, { hi: 0x002b3c27, lo: 0xd9063a3a },	{ hi: 0x7eaea384, lo: 0x8030a2bf }, { hi: 0xc602326d, lo: 0xed2003c0 },
	{ hi: 0x83a7287d, lo: 0x69a94086 }, { hi: 0xc57a5fcb, lo: 0x30f57a8a },	{ hi: 0xb56844e4, lo: 0x79ebe779 }, { hi: 0xa373b40f, lo: 0x05dcbce9 },
	{ hi: 0xd71a786e, lo: 0x88570ee2 }, { hi: 0x879cbacd, lo: 0xbde8f6a0 },	{ hi: 0x976ad1bc, lo: 0xc164a32f }, { hi: 0xab21e25e, lo: 0x9666d78b },
	{ hi: 0x901063aa, lo: 0xe5e5c33c }, { hi: 0x9818b344, lo: 0x48698d90 },	{ hi: 0xe36487ae, lo: 0x3e1e8abb }, { hi: 0xafbdf931, lo: 0x893bdcb4 },
	{ hi: 0x6345a0dc, lo: 0x5fbbd519 }, { hi: 0x8628fe26, lo: 0x9b9465ca },	{ hi: 0x1e5d0160, lo: 0x3f9c51ec }, { hi: 0x4de44006, lo: 0xa15049b7 },
	{ hi: 0xbf6c70e5, lo: 0xf776cbb1 }, { hi: 0x411218f2, lo: 0xef552bed },	{ hi: 0xcb0c0708, lo: 0x705a36a3 }, { hi: 0xe74d1475, lo: 0x4f986044 },
	{ hi: 0xcd56d943, lo: 0x0ea8280e }, { hi: 0xc12591d7, lo: 0x535f5065 },	{ hi: 0xc83223f1, lo: 0x720aef96 }, { hi: 0xc3a0396f, lo: 0x7363a51f }
];

function round(v, x, mul)
{
	let [a, b, c] = v;
	c = xor64(c, x);
	a = sub64(a, xor64(
		T1[ c.lo         & 0xff], 
		T2[(c.lo >>> 16) & 0xff], 
		T3[ c.hi         & 0xff], 
		T4[(c.hi >>> 16) & 0xff])
	);
	b = add64(b, xor64(
		T4[(c.lo >>>  8) & 0xff],
		T3[ c.lo >>> 24],
		T2[(c.hi >>>  8) & 0xff],
		T1[ c.hi >>> 24])
	);
	b = mul64(b, mul);
	// Rotate a, b, c - 1 word left
	v[0] = b; v[1] = c; v[2] = a;
}

function keySchedule(x)
{
	let [x0, x1, x2, x3, x4, x5, x6, x7] = x;
	x0 = sub64(x0, xor64(x7, KEY_SCHEDULE_CONST_1));
	x1 = xor64(x1, x0);
	x2 = add64(x2, x1);
	x3 = sub64(x3, xor64(x2, shl64(not64(x1), 19)));
	x4 = xor64(x4, x3);
	x5 = add64(x5, x4);
	x6 = sub64(x6, xor64(x5, shr64(not64(x4), 23)));
	x7 = xor64(x7, x6);
	x0 = add64(x0, x7);
	x1 = sub64(x1, xor64(x0, shl64(not64(x7), 19)));
	x2 = xor64(x2, x1);
	x3 = add64(x3, x2);
	x4 = sub64(x4, xor64(x3, shr64(not64(x2), 23)));
	x5 = xor64(x5, x4);
	x6 = add64(x6, x5);
	x7 = sub64(x7, xor64(x6, KEY_SCHEDULE_CONST_2));
	x[0] = x0; x[1] = x1; x[2] = x2; x[3] = x3; x[4] = x4; x[5] = x5; x[6] = x6; x[7] = x7;
}

class TigerTransform extends Transform
{
	constructor()
	{
		super();
		this.addInput("bytes", "Input")
			.addOutput("bytes", "Hash")
			.addOption("variant", "Variant", "tiger", { type: "select", texts: VARIANT_NAMES, values: VARIANT_VALUES });
	}

	// TODO: Combine with MD-like padding in a general function
	// Only difference here is the padding 1 bit for Tiger1 - 
	// otherwise it works like 32-bit(!) MD padding
	padMessage(bytes, variant)
	{
		const length = bytes.length;
		// "The message is "padded" (extended) so that its length (in bits) is
		// congruent to 448/896, modulo 512/1024"
		let paddingLength = 56 - (length % 64);

		// "Padding is always performed, even if the length of the message is
		// already congruent to 448/896, modulo 512/1024."
		// That is, if the calculated padding length is <= 0, we need to add 512/1024 bits to it
		if (paddingLength <= 0)
		{
			paddingLength += 64;
		}

		// Reserve space for message, padding, and length extension (depends on word size)
		const result = new Uint8Array(bytes.length + paddingLength + 8);
		result.set(bytes);

		// "Padding is performed as follows: a single "1" bit is appended to the
		// message, and then "0" bits are appended so that the length in bits of
		// the padded message becomes congruent to 448, modulo 512.
		// In all, at least one bit and at most 512 bits are appended."
		result[bytes.length] = (variant === "tiger2") ? 0x80 : 0x01; // "1" bit

		// NOTE: The maximum javascript array size is 2^32-1 bytes. That's also the
		// (very theoretical) maximum message length we would be able to handle.
		// That means the low word will store the low 29 bits of the byte length - shifted
		// left by 3 because MD/SHA actually stores *bit* length. And the high word will
		// just store the 3 bits shifted out. For 64 bit hashes, the rest of the appended
		// message length bits are way out of reach and will just be set to 0.
		const bitLengthLo = length << 3;
		const bitLengthHi = length >>> 29;

		const index = bytes.length + paddingLength;
		const bitLength = [bitLengthLo, bitLengthHi];
		result.set(int32sToBytesLE(bitLength), index);

		return result;
	}

	transform(bytes, options)
	{
		options = Object.assign({}, this.defaults, options);

		// TODO: Consider DataView
		const padded = bytesToInt64sLE(this.padMessage(bytes, options.variant));
		const h = [
			{ hi: 0x01234567, lo: 0x89abcdef },
			{ hi: 0xfedcba98, lo: 0x76543210 },
			{ hi: 0xf096a5b4, lo: 0xc3b2e187 }
		];

		const v = new Array(3);

		for (let chunkindex = 0; chunkindex < padded.length; chunkindex += 8)
		{
			const x = [];
			for (let index = chunkindex; index < chunkindex + 8; index ++)
			{
				x.push({ hi: padded[index].hi, lo: padded[index].lo });
			}

			for (let i = 0; i < 3; i++)
			{
				v[i] = { hi: h[i].hi, lo: h[i].lo };
			}

			for (let step = 0; step < 8; step++)
			{
				round(v, x[step], MUL_5);
			}

			keySchedule(x);

			for (let step = 0; step < 8; step++)
			{
				round(v, x[step], MUL_7);
			}

			keySchedule(x);

			for (let step = 0; step < 8; step++)
			{
				round(v, x[step], MUL_9);
			}

			h[0] = xor64(v[0], h[0]);
			h[1] = sub64(v[1], h[1]);
			h[2] = add64(v[2], h[2]);
		}

		return int64sToBytesLE(h);
	}
}

export {
	TigerTransform
};