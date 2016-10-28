CryptoPunk
==========

Supported
---------

### Classical Ciphers

* Affine
* Bifid
* Column transposition
* ROT-X / Caesar (with specific support for ROT-5, ROT-18, ROT-47)
* Skip
* Simple substitution
* Vigenère

### Mechanical Ciphers

* Enigma

### Modern Ciphers

* Blowfish
* DES (64 bit with parity or 56 bit without)
* Rijndael (128, 160, 192, 224, 256 key *and* block sizes, variable rounds)
* RC4 (with discard parameter)
* Simple XOR against key
* Browser-native AES, RSA (crypto.subtle)

### Hashes

* BLAKE (224, 256, 384, 512)
* BLAKE2 (BLAKE2s)
* HAVAL (128, 160, 192, 224, 256, 3-5 passes)
* Keccak (variable capacity, hash length, suffix)
* MD2
* MD4
* MD5
* RIPEMD (original)
* RIPEMD (128, 160, 256, 320)
* SHA-0
* SHA-1
* SHA-2 (128, 192, 256, 512)
* SHA-3 (128, 192, 256, 512)
* SHAKE (128, 256)
* WHIRLPOOL (0, T, final)

### Checksums
* ADLER-32
* BSD
* CRC (multiple variants)
* Fletcher (16, 32, 64)

### Byte <-> Text conversions

* ASCII
* Code pages (ISO-8859, MacOS Roman, Windows 1252...)
* UCS-2
* UTF-8
* UTF-16
* Binary (numbers and bytestreams)
* Octal (numbers and bytestreams)
* Decimal (numbers and bytestreams)
* Hexadecimal (numbers and bytestreams)
* Base32
* Base32-HEX
* Base64 (+ URL safe)


TODO
----
### Modern Ciphers

* ARIA
* Camellia
* CAST-128
* 3DES
* GOST (Magma) (GOST 28147-89, GOST R 34.12-2015)
* IDEA
* RC2, RC5, RC6
* SEED
* Serpent
* Skipjack
* TEA, XTEA
* Twofish
* Threefish
* Browser-native RSA decryption

### Hashes

* BLAKE2b
* Blue Midnight Wish (BMW)
* CubeHash
* FSB
* Fugue
* Grøstl
* JH
* MD6
* PANAMA
* RadioGatún
* Skein
* Snefru
* Spectral Hash
* SWIFFT
* Tiger / Tiger2