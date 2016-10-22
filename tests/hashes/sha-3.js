import test from "ava";
import { testBytesHash } from "../_testutils";
import { Sha3Transform, ShakeTransform } from "transforms/hashes/sha-3";

function doTest224(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHA3-224 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		Sha3Transform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHA3-224" }
	);
}

function doTest256(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHA3-256 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		Sha3Transform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHA3-256" }
	);
}

function doTest384(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHA3-384 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		Sha3Transform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHA3-384" }
	);
}

function doTest512(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHA3-512 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		Sha3Transform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHA3-512" }
	);
}

function doTestShake128(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHAKE-128 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		ShakeTransform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHAKE-128", length: 4096 }
	);
}

function doTestShake256(expectedHex, inputHex)
{
	const len = inputHex.length * 4;
	test(`SHAKE-256 hashes NIST ShortMsgKAT len = ${len}`, 
		testBytesHash, 
		ShakeTransform, 
		expectedHex, 
		inputHex, 
		{ variant: "SHAKE-256", length: 4096 }
	);
}

// 0, 8, 16, 24, 32, 40... 128 bits
// r=1152, c=448
doTest224("6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7", "");
doTest224("df70adc49b2e76eee3a6931b93fa41841c3af2cdf5b32a18b5478c39", "cc");
doTest224("bff295861daedf33e70519b1e2bcb4c2e9fe3364d789bc3b17301c15", "41fb");
doTest224("14889df49c076a9af2f4bcb16339bcc45a24ebf9ce4dcdce7ec17217", "1f877c");
doTest224("a33c58df8a8026f0f9591966bd6d00eed3b1e829580ab9be268caf39", "c1ecfdfc");
doTest224("10e580a32199596169331ad43cfcf10264f81565037040028a06b458", "21f134ac57");
doTest224("fe52c30c95c1e5193207e97d355fde09453482708c0876aa961508f0", "c6f50bb74e29");
doTest224("8b449849cb7c4776c593de58fd5c2e322cb5316be08a75057a01ed6a", "119713cc83eeef");
doTest224("01386cdd70589b3b34941efe16b85071e9ba948179922044f640868e", "4a4f202484512526");
doTest224("86953d0864019c81fd3a805357a162fd76a13a7cbf6ff0d635015d0e", "1f66ab4185ed9b6375");
doTest224("e56fc2a5a58709031df02a2e46ad95f93583e2745630540d8d97f703", "eed7422227613b6f53c9");
doTest224("1d783c37c32a2b71b504bcaa05fc00b639f1fae7e8d8e3f3bc49f041", "eaeed5cdffd89dece455f1");
doTest224("54c7e4bf3c73e192ade223dfea86f2d04acf953612731958f854c7bd", "5be43c90f22902e4fe8ed2d3");
doTest224("77e51ceada2aa1cbbf95acd821008b57e946f7940223b19f0c53e62e", "a746273228122f381c3b46e4f1");
doTest224("9ed59ed155e97154e067fa0f5a130839b57bdbda6feb82dabe006f00", "3c5871cd619c69a63b540eb5a625");
doTest224("81b3e56cfeee8e9138d3bfe24bb7ccdfd4b50d0b8ca11ae7d4b0c960", "fa22874bcc068879e8ef11a69f0722");
doTest224("b1571bed52e54eef377d99df7be4bc6682c43387f2bf9acc92df608f", "52a608ab21ccdd8a4457a57ede782176");

