// pages/end/end.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'table',
      attrs: {
        class: 'div_class',
        style: 'border:1px solid #000'
      },
      children: [{
        name: 'tr',
        children: [{
            name:'td',
            children:[{type:'text',text:"姓名"}]
        }, {
            name: 'td',
            children: [{ type: 'text', text: "年龄" }]
          }]
      }],
      id:null
    }],
    result:[],
    region: ['广东省', '广州市', '海珠区'], toView: 'red',
    scrollTop: 100,
    customItem: '全部'
  },
  
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  
  formSubmit: function (e) {
    console.log(e)
    let name = e.detail.value.name;
    
    this.getdata(name)
  },
  getdata: function (name,n = 0) {
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').where({
      name
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data);
        that.setData({ result: res.data })

      },
      fail: function (res) {
        console.log(res.errCode);
        if (n === 1) {
          wx.showToast({
            title: '删除成功',
          })
          that.setData({ getdata: null })
        }
        else {
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
  
  upload: function () {
    var that = this;
    
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
        wx.cloud.uploadFile({
          cloudPath:'001.jpg', // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            that.setData({ id: res.fileID})
            console.log(res.fileID)
          },
          fail: console.error
        })
      
      },
      fail: function (error) {
        console.error("调用本地相册文件时出错")
        console.warn(error)
      },
      complete: function () {
      }
    })
  },
  download:function(){
    const that=this;
    console.log(that.data.id)
    wx.cloud.downloadFile({
      fileID: that.data.id, // 文件 ID
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) { console.log(res)},
          fail(res){
            console.log(res)
          }
        })
        // 返回临时文件路径
        console.log(res.tempFilePath)
        that.setData({ src: res.tempFilePath })
      },
      fail: console.error
    })
    
  }
})