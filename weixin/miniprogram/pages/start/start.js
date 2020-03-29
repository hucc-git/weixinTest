// pages/start/start.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit:function(e){
   console.log(e)
    let name = e.detail.value.name;
    let age = e.detail.value.age;
    let sex = e.detail.value.sex;
    let habbit = e.detail.value.habbit;
    this.insertdata(name,age,sex,habbit)
  },
  checkboxChange:function(e){
    console.log(e)
  },
  getdata: function (n = 0) {
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').doc("list002").get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data);
        that.setData({ getdata: res.data })

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
  insertdata: function (name, age, sex, habbit) {
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name,
        age,
        sex,
        habbit
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
        })
        console.log(res)
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        // that.getdata();
      }
    })
  },
  updatedata: function () {
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
  deletedata: function () {
    const that = this;
    const db = wx.cloud.database();
    db.collection('list').doc('list002').remove({
      success: function (res) {
        console.log(res);
        that.getdata(1);
      }
    })

  },
})