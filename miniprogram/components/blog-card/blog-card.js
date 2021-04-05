// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      const ds = event.target.dataset
      /* 
{imgs: Array(9), imgsrc: "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…303971269/blog/1615173156846-695099.771397393.jpg"}
imgs: (9) ["cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…303971269/blog/1615173156846-695099.771397393.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…03971269/blog/1615173156850-346691.8287226912.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…3971269/blog/1615173156851-418910.51913051493.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…03971269/blog/1615173156840-979003.3076616799.JPG", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…3971269/blog/1615173156843-185047.49400465624.JPG", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…03971269/blog/1615173156852-660109.1696515899.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…303971269/blog/1615173156848-452830.144884413.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…1303971269/blog/1615173156847-974249.03730461.jpg", "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57…303971269/blog/1615173156844-772696.325095936.jpg"]
imgsrc: "cloud://test-8gk2ms5v57b7d26c.7465-test-8gk2ms5v57b7d26c-1303971269/blog/1615173156846-695099.771397393.jpg"
__proto__: Object
      */
      console.log("预览图片",ds);
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
  }
})