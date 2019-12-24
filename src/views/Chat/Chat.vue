<template>
  <div class="chatContainer" style="z-index:999">
    <div class="chatBtn" @click="openChat()">
        <i class="iconfont icon-xiaoxi1"></i>
    </div>
    <div class="chat-message-num" v-if="hasNew">new</div>
    <div class="chatBox" ref="chatBox" style="width:700px">
        <div class="chatBox-head">
            <div class="chatBox-head-one">
                上医云聊天系统
                <div class="chat-close" @click="closeChat()" style="margin: 10px 10px 0 0;font-size: 14px">关闭</div>
            </div>
            <div class="chatBox-head-two">
                <div class="chat-return" @click="back()">返回</div>
                <div class="chat-people">
                    <div class="ChatInfoHead">
                        <img src="../../utils/img/icon01.png" alt="头像"/>
                    </div>
                    <div class="ChatInfoName">{{talkTo}}</div>
                </div>
                <div class="chat-close" @click="closeChat()">关闭</div>
            </div>
        </div>
        <div class="chatBox-info">
          <el-scrollbar style="height:100%" class="showScrollbar">
             <el-collapse >
              <el-collapse-item title="平台好友" class="pingtai">
                <div class="chatBox-list" ref="chatBoxlist">
                    <div class="chat-list-people" @click="chatToggle(items.name,items.tel)" v-for="items in employeeList" :key="items.index">
                        <div><img src="../../utils/img/icon01.png" alt="头像"/></div>
                        <div class="chat-name">
                            <p><span style="color:green">姓名：</span>{{items.name}} <span style="color:green">电话：</span>{{items.tel}}</p>
                        </div>
                        <div class="message-num" v-if="items.show">new</div>
                    </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="客户好友" class="kehu">
                <div class="chatBox-list" ref="chatBoxlist">
                    <div class="chat-list-people" @click="chatToggle(items.userName,items.userTel)" v-for="items in userList" :key="items.index">
                        <div><img src="../../utils/img/icon01.png" alt="头像"/></div>
                        <div class="chat-name">
                            <p><span style="color:green">姓名：</span>{{items.userName}} <span style="color:green">电话：</span>{{items.userTel}}</p>
                        </div>
                        <div class="message-num" v-if="items.show">new</div>
                    </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
            <!-- <div class="chatBox-list" ref="chatBoxlist">
                <div class="chat-list-people" @click="chatToggle()">
                    <div><img src="../../utils/img/icon01.png" alt="头像"/></div>
                    <div class="chat-name">
                        <p>自酌一杯酒</p>
                    </div>
                    <div class="message-num">10</div>
                </div>
            </div> -->
            <div class="chatBox-kuang" ref="chatBoxkuang">
                <div class="chatBox-content">
                    <div class="chatBox-content-demo" id="chatBox-content-demo">
                        <div class="clearfloat" v-for="item in messageData" :key="item.index">
                            <div class="author-name">
                                <small class="chat-date">{{item.date}}</small>
                            </div>
                            <div :class="item.position=='right'?'right':'left'">

                                <div class="chat-avatars" v-if="item.position=='left'"><img src="../../utils/img/icon01.png" alt="头像"/></div>
                                <div class="chat-message" v-if="item.type=='text'">
                                   {{item.talkContent}}
                                </div>
                                <div class="chat-message" v-if="item.type=='emoji'">
                                  <img v-for="item1 in item.talkContent" :key="item1.index" :src="item1.data" >
                                </div>
                                <div class="chat-message" v-if="item.type=='image'">
                                  <img :src="item.talkContent" >
                                </div>
                                <div class="chat-message" v-if="item.type=='audio'">
                                  <audio :src="item.talkContent"  controls="controls"></audio>
                                </div>
                                <div class="chat-avatars" v-if="item.position=='right'"><img src="../../utils/img/icon01.png" alt="头像"/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chatBox-send">
                    <!-- <div class="div-textarea" contenteditable="true" ><input v-model="talkContent"/></div> -->
                    <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="talkContent" style="width:83%" @keydown.native="listen($event)">
                    </el-input>

                    <div style="float:right">
                        <!-- <button id="chat-biaoqing" class="btn-default-styles">
                            <i class="iconfont icon-biaoqing"></i>
                        </button> -->
                        <label id="chat-tuxiang" title="发送图片" for="inputImage"  class="btn-default-styles">
                            <input type="file" @change="selectImg()" ref="inputImage" accept="image/jpg,image/jpeg,image/png"
                                   name="file" id="inputImage" class="hidden">
                            <i class="iconfont icon-tuxiang"></i>
                        </label>
                        <button @click="sendMsg()" class="btn-default-styles"><i class="iconfont icon-fasong"></i>
                        </button>
                    </div>
                    <div class="biaoqing-photo">
                        <ul>
                            <li><span class="emoji-picker-image" style="background-position: -9px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -40px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -71px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -102px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -133px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -164px -18px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -9px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -40px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -71px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -102px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -133px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -164px -52px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -9px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -40px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -71px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -102px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -133px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -164px -86px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -9px -120px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -40px -120px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -71px -120px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -102px -120px;"></span>
                            </li>
                            <li><span class="emoji-picker-image" style="background-position: -133px -120px;"></span>
                            </li>
                            <li><span class="emoji-picker-image" style="background-position: -164px -120px;"></span>
                            </li>
                            <li><span class="emoji-picker-image" style="background-position: -9px -154px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -40px -154px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -71px -154px;"></span></li>
                            <li><span class="emoji-picker-image" style="background-position: -102px -154px;"></span>
                            </li>
                            <li><span class="emoji-picker-image" style="background-position: -133px -154px;"></span>
                            </li>
                            <li><span class="emoji-picker-image" style="background-position: -164px -154px;"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
  export default {
    data(){
      return{
        //img/head/header.jpg
        headImg:require("../../utils/img/head/header.jpg"),
        //img/recycle.png
        clearScreen:require("../../utils/img/recycle.png"),
        //
        groupMembersImg:require("../../utils/img/head/find_more_friend_addfriend_icon.png"),
        //
        sendImg:require("../../utils/img/send_btn.jpg"),
        activeName:'',
        tableData: [],
        talkContent:'',
        messageData:[],
        talkTo:'未选择用户',
        currentUser:'',
        talkContent:'',
        talkToTel:'',
        talkTo:'',
        hasNew:false,
        employeeList:[],//平台
        userList:[]//客户
      }
    },
    methods:{
        listen (event) {
            if (event.keyCode === 13) {
                this.sendMsg() // 发送文本
                event.preventDefault() // 阻止浏览器默认换行操作
                return false
            }
        },
      screenFuc() {
        var topHeight = $(".chatBox-head").innerHeight();//聊天头部高度
        //屏幕小于768px时候,布局change
        var winWidth = $(window).innerWidth();
        if (winWidth <= 768) {
            var totalHeight = $(window).height(); //页面整体高度
            $(".chatBox-info").css("height", "80%");
            var infoHeight = $(".chatBox-info").innerHeight();//聊天头部以下高度
            //中间内容高度
            $(".chatBox-content").css("height", "90%");
            $(".chatBox-content-demo").css("height", "50%");

            $(".chatBox-kuang").css("height", "100%");
            $(".div-textarea").css("width", winWidth - 106);
        } else {
            $(".chatBox-info").css("height", "80%");
            $(".chatBox-content").css("height", "90%");
            $(".chatBox-content-demo").css("height", "50%");
            $(".chatBox-kuang").css("height", "200%");
            $(".div-textarea").css("width", 260);
        }
    },
    
    //打开/关闭聊天框
    openChat:function() {
      this.hasNew = false
        this.currentUser = JSON.parse(sessionStorage.getItem('employee'))
        let flag = true
        if(this.employeeList&&this.employeeList.length>0){
          for(let a of this.employeeList){
            if(a.show == true){
              flag = false
            }
          }
        }
        if(this.userList&&this.userList.length>0){
          for(let a of this.userList){
            if(a.show == true){
              flag = false
            }
          }
        }
        if(flag){
          this.$api.portalmanage.getFriendList({userName:this.currentUser.tel}).then((res) => {
              this.userList= res.rows.userList
              this.employeeList = res.rows.employeeList
          })
        }
      $(".chatBox").toggle(10);
    },
    
    closeChat:function(){
      $(".chatBox").toggle(10);
    },
  //  //获取好友列表
  //   getFridendList(){
  //     let _self=this
  //     this.currentUser = JSON.parse(sessionStorage.getItem('employee'))
  //     this.$api.portalmanage.getFriendList({userName:this.currentUser.tel}).then((res) => {
  //       _self.employeeList=res.rows.employeeList
  //       _self.userList=res.rows.userList
  //     })

  //   },
    //进聊天页面
    chatToggle(name,tel){
        for (let item of this.employeeList) {
              if(item.tel == tel){
                item.show = false
              }
        }
        for (let item of this.userList) {
          if(item.userTel == tel){
            item.show = false
          }
        }
        this.screenFuc()
        this.talkTo=name
        this.talkToTel=tel
         this.$api.portalmanage.selectChatRecord({key:this.currentUser.tel+'|'+tel}).then((res) => {
             if(res.code == 200){
                this.messageData = res.rows
                var n = $(this).index();
                $(".chatBox-head-one").toggle();
                $(".chatBox-head-two").toggle();
                $(".pingtai").fadeToggle();
                $(".kehu").fadeToggle();
                $(".chatBox-list").fadeToggle();
                $(".chatBox-kuang").fadeToggle();
                $(".showScrollbar").fadeToggle();


                //传名字
                $(".ChatInfoName").text($(this).children(".chat-name").children("p").eq(0).html());

                //传头像
                $(".ChatInfoHead>img").attr("src", $(this).children().eq(0).children("img").attr("src"));

                //聊天框默认最底部
                $(document).ready(function () {
                    $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
                });
             }
        })
        
    },
       

    //返回列表
    back(){
      $(".chatBox-head-one").toggle(1);
        $(".chatBox-head-two").toggle(1);
        $(".pingtai").fadeToggle(1);
          $(".kehu").fadeToggle(1);
        $(".chatBox-list").fadeToggle(1);
        $(".chatBox-kuang").fadeToggle(1);
        $(".showScrollbar").fadeToggle(1);
    },

    //保存聊条记录
    saveChatRecord(value){
        this.$api.portalmanage.saveChatRecord(value).then((res) => {
        })
    },
     //获取聊条记录
    selectChatRecord(value){
        this.$api.portalmanage.selectChatRecord(value).then((res) => {
           
        })
    },
    //      发送信息
      sendMsg(){
          let that = this
        if (this.talkContent) {
             let id = this.$imConn.getUniqueId();                   // 生成本地消息id
            let msg = new WebIM.message('txt', id);     // 创建文本消息 标记类型
            msg.set({
              msg: this.talkContent,                  // 消息内容
              to: this.talkToTel,  //发送给谁的环信id
              roomType: false,
              success: function (id, serverMsgId) {
                that.messageData.push({from:that.currentUser.tel,to:that.talkToTel,position:'right',type:'text',talkContent:that.talkContent})
                that.saveChatRecord({easemobId:that.currentUser.tel,talkToTel:that.talkToTel,from:that.currentUser.tel,to:that.talkToTel,position:'right',type:'text',talkContent:that.talkContent})


                //发送后清空输入框
                that.talkContent = ''
                //聊天框默认最底部
                $(document).ready(function () {
                    $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
                });
              },
              fail: function(e){
                console.log("发送失败",e);
              }
            });
            msg.body.chatType = 'singleChat';
            this.$imConn.send(msg.body);
        }
      },
    //      发送图片
    selectImg() {
// debugger;
        let inputDOM = this.$refs.inputImage;
        // 通过DOM取文件数据
        var reader = new FileReader();
        let _self = this
        reader.onload = function (evt) {
            var images = evt.target.result;
            let id = _self.$imConn.getUniqueId();                   // 生成本地消息id
            let msg = new WebIM.message('img', id);        // 创建图片消息
            // let input = document.getElementById('image');  // 选择图片的input
            let file = WebIM.utils.getFileUrl(inputDOM);      // 将图片转化为二进制文件
            let allowType = {
              'jpg': true,
              'gif': true,
              'png': true,
              'bmp': true
            };
            if (file.filetype.toLowerCase() in allowType) {
              let option = {
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: _self.talkToTel,                       // 接收消息对象
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function () {      // 消息上传失败
                  console.log('图片消息上传失败');
                },
                onFileUploadComplete: function () {   // 消息上传成功
                  console.log('图片消息上传成功');
                },
                success: function () {                // 消息发送成功
                  console.log('图片消息发送成功');

                },
                flashUpload: WebIM.flashUpload
              };
              msg.set(option);
              _self.$imConn.send(msg.body);
               _self.messageData.push({from:_self.currentUser.tel,to:_self.talkToTel,type:'image',talkContent:images,position:'right'})
               _self.saveChatRecord({easemobId:_self.currentUser.tel,talkToTel:_self.talkToTel,from:_self.currentUser.tel,to:_self.talkToTel,position:'right',type:'image',talkContent:images})
            //聊天框默认最底部
            $(document).ready(function () {
                $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
            });
            }else{
              alert("文件格式不支持！")
            }

        };
        reader.readAsDataURL(inputDOM.files[0]);

    }

    },
    mounted() {
        let _self=this
        this.$imConn.listen({
          onTextMessage: function ( message ) {
            _self.hasNew = true
            _self.$notify.info({
              title: '新消息',
              message: '您有新的消息，请在聊天系统中查看'
            });
            _self.currentUser = JSON.parse(sessionStorage.getItem('employee'))
            _self.$api.portalmanage.getFriendList({userName:_self.currentUser.tel}).then((res) => {
                if(res.code == 200){
                  _self.employeeList=res.rows.employeeList
                  _self.userList=res.rows.userList
                  let arr = _self.employeeList;
                  for (let item of arr) {
                    if(item.tel == message.from){
                      item.show = true
                    }
                  }
                  for (let item of _self.userList) {
                    if(item.userTel == message.from){
                      item.show = true
                    }
                  }
                }
            })
            


            _self.messageData.push({from:message.from,to:_self.currentUser.tel,talkContent:message.data,type:'text',position:'left'})
            _self.saveChatRecord({easemobId:_self.currentUser.tel,talkToTel:message.from,from:message.from,to:_self.currentUser.tel,position:'left',type:'text',talkContent:message.data})
            //聊天框默认最底部
            $(document).ready(function () {
                $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
            });
          },
          //接收到表情消息
          onEmojiMessage: function (message) {
            // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
            // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
            // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
            console.log('Emoji');
            var data = message.data;
            for(var i = 0 , l = data.length ; i < l ; i++){
              console.log(data[i]);
            }
             _self.messageData.push({from:message.from,talkContent:message.data,type:'emoji'})
          },
          onPictureMessage: function (message) {
           _self.hasNew = true
            _self.$notify.info({
              title: '新消息',
              message: '您有新的消息，请在聊天系统中查看'
            });
            _self.currentUser = JSON.parse(sessionStorage.getItem('employee'))
            _self.$api.portalmanage.getFriendList({userName:_self.currentUser.tel}).then((res) => {
                if(res.code == 200){
                  _self.employeeList=res.rows.employeeList
                  _self.userList=res.rows.userList
                  let arr = _self.employeeList;
                  for (let item of arr) {
                    if(item.tel == message.from){
                      item.show = true
                    }
                  }
                  for (let item of _self.userList) {
                    if(item.userTel == message.from){
                      item.show = true
                    }
                  }
                }
            })

            _self.messageData.push({from:message.from,to:_self.currentUser.tel,talkContent:message.url,type:'image',position:'left'})
            _self.saveChatRecord({easemobId:_self.currentUser.tel,talkToTel:message.from,from:message.from,to:_self.currentUser.tel,position:'left',type:'image',talkContent:message.url})
            //聊天框默认最底部
            $(document).ready(function () {
                $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
            });
          }, //收到图片消息
          onPresence: function ( message ) {
            // 这里需要弹出面板标识有人要添加您为好友
            console.log(message)
            // if(message.type == 'subscribe') {
            //   that.privateUser = message.from;
            //   that.privateUserPanel = true;
            // }
          },
          onAudioMessage:function(message){
            _self.hasNew = true
            _self.$notify.info({
              title: '新消息',
              message: '您有新的消息，请在聊天系统中查看'
            });
            _self.currentUser = JSON.parse(sessionStorage.getItem('employee'))
            _self.$api.portalmanage.getFriendList({userName:_self.currentUser.tel}).then((res) => {
                if(res.code == 200){
                  _self.employeeList=res.rows.employeeList
                  _self.userList=res.rows.userList
                  let arr = _self.employeeList;
                  for (let item of arr) {
                    if(item.tel == message.from){
                      item.show = true
                    }
                  }
                  for (let item of _self.userList) {
                    if(item.userTel == message.from){
                      item.show = true
                    }
                  }
                }
            })

            var option = {
                url: message.url,
                headers: {
                  'Accept': 'audio/mp4'
                },
                onFileDownloadComplete: function (response) {
                    var objectURL = WebIM.utils.parseDownloadResponse.call(_self.$imConn, response);
                    _self.messageData.push({from:message.from,to:_self.currentUser.tel,talkContent:objectURL,type:'audio',position:'left'})
                    _self.saveChatRecord({easemobId:_self.currentUser.tel,talkToTel:message.from,from:message.from,to:_self.currentUser.tel,position:'left',type:'audio',talkContent:objectURL})
                },
                onFileDownloadError: function () {
                    console.log('File down load error.')
                }
            };
            WebIM.utils.download.call(_self.$imConn, option);
            
            //聊天框默认最底部
            $(document).ready(function () {
                $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
            });
            
          }
        });
    
    //   window.onresize = this.screenFuc()
     //未读信息数量为空时
      var totalNum = $(".chat-message-num").html();
      if (totalNum == "") {
          $(".chat-message-num").css("padding", 0);
      }
      $(".message-num").each(function () {
          var wdNum = $(this).html();
          if (wdNum == "") {
              $(this).css("padding", 0);
          }
      });
    },
    destroyed: function () {
      // this.$imConn.close();
      // console.log("退出登录");
    }
  }
</script>

<style scoped>
  @import "../../utils/font_Icon/iconfont.css";
  @import "../../utils/css//chat.css";
</style>
