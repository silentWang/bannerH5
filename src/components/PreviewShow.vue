<template>
    <div class="container_cls">
        <div class="content_cls">
            <img :src="imageUrl">
            <img :src="watermarkIcon" class="watermark_cls">
            <van-row class="btn_list_cls">
                <van-button class="btn_cls" type="primary" @click="clickClose">重新diy</van-button>
                <van-button class="btn_cls" type="primary" @click="saveToPhone">保存模板</van-button>
            </van-row>
        </div>
    </div>
</template>

<script>
import watermark from '@/assets/watermark.png'
import {Dialog} from 'vant'
import DataModel from '../api/DataModel'
import CommonUtil from '../util/CommonUtil'
import { uploadTemplateInfo , getUserInfo} from '../api/api';
export default {
    props:{
        imageUrl:'',
    },
    data(){
        return {
            watermarkIcon:watermark,
        }
    },
    methods:{
        clickClose(){
            this.$emit('closePreviewEvent');
        },
        saveToPhone(){
            Dialog.confirm({
                title: '提示',
                message: '请确定是否消耗1次DIY次数？保存后不可修改',
            }).then(() => {
                CommonUtil.showLoading();
                let params = DataModel.getUrlParams();
                uploadTemplateInfo(params.templateId,this.imageUrl).then((response)=>{
                    CommonUtil.hideLoading();
                    if(response.code != 0) {
                        if(response.code == 888){
                            wx.miniProgram.navigateTo({
                                url: '../pay/paypage',
                                success:function(res){
                                    res.eventChannel.emit('downloadBannerEvent',{imageurl:response.data.pic_url})
                                }
                            });
                        }
                        else{
                            CommonUtil.showToast(response.msg);
                        }
                        return;
                    }
                    CommonUtil.showToast('生成成功');
                    // wx.downloadImage({
                    //     serverId: response.data.pic_url,//图片的地址
                    //     success:function(res){
                    //         console.log('图片保存成功',res)
                    //     }
                    // })
                    wx.miniProgram.switchTab({
                        url: '../mine/mine',
                        success:function(res){
                            res.eventChannel.emit('downloadBannerEvent',{imageurl:response.data.pic_url})
                        }
                    });
                })
            }).catch(() => {
                // on cancel
            });
        }
    }
}
</script>
<style scoped>
.container_cls{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
}
.content_cls {
    display: flex;
    flex-direction: column;
    position: relative;
    top: 40vw;
}
.content_cls img {
    width: 100vw;
    display: block;
    position: relative;
}
.watermark_cls {
    display: block;
    position: absolute !important;
}
.btn_list_cls {
    position: relative;
    top: 5vw;
}
.btn_cls {
    width: 40vw;
    height: 10vw;
    font-size: 5vw;
    margin: 3vw;
}
</style>
