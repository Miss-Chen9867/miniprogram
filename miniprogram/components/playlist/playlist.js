// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:"0",

  },
  observers:{
    ['playlist.playCount'](val){
      console.log(val);
      
      console.log(this._tranNmuner(val, 2));
      this.setData({
        count:this._tranNmuner(val, 2)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //格式化播放量 param point 保留多少个小数位
    _tranNmuner(num,point){
      let numStr = num.toString().split(".")[0];
      console.log(numStr.length);
      
      if (numStr.length<6) {
        return numStr
      }
      else if(numStr.length>=6 && numStr.length<=8){
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
        return parseFloat(parseInt(num/10000)+"."+decimal)+"万"
      }
      else if(numStr.length>=9){
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(num/100000000)+"."+decimal)+"亿"
      }
    }

  }
})
