const express = require('express')
// const expressGraphql = require('express-graphql');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
// const path = require('path')
const session = require('express-session')
const router = require('./control/router.ts')

// 文件目录的字符串(相对路径)
const uploadFolder = './assets/'
// 创建目录的函数
const createFolder = (folder: any) => {
    try {
        // 判断目录是否存在,使用同步,异步不行
        // 目录不存在会抛出异常
        fs.accessSync(folder)
    } catch (e) {
        // 抛出异常后创建目录,同步创建
        fs.mkdirSync(folder)
    }
}

// 调用目录创建函数 ==>目录创建完成
createFolder(uploadFolder)

// 创建一个storage对象按照你想要的方式存储上传来的文件
const storage = multer.diskStorage({
    // 设置存放位置
    destination: (req: any, file: any, cb: any) => {
        cb(null, uploadFolder)
    },
    // 设置文件名称
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.originalname)
    }
})
// 使用storage
const upload = multer({
    storage: storage
})

const port = process.env.PORT || 9999
const app = express()

app.all('*', (req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use('/static', express.static('static'))
app.use((req: any, res: any, next: any) => {
    // console.log(req.path)
    next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: 'fuckupig',
    cookie: { maxAge: 3600000 },
    resave: true,
    saveUninitialized: true
}))

app.use(router)

// import { typeDefs, resolvers } from './schema/index'
const { typeDefs, resolvers } = require('./schema/index.ts')
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// app.use('/graphql', expressGraphql({
//     schema,
//     graphiql: true
// }));


app.post('/upload', upload.single('logo'), (req: any, res: any) => {
    Object.keys(req).map(key => {
        console.dir(key)
        // console.dir(req[key])
    })

    res.send({ 'ret_code': 0 })
})

// ------------------ Eureka Config --------------------------------------------
// const eureka_address = process.env.EUREKA_ADDRESS || 'localhost';
// const eureka_port = '8761';
// const eureka_username = process.env.EUREKA_USERNAME || 'user';
// const eureka_password = process.env.EUREKA_PWD || 'password';
// const Eureka = require("eureka-js-client").Eureka;
// const client = new Eureka({
//     eureka: {
//         heartbeatInterval: 30000,
//         registryFetchInterval: 30000,
//         host: `${eureka_username}:${eureka_password}@${eureka_address}`,
//         port: `${eureka_port}`,
//         servicePath: "/eureka/apps/"
//     },
//     instance: {
//         app: 'test-node',
//         hostName: 'localhost',
//         ipAddr: 'localhost',
//         statusPageUrl: 'http://localhost:9999',
//         port: {
//             '$': 9999,
//             '@enabled': 'true'
//         },
//         // vipAddress: 'razer-node'
//         dataCenterInfo: {
//             '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
//             name: 'MyOwn'
//         }
//     }
// });
// client.logger.level('debug');
// client.start((error: any) => {
//     console.log(error || 'complete');
// })

app.listen(port, () => console.log(`devServer start on port:${port}`))
