<template>
  <div class="activeConfig">
    <div class="activeConfig-container">
      <Editor id="tinymce" v-model="tinymceHtml" :init="editorInit" />
    </div>
  </div>
</template>

<script>
// 引入元件
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
// 引入富文字編輯器主題的js和css
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
// 擴充套件外掛 image meadia table lists wordcount
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/autosave'

import 'tinymce/plugins/autoresize'
//import 'tinymce/plugins/formatpainter'

//以下元件為自定義元件，並且多圖片上傳，和百度地圖，表情包存在坑，這些坑後面再介紹
// import '@/plugins/axupimgs'
// import '@/plugins/bdmap'
// import '@/plugins/indent2em'
// import '@/plugins/lineheight'

export default {
  name: 'tinymce',
  components: { Editor },
  data() {
    return {
      // tinymce的繫結值
      tinymceHtml: '',
      // tinymce的初始化配置
      editorInit: {
        //tinumce容器
        selector: '#tinymce',
        //配置語言
        language_url: '/tinymce/langs/zh_TW.js',
        language: 'zh_TW',
        //配置皮膚
        skin_url: '/tinymce/skins/ui/oxide',
        //配置編輯器高度
        height: 500,
        min_height: 300,
        max_height: 650,
        width: 1000,
        min_width: 900,
        max_width: 1200,
        emoticons_database_url: '/emojis.js',
        emoticons_append: {
          diy1: {
            keywords: ['diy1'],
            char: '\uD83E\uDD2F',
            category: 'animals_and_nature',
          },
        },
        //配置外掛
        plugins:
          'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link' +
          ' media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist ' +
          'lists wordcount imagetools textpattern help autosave bdmap indent2em autoresize lineheight ' +
          'axupimgs emoticons',
        toolbar:
          'code undo redo restoredraft | cut copy paste pastetext | \
                        forecolor backcolor bold italic underline strikethrough link anchor | \
                        alignleft aligncenter alignright alignjustify outdent indent | \
                        styleselect formatselect fontselect fontsizeselect | bullist numlist | \
                        blockquote subscript superscript removeformat | \
                        table image media charmap hr pagebreak insertdatetime print preview | fullscreen | \
                        bdmap indent2em lineheight axupimgs emoticons',
        // 此處為圖片上傳處理函式
        iimages_upload_base_path: '/demo',
        images_upload_handler: function(blobInfo, succFun, failFun) {
          var xhr, formData
          var file = blobInfo.blob() //轉化為易於理解的file物件
          xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', '/demo/upimg2.php')
          xhr.onload = function() {
            var json
            if (xhr.status != 200) {
              failFun('HTTP Error: ' + xhr.status)
              return
            }
            json = JSON.parse(xhr.responseText)
            if (!json || typeof json.location != 'string') {
              failFun('Invalid JSON: ' + xhr.responseText)
              return
            }
            succFun(json.location)
          }
          formData = new FormData()
          formData.append('file', file, file.name)
          xhr.send(formData)
        },
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          '微軟雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;蘋果蘋方=PingFang SC,Microsoft YaHei,sans-serif;宋體=simsun,serif;仿宋體=FangSong,serif;黑體=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        link_list: [
          { title: '預置連結1', value: 'http://www.tinymce.com' },
          { title: '預置連結2', value: 'http://tinymce.ax-z.cn' },
        ],
        image_list: [
          {
            title: '預置圖片1',
            value: 'https://www.tiny.cloud/images/glyph-tinymce@2x.png',
          },
          {
            title: '預置圖片2',
            value: 'https://www.baidu.com/img/bd_logo1.png',
          },
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' },
        ],
        importcss_append: true,
        //自定義檔案選擇器的回撥內容
        file_picker_callback: function(callback, value, meta) {
          if (meta.filetype === 'file') {
            callback('https://www.baidu.com/img/bd_logo1.png', {
              text: 'My text',
            })
          }
          if (meta.filetype === 'image') {
            callback('https://www.baidu.com/img/bd_logo1.png', {
              alt: 'My alt text',
            })
          }
          if (meta.filetype === 'media') {
            callback('movie.mp4', {
              source2: 'alt.ogg',
              poster: 'https://www.baidu.com/img/bd_logo1.png',
            })
          }
        },
        autosave_ask_before_unload: false,
        // 水印“Powered by TinyMCE”
        branding: false,
        statusbar: false,
      },
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    // 圖片上傳
    handleImgUpload(blobInfo, success, failure) {},
  },
}
</script>

<style scoped lang="scss">
.activeConfig-container {
  margin-top: 30px;
  margin-left: 25%;
}
</style>
