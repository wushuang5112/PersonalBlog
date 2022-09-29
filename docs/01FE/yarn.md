Yarn配置与命令

修改Yarn的全局安装和缓存位置
在CMD命令行中执行

#1.改变 yarn 全局安装位置
yarn config  set global-folder "你的磁盘路径"

#2.然后你会在你的用户目录找到 `.yarnrc` 的文件，打开它，找到 `global-folder` ，改为 `--global-folder`
#这里是我的路径
yarn config set global-folder "D:\yarnData\global"

#2. 改变 yarn 缓存位置
yarn config set cache-folder "你的磁盘路径"

#这里是我的路径
yarn config set cache-folder "D:\yarnData\cache"
在我们使用 全局安装 包的时候，会在 “D:\Software\yarn\global” 下 生成node_modules\.bin目录

#3. 改变yarn bin位置
yarn config set prefix D:\yarnData\global\bin

我们需要将D:\Software\yarn\global\bin整个目录 添加到系统环境变量中去，否则通过yarn 添加的全局包 在cmd 中是找不到的。
检查当前yarn 的 bin的 位置
yarn global bin
检查当前 yarn 的 全局安装位置
yarn global dir

#4.设置淘宝源
yarn config set registry https://registry.npm.taobao.org/

#5. 控制台输入命令, 正常显示版本表示安装成功
yarn -v		# 查看yarn版本

#6. 查看yarn的所有配置
yarn config list		# 查看yarn配置

