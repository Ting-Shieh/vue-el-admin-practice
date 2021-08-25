<template>
  <div class="">
    <div class="">
      <!-- Web 版 -->
      <!-- <editor id="tinymce" v-model="tinymceHtml" :init="editorInit" /> -->
      <!-- 我們的版本 -->
       <editor v-model="myValue"
          :init="init"
          :disabled="disabled"
          @onClick="onClick">
        </editor>
    </div>
    <!--  -->

  </div>
</template>

<script>
/** Web 版 */
/*
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
import 'tinymce/icons/default'
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
        // iimages_upload_base_path: '/demo',
        // images_upload_handler: function(blobInfo, succFun, failFun) {
        //   var xhr, formData
        //   var file = blobInfo.blob() //轉化為易於理解的file物件
        //   xhr = new XMLHttpRequest()
        //   xhr.withCredentials = false
        //   xhr.open('POST', '/demo/upimg2.php')
        //   xhr.onload = function() {
        //     var json
        //     if (xhr.status != 200) {
        //       failFun('HTTP Error: ' + xhr.status)
        //       return
        //     }
        //     json = JSON.parse(xhr.responseText)
        //     if (!json || typeof json.location != 'string') {
        //       failFun('Invalid JSON: ' + xhr.responseText)
        //       return
        //     }
        //     succFun(json.location)
        //   }
        //   formData = new FormData()
        //   formData.append('file', file, file.name)
        //   xhr.send(formData)
        // },
        images_upload_handler: function(blobInfo, succFun, failFun) {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
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
*/


/** 我們的版本 */
import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/icons/default'
export default {
	inject:['app'],
    components:{
        Editor
    },
    name:'tinymce',
    props: {
        value: {
          type: String,
          default: ''
        },
        disabled: {
          type: Boolean,
          default: false
        },
        plugins: {
          type: [String, Array],
          default: 'lists image media table wordcount'
        },
        toolbar: {
          type: [String, Array],
          default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
        }
    },
    data(){
        return{
            init: {
                language_url: '/tinymce/langs/zh_TW.js',
                language: 'zh_TW',
                skin_url: '/tinymce/skins/ui/oxide',
                // skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
                height: 500,
                plugins: this.plugins,
                toolbar: this.toolbar,
                branding: false,
                menubar: false,
                // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                images_upload_handler: (blobInfo, success, failure) => {
                  const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                  success(img)
                },
				// 自定義按鈕
				setup:(editor)=>{
					editor.ui.registry.addButton('imageUpload',{
						tooltip: '插入圖片',  // 提示文本
						icon: 'image',
						onAction:()=>{
							this.app.chooseImage((data)=>{
								// 拿到 url (可能為數組)， 插入到编辑器中
								data.forEach(item=>{
									editor.insertContent(`&nbsp;<img src="${item.url}">&nbsp;`)
								})
							},100)
						}
					})
				}
              },
              myValue: this.value
        }
    },
    mounted () {
        tinymce.init({})
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
        // 需要什么事件可以自己增加
        onClick (e) {
          this.$emit('onClick', e, tinymce)
        },
        // 可以添加一些自己的自定义事件，如清空内容
        clear () {
          this.myValue = ''
        }
    },
    watch: {
        value (newValue) {
          this.myValue = newValue
        },
        myValue (newValue) {
          this.$emit('input', newValue)
        }
    }
}

</script>
