# GRE隧道建立(命令行)

主机A:
192.168.0.123
192.118.30.3(br2桥地址)

主机B:
192.168.0.124

## 场景一(单点传输 Tunnel-1):
![场景一](./resources/pic4.png)
### 主机A上执行如下操作:
```bash
ip tunnel add Tunnel-1 mode gre remote 192.168.0.123 local 192.168.0.124
ip addr add 192.118.30.2/24 dev Tunnel-1
ip link set Tunnel-1 up
```

### 主机B上执行如下操作:
```bash
ip tunnel add Tunnel-1 mode gre remote 192.168.0.124 local 192.168.0.123
ip addr add 192.118.30.4/24 dev Tunnel-1
ip link set Tunnel-1 up
```

## 场景二(两个不同网段进行传输 Tunnel-2):
![场景二](./resources/pic_1.png)
### 主机A上执行如下操作:
```bash
ifconfig br1:1 192.168.160.1/24
ip tunnel add Tunnel-2 mode gre local 192.168.160.1 remote 192.168.160.2
ifconfig Tunnel-2 up
ifconfig Tunnel-2 20.1.2.1/24
route add -net 20.1.3.0/24 gw 20.1.2.1


```

### 主机B上执行如下操作:
```bash
ifconfig br1:1 192.168.160.2/24
ip tunnel add Tunnel-2 mode gre remote 192.168.160.1 local 192.168.160.2
ifconfig Tunnel-2 up
ifconfig Tunnel-2 20.1.3.1/24
route add -net 20.1.2.0/24 gw 20.1.3.1
```

### 测试
```bash
# 主机A上执行
tcpdump -ni any host 192.168.160.1 # 抓包
ping 20.1.3.1 # 别起一个Terminal

# 主机B上执行
ping 20.1.2.1
```

> 亲测可用 && 详细文档参阅 [GRE隧道建立](./GRE隧道建立.md)
