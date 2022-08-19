# GitLab安装与布曙

- [安装说明文档（官网地址）](https://docs.gitlab.com/runner/install/linux-repository.html)
- [腾讯云镜像帮助文档](https://mirrors.cloud.tencent.com/help/gitlab-ce.html)
- [清华大学开源镜像说明文档(gitlab-runner)](https://mirrors.tuna.tsinghua.edu.cn/help/gitlab-runner/)

## 1. GitLab服务安装

```bash
### Ubuntu上布曙GitLabe，查看ubuntu版本代号命令:
lsb_release -c
### 修改系统语言
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_CTYPE=UTF-8
```

### 1.1 更新安装包源信息

```bash
sudo apt-get update
sudo apt-get install -y curl openssh-server ca-certificates tzdata perl
```

### 1.2 安装邮件服务器，若需要配置邮件地址

```bash
sudo apt-get install -y postfix
```

### 1.3 GitLab服务安装

```bash
# curl -s https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | bash
echo "deb https://mirrors.cloud.tencent.com/gitlab-ce/ubuntu focal main" > /etc/apt/sources.list.d/gitlab_gitlab-ce.list
sudo apt-get update
sudo EXTERNAL_URL="http://gitlab.wushuang5112.wang" apt-get install gitlab-ce
```

> gitlab.wushuang5112.wang为申请域名地址，替换成你的域名即可
> 上述注释curl命令行是从gitlab源下载安装包，下载速率比较慢，这里我们使用腾讯云镜像地址


### 1.4 查看初始密码(初始密码有24小时有效期)
```bash
cat /etc/gitlab/initial_root_password
```

<!-- cp /etc/gitlab/gitlab.rb{,.original} -->

### 1.5 绑定SSL证书

```bash
# 1. 编辑 vim /etc/gitlab/gitlab.rb ⽂件
vim /etc/gitlab/gitlab.rb
    external_url 'https://gitlab.wushuang5112.wang'
    nginx['enable'] = true
    nginx['redirect_http_to_https'] = true
    nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.wushuang5112.wang_bundle.crt"
    nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.wushuang5112.wang.key"
    nginx['listen_https'] = true
    nginx['http2_enabled'] = true
# 2. 使用配置重新生效
gitlab-ctl reconfigure
```

### 1.6 修改时区
```bash
# 1. 编辑 vim /etc/gitlab/gitlab.rb ⽂件
vim /etc/gitlab/gitlab.rb
    gitlab_rails['time_zone'] = 'Beijing'
# 2. 使用配置重新生效
gitlab-ctl reconfigure
```

## 2. GitLab-Runner安装

```bash
# curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
echo "deb https://mirrors.cloud.tencent.com/gitlab-runner/ubuntu focal main" > /etc/apt/sources.list.d/gitlab-runner.list
sudo apt-get update
sudo apt-get install gitlab-runner
systemctl status gitlab-runner
```

> Gitlab源地址安装速率较慢

## 3. 备份与恢复

```text
/etc/gitlab/gitlab.rb 配置文件须备份
/var/opt/gitlab/nginx/conf nginx配置文件
/etc/postfix/main.cfpostfix 邮件配置备份
# 备份命令, 备份默认路径: /var/opt/gitlab/backups/
gitlab-rake gitlab:backup:create
```

### 3.1 修改配置文件

可以通过/etc/gitlab/gitlab.rb配置文件来修改默认存放备份文件的目录

```bash
[root@gitlab ~]# vim /etc/gitlab/gitlab.rb
    gitlab_rails['backup_path'] = "/var/opt/gitlab/backups" # 存放备份文件的目录
    gitlab_rails['backup_keep_time'] = 604800 # 备份过期时间，以秒为单位
```

修改完成之后使用gitlab-ctl reconfigure命令重载配置文件即可

### 3.3 GitLab自动备份

创建定时任务

```text
[root@gitlab ~]# crontab -e
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create
```

### 3.4 GitLab迁移

```text
迁移的整体思路是：
1、在新服务器上安装相同版本的gitlab
2、将备份生成的备份文件发送到新服务器的相同目录下
在老服务器上将备份文件发送至新服务器的相应目录下
```

```bash
[root@gitlab ~]# scp /var/opt/gitlab/backups/1530156812_2018_06_28_10.8.4_gitlab_backup.tar root@10.0.0.6:/var/opt/gitlab/backups/
```

### 3.5 GitLab恢复

```bash
[root@gitlab ~]# gitlab-ctl stop unicorn		#停止相关数据连接服务
[root@gitlab ~]# gitlab-ctl stop sidekiq
[root@gitlab-new ~]# chmod 777 /var/opt/gitlab/backups/1530156812_2018_06_28_10.8.4_gitlab_backup.tar
#修改权限，如果是从本服务器恢复可以不修改
[root@gitlab ~]# gitlab-rake gitlab:backup:restore BACKUP=1530156812_2018_06_28_10.8.4	
#从1530156812_2018_06_28_10.8.4编号备份中恢复
[root@gitlab ~]# gitlab-ctl start #启动gitlab
```

## 4. GitLab维护作命令

```bash
sudo gitlab-ctl status
sudo gitlab-ctl start
sudo gitlab-ctl stop
```