// Purposely chosen off-powers-of-2 to cover edge cases - 248, 520, 1040
doTest224("6a6857fba903b9da2753690c39c548be008e22ebb372eeaa16c85918", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");
doTest224("95e87ac90f541ab90cbcf7fd7e0e0c152cef78d5ee1830e9ed8a1ed7", "16e8b3d8f988e9bb04de9c96f2627811c973ce4a5296b4772ca3eefeb80a652bdf21f50df79f32db23f9f73d393b2d57d9a0297f7a2f2e79cfda39fa393df1ac00");
doTest224("be3be49980f43fb6598be921d7d8fda1f397f605d9708c5d125c4e9f", "9334de60c997bda6086101a6314f64e4458f5ff9450c509df006e8c547983c651ca97879175aaba0c539e82d05c1e02c480975cbb30118121061b1ebac4f8d9a3781e2db6b18042e01ecf9017a64a0e57447ec7fcbe6a7f82585f7403ee2223d52d37b4bf426428613d6b4257980972a0acab508a7620c1cb28eb4e9d30fc41361ec");
// Test length = rate - 1 (1144 bits)
doTest224("ab0fd308590574d6f6130232d9fafa9ffcfea78579a6a8f67c590420", "ea40e83cb18b3a242c1ecc6ccd0b7853a439dab2c569cfc6dc38a19f5c90acbf76aef9ea3742ff3b54ef7d36eb7ce4ff1c9ab3bc119cff6be93c03e208783335c0ab8137be5b10cdc66ff3f89a1bddc6a1eed74f504cbe7290690bb295a872b9e3fe2cee9e6c67c41db8efd7d863cf10f840fe618e7936da3dca5ca6df933f24f6954ba0801a1294cd8d7e66dfafec");
// Test length = rate (1152 bits)
doTest224("d5134200dc98f4ca480cd24d24497737252b55977ae5a869ba27089d", "157d5b7e4507f66d9a267476d33831e7bb768d4d04cc3438da12f9010263ea5fcafbde2579db2f6b58f911d593d5f79fb05fe3596e3fa80ff2f761d1b0e57080055c118c53e53cdb63055261d7c9b2b39bd90acc32520cbbdbda2c4fd8856dbcee173132a2679198daf83007a9b5c51511ae49766c792a29520388444ebefe28256fb33d4260439cba73a9479ee00c63");
// Test length = rate + 1 (1160 bits)
doTest224("494cbc9b649e48ec5ad7364aeb9c8edf4a4f400789ef203f7b818a44", "836b34b515476f613fe447a4e0c3f3b8f20910ac89a3977055c960d2d5d2b72bd8acc715a9035321b86703a411dde0466d58a59769672aa60ad587b8481de4bba552a1645779789501ec53d540b904821f32b0bd1855b04e4848f9f8cfe9ebd8911be95781a759d7ad9724a7102dbe576776b7c632bc39b9b5e19057e226552a5994c1dbb3b5c7871a11f5537011044c53");

// 0, 8, 16, 24, 32, 40... 128 bits
doTest256("a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a", "");
doTest256("677035391cd3701293d385f037ba32796252bb7ce180b00b582dd9b20aaad7f0", "cc");
doTest256("39f31b6e653dfcd9caed2602fd87f61b6254f581312fb6eeec4d7148fa2e72aa", "41fb");
doTest256("bc22345e4bd3f792a341cf18ac0789f1c9c966712a501b19d1b6632ccd408ec5", "1f877c");
doTest256("c5859be82560cc8789133f7c834a6ee628e351e504e601e8059a0667ff62c124", "c1ecfdfc");
doTest256("55bd9224af4eed0d121149e37ff4d7dd5be24bd9fbe56e0171e87db7a6f4e06d", "21f134ac57");
doTest256("ae0cbc757d4ab088e172abfd8746289950f92d38a25295658dbf744b5635af04", "c6f50bb74e29");
doTest256("e340c9a44373efcc212f3cb66a047ac34c87ff1c58c4a14b16a2bfc34698bb1d", "119713cc83eeef");
doTest256("ba4fb009d57a5ceb85fc64d54e5c55a55854b41cc47ad15294bc41f32165dfba", "4a4f202484512526");
doTest256("b9886ef905c8bdd272eda8298865e0769869f1c964460d1aa9d7a0c687707ccd", "1f66ab4185ed9b6375");
doTest256("fab8f88d3191e21a725b21c63a02cad3fa7c450ef8584b94cfa382f393422455", "eed7422227613b6f53c9");
doTest256("9363acd3f48bb91a8998aa0e8df75c971770a16a71e7d2334409734cd7d0a9ee", "eaeed5cdffd89dece455f1");
doTest256("16932f6f65deaad5780e25ab410c66b0e4198eba9f4ed1a25ee24f7879faefe2", "5be43c90f22902e4fe8ed2d3");
doTest256("1c28100e0ef50671c7ea3e024fa3ba9da2ebddb4de264c3a2426c36ad3f91c61", "a746273228122f381c3b46e4f1");
doTest256("8183be4875fab7ec5f99ed94f5f900cf1d6b953d8f71e1e7cc008687980e613a", "3c5871cd619c69a63b540eb5a625");
doTest256("3b1a6d21fe44691dac4eb7c593a6d8523cb606e63cf00e94d711a574248daca5", "fa22874bcc068879e8ef11a69f0722");
doTest256("2c7e7cb356fdc68ec8927e499d2a6bae2b781817919c829ebbe8225baed46967", "52a608ab21ccdd8a4457a57ede782176");

// Purposely chosen off-powers-of-2 to cover edge cases - 248, 520, 1040
doTest256("39a4a0ffc4603698ae0a4f3d24b1bc42ac7a2d7d923e7a5d602453e82d5323c5", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");
doTest256("c4bb067383002db44ca773918bb74104b604a583e12b06be56c270f8b43512f2", "16e8b3d8f988e9bb04de9c96f2627811c973ce4a5296b4772ca3eefeb80a652bdf21f50df79f32db23f9f73d393b2d57d9a0297f7a2f2e79cfda39fa393df1ac00");
doTest256("71e1d610b576063f2b12f691220beadf506bec0a3a086bbe5864fb54f93db556", "9334de60c997bda6086101a6314f64e4458f5ff9450c509df006e8c547983c651ca97879175aaba0c539e82d05c1e02c480975cbb30118121061b1ebac4f8d9a3781e2db6b18042e01ecf9017a64a0e57447ec7fcbe6a7f82585f7403ee2223d52d37b4bf426428613d6b4257980972a0acab508a7620c1cb28eb4e9d30fc41361ec");

// r=832, c=768
// 0, 8, 16, 24, 32, 40... 128 bits
doTest384("0c63a75b845e4f7d01107d852e4c2485c51a50aaaa94fc61995e71bbee983a2ac3713831264adb47fb6bd1e058d5f004", "");
doTest384("5ee7f374973cd4bb3dc41e3081346798497ff6e36cb9352281dfe07d07fc530ca9ad8ef7aad56ef5d41be83d5e543807", "cc");
doTest384("1dd81609dcc290effd7ac0a95d4a20821580e56bd50dbd843920650be7a80a1719577da337cfdf86e51c764caa2e10bd", "41fb");
doTest384("14f6f486fb98ed46a4a198040da8079e79e448daacebe905fb4cf0df86ef2a7151f62fe095bf8516eb0677fe607734e2", "1f877c");
doTest384("d92bbd604bdd24b9889508f8558b13e96595ac90bc8a441daf9b51d6abc14ffd0835fb9366e3912504264ce87e421cb8", "c1ecfdfc");
doTest384("e248d6ff342d35a30ec230ba51cdb161025d6f1c251aca6ae3531f0682c164a1fc0725b1beff808a200c131557a22809", "21f134ac57");
doTest384("d6dd2ed08c1f644857a15dafaf80538bee597278c9abe047bfbabfb8b1fcb7543e80ae9f7143d00f4daaf39b138ab3ff", "c6f50bb74e29");
doTest384("49ca1eb8d71d1fdc7a72daa320c8f9ca543671c2cb8fe9b2638a8416df50a790a50d0bb6b88741d7816d6061f46aea89", "119713cc83eeef");
doTest384("89dbf4c39b8fb46fdf0a6926cec0355a4bdbf9c6a446e140b7c8bd08ff6f489f205daf8effe160f437f67491ef897c23", "4a4f202484512526");
doTest384("d6154641d7d9df62f0cedc2bd64ee82412b3a80f6eace7c45f9703373379007eabf592d2d2116e093dc33dcbba4649e9", "1f66ab4185ed9b6375");
doTest384("2ee5df2591cfc4cb1e1d0bd8b28727f0fa5359a75f7819a92a3cb80ddb5708e4705177b981396b4818d11e3ca615ec93", "eed7422227613b6f53c9");
doTest384("786c3f73fb092be184fc2b19f5920f3d94f25d4523165ae82f9b39b2c724fd62dc9a3263091a239d5ef1ad562dd4fd26", "eaeed5cdffd89dece455f1");
doTest384("79188139ec2cad8d197d308b806cf383782c29a8c27ee29c5e31425b2dd18b2f5f491fbfb38d7078f58510125c064a0a", "5be43c90f22902e4fe8ed2d3");
doTest384("0c82b8c75c5d540e7d624928281fba8b8d0b1583d74f3f0ea4f200f1ce5475149c282e05db695dc67baf42deffdc3f55", "a746273228122f381c3b46e4f1");
doTest384("830d2325c001623edfea97ea1d0e65982d4ed7abb8e64ea61c85e9bc1882d11fc4153c30be63fc66f5fbce74bb394596", "3c5871cd619c69a63b540eb5a625");
doTest384("1dbe1bc60a9c6fbe10a727e2a6d397930d547ad2c390286948c3167ee77ff6e275ec8431c5ad4b4e4e5ae67a4bc88d05", "fa22874bcc068879e8ef11a69f0722");
doTest384("feee2ef332515284e0ba247c62f264199044d03877c58e54b51a62e39e91c27aaae384837eb9d479b4c0308cfc6b779b", "52a608ab21ccdd8a4457a57ede782176");

// Purposely chosen off-powers-of-2 to cover edge cases - 248, 520, 1040
// 1040 tests length > rate
doTest384("2ea596b446d5ccd8f0927a2e3790911e00f1f52cfbfc41f12290cbacd1c903c74deef840fd1398e12ee863acd92baebf", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");
doTest384("662c4851d311a786de4cda7e9ea1eff0bfa462761ff6cf804e591ed9a15b0dc93a2bb6a6cffdc8d7d23a233a52c86ead", "16e8b3d8f988e9bb04de9c96f2627811c973ce4a5296b4772ca3eefeb80a652bdf21f50df79f32db23f9f73d393b2d57d9a0297f7a2f2e79cfda39fa393df1ac00");
doTest384("3d6bba145d7e69dbbb0f099d47a1f2138d4a00f26b07c62cf38471f0fb9ca022c61f7a769013a9bd8d5d87d8e01d9b4d", "9334de60c997bda6086101a6314f64e4458f5ff9450c509df006e8c547983c651ca97879175aaba0c539e82d05c1e02c480975cbb30118121061b1ebac4f8d9a3781e2db6b18042e01ecf9017a64a0e57447ec7fcbe6a7f82585f7403ee2223d52d37b4bf426428613d6b4257980972a0acab508a7620c1cb28eb4e9d30fc41361ec");

// r=576, c=1024
// 0, 8, 16, 24, 32, 40... 128 bits
doTest512("a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26", "");
doTest512("3939fcc8b57b63612542da31a834e5dcc36e2ee0f652ac72e02624fa2e5adeecc7dd6bb3580224b4d6138706fc6e80597b528051230b00621cc2b22999eaa205", "cc");
doTest512("aa092865a40694d91754dbc767b5202c546e226877147a95cb8b4c8f8709fe8cd6905256b089da37896ea5ca19d2cd9ab94c7192fc39f7cd4d598975a3013c69", "41fb");
doTest512("cb20dcf54955f8091111688beccef48c1a2f0d0608c3a575163751f002db30f40f2f671834b22d208591cfaf1f5ecfe43c49863a53b3225bdfd7c6591ba7658b", "1f877c");
doTest512("d4b4bdfef56b821d36f4f70ab0d231b8d0c9134638fd54c46309d14fada92a2840186eed5415ad7cf3969bdfbf2daf8cca76abfe549be6578c6f4143617a4f1a", "c1ecfdfc");
doTest512("584219a84e8796076bf1178b14b9d1e2f96a4b4ef11f10cc516fbe1a29639d6ba74fb92815f9e3c5192ed4dca20aea5b109d52237c9956401fd44b221f82ab37", "21f134ac57");
doTest512("4345b92a2ab7eadb6a24ee1d175ac258ccf2f694ac09ec9d47399e4d96f61f30b322c5438c51bacd0d597d00471a41ed8e9c9f146bbc807e6bc385f850fbabfe", "c6f50bb74e29");
doTest512("50081c93bf73ecc54a5ffe43fc14f8baeedbe7da0302ac984c9e668389886bd064bab26ddcb616eb4e0e726042b19f3fd50bdd0d2c5b34892e00e6f399de254f", "119713cc83eeef");
doTest512("150d787d6eb49670c2a4ccd17e6cce7a04c1fe30fce03d1ef2501752d92ae04cb345fd42e51038c83b2b4f8fd438d1b4b55cc588c6b913132f1a658fb122cb52", "4a4f202484512526");
doTest512("a13c951c6c51f236a0197a29a8994b1c7294e17ba518ed1029d6f54ad739d8765920281bbb854d16fbb60e0385afd6e6e433e63aaa77e73b8bee7fde569d6875", "1f66ab4185ed9b6375");
doTest512("5a566fb181be53a4109275537d80e5fd0f314d68884529ca66b8b0e9f240a673b64b28fffe4c1ec4a5cef0f430229c5757ebd172b4b0b68a81d8c58a9e96e164", "eed7422227613b6f53c9");
doTest512("7c77e30ece98ef88964458683c5e0287b5896e166ccca71d2bfd8d8bbc6d6fe589a0225eb1d6aa7b220f1410c9a9ec0672ccddaa1732c3e2877fb5d232c2a428", "eaeed5cdffd89dece455f1");
doTest512("f5df5952924e933330bd5bd7627a62c3672f24a4991dadaf78816e023769c91d1910537f9c19fcde60fa6de927982dd5f5970f74e30f2b040f67348a3394c48c", "5be43c90f22902e4fe8ed2d3");
doTest512("80a1317ec534ed48d8a813e0bca0cee04f705a2f86352306a932edc548b9a8f1cf79f95027f43bdada8213449c54f68f4dd800b15c4abad87ad7a3b371a7c918", "a746273228122f381c3b46e4f1");
doTest512("54c274c3ddf26d824f5fdfcb349a600890057eb2e2022245cbb8bdc0d2240cfa8348f02191fabc0e10f9287185211c9f569132ee6dde4c396668b4bb50aefc3f", "3c5871cd619c69a63b540eb5a625");
doTest512("00767236a7352551b283a8ecf4c79274f8c4cea553ab43fc71cf22fb2f6865ad02c88bf0092f213057340c85a5318f62f4991c00c63cb0558cbcf13d6d84e73d", "fa22874bcc068879e8ef11a69f0722");
doTest512("001618372e75147af90c0cf16c3bbdaa069ddbc62483b392d028ded49f75084a5dfcc53aecd9f57ddbb73daa041fd71089d8fb5edf6cfaf6f1e4e25ad3de266c", "52a608ab21ccdd8a4457a57ede782176");

// Purposely chosen off-powers-of-2 to cover edge cases - 248, 520, 1040
// 1040 tests input length > rate
doTest512("dc29eb7130812a652af3ff9b77629684634502ea6667e7e9f80090ec2a9d690c8c9a78645fb04d9cd269e706ee2c96e74207fbbda559dc285c9bc52f15a256ca", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");
doTest512("b0e23d600ba4215f79d50047bbfed50df7d6e769514d796afd166deeca88bd1cbe0afc72a41e0317a223225b4f5882f723afcba3af7c457eb525946da6c53bb0", "16e8b3d8f988e9bb04de9c96f2627811c973ce4a5296b4772ca3eefeb80a652bdf21f50df79f32db23f9f73d393b2d57d9a0297f7a2f2e79cfda39fa393df1ac00");
doTest512("d38ef3b12eaa0bf62a75b6b63cff3c9ef171de1b75f5d02629365bcfe65ba7ddd30fcef7febb82f19f9bedcc1cc4c679b4292ea62c2a90a7562da9a1318fe278", "9334de60c997bda6086101a6314f64e4458f5ff9450c509df006e8c547983c651ca97879175aaba0c539e82d05c1e02c480975cbb30118121061b1ebac4f8d9a3781e2db6b18042e01ecf9017a64a0e57447ec7fcbe6a7f82585f7403ee2223d52d37b4bf426428613d6b4257980972a0acab508a7620c1cb28eb4e9d30fc41361ec");

// 0, 16, 64, 248 bits - 4096 bit output
// Also tests output length > rate
doTestShake128("7f9c2ba4e88f827d616045507605853ed73b8093f6efbc88eb1a6eacfa66ef263cb1eea988004b93103cfb0aeefd2a686e01fa4a58e8a3639ca8a1e3f9ae57e235b8cc873c23dc62b8d260169afa2f75ab916a58d974918835d25e6a435085b2badfd6dfaac359a5efbb7bcc4b59d538df9a04302e10c8bc1cbf1a0b3a5120ea17cda7cfad765f5623474d368ccca8af0007cd9f5e4c849f167a580b14aabdefaee7eef47cb0fca9767be1fda69419dfb927e9df07348b196691abaeb580b32def58538b8d23f87732ea63b02b4fa0f4873360e2841928cd60dd4cee8cc0d4c922a96188d032675c8ac850933c7aff1533b94c834adbb69c6115bad4692d8619f90b0cdf8a7b9c264029ac185b70b83f2801f2f4b3f70c593ea3aeeb613a7f1b1de33fd75081f592305f2e4526edc09631b10958f464d889f31ba010250fda7f1368ec2967fc84ef2ae9aff268e0b1700affc6820b523a3d917135f2dff2ee06bfe72b3124721d4a26c04e53a75e30e73a7a9c4a95d91c55d495e9f51dd0b5e9d83c6d5e8ce803aa62b8d654db53d09b8dcff273cdfeb573fad8bcd45578bec2e770d01efde86e721a3f7c6cce275dabe6e2143f1af18da7efddc4c7b70b5e345db93cc936bea323491ccb38a388f546a9ff00dd4e1300b9b2153d2041d205b443e41b45a653f2a5c4492c1add544512dda2529833462b71a41a45be97290b6f", "");
doTestShake128("09c9652bb968996a35e4814e27587131f53fd01ab9fe83758aceb8134fceca24c84f592cee43a4476e8853fcab7dafef7b60ecfebfd70dfcf587b3af358a286fe3713bf4735a84975bb65e3586c81ea716bfb999626dc973a495a6e0024061387d628e9e59dfd2b39c68c8cead665ab43f6d2625a10630761dfb60276ea97b280442462246c6d74a1960a8419a76a37b68449a9e427d6a7ec1fbdf4760847ad6f6f5a08cefb767caeb6c2382f4f3d0e49de4428cd4240635c9136911a82ff0b9c74569a1b7c8af72ab1ea5f2f6f6a45e3bb08229addfa916b18a74f7939c5130152ac8343a10694154fdc6e1570ec7ecabbb01eddc92ef0bb1b3db914c74cce399acc9b766fd7494b2ef27ac57b80d52535942d55e2dbfaa61cdf3f48759aa612ded11421855ad15ffab91462a56f873bbaf4fe88457a47b6c0594818d0a9189895239c1429ed8754eee5498f4d0fb6c9d0df0eb5316289e72c6aaeb8c61317b409156d4221ce6cfc7c5f39272d87c2d884f88f1b8b3c05ca9e235ed92c7dd7806cdada7166cc1b9107da5e6536d4ff111bf9199d6b72ac17d874323d68d76aec4650f1a4b067c50215362201a7f71116bf6633af08d712804b83f08a5dc7ccd4315963106d50453d44eff59c9c652f4a924be93c0b958ea286b0a4b597899a28c9bd5419c042668aa7b0cfcac4cdf9260f2824abf3ee79fef53ebe3c36df831", "41fb");
doTestShake128("977735a853d872ff7c17c4a825afd9df886ac43387df245c37a608ac7f4e0ed015811167222000aee1968960174ee5a39369a23c5dffb4991ad247b8801de71bea97069ea77202999f8e8cf3829816ee598b00c4049265dfbb2b138b13ec3194b988242bc099248baf9997aed80e95b5f859d42b12dbd578fdeae47ccc2f8d3e90bf6e8d98afbe2f4813f68b6fbc4c18c9b8a557a0d87d744a4238d89260941030945538b2df07e05fd45b50bd790a0510ed4430adb3b7768df8c4914e0914fb00da09331f11371052d301031853c7f3c32528c0622a77c48463cd1cd96ecf7490f70f16e941cbfade71dd8477ecff1177b7193e456ecc42befbe070667d6f39abee5cba354b33a83602c1c17280d2dbd0ce597ecf1fec3b27810df38c2805d8b85d60994edd2c83f5898cc6623241f16c4c92444fb6a0714d8bf189aa5aec9d5bf1448805764ea0ccc8b6e399961dfa7cb9d8de8d800080eeb5d010bcacac6728e8de482c37270459dcbc80f496267377d97817149372a053b2d53209c2dd61216cc3aad29c7238d6b142d71a92ceee4710476c2a48fadb683b9423727ce772fce2bdbcf781c119fb43526b8eaaf1d10f21e586952227e29bae61fa2c7edc6260f76ab543244e538180cd90c207330ef29cea987f7acdfa028a78d3e93f11ea159b21bf3f50faeb7961874e816162d42735c9d3567afa45d1d8b66cefb58678", "4a4f202484512526");
doTestShake128("e22ac7fe9db19147b2dbd586d6c5837a5dd3df2346ea61dac753b0371274dc110612ae3db350eafeeb89bb1179eb9d84a0590b243d0dd9baa00796030d2782f0163e85328a0aa06974a7321e66649281db8c506400310ab3e21243f4c2cc5cd8b36ac7c35c235305e6b1585b33784897d82a2d31f664d963ada323a9c922a61d9aa5bef0b90c6b7183f1fd0ed4128b2fe0e12eb6b461176c52aebfd608c00c7d79799071ab30da33ca9aa26932aeee0d585905bbc853e80aa746706faf7be50c90c1fbc18e290505277e9bb9bfa9c767e952a68c4f93a044f62e066e61a0ad301bbfb921c818690bf6d116c6cbe7df174a7e57e22294303820494757b3254ac40404a7f4a6d1f9624e5cf3a770392b2df9fd1ffef01ac9afdc74442c0eb6f11e1eabc59270b4da6f2d6356e79607d6462c08a6f29154bcadf4ffd6e20ecb700e188e523b3930e35c8990afad2141ff71912adb07dc00d5bb78d7fc5590467815ba9f46ce4f5cad34910a574687d8f7fac2f60b34d4c3ba6d25d3e5118b851bcb73c1b1004a623f8ddc8a0d07ad21b45f543ca8e705b3864d1c4fe024a19ed5fb0542dba0c39fe0a82d83266d9c124e61ddb107d8e0ab57c970cfe5879daaa7170022408f7a9a228196c5c7ac614cb98cc276d1f5ecd79347a41d97360a19e65681a5b75e78c7f79addcd401da6de7ded3b1dff1f746806ae03f496ca701c8448", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");

// 0, 16, 64, 248 bits - 4096 bit output
// Also tests output length > rate
doTestShake256("46b9dd2b0ba88d13233b3feb743eeb243fcd52ea62b81b82b50c27646ed5762fd75dc4ddd8c0f200cb05019d67b592f6fc821c49479ab48640292eacb3b7c4be141e96616fb13957692cc7edd0b45ae3dc07223c8e92937bef84bc0eab862853349ec75546f58fb7c2775c38462c5010d846c185c15111e595522a6bcd16cf86f3d122109e3b1fdd943b6aec468a2d621a7c06c6a957c62b54dafc3be87567d677231395f6147293b68ceab7a9e0c58d864e8efde4e1b9a46cbe854713672f5caaae314ed9083dab4b099f8e300f01b8650f1f4b1d8fcf3f3cb53fb8e9eb2ea203bdc970f50ae55428a91f7f53ac266b28419c3778a15fd248d339ede785fb7f5a1aaa96d313eacc890936c173cdcd0fab882c45755feb3aed96d477ff96390bf9a66d1368b208e21f7c10d04a3dbd4e360633e5db4b602601c14cea737db3dcf722632cc77851cbdde2aaf0a33a07b373445df490cc8fc1e4160ff118378f11f0477de055a81a9eda57a4a2cfb0c83929d310912f729ec6cfa36c6ac6a75837143045d791cc85eff5b21932f23861bcf23a52b5da67eaf7baae0f5fb1369db78f3ac45f8c4ac5671d85735cdddb09d2b1e34a1fc066ff4a162cb263d6541274ae2fcc865f618abe27c124cd8b074ccd516301b91875824d09958f341ef274bdab0bae316339894304e35877b0c28a9b1fd166c796b9cc258a064a8f57e27f2a", "");
doTestShake256("b64ecacd5f7499acc085c908d35dcc1fc0131816f28d360592e1265079f92a5f844c4bf6aa50d98d52720797e8c992f43c76a73fd95f9bc4cd272157842ada2518190fca342dc20d0c57cddf01b3ddf77977eded63445e40be82df8d26db629a2d307ee9fe28d2fe557e3971858c6d67c42be2cf44dd7570521ce06474467425b7aaae39db90945bad388009ed5715c684bb4e4981eea324ecf66584ad08d9f27c6a4dcf615591857bc7364e8a7c136661ae5ffe828c734dd5ea5a071276e8477b8525e02b7b445d91cc6e37d58740dc2b069be6d92e7df95c1ab52b76f7761ae34328962eac7156e460b3c04ffecaec8722a56e7373285e42d4cac5498f8d7dd5ecda9f9973a32f8d425171e1390bfc812c9ee4d4ab8fa9a0d93aa90a4c258fc64d77bbcf49977e87c3810c80c4585168996a31f446f9391a193b888cd321e22e9368f4f11495fe124141c04015532345d7cb0a13a4dd9007d737b3a176a88e5fc153d4ac2e8cd641c40c4261bba70e1b87114030ff67cb22acec90ac288d6b59d25b00038468b4780254fac4ef158ec2cd52c0ab9217eed1ed0a5e7b4c4b3a64b1824e2b27aa53398765d5352bd1ed0e9c7b3fb264d141741659f7d8fd0eeec9f9163c42afdb540d5f2c87833880a0c942ae4ccea7fff2f4c798b8aaf24c33be8054a09459a3af7200d555334241709a18ecf88ce93c99234d6ab0285916ae", "41fb");
doTestShake256("8a804fc3a4fee6cef6808c756a17bcdf6b235808493fc78e79701e59a9e9a67d60f0f256aa69dc0258a2510f9936aee2bcbd0f679696f439f37bf9afb170d44a58dbcf71eff14cec1e624d3d8f1ddddd3e33421b1e305c794c2c88fcadf9d7c51f52e4352bf9c9c895aa457f5449e82fb36e2a64d1aa69771ef3d675f09030a95653837ab2237daa7fcec36651355b2507713cc6a2186e950de82dc699122644193f8f231c607ba7f3bdd0a214b4ec0155d30517f681fdc2a89d3143040be0e0b6dc7e5185c723464ccaa2fe321af3b4174283355fe3d1ced518e00b6063ddd607b166ba388978294244ea8ec773a528003a04914b76e9be3337d806ca20c584b2bb66afcd144417e3d93243f185d26dba90ea39259c7f23b8a6427aa8a7622f277605f4a463f78a0c189c8de2c553ae20773d7cb4f7e26a13f4204b3752d9ceddf29849798479a4bd0d7ce4d22cc51f88127435bd161f026b1811a723e786db1dc01f921fe076c3532fa969ef1f8993e0a4fb6c17597d8db38dd7af259e322751cc0a1cca2ee4940f4ea56ce9179941cf4696256cd04ab853266d12e7e679377d54e2c2f24832974c573192dd2fdd4da5efd72114109248b03f0ae03123252ffff977bde87af8d8022c4c51da68efb87abeeda7a72eb4d0d1a2eb65ea4cebc7ccabf3787b9be98e14e4a273635f69e3e4ba557a1a42d1bf69ebd359b895320a", "4a4f202484512526");
doTestShake256("b3dc434bad278ece68c6dfbac1416bf47fb37645ac6e6b7e4dfd79e4605ee32b9795ed18683fcb56f910e223704ff1200f015eafb2ee06181e9eab1ba17bc5d84bc22a2d5c134991c906a71d8b20f6ecd6bbc27fe715edabdcf1c4e1a374b15ab4d76ea6ac580904bc66010cd8352caf365da80094f461070cffa34a86df705b87cc277d80196c86c602326e8e3aace1be7f0136c0988faa11a2ff91ae941799ec4de96e9f167e4088c822bbacc46dfa327df7210c9b31a9f7306ae753152a86f9e0ecb03fdeb7415c9adba6d61fca7f4d3c776ee6fbe6901860292fcc6cb89fb45a68f6165e36885dd40671ee372283591bc90c2b4a542282b13bee71ebba4e12797df59fe47649a27af116da9f41e0f0b6b962f7260dfa2f569a97bf47405a4ec4a6463680e3903cc7c3ca2f39e9366fceca8031da89e447b37f3b80769fdc0449291faf1bb8f9ceced3c175062dae783f51637581e913104c7042bc328e1f2571caa5572e75ee3f5a0f559b50191f3ecbc1ffc039bd3dba90f7007aaded690ff35d8d84fd0a9d427b2171072f1ed51a8ea9aa8a066fef6b88915265d80ca283eab1056b6bca093d60bfe288e3b9029e5aa395c9f3e3913d4b22bada270a282ff83c963e97f1f7543aa92b5f419973671ee03a79d1392c40ee57265fdaf75977c9f0e98c2ceddd7f7c52b4122a4e517280c9547df99ffb30692ed39929fa16", "84fb51b517df6c5accb5d022f8f28da09b10232d42320ffc32dbecc3835b29");
