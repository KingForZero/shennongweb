由于公众号配置了服务器，所以网页上自定义的按钮和自动回复全部失效，只能通过http
请求来配置相关的按钮
配置按钮的地址 post请求
https://api.weixin.qq.com/cgi-bin/menu/create?access_token=accessToken
body为
```
     {
         "button": [
             {
                 "type": "view",
                 "name": "医疗记录",
                 "url": "http://soelaine.com/medicalRecordListGZ"
             }
         ]
     }
 ```
