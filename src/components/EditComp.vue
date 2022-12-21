<template>
  <div class="card_body">
    <div class="head_cls">
        <div class="head_info_cls">
            <img shape="square" class="userinfo_avatar_cls" :src="userInfo.avatarurl">
            <div class="user_nickname_cls">{{userInfo.nickname}}</div>
        </div>
        <div class="user_detail_cls">
            <div class="times_label_cls">模板diy次数: {{userInfo.num}}次</div>
            <!-- <span type="danger" class="get_times_cls" @click="getDIYTimes">获取次数</span> -->
        </div>
    </div>
    <div id="poster" class="poster_cls" v-if="!showBuyDialog">
        <img class="bg_image_cls" :src="back_url + '?_=' + Date.now()" crossorigin="anonymous"/>
        <div class="common_item_cls" 
            v-for="(item, index) in nameInfos"
            :style="getTextStyle(item)"
            :key="'name_'+index"
            @click="clickItem(1,item)">{{ item.value }}
        </div>
        <div class="common_item_cls"
            :style="getTextStyle(item)"
            v-for="(item, index) in ageInfos"
            :key="'age_'+index"
            @click="clickItem(2,item)">{{ item.value }}
        </div>
        <div class="common_item_cls"
            :style="getTextStyle(item)"
            v-for="(item, index) in otherInfos"
            :key="'other_'+index"
            @click="clickItem(3,item)">{{ item.value }}
        </div>
        <div class="common_item_cls"
            :data-index="index"
            :style="getIconStyle(item)"
            v-for="(item, index) in iconInfos"
            :key="index"
            @click="clickItem(0,item)"
            @touchstart="startDragIcon">
            <img width="100%" :src="iconImage"/>
        </div>
    </div>
    <div class="edit_container_cls" v-if="!showBuyDialog">
        <van-list v-if="curSelectItem" class="edit_content_cls">
            <van-cell class="item_group_cls">
                <van-field class="item_content_cls" v-model="curSelectItem.value" />
            </van-cell>
            <van-cell class="item_group_cls">
                <div>字体颜色</div>
                <div class="item_color_cls">
                    <!-- <div class="color_preview_cls" :style="{background:curSelectItem.color}"></div> -->
                    <swatches-picker @input="updateColor" v-model="pickerColor"></swatches-picker>
                </div>
            </van-cell>
            <van-cell class="item_group_cls">
                <div class="item_label_cls">字体大小</div>
                <van-slider v-model="curSelectItem.size" :min="30" :max="360"/>
            </van-cell>
            <van-cell class="item_btn_cls">
                <van-button type="primary" class="common_button_cls" @click="createPic" block>预览</van-button>
            </van-cell>
        </van-list>
        <div v-else>
            <van-uploader :after-read="afterRead">
                <van-button icon="plus" type="primary" class="common_button_cls">更换图片</van-button>
            </van-uploader>
        </div>
    </div>
    <div v-if="showBuyDialog">
        <DialogInput @confirmHandler="onConfirmInput"></DialogInput>
    </div>
    <PreviewShow v-if="showPreview" @closePreviewEvent='closePreview' :imageUrl="resultBanner"></PreviewShow>
  </div>
</template>

