// Copyright (C) 2025 Langning Chen
// 
// This file is part of miniapp.
// 
// miniapp is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// miniapp is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with miniapp.  If not, see <https://www.gnu.org/licenses/>.

import { BasePage } from './base-page.js'
class App extends $falcon.App {
  /**
   * 构造函数,应用生命周期内只构造一次
   */
  constructor() {
    super()
  }

  /**
   * 应用生命周期:应用启动. 初始化完成时回调,全局只触发一次.
   * @param {Object} options 启动参数
   */
  onLaunch(options) {
    super.onLaunch(options)
    // 屏幕分辨率适配机制:
    // 当 viewPort 设置750时, 所有元素尺寸可按照设计稿为 750px 宽度标准编写,
    // 最后系统会动态计算屏幕实际尺寸并显示.
    // 多机型自适应：以【宽度】为 vw 基准，以真实高度为 vh 基准。
    // viewPort 取真实宽度后，1vw == 画布宽/实际宽，1vh == 画布高/实际高，
    // X5Pro(640x260) 与 X7(960x266) 都能按自身尺寸正确缩放，正方形不会变形。
    let w = 0, h = 0
    try {
      const env = (typeof $falcon !== 'undefined' && $falcon.env) || (typeof WXEnvironment !== 'undefined' ? WXEnvironment : null)
      if (env) {
        w = env.deviceWidth || env.width || 0
        h = env.deviceHeight || env.height || 0
      }
    } catch (e) { w = 0 }
    if (!w) w = 640
    if (!h) h = Math.round(w * 254 / 800)
    this.setViewPort(w)
    this.screenW = w
    this.screenH = h

    // 设置页面基类,应用全局的$falcon.Page将被替换成此处指定的BasePage.
    // 继承自$falcon.Page的页面将继承自改基类.
    // 如页面未指定js,直接指向.vue文件,页面创建时会默认创建该类的实例
    $falcon.useDefaultBasePageClass(BasePage)
  }

  /**
   * 应用生命周期,应用启动或应用从后台切换到前台时触发
   */
  onShow() {
    super.onShow()
  }

  /**
   * 应用生命周期:应用退出前或者应用从前台切换到后台时触发
   */
  onHide() {
    super.onHide()
  }

  /**
   * 应用生命周期:应用销毁前触发
   */
  onDestroy() {
    super.onDestroy()
  }
}

try {
  globalThis['window'] = {
    requestAnimationFrame,
    cancelAnimationFrame
  }
} catch (err) {
  console.log(err)
}

try {
  globalThis['process'] = {
    env: {
      NODE_ENV: 'production'
    }
  }
} catch (err) {
  console.log(err)
}

export default App
