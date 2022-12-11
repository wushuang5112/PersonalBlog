# 常用命令

## 第一步 在云服务器上安装 zerotier-one

### 方法一 更简单
```bash
$ curl -s https://install.zerotier.com | sudo bash
```

### 方法二 更安全
> 要求系统中安装了 GPG
```bash
$ curl -s 'https://raw.githubusercontent.com/zerotier/ZeroTierOne/master/doc/contact%40zerotier.com.gpg' | gpg --import && \
if z=$(curl -s 'https://install.zerotier.com/' | gpg); then echo "$z" | sudo bash; fi
```

## 第二步 云服务器加入虚拟网络
执行命令，将云服务器加入到自己创建好的虚拟网络，将命令中的 xxxxxxxx 替换成实际的虚拟网络 ID。
```bash
$ sudo zerotier-cli join xxxxxxxx
```

## 第三步 配置 Moon
进入 zerotier-one 程序所在的目录，默认为 /var/lib/zerotier-one。
```bash
$ cd /var/lib/zerotier-one
```

### 生成 moon.json 配置文件
```bash
$ sudo zerotier-idtool initmoon identity.public >> moon.json
```

### 编辑 moon.json 配置文件
```bash
$ sudo nano moon.json
```

### 将配置文件中的 "stableEndpoints": [] 修改成 "stableEndpoints": ["ServerIP/9993"]，将 ServerIP 替换成云服务器的公网IP。

### 生成 .moon 文件
```bash
$ sudo zerotier-idtool genmoon moon.json
```
将生成的 000000xxxxxxxxxx.moon 移动到 moons.d 目录
```bash
$ sudo mkdir moons.d
$ sudo mv 000000xxxxxxxxxx.moon moons.d
```
> .moon 配置文件的名一般为10个前导零+本机的节点ID

### 重启 zerotier-one 服务
```bash
$ sudo systemctl restart zerotier-one
```

## 使用 Moon
普通的 Zerotier 成员使用 Moon 有两种方法:
第一种方法是使用 zerotier-cli orbit 命令直接添加 Moon 节点ID；
第二种方法是在 zerotier-one 程序的根目录创建moons.d文件夹，将 xxx.moon 复制到该文件夹中;
我们采用第一种方法：

### Linux 系统下使用 Moon
将命令中的两组 xxxxxxxxxx 都替换成 moon 的节点ID。
```bash
$ sudo zerotier-cli orbit xxxxxxxxxx xxxxxxxxxx
```

### 检查是否添加成功
```bash
$ sudo zerotier-cli listpeers
```

### Windows 系统下使用 Moon
以管理员身份打开 PowerShell，将命令中的两组 xxxxxxxxxx 都替换成 moon 的节点ID。
```bash
PS C:\Windows\system32> zerotier-cli.bat orbit xxxxxxxxxx xxxxxxxxxx
```
检查是否添加成功
```bash
PS C:\Windows\system32> zerotier-cli.bat listpeers
```
> 提示：Windows 系统的默认程序目录位于 C:\Program Files (x86)\ZeroTier\One。

## 常见问题一：电脑添加了虚拟网络，但Zerotier管理列表中始终没有显示这台设备
答：可以尝试在Zerotier管理界面中 Advanced -> Manually Add Member 中手动添加电脑的节点ID。

# 相关链接
[Zerotier 官网](https://www.zerotier.com/)
[Creating Your Own Roots (a.k.a. Moons)](https://www.zerotier.com/manual/#4_4)
[参考资料](https://blog.csdn.net/never_late/article/details/127329225)


# ------------------------------------------------------------------------------
# 查看Zerotier节点信息
zerotier-cli info
```bash
root@bdefb925d691:/# zerotier-cli info
200 info 1169545b64 1.8.4 ONLINE
```

# 查看Zerotier节点状态
zerotier-cli status
```bash
root@HankingRoutes:~# zerotier-cli status
200 info fda24cc8c2 1.6.5 ONLINE
```

# 查看节点状态
zerotier-cli listnetworks
```bash
root@HankingRoutes:~# zerotier-cli listnetworks
200 listnetworks <nwid> <name> <mac> <status> <type> <dev> <ZT assigned ips>
200 listnetworks 1169545b648296ee 内网穿透 ee:6b:20:28:93:96 OK PRIVATE ztjig5ntmk 10.251.25.34/24
```
