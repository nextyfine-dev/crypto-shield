import crypto from "node:crypto";
import fs from "node:fs/promises";
import { promisify } from "node:util";

export type AuthTagLength = 4 | 6 | 8 | 10 | 12 | 14 | 16;

export type CipherOptions =
  | crypto.CipherCCMOptions
  | crypto.CipherGCMOptions
  | crypto.CipherOCBOptions;

export type EncryptionAlgorithm =
  | crypto.CipherCCMTypes
  | crypto.CipherGCMTypes
  | crypto.CipherOCBTypes;

export type Pbkdf2Algorithm =
  | "sha512"
  | "sha256"
  | "sha3-256"
  | "sha1"
  | "sha3-512"
  | "md5";

/**
 * * KeyLength that includes common key lengths used in various encryption algorithms
 *
 * `16` used for:
 *   - aes-128-ccm
 *   - aes-128-gcm
 *   - aes-128-ocb
 *   - aes-192-ccm
 *   - aes-192-gcm
 *   - aes-192-ocb
 *
 * `24` used for:
 *   - aes-256-ccm
 *   - aes-256-ocb
 *
 * `32` used for:
 *   - aes-256-ccm
 *   - aes-256-gcm
 *   - aes-256-ocb
 *  - chacha20-poly1305
 */
export type KeyLength = 8 | 16 | 24 | 32;

export interface EncryptDecryptOptions {
  algorithm?: EncryptionAlgorithm;
  iterations?: number;
  keyLength?: KeyLength;
  ivLength?: number;
  tagLength?: AuthTagLength;
  salt?: number;
  encoding?: BufferEncoding;
  secretKey?: string | null;
  decoding?: BufferEncoding;
  pbkdf2Algorithm?: Pbkdf2Algorithm;
}

class CryptoShield {
  private algorithm: EncryptionAlgorithm;
  private iterations: number;
  private keyLength: number;
  private ivLength: number;
  private tagLength: AuthTagLength;
  private salt: number;
  private encoding: BufferEncoding;
  private secretKey?: string | null;
  private cipherOption: CipherOptions;
  private decoding: BufferEncoding;
  private pbkdf2Algorithm: Pbkdf2Algorithm;

  constructor(options: EncryptDecryptOptions = {}) {
    const {
      algorithm = "aes-256-gcm",
      iterations = 5000,
      keyLength = 32,
      ivLength = 12,
      salt = 32,
      encoding = "hex",
      secretKey = null,
      tagLength = 16,
      decoding = "utf8",
      pbkdf2Algorithm = "sha512",
    } = options;

    this.algorithm = algorithm;
    this.iterations = iterations;
    this.keyLength = keyLength;
    this.ivLength = ivLength;
    this.tagLength = tagLength;
    this.encoding = encoding;
    this.salt = salt;
    this.secretKey = secretKey?.trim();
    this.cipherOption = { authTagLength: tagLength };
    this.decoding = decoding;
    this.pbkdf2Algorithm = pbkdf2Algorithm;
  }

  public setSecretKey(secret: string | number | object) {
    let newSecretKey = secret;
    if (typeof secret === "number") newSecretKey = secret.toString();
    else if (typeof secret === "object") newSecretKey = JSON.stringify(secret);

    if (typeof newSecretKey !== "string" || newSecretKey.trim() === "") {
      throw new Error("Invalid secret key");
    }
    this.secretKey = newSecretKey.trim();
  }

  private async deriveKey(salt: Buffer, key?: string) {
    const secret = key ?? this.secretKey;
    if (!secret) throw new Error("Secret key is required!");
    const pbkdf2 = promisify(crypto.pbkdf2);
    return pbkdf2(
      secret,
      salt,
      this.iterations,
      this.keyLength,
      this.pbkdf2Algorithm
    );
  }

  private async getDecryptedData(buffer: Buffer, secret?: string) {
    const ivPosition = this.salt + this.ivLength;
    const tagPosition = ivPosition + this.tagLength;

    const salt = buffer.subarray(0, this.salt);
    const iv = buffer.subarray(this.salt, ivPosition);
    const tag = buffer.subarray(ivPosition, tagPosition);
    const encrypted = buffer.subarray(tagPosition);

    const key = await this.deriveKey(salt, secret);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      iv,
      this.cipherOption
    );

    // @ts-ignore
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted;
  }

  private async getEncryptedData(data: string | Buffer, secret?: string) {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.salt);
    const key = await this.deriveKey(salt, secret);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      key,
      iv,
      this.cipherOption
    );
    const updated =
      typeof data === "string"
        ? cipher.update(String(data), "utf8")
        : cipher.update(data);
    const encrypted = Buffer.concat([updated, cipher.final()]);
    // @ts-ignore
    const tag: Buffer = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]);
  }

  public async encryptText(text: string, secret?: string): Promise<string> {
    try {
      const data = await this.getEncryptedData(text, secret);
      return data.toString(this.encoding);
    } catch (error) {
      throw new Error(`Text encryption failed! ${error}`);
    }
  }

  public async decryptText(
    encryptedText: string,
    secret?: string
  ): Promise<string> {
    try {
      const encryptedBuffer = Buffer.from(String(encryptedText), this.encoding);
      const data = await this.getDecryptedData(encryptedBuffer, secret);
      return data.toString(this.decoding);
    } catch (error) {
      throw new Error(`Text decryption failed! ${error}`);
    }
  }

  public async encryptFile(
    inputFilePath: string,
    outputFilePath: string | null = null,
    secret?: string
  ) {
    try {
      const fileData = await fs.readFile(inputFilePath);
      const encrypted = await this.getEncryptedData(fileData, secret);

      const outPath = outputFilePath ?? inputFilePath;
      await fs.writeFile(outPath, encrypted);

      return true;
    } catch (error) {
      throw new Error(`File encryption failed! ${error}`);
    }
  }

  public async decryptFile(
    inputFilePath: string,
    outputFilePath: string | null = null,
    secret?: string
  ) {
    try {
      const encryptedBuffer = await fs.readFile(inputFilePath);
      const decrypted = await this.getDecryptedData(encryptedBuffer, secret);
      const outPath = outputFilePath ?? inputFilePath;
      await fs.writeFile(outPath, decrypted);
      return true;
    } catch (error) {
      throw new Error(`File decryption failed! ${error}`);
    }
  }
}

export default CryptoShield;
