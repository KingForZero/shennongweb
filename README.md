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
 获取token
 
 https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx219c18e85cbbe024&secret=7090441bc943abf24aba924743fe611c
 
 菜单配置
 
 https://api.weixin.qq.com/cgi-bin/menu/create?access_token=37_iDrSqYG7vM7i-yJnO4NGmO7aDm2LIkzYY9ie6-nrJmm03YTEKm_Ykd462V6ZxwITD6HPzgY1LX2w14CxbIzn13n5OFKJkA-bjMB2dMCVtpw1v7vq0K3-oGZfT9OfrQf7PTjwBlRefEsjn7F6PKWgAEAVQC
 
 body
 
 {
     "button": [
         {
             "name": "业务介绍",
             "sub_button": [
                 {
                     "type": "view_limited",
                     "name": "营养专家",
                     "media_id": "tMxb2UBoHxlxBeLOk9OAxPG6DHBfmSM4e6SngU1QRs8"
                 },
                 {
                     "type": "view_limited",
                     "name": "研究中心",
                     "media_id": "tMxb2UBoHxlxBeLOk9OAxCmwnkKUIkYmbcrRzNhtE8Q"
                 },
                 {
                     "type": "view_limited",
                     "name": "服务内容",
                     "media_id": "tMxb2UBoHxlxBeLOk9OAxJ8N1u2GvrGHsT65QcsAHcI"
                 }
                 
             ]
         },
         {
             "name": "营养知识",
             "sub_button": [
                 {
                     "type": "view",
                     "name": "营养方案",
                     "url": "http://soelaine.com/yyfa"
                 },
                {
                     "type": "view",
                     "name": "直播平台",
                     "url": "https://h5.hzyanxuan.com/yanxuan?shopid=177231"
                 },
                 {
                     "type": "view",
                     "name": "健康讲座",
                     "url": "https://mp.weixin.qq.com/mp/homepage?__biz=MzIxNTkyMjQzMQ==&hid=1&sn=bdd4bc0e432ec47146751c637fa19786"
                 }
             ]
         },
         {
             "name": "服务中心",
             "sub_button": [
                 {
                     "type": "view",
                     "name": "健康自测",
                     "url": "http://soelaine.com/jkzc"
                 },
                 {
                     "type": "view",
                     "name": "专家咨询",
                     "url": "http://soelaine.com/zjzx"
                 },
                 {
                     "type": "view",
                     "name": "订单查看",
                     "url": "http://soelaine.com/ddck"
                 },
                 {
                     "type": "view",
                     "name": "国际代购",
                     "url": "http://soelaine.com/cpjs"
                 }
             ]
         }
     ]
 }
