// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:null,
    age:null,
    habbit:[],
    getdata:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name, options.age)
    this.setData({ name: options.name, age: options.age, habbit: JSON.parse(options.habbit).join("、")})
  },
  getdata:function(n=0){
    const that=this;
    const db = wx.cloud.database();
    db.collection('list').doc("list002").get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data);
        that.setData({getdata:res.data})
      
      },
      fail:function(res){
        console.log(res.errCode);
        if(n===1){
          wx.showToast({
            title: '删除成功',
          })
          that.setData({ getdata: null })
        }
        else{
          if (res.errCode === -1) {
            wx.showToast({
              title: '无此数据',
            })
            that.setData({ getdata: null })
          }
        }
        
      }
    })
  },
  insertdata:function(){
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
         _id: 'list002', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        id: "3",
        name:"王五",
        age:"20"
       
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.getdata();
      }
    })
  },
  updatedata:function(){
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').doc('list002').update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name: "王六"
      },
      success: function (res) {
        console.log(res);
        that.getdata();
      }
    })
  },
  deletedata:function(){
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').doc('list002').remove({
      success: function (res) {
        console.log(res);
        that.getdata(1);
      }
    })
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})