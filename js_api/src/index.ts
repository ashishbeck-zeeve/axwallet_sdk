import basic from "./service/basic";
import nomination from "./service/nomination";
import transfer from "./service/transfer";

function send(path: string, data: any) {
  console.log(JSON.stringify({ path, data }));
}
send("log", "main js loaded");
(<any>window).send = send;

(<any>window).basic = basic;
(<any>window).nomination = nomination;
(<any>window).transfer = transfer;

// initialize the network and wallet
// basic.init("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk")