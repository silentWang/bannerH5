<template>
  <div class="card_body">
    <div class="head_cls">
        <div class="head_info_cls">
            <img shape="square" class="userinfo_avatar_cls" :src="userInfo.avatarurl">
            <div class="user_nickname_cls">{{userInfo.nickname}}</div>
        </div>
        <div class="user_detail_cls">
            <div class="times_label_cls">模板diy次数: {{userInfo.num}}次</div>
            <span type="danger" class="get_times_cls" @click="getDIYTimes">获取次数</span>
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
            data-cate="pic"
            :style="getIconStyle(item)"
            v-for="(item, index) in iconInfos"
            :key="index"
            @click.prevent
            @touchstart.prevent
            @touchstart="drawXY">
            <img width="100%" src="@/assets/default_head.png"/>
        </div>
    </div>
    <div class="edit_container_cls" v-if="!showBuyDialog">
        <div v-if="curSelectItem && curSelectItem.value.length > 0">
            <div class="item_group_cls">
                <van-field class="item_content_cls" v-model="curSelectItem.value" label="内容" />
            </div>
            <div class="item_group_cls">
                <div>字体颜色</div>
                <div class="item_color_cls">
                    <div class="color_preview_cls" :style="{background:curSelectItem.color}"></div>
                    <!-- <color v-model="curSelectItem.color"></color> -->
                </div>
            </div>
            <div class="item_group_cls">
                <div class="item_label_cls">字体大小</div>
                <van-slider v-model="curSelectItem.size" :min="30" :max="360"/>
            </div>
            <van-button type="primary" class="common_button_cls" @click="createPic" block>生成海报</van-button>
        </div>
    </div>
    <div v-if="showBuyDialog">
        <DialogInput @confirmHandler="onConfirmInput"></DialogInput>
    </div>
  </div>
</template>

<script>
import DialogInput from './DialogInput.vue'
import { getBannerDetail, getUserInfo } from '../api/api'
import { loadFont,getPxToVW, getUrlVars } from '../util/utils'
export default {
  name: 'EditComp',
  components:{
    DialogInput
  },
  data () {
    return {
        "userInfo":{},
        "back_url": "",
        "template_id": '',
        "nameInfos":"",
        "ageInfos":"",
        "otherInfos":"",
        "iconInfos":"",
        "curSelectItem":null,
        "subTemplateList": [],
        "subTemplateIndex": 0,
        "fontId": '',
        "myTimesTxt":"剩余0次",
        "showBuyDialog":true
    }
  },
  created: function () {
    let that = this
    // 模板详情
    that.template_id = getUrlVars('templateId');
    getUserInfo().then(res=>{
        this.userInfo = res.data;
    })
  },
  methods:{
    onConfirmInput(data){
        let that = this;
        getBannerDetail(that.template_id,data.name,data.age).then(res=>{
            let data = res.data
            this.showBuyDialog = false;
            console.log(data)
            that.back_url = data.back_pic
            that.fontId = loadFont(data.font_url);
            that.subTemplateList = [data.extra];
            this.nameInfos = data.extra.name || [];
            this.ageInfos = data.extra.age || [];
            this.otherInfos = data.extra.other_text || [];
            this.iconInfos = data.extra.pic || [];
            this.clickItem(1,this.nameInfos[0])
        })
    },
    getTextStyle(item){
        let style = "";
        style += `fontSize: ${getPxToVW(item.size)}vw;`;
        style += `fontWeight:${item.bold ? 'bold' : ''};`;
        style += `fontFamily:${this.fontId};`;
        style += `left: ${getPxToVW(item.x)}vw;`;
        style += `top: ${getPxToVW(item.y)}vw;`;
        style += `width:${getPxToVW(item.w)}vw;`;
        style += `textAlign: ${item.textAlign};`;
        style += `color:${item.color};`;
        style += `transform: rotate(${item.rotation}deg)`;
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
    getShow(){
        return {show:this.showBuyDialog}
    },
    createPic(){
        let that = this
        html2canvas(document.getElementById('poster'), {
            allowTaint: true,
            useCORS: true,
        }).then(function(canvas) {
            console.log(canvas.toDataURL());
            document.body.appendChild(canvas);
            // that.convertCanvasToImg(canvas)
            var dataUrl = canvas.toDataURL("image/png");
            wx.miniProgram.navigateTo({
                url: `/pages/save/index?dataUrl=${dataUrl}`,
            });
        });
    },
    getDIYTimes(){
        this.showBuyDialog = true;
    },
    close(){

    },
    clickItem(type,item){
        this.curSelectItem = item;
        if(type != 0){

        }
    },
    drawXY(el){
        let that = this
        let oDiv = el.currentTarget; //当前元素
        let index = oDiv.dataset.index
        let cate = oDiv.dataset.cate
        let disX = el.touches[0].clientX - oDiv.offsetLeft;
        let disY = el.touches[0].clientY - oDiv.offsetTop;
        document.ontouchmove = function (e) {
            //通过事件委托，计算移动的距离
            let l = e.touches[0].clientX - disX;
            let t = e.touches[0].clientY - disY;
            //移动当前元素
            // if (l >= 0 && l <= window.innerWidth - oDiv.offsetWidth) {
            if (l >= 0 && l <= that.width - oDiv.offsetWidth) {
                that.subTemplateList[that.subTemplateIndex][cate][index].x = l
            }
            //移动当前元素
            // if (t >= 0 && t <= window.innerHeight - oDiv.offsetHeight ) {
            if (t >= 0 && t <= that.height - oDiv.offsetHeight ) {
                that.subTemplateList[that.subTemplateIndex][cate][index].y = t
            }
        };
        document.ontouchcancel = document.ontouchend = function (e) {
            document.ontouchmove = null;
            document.ontouchcancel = null;
            document.ontouchend = null;
        }
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
    .edit_container_cls {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
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
        display: flex;
    }
    .item_group_cls .item_label_cls{
        display: inline-block;
        margin: 0 0 4vw 0;
    }
    .item_color_cls .color_preview_cls {
        width: 10vw;
        background: #ff0000;
        margin-right: 10px;
    }
    .common_button_cls {
        width: 50vw;
        height: 10vw;
        margin: 0 auto;
        font-size: 5vw;
    }
    .head_info_cls {
        display: flex;
        flex-direction: row;
    }
    .userinfo_avatar_cls {
        width: 128px;
        height: 128px;
        margin: 40px 20px 20px 30px;
    }
    .user_nickname_cls {
        display: block;
        padding-top: 50px;
        font-weight: bold;
        margin-left: 10px;
    }
    .user_detail_cls {
        display: block;
        position: absolute;
        top: 110px;
        left: 180px;
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
