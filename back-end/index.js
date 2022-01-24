'use strict';
import  { Application, Router, send } from "./deps.js";
import { renderFileToString ,readJsonSync} from './deps.js';
const items = readJsonSync("./static/products.json");

const router = new Router();

router.get("/", async (context) => {
    try { 
        context.response.body = await renderFileToString(Deno.cwd() + "/front-end/uebersicht.ejs", { itemList: items });
        context.response.type = "html";           
    } catch (error) {
        console.log(error);
    }
});

router.get("/detailansicht&:id", async (context) => {
    try {
        let zufallitem = getSelectedProduct(context.parms.id);
        context.response.body = await renderFileToString(Deno.cwd() + "/front-end/detailansicht.ejs", { item: zufallitem });
        context.response.type = "html";           
    } catch (error) {
        console.log(error);
    }
});
router.post("/warenkorb", async (context) => {
    try {
        const body = await context.request.body().value;
        console.log(body);
        context.response.body = await renderFileToString(Deno.cwd() + 
            "/front-end/warenkorb.ejs", { itemList: items });
        context.response.type = "html";
    } catch (error) {
        console.log(error);
    }
});

function getSelectedProduct(id) {
    for(let item of items) {
        if(id == item.id) {
            return item;
        }
    }
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Diese Middleware muss nach den Routes stehen.
// Steht diese Middleware vor den Routes, werden die Routes nicht verarbeitet!
app.use(async (context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/static`,
    });
}); 

await app.listen({ port: 8000 });