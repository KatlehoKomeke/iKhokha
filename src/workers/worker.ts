import { parentPort } from "worker_threads";
import { readFileSync } from "fs";
import { CommentAnalyzer } from "../classes/CommentAnalyzer";

type incomingData = {
  path: string;
  options: BufferEncoding;
  commentAnalyzer: CommentAnalyzer;
};

parentPort?.on("message", (data: incomingData) => {
  parentPort?.postMessage({ result: reportForSingleFile(data) });
});

function reportForSingleFile(data: incomingData): Map<string, bigint> {
  const fileContent = readFileSync(data.path, data.options);
  return data.commentAnalyzer.analyze(fileContent);
}
