# Socat工具使用

## 安装
apt install -y socat
## 常用命令
socat tcp6-listen:9527 -
# 注意末尾有个 空格 减号
socat tcp4-listen:9527 -
socat tcp-connect:[ipv6-addr]:9527 -
socat tcp-connect:ipv4:9527 -
socat tcp-connect:localhost:9527 -

# 检查端口占用
lsof -i:9527
netstat -tunlp | grep 9527


# 连接远程HTTP服务器(python3 -m http.server 8888)
socat - tcp:42.193.246.119:8888
GET / HTTP/1.1 (后再回车请求首页)

# kali作为服务器端侦听端口
# 服务器端
socat - tcp4-listen:8888
# 客户端
socat - tcp:127.0.0.1:8888

# kali接收文件
# 服务器端
socat tcp4-listen:333 open:2.txt,creat,append #接收信息并保存到2.txt
# 客户端
echo "I am xubuntu!" > 1.txt
cat 1.txt | socat - tcp4:127.1:333
或
echo "I am xubuntu!" | socat - tcp4:127.1:333

# 端口转发
# 服务器端
socat tcp4-listen:2222,fork tcp4:42.193.246.119:8888
# 客户端ubantu
# 用浏览器访问http://IP:2222/
# 发现转向 http://42.193.246.119:8888

# UDP远程执行命令
# 服务器端kali
socat - udp-l:8888 #侦听8888端口
# 客户端
echo "I am ubuntu!" | socat - udp4-datagram:42.193.246.119:8888 #发送内容
echo "`id`" | socat - udp4-datagram:42.193.246.119:8888 #可以用来发送指令

https://blog.csdn.net/weixin_44604541/article/details/105455457

# socat是一个命令行程序，这就意味着他不能在同一个终端下建立多个进程，这对于高并发场景来说意味着多条TCP抢socat，延迟也会因此有着不可忍受的波动，所以我们使用 reuseaddr参数绑定一个本地端口，同时使用 fork参数将socat转变为多链接模式，即当一个链接建立后，自动复制一个同样的端口监听，这样就能有效提高高并发场景下的性能表现。
socat TCP-LISTEN:8080,reuseaddr,fork,su=nobody TCP:192.168.1.2:8080

# 对于UDP这样的链接来说，最好在命令中加入 -T参数，尽快关闭不活跃的链接
socat -T 120 UDP-LISTEN:8080,reuseaddr,fork,su=nobody UDP:192.168.1.2:8080

# 由于 address的变化性，我们甚至可以把 socat作为Web Server或者一个文件服务器
socat -d -d /dev/sda1,rawer,nonblock,ignoreeof,cr,echo=0 TCP-LISTEN:55555,reuseraddr
# 这样，一个监听在55555端口上的文件服务器就有了，其中
# 
# -d -d：输出调试信息
# rawer：直接读取/写入，这样可以提升速度。
# nonblock：使用non-block IO模式防止拥塞
# ignoreeof：忽略EOF，这让这台文件服务器一直在线，而不是每传输完一个文件后就关闭
# cr：换行符转换
# ehco=0：关闭echo（根据rawer的要求）
