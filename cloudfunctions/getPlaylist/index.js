
// 云函数入口文件、
// 以下调用获取和云函数当前所在环境相同的数据库的引用
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const axios = require('axios')

const URL = 'https://apis.imooc.com/personalized?icode=634FF60E2F286449'

//将经常用到的集合抽离成变量 操作云数据库
const playlistCollection = db.collection('playlist')

// 小程序云开发的数据库调用是有限制的，小程序端每次最多只能调用20条，调用云函数也只能获取100条，在很多情况下就不方便。
//突破获取数据条数的限制
//分多次获取
const MAX_LIMIT = 10

// 云函数入口函数
exports.main = async (event, context) => {
  //获取云数据库 集合中的总数据条数
  const countResult = await playlistCollection.count()
  const total = countResult.total
  //算出要取多少次
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  //云函数操作云数据库 当数据量多的时候 采用多次取数据  promise.all
  const tasks = []
  //每次循环取数据
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    console.log("Promise.all",Promise.all(tasks));
    console.log(await Promise.all(tasks));
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 更新代码: axios发送请求，请求新的URL
  const {
    data
  } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const playlist = data.result
  const newData = []
  //获取歌曲单信息 进行 去重操作
  //理由是：当操作事件非常接近的时候，后台数据其实几乎没有什么变化
  //进行一个去重才做可以有效的提高操纵数据的效率
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      // 更新代码: 给每个歌单信息增加createTime属性
      let pl = playlist[i]
      pl.createTime = db.serverDate()
      // newData.push(playlist[i])
      newData.push(pl)
    }
  }
  console.log(newData)
  // 更新代码: 一次性批量插入数据
  if (newData.length > 0) {
    await playlistCollection.add({
      data: [...newData]
    }).then((res) => {
     console.log(res);
      console.log('插入成功')
    }).catch((err) => {
      console.log(err)
      console.error('插入失败')
    })
  }

  return newData.length
}