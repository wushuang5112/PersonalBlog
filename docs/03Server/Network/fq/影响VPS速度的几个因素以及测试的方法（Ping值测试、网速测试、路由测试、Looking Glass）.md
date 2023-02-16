影响VPS速度的几个因素以及测试的方法（Ping值测试、网速测试、路由测试、Looking Glass）

1. 影响VPS网速的因素
声明：这篇文章其实是参考抄的@老付聊主机VPS常用测速工具与脚本介绍

不过咕咕也都测试过，再补充了一些自己的内容进去。

有一些网络基础知识的朋友都知道，请求数据包从客户端发出后，经过一定的路由（去程路由）到达服务器，服务器响应数据包再经过一定的路由（回程路由）到达客户端，这样就完成了一次最简单的通信。

1.1 Ping值
ping值代表从客户端发出数据包到服务器返回数据包到达客户端一次的时间，时间越小，表示响应越快。一般国内服务器ping值约几十ms（毫秒），日韩新加坡等附近国家服务器ping值约几十到100多ms，美国欧洲服务器约200+ms。ping值并不能完全代表网速，不过在其他条件相同的情况下，ping值越小肯定越好。

1.2 丢包率
如果不发生丢包，肯定ping值越小最终网速越快，如果有丢包发生，则要看看丢包率的大小。一般当网络发生拥塞时，中间路由器会根据一定的策略进行丢包，比如：

优先丢弃UDP包

TCP优先保证80，443端口包，而丢弃其他端口的包

icmp包优先

如果丢包率比较高，比如高于5%，则可认为网络情况较差。

1.3 线路
大家也许经常听说电信CN2 GIA/GT，联通AS9929/AS4837，IPLC/IEPL等，这就是我们所说的“线路”。从客户端到服务器通常有多条线路，有的线路使用的人多，质量自然就差，使用人数少的线路质量自然就好，好的VPS会花较多的钱来购买优质线路，价格自然就贵许多。

需要注意的是，线路包含去程线路与回程线路，而且回程线路往往更加重要（因为服务器响应的数据量通常比用户请求的数据量大），部分VPS商家所谓三网优化线路只优化了去程，没有优化回程，效果自然就大打折扣。

下期我们来讲讲国内三家运营商的优质线路，敬请期待！

1.4 带宽
带宽是VPS商家设置的限制，一般国内服务器带宽比较小(1-10M)，海外服务器带宽会比较大（100M甚至1000M)。带宽一般来说越大越好，但是朋友们也不要一味追求大带宽，小流量非图片站5M带宽足够，代理上网20M足够看youtube 4K视频。

总之，VPS服务商提供的带宽越大，ping值越低，丢包率越小，VPS的网速则越快，而好的线路则会具备上面说的这些特征（ping值低，丢包少），所以大家选购VPS的时候注意主机商的线路说明，同时也需要自己测试，看看真实情况如何。

下面就给大家推荐一些常用的测速工具或脚本，需要提前说明的是，大家测试时尽量在高峰时期测试（晚上8:00-10:00），低峰期测试结果可能很好，但一到高峰期就原地爆炸。

2. Ping值测试
2.1 ping.pe - 国内外多地到服务器连续ping值及丢包率测试
地址： http://ping.pe/

相比普通工具只能测试一次，ping.pe可以从不同区域连续进行多次ping测试，实时显示出最大/最小/平均延时及丢包率，并以图表的方式显示（右侧线条）。





上图是咕咕的搬瓦工DC6 测试结果（测试时间20:54，高峰期），机器在洛杉矶，美国的ping值比较低，大陆平均ping值140ms左右，丢包率基本为0。晚高峰不丢包，很关键。同款服务器购买直达链接。

类似测试工具还有：

https://www.itdog.cn/ping/
https://tools.ipip.net/newping.php
https://www.17ce.com/
https://www.boce.com/ping （很慢，不推荐）

2.2 TCPing - 使用TCP协议的PING测试
地址： https://www.itdog.cn/tcping/

前面提到，电信运营商做QoS优化时可能会提高icmp包的优先级（普通ping正是采用的icmp协议），导致ping的测试结果与实际上网体验不符。

本工具使用TCP协议进行ping测试，测试结果更具有说服力。

唯一要求是VPS需要开启TCP端口。



上图是咕咕博客各地的TCPing结果，解析到了德国法兰克福服务器，由于是AS9929线路，大陆ping值平均170ms左右，应该还是不错的。（大家可以在评论区反馈一下打开博客的速度怎么样 = =）

Ping值检测使用上面两个工具基本足够，由于ping测试的是往返时延，所以没有必要测试所谓回程ping值。当然，如果仅仅是用来代理上网的VPS，在自己电脑上使用ping命令直接测试自己当前网络到VPS的ping值及丢包才是最重要的。

