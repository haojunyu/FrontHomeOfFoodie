// component/addsub/addsub.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    count:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cartSub:function(){
      var newCnt = this.data.count-1
      this.setData({
        count:newCnt
      })
      this.triggerEvent('changeCnt', { count: newCnt })
    },
    cartAdd:function(){
      var newCnt = this.data.count + 1
      this.setData({
        count:newCnt
      })
      this.triggerEvent('changeCnt', { count: newCnt })
    }
  }
})
