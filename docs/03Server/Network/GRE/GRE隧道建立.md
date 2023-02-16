# ubantu与CentOS虚拟机之间搭建GRE隧道

## 0. 前言
在学习ipsec过程中，一般都会涉及到ipsec的局限性：ipsec****协议是一种点对点协议，不支持组播，也不能保护组播、广播报文。因此ipsec协议无法用于音视频会议等场合，此时通常的解决办法是采用GRE Over IPSec. 给出的解释是：GRE协议可以封装组播、广播报文，但是无法对业务内容进行加密；而ipsec可以对报文进行加密，但是无法封装组播和广播报文。因此将两种协议结合，因而GRE over IPSec协议应运而生。 但是我找了很多资料(其实没有多少)，都没有找到为什么GRE协议支持封装组播和广播报文，而ipsec不行；他们作为点对点协议，为什么GRE可以而IPsec不行呢？ 因为没有找到答案，所以不能证实自己的想法正确与否，于是通过搭建GRE隧道环境，学习Linux内核中GRE隧道的操作配置原则，希望能从中得到些许启发。
搭建GRE隧道环境实际上是很简单的，因为Linux内核已经支持了GRE隧道，因此直接在虚拟机(ubantu和CentOS)里进行简单的配置即可完成操作。

![虚拟机图片](./resources/pic1.awebp)

## 1. Linux内核支持的隧道类型
目前Linux内核已经支持多种隧道类型，包括：IPIP隧道，GRE隧道，... 。其余这几个我也没见过。当然除了这几种，还有ipsec协议，l2tp协议，可以的是我目前都还没有用过，实在是暴殄天物，罪过罪过
![图片1](./resources/pic2.awebp)
![图片2](./resources/pic3.awebp)
下面通过搭建两组拓扑环境，来学习GRE隧道的基本规则，然后在此基础上分析下GRE和IPSEC在组播和广播报文封装的表现出不同行为的可能原因(另写一遍文章喽)。

## 2. GRE隧道跨(公)网连接相同子网地址主机
## 2.1 拓扑环境：
![拓扑环境](./resources/pic4.awebp)

