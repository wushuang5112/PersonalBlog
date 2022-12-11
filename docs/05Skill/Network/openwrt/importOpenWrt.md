几个常用官网:
https://downloads.immortalwrt.org/
https://bingmeme.github.io/OpenWrt_CN/release/ImmortalWrtSource.html

镜像
腾讯云: https://mirrors.vsean.net/openwrt/releases/packages-18.06/
主站 downloads.immortalwrt.org
镜像（CloudFlare）immortalwrt.kyarucloud.moe
镜像（腾讯云）mirrors.vsean.net/openwrt
此外，由于此前 opde 大量文件容易卡死列表程序，现在单独移动至 opde.immortalwrt.org

命令行

### OpenWrt 版本检查命令
> cat /etc/banner

```bash
root@HankingRoutes:~# cat /etc/opkg/distfeeds.conf
src/gz immortalwrt_core https://mirrors.tencent.com/lede/snapshots/targets/ramips/mt7621/packages
src/gz immortalwrt_base https://mirrors.tencent.com/lede/snapshots/packages/mipsel_24kc/base
src/gz immortalwrt_luci https://mirrors.tencent.com/lede/releases/18.06.9/packages/mipsel_24kc/luci
src/gz immortalwrt_node https://mirrors.tencent.com/lede/snapshots/packages/mipsel_24kc/node
src/gz immortalwrt_packages https://mirrors.tencent.com/lede/snapshots/packages/mipsel_24kc/packages
src/gz immortalwrt_routing https://mirrors.tencent.com/lede/snapshots/packages/mipsel_24kc/routing
src/gz immortalwrt_telephony https://mirrors.tencent.com/lede/snapshots/packages/mipsel_24kc/telephony
root@HankingRoutes:~#
```
