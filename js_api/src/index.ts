import basic from "./service/basic";
import nomination from "./service/nomination";

function send(path: string, data: any) {
  console.log(JSON.stringify({ path, data }));
}
send("log", "main js loaded");
(<any>window).send = send;

(<any>window).basic = basic;
(<any>window).nomination = nomination;
