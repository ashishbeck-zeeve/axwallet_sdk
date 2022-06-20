import basic from "./service/basic";
import nomination from "./service/nomination";
import seedPhrase from "./service/seedPhrase";
import {
  avalanche,
  xChain,
  pChain,
  cChain,
} from "./constants/networkSpect";

function send(path: string, data: any) {
  console.log(JSON.stringify({ path, data }));
}
send("log", "main js loaded");
(<any>window).send = send;

(<any>window).basic = basic;
(<any>window).nomination = nomination;
(<any>window).seedPhrase = seedPhrase;
(<any>window).avalanche = avalanche;

