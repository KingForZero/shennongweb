<template>
  <div>
    <van-contact-card type="add" add-text="添加就诊人" @click="onAdd" />
    <!--<van-contact-card-->
      <!--type="edit"-->
      <!--:name="currentContact.name"-->
      <!--:tel="currentContact.tel"-->
      <!--@click="onEdit"-->
    <!--/>-->
    <div class="van-hairline--top" v-for="(item,i) in contactList" @click="confirm(item.userChildId)">
      <div  role="button" tabindex="0" class="van-cell van-cell--clickable van-cell--center van-cell--borderless van-contact-card van-contact-card--edit">
        <i class="van-icon van-icon-contact van-cell__left-icon"><!----></i>
        <div class="van-cell__value van-cell__value--alone van-contact-card__value">
          <div>姓名：{{item.userName}}</div>
          <div>关系：{{item.relation}}</div>
        </div>
        <!--<i  class="van-icon van-icon-arrow van-cell__right-icon">&lt;!&ndash;&ndash;&gt;</i>-->
        <span v-if="i!=0" @click.stop="edit(item,i)" style="color: blue">修改</span>
        <span v-if="i!=0" @click.stop="removeContact(item.userChildId)" style="margin-left:10px;color: red">删除</span>
      </div>
    </div>
    <van-popup position="top" closeable v-model="show" style="height: 50%">
        <div style="margin-top: 39px;"> </div>
      <van-cell-group>
        <van-field
          v-model="contact.userName"
          name="username"
          label="姓名"
          placeholder="姓名"
        />

        <van-field
          v-model="contact.userAge"
          name="userAge"
          label="年龄"
          placeholder="年龄"
        />

        <!--<van-field label="性别">-->
          <!--<template #input>-->
            <!--<van-radio-group v-model="contact.userSex">-->
              <!--<van-radio name="0">男</van-radio>-->
              <!--<van-radio name="1">女</van-radio>-->
            <!--</van-radio-group>-->
          <!--</template>-->
        <!--</van-field>-->
        <div class="van-cell  van-field">
          <div class="van-cell__title van-field__label">
            <span>性别</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-radio-group v-model="contact.userSex" style="display: flex">
                <van-radio name="0">男</van-radio>
                <van-radio name="1" style="margin-left: 20px">女</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
        <!--<van-field-->
          <!--readonly-->
          <!--clickable-->
          <!--name="birthday"-->
          <!--:value="contact.birthday"-->
          <!--label="出生日期"-->
          <!--placeholder="点击选择时间"-->
          <!--@click="showPicker = true"-->
        <!--/>-->
        <van-field
          v-model="contact.relation"
          name="relation"
          label="关系"
          placeholder="孩子、朋友等"
        />
      </van-cell-group>

        <div style="margin: 16px;" @click="editContact">
          <van-button round block type="info" native-type="submit">
            完成
          </van-button>
        </div>
    </van-popup>


    <!--<van-popup v-model="showPicker" position="bottom">-->
    <!--<van-datetime-picker-->
      <!--type="date"-->
      <!--:min-date="minDate"-->
      <!--:max-date="maxDate"-->
      <!--@confirm="onConfirm"-->
      <!--@cancel="showPicker = false"-->
    <!--/>-->
    <!--</van-popup>-->
  </div>
</template>
<script>
  import Cookies from "js-cookie"
  import { imageUrl } from '@/utils/global'
  import { timestampToDate } from "@/utils/datetime"
  import { Dialog } from 'vant';
  export default {
    components: {
      [Dialog.Component.name]: Dialog.Component,
    },
    name: 'Contact',
    data() {
      return {
        openId:'',
        state:'',
        docId:'',
        minDate: new Date(1920, 0, 1),
        maxDate: new Date(),
        showPicker:false,
        show:false,
        contactList:[],
        contact:{
          userName:'',
          userSex:'',
          userAge:'',
          relation:''
        }
      }
    },
    methods: {
      onAdd(){
        this.contact = {}
        this.show = true
      },
      onSubmit(values){
        console.log('submit', values);
      },
      onConfirm(date){
        this.contact.birthday = timestampToDate(date);
        this.showPicker = false;
      },
      confirm(userChildId){
        this.$router.push({path: '/teletext', query: {id: this.docId,userChildId:userChildId}})
      },
      selectContact(){
        this.openId = Cookies.get("openId")
        this.state = Cookies.get("state")
        this.$api.gongZhongHao.selectChildUserByUserId({openId:this.openId,state:this.state}).then((res) => {
          if(res.code == 200) {
            let data = res.rows
            this.contactList = data
          }
        })
      },
      editContact(){
        this.contact.openId = this.openId
        this.contact.state = this.state
        this.$api.gongZhongHao.editChildUser(this.contact).then((res) => {
          if(res.code == 200) {
            this.show = false
            this.selectContact()
          }
        })
      },
      removeContact(id){
        Dialog.confirm({
          message: '确认删除吗？',
        })
          .then(() => {
            // on confirm
            this.$api.gongZhongHao.removeChildUser({clientChildUserId:id?id:''}).then((res) => {
              if(res.code == 200) {
                this.selectContact()
              }
            })
          })
          .catch(() => {
            // on cancel
          });

      },
      edit(item,i){
        this.contact = item
        this.show = true
      }
    },
    mounted() {
      this.docId = this.$route.query.id
      this.selectContact();
    },
    created() {


    }
  }
</script>
<style scoped>

</style>
