// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'Pfin8fQI5JPIWeP6EvgZbNQsmlHkUKo_6-4IJ8BtDEw',
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      data: {
        thing1: {
          value: event.content,
        },
        thing5: {
          value:  event.createTime,
        }
      },
      miniprogramState: 'developer'
    })
  } catch (err) {
    console.log(err)
  }

}