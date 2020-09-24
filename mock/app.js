const jsonServer = require('json-server');//在node里面使用json-server包

//引入数据库
const db = require('./db.js');//引入mockjs配置模块  (这里我们的db.js就是数据库了)

//操作磁盘
const path = require('path');

const Mock = require('mockjs');
let mock='/api';//定义路由根别名
let port = 3333;//端口

//创建服务器
const server = jsonServer.create();//创建jsonserver 服务对象

//配置jsonserver服务器 安装中间件
server.use(jsonServer.defaults({
  static:path.join(__dirname, '/public'),//静态资源托管
}));
server.use(jsonServer.bodyParser);//抓取body数据使用json-server中间件(可以接收非地址栏数据)

//响应 (统一响应)
//可选 统一修改请求方式
server.use((req, res, next) => {
  //业务处理
  // console.log(1)
  // request.method = 'GET';
  if (req.url.includes('/login') || req.url.includes('/reg')){   //判断访问的若是登录或注册接口，就放行
    next()
  } else {
    if (req.headers.token && req.headers.token.length===16){      //否则访问的就是其他接口了，但是需要携带16位的token
      next()				//参数应该携带在headers中
    } else {
      setTimeout(()=>res.jsonp({   //模拟延时
        err:2,
        msg:'token无效或过期'
      }),1000)
    }
  }
});

//登录注册校验
let mr = Mock.Random;//提取mock的随机对象
server.post(mock+'/login', (req, res) => {
  // console.log(req.query, req.body);//抓取提交过来的query和body
  let username=req.body.username;
  let password=req.body.password;
  (username === 'alex' && password === 'alex123')?      //若登录名和密码都符合，则登录成功（这里因为是模拟数据，所以写死了）
    res.jsonp({
      "err": 0,           //这里就是使用mockjs生成了许多数据
      "msg": "登录成功",
      "data": {
        "follow": mr.integer(1,5),
        "fans": mr.integer(1,5),
        "nikename": mr.cname(),
        "icon": mr.image('20x20',mr.color(),mr.cword(1)),
        "time": mr.integer(13,13)
      },
      "token":mr.integer(16)
    }) :
    res.jsonp({
      "err": 1,
      "msg": "登录失败",
    })

});
server.post(mock+'/reg', (req, res) => {
  let username=req.body.username;
  (username !== 'alex') ?
    res.jsonp({
      "err": 0,
      "msg": "注册成功",
      "data": {
        "follow": mr.integer(0,0),
        "fans": mr.integer(0,0),
        "nikename": mr.cname(),         //注册成功返回的不一定是注册的名字（因为我们是使用mockjs随机生成的）
        "icon": mr.image('20x20',mr.color(),mr.cword(1)),
        "time": mr.integer(13,13)
      }
    }) :
    res.jsonp({
      "err": 1,
      "msg": "注册失败",
    })

});


//响应mock接口 
const router = jsonServer.router(db);//创建路由对象 db为mock接口路由配置  db==object

//自定义返回的数据的结构
router.render = (req, res) => {
  let data = res.locals.data;//object array
  // console.log('app.js',res);
  let bl = false;
  if (typeof data === 'object' && Object.keys(data).length !== 0){   //判断数据： 是对象而不是数组，则bl = true
    bl = true;
  } else {
    bl = false; // delete 操作时，返回空对象
  }

  setTimeout(()=>{//模拟服务器延时
    res.jsonp({
      err: bl  ? 0 : 1,
      msg: bl ? '成功' : '失败',
      data: res.locals.data
    })
  },1000)

  // res.jsonp(res.locals.data)

};

//路由自定义别名
server.use(jsonServer.rewriter({         //rewriter() 方法 ： 生成路由别名  （这里在第10行，定义了一个路由根别名，所以这里的mock==/api）
  [mock+"/*"]: "/$1",

  // "/product\\?dataName=:dataName": "/:dataName",
  // "/banner\\?dataName=:dataName": "/:dataName",
  // "/detail\\?dataName=:dataName&id=:id": "/:dataName/:id",

  // "/product/del\\?dataName=:dataName&id=:id": "/:dataName/:id",
  // "/product/add\\?dataName=:dataName": "/:dataName",
  // "/product/check\\?dataName=:dataName&id=:id": "/:dataName/:id"
	
  "/api/*": "/$1",
  "/:resource/:id/show": "/:resource/:id",
  "/posts/:category": "/posts?category=:category",
  "/home\\?id=:id": "/home/:id"
	
}));

//路由响应
server.use(router);

//开启jsonserver服务
server.listen(3333, () => {
  console.log('mock server is running')
});