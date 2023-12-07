# 🛡️ crypto-shield

**crypto-shield: Secure and Efficient Encryption and Decryption Library for Node.js**

crypto-shield is a powerful and efficient Node.js library designed for seamless encryption and decryption using a variety of algorithms. Leveraging Node.js's built-in crypto module, this library empowers users with fine-grained control over their encryption processes, ensuring both security and flexibility.

## Table of Contents

- [🛡️ crypto-shield](#️-crypto-shield)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Initialization](#initialization)
    - [Setting the Secret Key](#setting-the-secret-key)
    - [Encrypting and Decrypting Text](#encrypting-and-decrypting-text)
    - [File Encryption and Decryption](#file-encryption-and-decryption)
- [API Documentation](#api-documentation)
  - [Class: CryptoShield](#class-cryptoshield)
    - [new CryptoShield(options)](#new-cryptoshieldoptions)
      - [Parameters](#parameters)
    - [EncryptDecryptOptions](#encryptdecryptoptions)
      - [Properties](#properties)
    - [Usage](#usage-1)
    - [setSecretKey(secret: string): void](#setsecretkeysecret-string-void)
      - [Parameters](#parameters-1)
    - [encryptText(text: string, secret?: string): Promise\<`string`\>](#encrypttexttext-string-secret-string-promisestring)
      - [Parameters](#parameters-2)
    - [decryptText(encryptedText: string, secret?: string): Promise\<`string`\>](#decrypttextencryptedtext-string-secret-string-promisestring)
        - [Parameters](#parameters-3)
    - [encryptFile(inputFilePath: string, outputFilePath?: string, secret?: string): Promise\<`boolean`\>](#encryptfileinputfilepath-string-outputfilepath-string-secret-string-promiseboolean)
      - [Parameters](#parameters-4)
    - [decryptFile(inputFilePath: string, outputFilePath?: string, secret?: string): Promise\<`boolean`\>](#decryptfileinputfilepath-string-outputfilepath-string-secret-string-promiseboolean)
      - [Parameters](#parameters-5)
  - [License](#license)

## Features

- 🚀 Encrypt and decrypt text effortlessly.
- 📁 Encrypt and decrypt files securely.
- 🔐 Supports a diverse set of encryption algorithms for enhanced security.
- 🛠️ Customizable encryption options, allowing fine-tuning for specific use cases.
- 🔑 Utilizes PBKDF2 for robust key derivation.
- 🎯 Streamlined API for seamless integration into Node.js applications.
- 🌐 Versatile support for both CommonJS (CJS) and ECMAScript Modules (ESM).
- ⚡ Optimized performance ensures swift cryptographic operations.
- 🛡️ Robust error handling for a reliable encryption and decryption experience.
- 🤝 Well-documented and beginner-friendly, fostering ease of use.
- 🌈 Compatible with a variety of Node.js projects, enhancing flexibility.
- 🔄 Supports both asynchronous (async/await) and synchronous (Promise) programming paradigms.
- 📦 Lightweight and dependency-free, keeping your project dependencies in check.
- 🌐 Cross-platform compatibility for versatile deployment options.
- 🛑 Thoroughly tested to ensure reliability and stability in diverse scenarios.

crypto-shield provides an extensive feature set to meet your encryption and decryption needs while offering simplicity, security, and flexibility in your Node.js projects.

## Installation

Install the package using npm:

```bash
npm install crypto-shield
```

Install the package using yarn:

```bash
yarn add crypto-shield
```

Install the package using bun:

```bash
bun add crypto-shield
```

## Usage

### Initialization

```javascript
// CommonJS
const CryptoShield = require("crypto-shield");
const encryptor = new CryptoShield();

// ESM
import CryptoShield from "crypto-shield";
const encryptor = new CryptoShield();
```

### Setting the Secret Key

```javascript
const secretKey = "my-secret-key";

// Set the key while initialize
const encryptor = new CryptoShield({ secretKey });

// OR

// Add secretKey after initialize it.
const encryptor = new CryptoShield();
encryptor.setSecretKey(secretKey);
```

### Encrypting and Decrypting Text

```javascript
const plaintext = "Hello, world!";

// Async/Await
(async () => {
  try {
    const encryptedText = await encryptor.encryptText(plaintext);
    console.log("Encrypted Text:", encryptedText); // 3992b5bf64591ebbe93708ffb2dc00e8a481b93d4c2c1b752509525b05a4f24316a9d3e82556e61e79c6c129db31b62cf57a910a3c3b1d0d64ab0dc41a4eaa5ce948442365d2ce0280

    const decryptedText = await encryptor.decryptText(encryptedText);
    console.log("Decrypted Text:", decryptedText); // Hello, world!
  } catch (error) {
    console.error("Error:", error);
  }
})();

// Promises
encryptor
  .encryptText(plaintext)
  .then((encryptedText) => {
    console.log("Encrypted Text:", encryptedText);

    return encryptor.decryptText(encryptedText);
  })
  .then((decryptedText) => {
    console.log("Decrypted Text:", decryptedText);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### File Encryption and Decryption

```javascript
const inputFile = "input.txt";
const outputFile = "output.txt";
const secretKey = "my-secret-key";

encryptor.setSecretKey(secretKey);

// Async/Await
(async () => {
  try {
    await encryptor.encryptFile(inputFile, outputFile);
    console.log("File encrypted successfully");

    await encryptor.decryptFile(outputFile);
    console.log("File decrypted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
})();

// Promises
encryptor
  .encryptFile(inputFile, outputFile)
  .then(() => console.log("File encrypted successfully"))
  .then(() => encryptor.decryptFile(outputFile))
  .then(() => console.log("File decrypted successfully"))
  .catch((error) => console.error("Error:", error));
```

# API Documentation

## Class: CryptoShield

### new CryptoShield(options)

Creates an instance of the CryptoShield class.

#### Parameters

- `options` (optional): `EncryptDecryptOptions` - An object with configuration options.

### EncryptDecryptOptions

The `EncryptDecryptOptions` interface defines the configuration options available when initializing an instance of the `CryptoShield` class.

#### Properties

- `algorithm` (optional): Specifies the encryption algorithm to be used. Choose from the supported algorithms defined in `EncryptionAlgorithm`. Default is `"aes-256-gcm"`.
- `iterations` (optional): The number of iterations for the key derivation function (PBKDF2). Default is `5000`.

- `keyLength` (optional): The length of the encryption key. Choose from the common key lengths defined in `KeyLength`. Default is `32`.

- `ivLength` (optional): The length of the initialization vector (IV) used in the encryption process. Default is `12`.

- `tagLength` (optional): The length of the authentication tag used in some encryption algorithms. Choose from `AuthTagLength`. Default is `16`.

- `salt` (optional): The length of the salt used in the key derivation process. Default is `32`.

- `encoding` (optional): The encoding to be used for text representation. Default is `"hex"`.

- `decoding` (optional): The encoding to be used for text decoding. Default is `"utf8"`.

- `secretKey` (optional): The secret key used for encryption and decryption. If not provided, it can be set later using the `setSecretKey` method.

- `pbkdf2Algorithm` (optional): The hash algorithm used in the key derivation process (PBKDF2). Choose from the supported algorithms defined in `Pbkdf2Algorithm`. Default is `"sha512"`.

### Usage

```typescript
import CryptoShield, { EncryptDecryptOptions } from "crypto-shield";

// Example options
const options: EncryptDecryptOptions = {
  algorithm: "aes-128-gcm",
  iterations: 10000,
  keyLength: 16,
  ivLength: 16,
  tagLength: 8,
  salt: 64,
  encoding: "base64",
  decoding: "utf-8",
  secretKey: "my-secret-key",
  pbkdf2Algorithm: "sha256",
};

// Initialize CryptoShield with options
const encryptor = new CryptoShield(options);

// Use encryptor instance with the provided options
```

### setSecretKey(secret: string): void

Set the secret key for encryption and decryption.

#### Parameters

- `secret` (string): The secret key.

### encryptText(text: string, secret?: string): Promise<`string`>

Encrypts the given text.

#### Parameters

- `text` (string): The text to encrypt.
- `secret` (optional, string): The secret key.

### decryptText(encryptedText: string, secret?: string): Promise<`string`>

Decrypts the given encrypted text.

##### Parameters

- `encryptedText` (string): The text to decrypt.
- `secret` (optional, string): The secret key.

### encryptFile(inputFilePath: string, outputFilePath?: string, secret?: string): Promise<`boolean`>

Encrypts a file.

#### Parameters

- `inputFilePath` (string): The path to the input file.
- `outputFilePath` (optional, string): The path to the output file. If not provided, the input file will be overwritten.
- `secret` (optional, string): The secret key.

### decryptFile(inputFilePath: string, outputFilePath?: string, secret?: string): Promise<`boolean`>

Decrypts a file.

#### Parameters

- `inputFilePath` (string): The path to the input file.
- `outputFilePath` (optional, string): The path to the output file. If not provided, the input file will be overwritten.
- `secret` (optional, string): The secret key.

## License

This project is licensed under the [MIT License](LICENSE).
