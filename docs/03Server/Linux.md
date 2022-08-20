# Linux

## 1 服务状态查看命令(systemctl status server)

```text
systemctl 管理的 active(exited) 状态说明
使用systemctl 查看服务的状态，返回的状态有以下几种：

loaded ##系统服务已经初始化完成，加载过配置
active（running） ##正有一个或多个程序正在系统中执行， vsftpd就是这种模式
atcive（exited） ##仅执行一次就正常结束的服务， 目前并沒有任何程序在系統中执行
atcive（waiting）##正在执行当中，不过还在等待其他的事件才能继续处理
inactive #服务关闭
enbaled ##服务开机启动
disabled ##服务开机不自启
static ##服务开机启动项不可被管理
failed ##系统配置错误
```
