const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const dbConfig = require("./config").db;
const router = require("./routes/index");
const {
    query
} = require("./utils/db");
const app = new Koa();

const server = require("http").createServer(app.callback());
server.listen(5252);
app.use(cors());

// 具体参数我们在后面进行解释
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/login') {
            return "*"; // 允许来自所有域名请求
        }
        // return 'http://localhost:3000'; // 这样就能只允许 http://localhost:3000 
        return '*'; // 这样就能只允许 http://localhost:3000 
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
global.query = query;


console.log("服务器已启动,端口5252");