<script>
import DialogInput from './DialogInput.vue'
import PreviewShow from './PreviewShow.vue'
import DataModel from '../api/DataModel'
import { Swatches } from "vue-color";
import { getBannerDetail, getUserInfo } from '../api/api'
import { loadFont,getPxToVW } from '../util/utils'
import default_head from '@/assets/default_head.png'
import CommonUtil from '../util/CommonUtil';
export default {
  name: 'EditComp',
  components:{
    DialogInput,
    PreviewShow,
    "swatches-picker":Swatches,
  },
  data () {
    return {
        "width":750,
        "height":422,
        "userInfo":{},
        "back_url": "",
        "template_id": '',
        "nameInfos":"",
        "ageInfos":"",
        "otherInfos":"",
        "iconInfos":"",
        "curSelectItem":null,
        "fontId": '',
        "myTimesTxt":"剩余0次",
        "showBuyDialog":true,
        "showPreview":false,
        "iconImage":default_head,
        "pickerColor":{},
        "resultBanner":''
    }
  },
  created: function () {
    this.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    this.height = 422*this.width/750
    console.log(this.width + '---' + this.height)
    this.template_id = DataModel.getUrlParams()['templateId'];
    getUserInfo().then(res=>{
        this.userInfo = res.data;
    })
  },
  methods:{
    onConfirmInput(data){
        getBannerDetail(this.template_id,data.name,data.age).then(res=>{
            let data = res.data
            this.showBuyDialog = false;
            console.log(data)
            this.back_url = data.back_pic
            this.fontId = loadFont(data.font_url);
            this.nameInfos = data.extra.name || [];
            this.ageInfos = data.extra.age || [];
            this.otherInfos = data.extra.other_text || [];
            this.iconInfos = data.extra.pic || [];
            this.clickItem(1,this.nameInfos[0])
        })
    },
    closePreview(){
        this.showPreview = false;
        this.resultBanner = '';
    },
    updateColor(color){
        this.curSelectItem.color = color.hex;
    },
    getTextStyle(item){
        let style = "";
        style += `fontSize: ${getPxToVW(item.size)}vw;`;
        style += `fontWeight:${item.bold ? 'bold' : ''};`;
        style += `fontFamily:${this.fontId};`;
        style += `left: ${getPxToVW(item.x)}vw;`;
        style += `top: ${getPxToVW(item.y)}vw;`;
        style += `width:${getPxToVW(item.w)}vw;`;
        style += `text-align: ${item.textAlign};`;
        style += `color:${item.color};`;
        style += `transform: rotate(${item.rotation}deg);`;
        if(item.shadow){
            style += `textShadow: ${getPxToVW(item.shadowSize)}vw ${getPxToVW(item.shadowSize)}vw ${getPxToVW(item.shadowSize)}vw ${item.shadowColor};`;
        }
        if(item.stroke){
            style += `textStroke:${getPxToVW(item.strokeSize)}vw ${item.strokeColor};`;
            style += `webkitTextStroke: ${getPxToVW(item.strokeSize)}vw ${item.strokeColor};`;
        }
        if(item.border){
            style += `border:1px dashed #000;`;
        }
        return style;
    },
    getIconStyle(item){
        let style = "";
        style += `left: ${getPxToVW(item.x)}vw;`;
        style += `top: ${getPxToVW(item.y)}vw;`;
        style += `width:${getPxToVW(item.w)}vw;`;
        style += `height:${getPxToVW(item.h)}vw;`;
        style += `transform: rotate(${item.rotation}deg);`;
        return style;
    },
    createPic(){
        let that = this;
        CommonUtil.showLoading('生成中');
        if(this.curSelectItem) this.curSelectItem.border = false;
        this.$forceUpdate();
        // this.clearBorder()
        setTimeout(() => {
            html2canvas(document.getElementById('poster'), {
                allowTaint: true,
                useCORS: true,
            }).then(function(canvas) {
                // console.log(canvas.toDataURL());
                // document.body.appendChild(canvas);
                // that.convertCanvasToImg(canvas)
                that.resultBanner = canvas.toDataURL("image/png");
                that.showPreview = true;
                CommonUtil.hideLoading();
                // let dataUrl = canvas.toDataURL("image/png");
                // wx.miniProgram.navigateTo({
                //     url: `/pages/save/index?dataUrl=${dataUrl}`,
                // });
            });
        }, 1000);
    },
    clearBorder(){
        let eles = document.getElementsByClassName('common_item_cls');
        if(!eles || eles.length == 0) return;
        for(let i = 0,len = eles.length;i < len;i++){
            let ele = eles[i];
            ele.border = 'none'
        }
    },
    getDIYTimes(){},
    afterRead(file){
      // 此时可以自行将文件上传至服务器
      this.iconImage = file.content;
    },
    clickItem(type,item){
        if(this.curSelectItem){
            this.curSelectItem.border = false;
        }
        if(type != 0){
            this.curSelectItem = item;
            this.curSelectItem.border = true;
        }
        else{
            this.curSelectItem = null;
        }
    },
    startDragIcon(el){
        let that = this
        let oDiv = el.currentTarget; //当前元素
        let index = oDiv.dataset.index
        let iconInfo = this.iconInfos[index]
        let disX = el.targetTouches[0].clientX;
        let disY = el.targetTouches[0].clientY;
        let dx = oDiv.offsetLeft;
        let dy = oDiv.offsetTop;
        let moveFunc = (e)=>{
            //通过事件委托，计算移动的距离
            let l = e.targetTouches[0].clientX - disX + dx;
            let t = e.targetTouches[0].clientY - disY + dy;
            //移动当前元素
            if (l >= 0 && l <= that.width - oDiv.offsetWidth) {
                oDiv.style.left = l + 'px';
                // iconInfo.x = l
            }
            //移动当前元素
            if (t >= 0 && t <= that.height - oDiv.offsetHeight ) {
                oDiv.style.top = t + 'px';
                // iconInfo.y = t
            }
        }
        let endFunc = ()=>{
            document.removeEventListener('touchmove',moveFunc);
            document.removeEventListener('touchcancel',endFunc);
            document.removeEventListener('touchend',endFunc);
        }
        document.addEventListener('touchmove',moveFunc);
        document.addEventListener('touchcancel',endFunc);
        document.addEventListener('touchend',endFunc);
    },
  }
}
</script>