## 2.1 ubantu配置：
首先，我确定了下该虚拟机中是否存在gre相关的接口，结果当然是没有了。
```bash
root@ubantu:/home/toney# ifconfig -a
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2409:8a00:18e9:810:141:383c:ac6f:8b11  prefixlen 64  scopeid 0x0<global>
        inet6 2409:8a00:18e9:810:f8dd:500e:b1a:463b  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::8e84:574c:7a8b:440a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:fb:db:ad  txqueuelen 1000  (Ethernet)
        RX packets 3581  bytes 1030105 (1.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1177  bytes 114532 (114.5 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 160  bytes 12920 (12.9 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 160  bytes 12920 (12.9 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## 2.1.1 添加GRE隧道
> ip tunnel add Tunnel-1 mode gre remote 192.168.1.13 local 192.168.1.10
添加GRE隧道时,需要指定隧道的名称，我这里叫做Tunnel-1; 因为要搭建GRE类型隧道，因此mode为gre。 而GRE隧道的地址为192.168.1.13<========>192.168.1.10。
由于是第一次执行此命令，底层实际上安装上了gre隧道相关的驱动。用户只有在此基础上才能配置GRE隧道，不过，无需担心，内核自动完成。
如果在添加隧道时不指定remote和local地址，也是可以的，它实际上是只是安装gre隧道相关驱动。下面是添加隧道时没有指定remote和local地址时的结果：

```bash
root@ubantu:/home/toney# ip tunnel add Tunnel-1
cannot determine tunnel mode (ipip, gre, vti or sit)
root@ubantu:/home/toney# ifconfig -a
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2409:8a00:18e9:810:141:383c:ac6f:8b11  prefixlen 64  scopeid 0x0<global>
        inet6 2409:8a00:18e9:810:200d:99e2:4f3d:cb6f  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::8e84:574c:7a8b:440a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:fb:db:ad  txqueuelen 1000  (Ethernet)
        RX packets 5038  bytes 5896155 (5.8 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2744  bytes 309264 (309.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 164  bytes 15044 (15.0 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 164  bytes 15044 (15.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

root@ubantu:/home/toney# ip tunnel add Tunnel-1 mode gre
add tunnel "gre0" failed: File exists
root@ubantu:/home/toney# ifconfig -a
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2409:8a00:18e9:810:141:383c:ac6f:8b11  prefixlen 64  scopeid 0x0<global>
        inet6 2409:8a00:18e9:810:200d:99e2:4f3d:cb6f  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::8e84:574c:7a8b:440a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:fb:db:ad  txqueuelen 1000  (Ethernet)
        RX packets 5097  bytes 5900501 (5.9 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2766  bytes 311496 (311.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

erspan0: flags=4098<BROADCAST,MULTICAST>  mtu 1450
        ether 00:00:00:00:00:00  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

gre0: flags=128<NOARP>  mtu 1452
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

gretap0: flags=4098<BROADCAST,MULTICAST>  mtu 1462
        ether 00:00:00:00:00:00  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 164  bytes 15044 (15.0 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 164  bytes 15044 (15.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

root@ubantu:/home/toney#
root@ubantu:/home/toney# lsmod | grep gre
ip_gre                 28672  0
ip_tunnel              24576  1 ip_gre
gre                    16384  1 ip_gre
root@ubantu:/home/toney#
```
如果输入完整的命令，则会成功添加上Tunnel-1隧道：
```bash
root@ubantu:/home/toney# ifconfig -a
Tunnel-1: flags=144<POINTOPOINT,NOARP>  mtu 1476
        unspec C0-A8-01-0A-00-00-00-87-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2409:8a00:18e9:810:141:383c:ac6f:8b11  prefixlen 64  scopeid 0x0<global>
        inet6 2409:8a00:18e9:810:200d:99e2:4f3d:cb6f  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::8e84:574c:7a8b:440a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:fb:db:ad  txqueuelen 1000  (Ethernet)
        RX packets 5745  bytes 5947674 (5.9 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2965  bytes 329731 (329.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

erspan0: flags=4098<BROADCAST,MULTICAST>  mtu 1450
        ether 00:00:00:00:00:00  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

gre0: flags=128<NOARP>  mtu 1452
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

gretap0: flags=4098<BROADCAST,MULTICAST>  mtu 1462
        ether 00:00:00:00:00:00  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 169  bytes 15509 (15.5 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 169  bytes 15509 (15.5 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```


## 2.1.2 配置GRE隧道接口IP
> ip addr add 10.1.2.1/24 dev Tunnel-1
或者
> ifconfig Tunnel-1 10.1.2.1/24
从添加隧道结果来看，Tunnel-1接口虽然已经成功添加，但是处于down状态，此外也没有IP地址。 不，等等，那我们在添加隧道时指定的remote和local是什么呢？
**它是经过GRE隧道封装后的报文IP地址，但是针对什么报文进行封装，目前我们尚未配置。**
配置此接口IP的目的是：为了确定哪些报文需要进入GRE接口，然后进行隧道封装。为什么需要添加IP呢？ 因为我们是通过路由将报文引入到Tunnel-1接口的, 如果不填IP，那么我路由的下一条该写成什么呢， 是吧。
![路由表](./resources/pic5.awebp)

## 2.1.3 激活GRE隧道接口IP
> ifconfig Tunnel-1 up
或者
> ip link set Tunnel-1 up
至于配置接口IP和是否up接口，没有什么先后顺序，把他们当做不同的eth接口处理即可。
![隧道信息](./resources/pic6.awebp)

## 2.2 CentOS配置：
CentOS虚拟机的配置和Ubantu的配置完全相同，安照此步骤操作即可。
> ip tunnel add Tunnel-1 mode gre local 192.168.1.13 remote 192.168.1.10
> ip link set Tunnel-1 up
> ip addr add 10.1.2.2/24 dev Tunnel-1
查看配置结果r如下：
```bash
[root@toney toney]#
[root@toney toney]#
[root@toney toney]# ifconfig
Tunnel-1  Link encap:UNSPEC  HWaddr C0-A8-01-0D-FF-FF-90-6D-00-00-00-00-00-00-00-00
          inet addr:10.1.2.2  P-t-P:10.1.2.2  Mask:255.255.255.0
          UP POINTOPOINT RUNNING NOARP  MTU:1476  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:0 (0.0 b)  TX bytes:0 (0.0 b)

eth0      Link encap:Ethernet  HWaddr 00:0C:29:DA:34:3C
          inet addr:192.168.1.13  Bcast:192.168.1.255  Mask:255.255.255.0
          inet6 addr: 2409:8a00:18e9:810:20c:29ff:feda:343c/64 Scope:Global
          inet6 addr: fe80::20c:29ff:feda:343c/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:3571 errors:0 dropped:0 overruns:0 frame:0
          TX packets:781 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:236685 (231.1 KiB)  TX bytes:71021 (69.3 KiB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:4 errors:0 dropped:0 overruns:0 frame:0
          TX packets:4 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:240 (240.0 b)  TX bytes:240 (240.0 b)
```
路由表信息如下：
![路由表](./resources/pic7.awebp)

## 2.3 ping包测试通讯链路：
这里有一点需要注意：Linux系统可能开了iptables过滤功能，因此在ping时出现了类似" ICMP host 192.168.1.13 unreachable - admin prohibited, length 116"信息，详情如下：
![路由表](./resources/pic8.awebp)
百度一下,在两台虚拟机上都执行如下操作即可：
> iptables -F 或 iptables -X
然后在ping包测试，数据可通：
![Ping数据包](./resources/pic9.awebp)
![Tcpdump数据包](./resources/pic10.awebp)
至此，基本GRE隧道环境搭建成功。

## 3. GRE隧道跨(公)网连接不同子网地址主机
## 3.1 拓扑环境
![网络拓扑图](./resources/pic_1.awebp)
目的： 通过GRE隧道将20.1.2.1/24、20.1.3.2/24两个子网连接起来进行通讯。
## 3.2 Ubantu配置
## 3.2.1 配置ens33子接口IP
> ifconfig eth0:1 192.168.100.1/24
查看接口配置如下：
![IP别名](./resources/pic_2.awebp)

## 3.2.2 添加另一个GRE隧道接口并up
> ip tunnel add Tunnel-2 mode gre local 192.168.100.1 remote 192.168.100.2
> ifconfig Tunnel-2 up

## 3.2.3 配置隧道接口IP
> ifconfig Tunnel-2 20.1.2.1/24
![隧道2](./resources/pic_3.awebp)

## 3.2.4 添加对端子网路由表
由于本端没有对端子网20.1.3.0/24的路由，因此需要添加路由，将该网段报文引入到Tunnel-2接口，这样便可以通过GRE隧道进行封装。
> route add -net 20.1.3.0/24 gw 20.1.2.1
![路由表](./resources/pic_4.awebp)

## 3.3 CentOS配置
## 3.3.1 配置ens33子接口IP
> ifconfig ens33:1 192.168.100.2/24
![IP别名](./resources/pic_5.awebp)

## 3.3.2 添加另一个GRE隧道接口并up
> ip tunnel add Tunnel-2 mode gre remote 192.168.100.1 local 192.168.100.2
> ifconfig Tunnel-2 up
结果如下：
![GRE隧道](./resources/pic_6.awebp)

## 3.3.3 配置隧道接口IP
> ifconfig Tunnel-2 20.1.3.1/24

## 3.3.4 添加对端子网路由表
由于本端没有对端子网20.1.2.0/24的路由，因此需要添加路由，将该网段报文引入到Tunnel-2接口，这样便可以通过GRE隧道进行封装。
> route add -net 20.1.2.0/24 gw 20.1.3.1
![添加路由配置](./resources/pic_7.awebp)

## 3.4 ping测试链路连通性
![Ping网关地址](./resources/pic_8.awebp)
![Tcpdump截图](./resources/pic_9.awebp)
