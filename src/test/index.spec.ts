import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import CryptoShield from "../index.js";

const filePath = path.join(dirname(fileURLToPath(import.meta.url)), "text.txt");

const encDec = new CryptoShield({ secretKey: "1234" });
const text = "Hello, world!";

describe("Node Encryption Decryption Test Cases:-", () => {
  it("Should encrypt the text and write the data", async () => {
    const encData = await encDec.encryptText(text);
    await fs.writeFile(filePath, encData);
    assert.equal(typeof encData, "string");
  });

  it("Should read the data from file and decrypt the text and write the data again", async () => {
    const data = await fs.readFile(filePath);
    const decData = await encDec.decryptText(data.toString());
    await fs.writeFile(filePath, decData);
    assert.equal(decData, text);
  });

  it("Should encrypt the file", async () => {
    const hasEncrypted = await encDec.encryptFile(filePath);
    assert.equal(hasEncrypted, true);
  });

  it("Should decrypt the file", async () => {
    const hasDecrypted = await encDec.decryptFile(filePath);
    assert.equal(hasDecrypted, true);
  });

  it("Should delete the file", async () => {
    await fs.unlink(filePath);
  });
});
