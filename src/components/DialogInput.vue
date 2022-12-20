<template>
    <div>
        <div class="dialog_container">
            <div class="dialog_cls">
                <div class="dialog_title_cls">请输入您的姓名和年龄</div>
                <van-field class="input_dialog_cls" v-model="enterName" label="姓名" placeholder="请输入姓名"/>
                <van-field class="input_dialog_cls" v-model="enterAge" is-link readonly
                    label="年龄"
                    placeholder="选择年龄"
                    @click="showAgePicker = true"/>
                <van-button type="primary" class="confirm_btn_cls" @click="onConfirmInput" block>确定</van-button>
            </div>
        </div>
        <van-popup v-model="showAgePicker" round position="bottom">
            <van-picker :columns="ageSelectList" 
                title="选择年龄" show-toolbar
                @cancel="showAgePicker = false" @confirm="confirmAge" />
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return {
            "ageSelectList":[],
            "enterName":'',
            "enterAge":18,
            "showAgePicker":false
        }
    },
    mounted(){
        let ages = []
        for(let i = 1;i <= 120;i++){
            ages.push({value:i,text:i+'岁'});
        }
        this.ageSelectList = ages;
    },
    methods:{
        confirmAge(data){
            this.showAgePicker = false;
            this.enterAge = data.value;
        },
        onConfirmInput(){
            this.$emit('confirmHandler',{name:this.enterName,age:this.enterAge})
        }
    }
}
</script>

<style scoped>
    .dialog_container {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 999;
        background: rgba(0, 0, 0, 0.7);
        left: 0;
        top: 0;
    }
    .dialog_cls {
        width: 80vw;
        height: 60vw;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        margin: 0 auto;
        position: relative;
        top: 25vh;
        padding: 5vw;
        border-radius: 2vw;
    }
    .dialog_cls .input_dialog_cls {
        font-size: 4.8vw;
        line-height: 4.8vw;
        position: relative;
        margin-top: 8vw;
    }
    .confirm_btn_cls {
        position: relative;
        height: 10vw;
        font-size: 6vw;
        font-weight: bold;
        margin-top: 10vw;
    }
    .dialog_title_cls {
        font-size: 6vw;
        height: 6vw;
    }
</style>