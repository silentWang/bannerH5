class DataModel {
    static _instance = null;
    static getInstance(){
        if(!this._instance){
            this._instance = new DataModel();
        }
        return this._instance
    }

    getUrlParams(){
        if(!this.urlParams){
            let url = window.location.href;
            let ourl = url.split('#')[0];
            let vurl = ourl.split('?')[1];
            let kv = {};
            if(vurl){
                let arr = vurl.split('&');
                for(let i = 0;i < arr.length;i++){
                    kv[arr[i].split('=')[0]] = arr[i].split('=')[1]
                }
            }
            this.urlParams = kv;
            console.log('urlParams',this.urlParams)
        }
        return this.urlParams;
    }

    setUserInfo(data){
        this.userInfo = data;
    }

}

export default DataModel.getInstance()