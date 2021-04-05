


// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object,
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    modalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                console.log("用户信息",userInfo);
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },

    onLoginsuccess(event) {
      //但用户评论没有授权时，得授权，根据授权的函数再次得到用户信息
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },

    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },

    //评论框里边的发送按钮
    onSend(event) {
      // 插入数据库
      console.log("onSend")
      let content = this.data.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true,
      })
      // 在小程序端插入数据 会自带 _openid
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        // 推送订阅消息
        wx.cloud.callFunction({
          name: 'subscribeMsg',
          data: {
            content,
            blogId: this.properties.blogId
          }
        }).then((res) => {
          console.log("发送成功",res)
        })

        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })

        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })
    },
    // 调起客户端小程序订阅消息界面
    subscribeMsg() {
      console.log("调起客户端小程序订阅消息界面")
      // Pfin8fQI5JPIWeP6EvgZbNQsmlHkUKo_6-4IJ8BtDEw
      const tmplId = 'Pfin8fQI5JPIWeP6EvgZbNQsmlHkUKo_6-4IJ8BtDEw'
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: (res) => {
          console.log(res)
          if (res[tmplId] === 'accept') {
            this.onComment()
          } else {
            wx.showToast({
              icon: 'none',
              title: '订阅失败，无法评论',
            })
          }
        }
      })
    },
    // 获取textarea内容
    onInput(event){
        this.setData({
          content: event.detail.value
        })
    }

  }
})