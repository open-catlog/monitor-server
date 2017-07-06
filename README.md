## 1. 项目结构

- build/：存储 [moniter-view](https://github.com/open-catlog/monitor-view) 打包后的 JS 文件
- controllers/：控制器
- models/：数据库模型
- public/：页面入口
- tasks/：数据采集任务
- util/：基础工具
- app.js：项目入口文件
- config.js：项目配置文件
- routers.js：路由文件

## 2. 服务端主要工作

  - 负责页面的路由和逻辑处理
  - 是前端页面和数据库的中间介质
  - 采集和清理数据：
      - tasks/cleaner.js：定时进行数据库中的数据清理
      - tasks/hardwareMiner.js：收集各个服务器的硬件信息，硬件信息采集模块见 [os_tools](https://github.com/open-catlog/os_tools)
      - tasks/mysqlMiner.js：收集 MySQL 的增删改查次数信息，MySQL信息采集模块见 [mysqk_tools](https://github.com/open-catlog/mysql_tools)
      - tasks/nginxMiner.js：由于 Nginx 本身是 Web 服务器，所以可以直接通过 HTTP 请求进行数据获取，Nginx 的相关配置示例见 [nginxMonitor](https://github.com/open-catlog/nginxMonitor)

## 3. 运行步骤

为方便用户看效果，通过以下步骤可以在不连接数据库的情况下，进行效果的大致预览。首先要确保你的本机拥有 node 环境。

```
克隆项目到本地：git clone https://github.com/open-catlog/monitor-server
安装依赖：npm i
本地运行项目：npm run start
```

然后在浏览器输入 localhost:6789 就可以看到最终的页面展示了

## 4. 效果预览

### 4.1. PV/UV页面
  ![](http://cdn1.showjoy.com/images/d6/d6a3720b28a24e379d30d985ab3b7f10.png)
### 4.2. Nginx页面
  ![](http://cdn1.showjoy.com/images/af/af9423ee29f34d25a5685bd238b405e8.jpeg)