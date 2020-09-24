// 用mockjs模拟生成数据
var Mock = require('mockjs');

// node app.js 要求db.js 暴露一个object
let mapData = (n) => {
  let data=[];

  for (let i=1; i<=n; i++){
    data.push({
      _id: i+'',
      id: i+'',
      title:'@ctitle(8,12)',
      des:'@ctitle(10,20)',
      time:'@integer(1594004307038,1598004307038)',
      detail:{
        auth_icon:Mock.Random.image('50x50',Mock.Random.color(),Mock.Random.cword(1)),
        auth:'@cname()',
        content: [1,2,3].map(()=>(
          "<p style='margin-top: 20px;text-indent: 2em'>"+"@cparagraph(10,15)"+"</p>"
        )).join('')
      }
    })
  }

  return data;
};

let mapData2 = (n) => {
  let data=[];

  for (let i=1; i<=n; i++){
    data.push({
      _id: i+'',       //如果数据库是mongodb 则id是这样的 "_id" ,因为返回的id是一个字符串，所以是 " i+'' " ,转化为字符串
      id: i+'',        //这个id是因为： 路由别名只认id，不认_id ， 例：/course/:id
      title:'@ctitle(5,10)',
      sub_title:'@ctitle(8,12)',
      banner: Mock.Random.image('1680x745',Mock.Random.color(),Mock.Random.cword(3,7)),
      time:'@integer(1594004307038,1598004307038)',
      detail:{
        auth_icon:Mock.Random.image('50x50',Mock.Random.color(),Mock.Random.cword(1)),
        auth:'@cname()',
        content:[1,2,3].map(()=>(
          "<p style='margin-top: 20px;text-indent: 2em'>"+"@cparagraph(10,15)"+"</p>"
        )).join('')
      }
    })
  }

  return data;
};


module.exports = Mock.mock({    //直接对外暴露的就是一个对象
  
  'user': {
    "follow":Mock.Random.integer(0,100),
    "fans":Mock.Random.integer(0,100),
    "nikename":Mock.Random.cname(),
    "icon":Mock.Random.image('20x20',Mock.Random.color(),Mock.Random.cword(1)),
    "time":Mock.Random.integer(13)
  },
  'banner':mapData2(10),
  'home': mapData(100),
  'follow': mapData(80),
  'hotspot': mapData(60)
  
});







//暴露出(导出)函数
/* module.exports = () => {
	// 使用 Mock
	  var data = Mock.mock({    //数据是由Mock中的mock()方法生成的
	    'course|30': [     //左键代表接口 ; 右键代表数据   |代表可以生成多少条数据(30)
	      {
	        // 属性 id 是一个自增数，起始值为 1，每次增 1
	        'id|+1': 1000,   //这里起始值为：1000
	        course_name: '@ctitle(5,10)',  //产生标题,c:是中文的 长度是5到10个
	        autor: '@cname',       //产生名字,且是中文的百家姓
	        college: '@ctitle(6)', 
	        'category_Id|1-6': 1
	      }
	    ],
	    'course_category|6': [
	      {
	        "id|+1": 1,
	        "pid": -1,
	        cName: '@ctitle(4)'
	      }
	    ]
	  });
	
	// 返回的data会作为json-server的数据
	return data;     //返回数据
} */