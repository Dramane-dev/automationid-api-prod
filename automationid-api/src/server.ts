import Main from "./classes/Main.class";
import express, { Express } from "express";

const router: Express = express();
export const main = new Main(router);
main.startServer().then((res) => {
    console.log(res);
});
