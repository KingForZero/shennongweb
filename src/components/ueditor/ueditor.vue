<template>
  <div>
    <script id="editor" type="text/plain" ></script>
  </div>
</template>

<script>
  import '../../../static/ueditor/ueditor.config.js'
  import '../../../static/ueditor/ueditor.all.js'
  import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
  import '../../../static/ueditor/jquery-2.2.3.min.js'

  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
      config: {
          type: Object
      },
      defaultMsg: {
        type: String
      }
    },
    data() {
      return {
        editor: null
      }
    },
    mounted() {
      //初始化UE
      const _this = this;
      this.editor = UE.delEditor("editor");
      this.editor = UE.getEditor('editor',this.config);
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    destoryed() {
      this.editor.destory();
    },
    methods:{
      getUEContent: function(){
       return this.editor.getContent();
      },
      setUEContent: function(data){
         this.editor.setContent(data);
      },
      getContentTxt: function(){
        return this.editor.getContentTxt();
      },
      destoryUE:function(){
        this.editor.destory();
      }
    }
  }
</script>