3. 网速（带宽）测试
3.1 SuperSpeed.sh - VPS三网测速脚本
使用方法(需要以root用户执行)

sudo -i
bash <(curl -Lso- https://git.io/superspeed_uxh)
3.1.1 搬瓦工

3.1.2 Cloudcone

3.1.3 腾讯云香港轻量

此脚本由老鬼@oooldking编写，后经过多人修复与改进，可以一键测试VPS到三网不同地区的速度。我们应该更加关注图中上传速度的结果，因为这是用户访问我们的网站的速度，或者是我们用来代理上网的实际速度。

小科普：

Mbps是megabits per second的缩写，是一种传输速率单位，指每秒传输的位（比特）数量。 比特和字节直接是8倍的关系。

所以：

100Mbps=100/8=12.5MB/s
4Mbps=4/8(MB/s)=0.5MB/s

3.2 Speedtest-cli - 测试VPS到任意区域的速度
安装 https://www.speedtest.net/zh-Hans/apps/cli
使用
# 显示附近测速服务器
# 如果需要更多，可访问https://www.speedtest.net/api/js/servers?engine=js
speedtest -L
# 指定服务器测速
speedtest -s

以腾讯云香港轻量（Debian10）举例子：

sudo apt-get install curl
curl -s https://install.speedtest.net/app/cli/install.deb.sh | sudo bash
sudo apt-get install speedtest
speedtest -L

speedtest 1536  # 测香港的

speedtest-cli就是由大名鼎鼎的OOKLA出品的http://speedtest.net的命令行版本，上面提到的superspeed.sh脚本亦是包装了speedtest-cli而来的。

4. 路由测试
路由就是我们通常所说的线路，由于一般情况下去程路由与回程路由不同，因此测试路由需要分别测试去程路由与回程路由。通过路由中的IP或ASN初步可以判断线路质量好坏。例如：路由中如果有59.43.*.*则代表CN2线路，如果去程与回程都有59.43.*.*，则是CN2 GIA线路，如果仅有去程有，则是CN2 GT线路，如果仅有202.97.*.*则是普通163线路。

关于线路的知识后续专门写一篇文章来介绍。

4.1 http://itdog.cn - 多地去程路由测试
地址: https://www.itdog.cn/tracert/

此在线工具可以追踪国内多机房到指定VPS的去程路由，显示中间路由节点的IP、位置、AS号、延时等信息。


上图为上海电信到咕咕的搬瓦工DC6 的主机的路由，中间经过的59.53，且不止一跳，说明线路为CN2 GIA 质量很棒，在高峰期访问质量也有保证。

4.2 简单测试- 多地回程路由测试
curl https://raw.githubusercontent.com/zhucaidan/mtr_trace/main/mtr_trace.sh|bash
4.2.1 搬瓦工DC6

能够直接显示出回程线路情况。

4.2.2 腾讯云香港轻量

4.2.3 Cloudcone

4.3 testrace.sh - 多地回程路由测试
注意：脚本会安装必要软件包

wget https://raw.githubusercontent.com/PhilCity/testrace/master/testrace.sh
bash testrace.sh
此脚本可以测试VPS到三网各地多个服务器的路由回程路由，相比去程路由，回程路由更加重要，是VPS线路选择的关键。



4.4 besttrace - 指定IP路由测试工具
下载地址 https://cdn.ipip.net/17mon/besttrace4linux.zip
使用
bestrace <ip或域名>

查看本地IP：https://ip.skk.moe/

wget https://cdn.ipip.net/17mon/besttrace4linux.zip

apt install zip

unzip besttrace4linux.zip

chmod +x besttrace


./besttrace -q1 -g cn  8.8.8.8     # ./besttrace -q1 -g cn IP   换成你本地的IP，查看本地IP：https://ip.skk.moe/

besttrace 是由http://IPIP.net出品的路由追踪工具，前面提到的testrace.sh脚本亦是对bestrace工具的封装。

bestrace可测试当前机器到任意IP的路由，并显示中间节点的IP/位置/ASN/延时。

如果用VPS代理上网，不妨测试下自己电脑到VPS之间的去/回程路由，看看线路。

5. 购买前测试
上面提到的一些脚本需要在VPS上执行，所以有些脚本在购买前无法执行，对于这种情况，一般VPS商家会给出测试IP，有了测试IP我们可以进行Ping测试与去程路由测试，有的商家还会给出LibreSpeed测速页面（demo: https://librespeed.org/ ），我们可以测试当前机器到测速VPS的速度。

有的商家还会给出Looking Glass咱们可以通过Looking Glass来测试回程路由。

不过，最好还是联系商家要一个测试VPS，自己登录后用脚本测试一下。如果实在没有测试VPS，咱们可以先购买一个月，测试效果不好直接发工单申请退款。

5.1 Web测速 speedtestX
Web测速 speedtestX https://github.com/BadApple9/speedtest-x 后续出搭建教程。
