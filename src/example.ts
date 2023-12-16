// import { dirname, join, resolve } from "node:path";
// import fs from "node:fs";
// import fsPromise from "node:fs/promises";
// import { fileURLToPath } from "node:url";

// import Cs from "./index.js";
// import { Transform, TransformCallback } from "node:stream";

// const cs = new Cs({ secretKey: "1234" });

// // const __path = (dir: string, url = import.meta.url) =>
//   join(dirname(fileURLToPath(url)), dir);

// const filePath = __path("test.mkv");
// const filePath1 = __path("test1.mkv");
// const filePath2 = __path("test2.mkv");

// const chunkSizeInMB = 10;
// const chunkSize = chunkSizeInMB * 1024 * 1024; // Convert MB to bytes

// const readStream = fs.createReadStream(filePath1, { highWaterMark: chunkSize });
// const writeStream = fs.createWriteStream(filePath2, {
//   highWaterMark: chunkSize,
// });

// // class ModifyDataTransform extends Transform {
// //   _transform(chunk: Buffer, _: BufferEncoding, callback: TransformCallback) {
// //     // console.log("chunk", chunk);
// //     const enc = cs.getDecryptedData(chunk);
// //     // console.log("enc", enc);
// //     this.push(enc);
// //     callback();
// //   }
// // }

// // const modifyDataTransform = new ModifyDataTransform();

// // let temp = 0;

// // function readDataInChunks() {
// //   temp = temp + 1000;
// //   let len = readStream.readableLength;

// //   console.log("temp", temp);
// //   console.log("len", len);
// //   while (len > 0) {
// //     if (len < temp) {
// //       temp = len;
// //     }
// //     const chunk = readStream.read(temp);
// //     modifyDataTransform.write(chunk);
// //     len = len - temp;
// //   }
// // }

// // readStream.on("readable", readDataInChunks);

// // modifyDataTransform.pipe(writeStream);

// // readStream.pipe(modifyDataTransform).pipe(writeStream);

// // readStream.on("close", () => {
// //   writeStream.end(() => {
// //     console.log("Done");
// //   });
// // });

// // readStream.on("error", (error) => {
// //   console.error("Error:", error.message);
// // });

// // writeStream.on("finish", () => {
// //   console.log("Write stream finished");
// // });

// // writeStream.on("error", (error) => {
// //   console.error("Write stream error:", error.message);
// // });

// writeStream.on("close", () => {
//   console.log("Write stream closed");
// });
