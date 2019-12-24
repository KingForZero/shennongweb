<template>
    <div>
     <!-- <div id="loginmodal" class="modal hide in" role="dialog"
           aria-hidden="true" data-backdrop="static">
        <div class="modal-header">
          <h3>用户登录</h3>
        </div>
        <div class="modal-body">
          <table>
            <tr>
              <td width="65%">
                <label for="username">用户名:</label>
                <input type="text" name="username" value="" id="username" tabindex="1"/>
                <label for="password">密码:</label>
                <input type="password" name="password" value="" id="password" tabindex="2" />
                <label for="token">令牌:</label>
                <input type="text" name="token" value="" id="token" disabled="disabled" tabindex="3" />
              </td>
            </tr>
          </table>
          <label class="checkbox">
            <input type="checkbox" name="usetoken" id="usetoken" tabindex="4" />使用令牌登录
          </label>
        </div>
        <div class="modal-footer">
          <button class="flatbtn-blu" onclick="login()" tabindex="3">登录</button>
          <button class="flatbtn-blu" onclick="showRegist()" tabindex="4">注册</button>
        </div>
      </div>

      &lt;!&ndash; 注册操作界面 &ndash;&gt;
      <div id="regist-div-modal" class="alert modal hide" role="dialog"
           aria-hidden="true" data-backdrop="static">
        <div class="modal-header">
          <h3>用户注册</h3>
        </div>
        <div class="modal-body">
          <div id="regist_div" style="overflow-y: auto">
            <table>
              <tr>
                <td width="65%"><label>用户名:</label> <input type="text"
                                                           value="" id="regist_username" tabindex="1" /> <label>密码:</label>
                  <input type="password" value="" id="regist_password" tabindex="2" />
                  <label>昵称:</label> <input type="text" value=""
                                            id="regist_nickname" tabindex="3" /></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button id="confirm-regist-confirmButton" class="btn btn-primary"
                  onclick="regist()">完成</button>
          <button id="confirm-regist-cancelButton" class="btn"
                  onclick="showlogin()">返回</button>
        </div>
      </div>

      <div id="waitLoginmodal" class="modal hide" data-backdrop="static">
        <img src="img/waitting.gif">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在努力加载中...</img>
      </div>-->
      <div class="content" id="content" >
        <div class="leftcontact" id="leftcontact">
          <div id="headerimg" class="leftheader">
                <span> <img :src="headImg" alt="logo"
                            class="img-circle" width="60px" height="60px"
                            style="margin-top: -40px; margin-left: 20px" /></span> <span
            id="login_user" class="login_user_title"> <a
            class="leftheader-font" href="#"></a>
                </span> <span>
                    <div class="btn-group" style="margin-left: 5px;">
                        <button class="btn btn-inverse dropdown-toggle" data-toggle="dropdown">
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="javascript:;" onclick="showAddFriend()">添加好友</a></li>
                            <li><a href="javascript:;" onclick="showDelFriend()">删除好友</a></li>
                            <li class="divider"></li>
                            <li><a href="javascript:;" onclick="logout();return false;">退出</a></li>
                        </ul>
                    </div>
                </span>
          </div>
          <div id="leftmiddle">
            <!--
            <input style="width: 120px; color: #999999; margin-top: 8px;"
                type="text" id="searchfriend" value="搜索"
                onFocus="if(value==defaultValue){value='';this.style.color='#000'}"
                onBlur="if(!value){value=defaultValue;this.style.color='#999'}" />
            <button id="searchFriend" style="background: #cccccc">查询</button>
        -->
          </div>
          <div id="contractlist11"
               style="height: 492px; overflow-y: auto; overflow-x: auto;">
            <el-collapse v-model="activeName" accordion   @change="handleChange">
              <el-collapse-item title="平台好友" name="1">
                <div v-for="items in employeeList">
                  <p><a href="#" @click="clickFriend(items.name,items.tel)">{{items.name}} </a></p>
                </div>
              </el-collapse-item>
              <el-collapse-item title="客户好友" name="2">
                <div v-for="items in userList">
                  <p><a href="#" @click="clickFriend(items.userName,items.userTel)">{{items.userName}} </a></p>
                </div>
              </el-collapse-item>
            </el-collapse>

          </div>
        </div>
        <div id="rightTop" style="height: 78px;"></div>
        <!-- 聊天页面 -->
        <div class="chatRight">
          <div id="chat01">
            <div class="chat01_title">
              <ul class="talkTo">
                <li id="talkTo"><a href="#">{{talkTo}}</a></li>
                <li id="recycle" style="float: right;"><img
                  :src="clearScreen" onclick="clearCurrentChat();"
                  style="margin-right: 15px; cursor: hand; width: 18px;" title="清屏" /></li>
                <li id="roomInfo" style="float: right;"><img
                  id="roomMemberImg"
                  :src="groupMembersImg"
                  onclick="showRoomMember();"
                  style="margin-right: 15px; cursor: hand; width: 18px; display: none"
                  title="群组成员" /></li>
              </ul>
            </div>
            <div id="null-nouser" class="chat01_content">
              <div v-for="items in messageData">
                <div  v-if="items.messagePosition=='2'" style="width: 555px">
                  <div style="margin-left: 20px ">{{talkTo}} &nbsp;:</div>
                 <div style="margin-left: 50px;margin-top: 10px;color:grey;font-size: 18px"> {{items.data}}</div>
                </div>

                <div  v-if="items.image" style="width: 555px">
                  <div style="margin-left: 20px ">{{items.from}}&nbsp;:</div>
                  <div style="margin-left: 50px;margin-top: 10px;"> <a :href='items.data'>{{items.data}}</a>
                  </div>
                </div>

                <div v-if="items.messagePosition=='1'" style="width: 555px;margin-top: 20px">
                 <!-- <div style="margin-right: 20px;text-align: right">{{items.from}}&nbsp;:</div>-->
                  <div>
                    <p style="text-align: right;margin-right:30px;margin-top:10px;color:green;font-size: 18px"> {{items.data}}</p>
                   </div>
                </div>
                <hr>
              </div>
            </div>
          </div>

          <div class="chat02">
            <div class="chat02_title">
              <a class="chat02_title_btn ctb01" onclick="showEmotionDialog()"
                 title="选择表情"></a> <a class="chat02_title_btn ctb03" title="选择图片"
                                      @click="showSendPic" href="#"> </a> <a
              class="chat02_title_btn ctb02" onclick="showSendAudio()" href="#"
              title="选择语音"><span></span></a> <label id="chat02_title_t"></label>
              <div id="wl_faces_box" class="wl_faces_box">
                <div class="wl_faces_content">
                  <div class="title">
                    <ul>
                      <li class="title_name">常用表情</li>
                      <li class="wl_faces_close"><span
                        onclick='turnoffFaces_box()'>&nbsp;</span></li>
                    </ul>
                  </div>
                  <div id="wl_faces_main" class="wl_faces_main">
                    <ul id="emotionUL">
                    </ul>
                  </div>
                </div>
                <div class="wlf_icon"></div>
              </div>
            </div>
            <div id="input_content" class="chat02_content">
              <textarea id="talkInputId" ref="textContent" style="resize: none;"  v-model="talkContent"></textarea>
            </div>
            <div class="chat02_bar">
              <ul>
                <li style="right: 5px; top: 5px;"><img :src="sendImg"
                                                       @click="sendText()" /></li>
              </ul>
            </div>

            <div style="clear: both;"></div>
          </div>
          <div id="fileModal" class="modal hide" role="dialog"
               aria-hidden="true" data-backdrop="static">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"
                      aria-hidden="true">&times;</button>
              <h3>文件选择框</h3>
            </div>
            <div class="modal-body">
              <input type='file' id="fileInput" /> <input type='hidden'
                                                          id="sendfiletype" />
              <div id="send-file-warning"></div>
            </div>
            <div class="modal-footer">
              <button id="fileSend" class="btn btn-primary" onclick="sendFile()">发送</button>
              <button id="cancelfileSend" class="btn" data-dismiss="modal">取消</button>
            </div>
          </div>
        </div>

        <div id="addFridentModal" class="modal hide" role="dialog"
             aria-hidden="true" data-backdrop="static">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"
                    aria-hidden="true">&times;</button>
            <h3>添加好友</h3>
          </div>
          <div class="modal-body">
            <input id="addfridentId" onfocus='clearInputValue("addfridentId")' />
            <div id="add-frident-warning"></div>
          </div>
          <div class="modal-footer">
            <button id="addFridend" class="btn btn-primary"
                    onclick="startAddFriend()">添加</button>
            <button id="cancelAddFridend" class="btn" data-dismiss="modal">取消</button>
          </div>
        </div>

        <div id="delFridentModal" class="modal hide" role="dialog"
             aria-hidden="true" data-backdrop="static">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"
                    aria-hidden="true">&times;</button>
            <h3>删除好友</h3>
          </div>
          <div class="modal-body">
            <input id="delfridentId" onfocus='clearInputValue("delfridentId")' />
            <div id="del-frident-warning"></div>
          </div>
          <div class="modal-footer">
            <button id="delFridend" class="btn btn-primary"
                    onclick="directDelFriend()">删除</button>
            <button id="canceldelFridend" class="btn" data-dismiss="modal">取消</button>
          </div>
        </div>

        <!-- 一般消息通知 -->
        <div id="notice-block-div" class="modal hide">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <div class="modal-body">
            <h4>Warning!</h4>
            <div id="notice-block-body"></div>
          </div>
        </div>

        <!-- 确认消息通知 -->
        <div id="confirm-block-div-modal" class="modal hide"
             role="dialog" aria-hidden="true" data-backdrop="static">
          <div class="modal-header">
            <h3>订阅通知</h3>
          </div>
          <div class="modal-body">
            <div id="confirm-block-footer-body"></div>
          </div>
          <div class="modal-footer">
            <button id="confirm-block-footer-confirmButton"
                    class="btn btn-primary">同意</button>
            <button id="confirm-block-footer-cancelButton" class="btn"
                    data-dismiss="modal">拒绝</button>
          </div>
        </div>

        <!-- 群组成员操作界面 -->
        <div id="option-room-div-modal" class="alert modal hide"
             role="dialog" aria-hidden="true" data-backdrop="static">
          <button type="button" class="close" data-dismiss="modal"
                  aria-hidden="true">&times;</button>
          <div class="modal-header">
            <h3>群组成员</h3>
          </div>
          <div class="modal-body">
            <div id="room-member-list" style="height: 100px; overflow-y: auto"></div>
          </div>
        </div>
      </div>


      <el-dialog  width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <input type="file" ref="sendPic"  />
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm" >
            {{$t('action.submit')}}
          </el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        data(){
          return{
            size: 'small',
          //img/head/header.jpg
            headImg:require("../../utils/img/head/doctor.jpg"),
            //img/recycle.png
            clearScreen:require("../../utils/img/recycle.png"),
            //
            groupMembersImg:require("../../utils/img/head/find_more_friend_addfriend_icon.png"),
            //
            sendImg:require("../../utils/img/send_btn.jpg"),
            activeName:'',
            tableData: [],
            messageData:[],
            talkTo:'未选择用户',
            talkToTel:'',
            talkContent:'',
            messagePosition:false,
            dialogVisible:false,
            currentUser:'',
            employeeList:[],//平台
            userList:[]//客户
          }
        },
        methods:{
          //折叠板改变
          handleChange(val) {
            console.log("当前点击：：："+val);
            if(val=="1"){
              console.log("当前点击我的好友");
              this.messageData=[]
              this.talkTo='未选择用户'
              this.getFridendList();
            }else if(val=="2"){
              this.messageData=[]
              this.talkTo='未选择用户'
              console.log("当前点击获取客户好友");
              this.getFridendList();
            }
          },
          //展示发送图片窗口
          showSendPic(){
            console.log("开发发送图片方法")
            if(this.talkTo=='未选择用户'){
              alert("请选择聊天用户")
              return
            }
        this.dialogVisible=true
          },
          //发送消息
          sendText() {
            if(this.talkTo=='未选择用户'){
              alert("请选择聊天用户")
              return
            }
            let _self=this
            console.log("点击发送按钮");
            console.log("接收者：："+_self.talkTo);
            console.log("发送的内容：：："+ _self.talkContent);
            _self.messageData.push({from:'我',data:_self.talkContent,messagePosition:1})
            // const that = this
            let id = this.$imConn.getUniqueId();                   // 生成本地消息id
            let msg = new WebIM.message('txt', id);     // 创建文本消息 标记类型
            msg.set({
              msg: _self.talkContent,                  // 消息内容
              to: _self.talkToTel,  //发送给谁的环信id
              roomType: false,
              success: function (id, serverMsgId) {
                // _self.messageData.push({from:'我',data:_self.talkContent,messagePosition:1})
                _self.talkContent=''
                console.log("发送to：：id::"+id+":::serverMsgId"+serverMsgId);
                // var emojiMessage  = that.WebIM.utils.parseEmoji(that.message); //这个是处理表情的方法
              },
              fail: function(e){
                console.log("发送失败",e);
              }
            });
            msg.body.chatType = 'singleChat';
            this.$imConn.send(msg.body);
          },
          //获取好友列表
          getFridendList(){
            let _self=this
            // this.$imConn.getRoster({
            //   success: function ( roster ) {
            //     // console.log("tableData的值：：："+this.tableData);
            //     console.log("获取好友列表")
            //
            //     //获取好友列表，并进行好友列表渲染，roster格式为：
            //     /** [
            //      {
            //       jid:'asemoemo#chatdemoui_test1@easemob.com',
            //       name:'test1',
            //       subscription: 'both'
            //     }
            //      ]
            //      */
            //     console.log(_self)
            //     _self.tableData=roster
            //     // this.tableData =  roster
            //     // for ( let i = 0, l = roster.length; i < l; i++ ) {
            //     //   let ros = roster[i];
            //     //   // console.log("好友列表："+JSON.stringify(ros));
            //     //   // this.tableData.push({ name: ros.name })
            //     //   //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
            //     //   // if ( ros.subscription === 'both' || ros.subscription === 'to' ) {
            //     //   //
            //     //   // }
            //     // }
            //   },
            // });
            this.currentUser = JSON.parse(sessionStorage.getItem('employee'))
            console.log("点击获取登录用户手机号：："+this.currentUser.tel)
            this.$api.portalmanage.getFriendList({userName:this.currentUser.tel}).then((res) => {
              console.log("好友列表：："+res)
              _self.employeeList=res.rows.employeeList
              _self.userList=res.rows.userList
              // this.departMentOneList = res.rows
            })

          },
          //点击某个好友
          clickFriend(name,tel){
            // let el = event.currentTarget;//复杂的click哈哈
            // // alert(el.innerText);
            this.messageData=[]
            this.talkTo=name;
            this.talkToTel=tel
            console.log("点击获取好友的手机号：："+tel)
          },
          // 单聊发送图片消息
          sendPrivateImg  () {
            console.log("开发发送图片方法")
            if(this.talkTo=='未选择用户'){
              alert("请选择聊天用户")
              return
            }
            let _self=this
            console.log("点击发送图片按钮");
            console.log("接收者：："+_self.talkTo);

            let id = this.$imConn.getUniqueId();                   // 生成本地消息id
            let msg = new WebIM.message('img', id);        // 创建图片消息
            // let input = document.getElementById('image');  // 选择图片的input
            let file = WebIM.utils.getFileUrl(this.$refs.sendPic);      // 将图片转化为二进制文件
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
                to: _self.talkTo,                       // 接收消息对象
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function () {      // 消息上传失败
                  console.log('图片消息上传失败');
                  alert("图片消息上传失败")
                },
                onFileUploadComplete: function () {   // 消息上传成功
                  console.log('图片消息上传成功');
                },
                success: function () {                // 消息发送成功
                  console.log('图片消息发送成功');
                  _self.dialogVisible=false
                  alert("图片消息发送成功")

                },
                flashUpload: WebIM.flashUpload
              };
              msg.set(option);
              this.$imConn.send(msg.body);
            }else{
              alert("文件格式不支持！")
            }
          },
          submitForm: function () {
            this.sendPrivateImg()
          },
      },
      mounted() {
        let _self=this
        this.$imConn.listen({
          onTextMessage: function ( message ) {
            console.log(message);
            _self.$message({message: "用户："+message.from+"发来消息，请点击聊天室选择"+message.from+"进行聊天", type: 'success'})
            _self.messageData.push({from:message.from,data:message.data,messagePosition:2})
            // that.chatCont.push({id: 2, cont: message.data});
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
          },
          onPictureMessage: function (message) {
            console.log(message)
            _self.$message({message: "用户："+message.from+"发来消息，请点击聊天室选择"+message.from+"进行聊天", type: 'success'})
            _self.messageData.push({from:message.from,data:message.url,messagePosition:3,image:true})
            console.log("接收到图片消息 ", message.url);
          }, //收到图片消息
          onPresence: function ( message ) {
            // 这里需要弹出面板标识有人要添加您为好友
            console.log(message)
            // if(message.type == 'subscribe') {
            //   that.privateUser = message.from;
            //   that.privateUserPanel = true;
            // }
          }
        });

        // // 登录信息
        // let options = {
        //   apiUrl:(location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',//不用动
        //   user: '234',
        //   pwd: '234',
        //   appKey: '1114181016253122#shennong'
        // }
        // console.log('登录信息',options)
        // this.$imConn.open(options)

        // 单聊贴图发送
        // this.$refs.textContent.addEventListener('paste', function (e) {
        //   console.log("开发发送贴图方法")
        //   if(this.talkTo=='未选择用户'){
        //     alert("请选择聊天用户")
        //     return
        //   }
        //   let _self=this
        //   console.log("点击发送贴图按钮");
        //   console.log("接收者：："+_self.talkTo);
        //   console.log(e)
        //   if (e.clipboardData && e.clipboardData.types) {
        //     console.log("进来了--------1-"+e.clipboardData.items.length)
        //     if (e.clipboardData.items.length > 0) {
        //       console.log("进来了--------2")
        //       if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
        //         console.log("进来了--------3")
        //         let blob = e.clipboardData.items[0].getAsFile();
        //         let url = window.URL.createObjectURL(blob);
        //         let id = this.$imConn.getUniqueId();             // 生成本地消息id
        //         let msg = new WebIM.message('img', id);  // 创建图片消息
        //         msg.set({
        //           apiUrl: WebIM.config.apiURL,
        //           file: {data: blob, url: url},
        //           to: '17600622806',                      // 接收消息对象
        //           roomType: false,
        //           chatType: 'singleChat',
        //           onFileUploadError: function (error) {
        //             console.log('Error');
        //           },
        //           onFileUploadComplete: function (data) {
        //             console.log('Complete');
        //           },
        //           success: function (id) {
        //             console.log('Success');
        //           }
        //         });
        //         this.$imConn.send(msg.body);
        //       }
        //     }
        //   }
        // });

      },
      destroyed: function () {
        // this.$imConn.close();
        // console.log("退出登录");
      }
    }
</script>

<style scoped>
  @import "../../utils/css/bootstrap.css";
  @import "../../utils/css/webim.css";
</style>