<style scoped>
    .card_body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .poster_cls {
        width: 100vw;
        height: 56.26vw;
        position: relative;
        overflow: hidden;
    }
    .bg_image_cls {
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
    }
    .head_cls {
        height: 30vw;
        margin-bottom: 2vw;
        font-size: 4.8vw;
        border-bottom: 1px solid #999;
        background: #eff2f5;
    }
    .common_item_cls {
        position: absolute;
        border-bottom: 1px solid #eee;
    }
    .common_item_cls img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .edit_container_cls {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        overflow-y: scroll;
        height: calc(100vh - 88.5vw);
    }
    .edit_content_cls {
        width: 100%;
        overflow-y: auto;
    }
    .item_group_cls {
        text-align: left;
        font-size: 4vw;
        border-top: 1px solid #eee;
        padding: 4vw;
        margin: 2vw 0;
        background: #eff2f5;
    }
    .item_group_cls .item_content_cls {
        font-size: 4vw;
        line-height: 4vw;
        border-radius: 1vw;
    }
    .item_group_cls .item_color_cls {
        margin-top: 1vw;
    }
    .item_group_cls .item_label_cls{
        display: inline-block;
        margin: 0 0 4vw 0;
    }
    .item_group_cls .van-slider {
        margin: 0 auto;
        width: 80vw;
        height: 2.5vw;
        margin-bottom: 2.5vw;
    }
    .item_color_cls .color_preview_cls {
        width: 10vw;
        height: 10vw;
        background: #ff0000;
        margin-right: 10px;
    }
    .item_color_cls .vc-swatches {
        width: 90vw;
    }
    .item_btn_cls {
        padding:2.5vw;
    }
    .common_button_cls {
        width: 50vw;
        height: 10vw;
        margin: 0 auto;
        font-size: 5vw;
        position: relative;
    }
    .head_info_cls {
        display: flex;
        flex-direction: row;
    }
    .userinfo_avatar_cls {
        width: 18vw;
        height: 18vw;
        margin: 7.5vw 5vw;
    }
    .user_nickname_cls {
        display: block;
        padding-top: 9vw;
        font-weight: bold;
        margin-left: 1vw;
    }
    .user_detail_cls {
        display: block;
        position: absolute;
        top: 18vw;
        left: 28vw;
    }
    .times_label_cls {
        display: inline-block;
    }
    .get_times_cls {
        display: inline-block;
        font-size: 36px;
        margin: 0 0 5px 10px;
        color: #ff0000;
        border-bottom: 1px #ff0000 solid;
    }
</style>
