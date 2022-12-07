// I commented out the multithreading becasue it was
// totally not needed for this, I will explain further
// during the technical interview.

import { readdir, readFile } from "fs";
import { CommentAnalyzer } from "./classes/CommentAnalyzer";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
// import { isMainThread , Worker } from "worker_threads";

if (dotenv.config({ path: __dirname + "/.env" }).error)
  throw ".env config failed";

// const worker = new Worker("./worker.js");
// const threadedTotalResults = new Map<string, bigint>();

//Listen for a message from worker
// worker.on("message", result => {
// 	addReportResults(result.result, threadedTotalResults);
// });

// worker.on("error", error => {
// 	console.error(error);
// });

const asyncTotalResults = new Map<string, bigint>();

function addReportResults(
  source: Map<string, bigint>,
  target: Map<string, bigint>
): void {
  source.forEach((value, key): void => {
    target.set(key, value);
  });
}

function createReport(
  pathToDocs: string,
  commentAnalyzer: CommentAnalyzer
): void {
  readdir(pathToDocs, async (error, files): Promise<void> => {
    if (error) {
      console.error(error);
    } else {
      files.forEach((fileName, index): void => {
        if (fileName.endsWith(process.env.FILE_EXTENSION!)) {
          // if(isMainThread) {
          // eslint-disable-next-line max-len
          // 	worker.postMessage({path:pathToDocs + fileName, options: { encoding: "utf8" }, commentAnalyzer:new CommentAnalyzer(new Map<string, bigint>()) });
          // }
          readFile(
            pathToDocs + fileName,
            { encoding: "utf8" },
            async (error, data): Promise<void> => {
              if (error) {
                console.error(error);
              }{
                await addReportResults(
                  commentAnalyzer.analyze(data),
                  asyncTotalResults
                );
                if (index === files.length - 1) {
                  printTotalResults(asyncTotalResults);
                }
              }
            }
          );
        }
      });
    }
  });
}

function printTotalResults(totalResults: Map<string, bigint>): void {
  console.log("RESULTS\n=======");
  totalResults.forEach((value, key) => console.log(key + " : " + value));
}

createReport(
  process.env.PWD! + process.env.DOCS_PATH!,
  new CommentAnalyzer(new Map<string, bigint>())
);
