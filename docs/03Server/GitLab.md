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

### 1.2 安装邮件传输客户端 (MTA)

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

### 1.5 时区修改
#### 系统时间修改
```bash
sudo timedatectl list-timezones # 查看时区
sudo timedatectl set-timezone Asia/Hong_Kong # 设置时区
timedatectl # 运行timedatectl命令去验证修改
```

#### Gitlab时区修改
```bash
# 1. 编辑 vim /etc/gitlab/gitlab.rb ⽂件
vim /etc/gitlab/gitlab.rb
    gitlab_rails['time_zone'] = 'Asia/Hong_Kong'
# 2. 使用配置重新生效
gitlab-ctl reconfigure
```

<!-- cp /etc/gitlab/gitlab.rb{,.original} -->

### 1.6 绑定SSL证书

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

### 1.7 绑定发送邮件邮箱

> 先输入systemctl status postfix确定postfix是启动状态，看到 Active: active (running|exited)说明，已经启动了

```text
ubuntu@VM-12-15-ubuntu:/etc/gitlab$ systemctl status postfix
● postfix.service - Postfix Mail Transport Agent
     Loaded: loaded (/lib/systemd/system/postfix.service; enabled; vendor preset: enabled)
     Active: active (exited) since Fri 2022-08-19 18:11:56 CST; 13h ago
   Main PID: 18906 (code=exited, status=0/SUCCESS)
      Tasks: 0 (limit: 8818)
     Memory: 0B
     CGroup: /system.slice/postfix.service

Aug 19 18:11:56 VM-12-15-ubuntu systemd[1]: Starting Postfix Mail Transport Agent...
Aug 19 18:11:56 VM-12-15-ubuntu systemd[1]: Finished Postfix Mail Transport Agent.
```

```bash
# 1. 编辑 vim /etc/gitlab/gitlab.rb ⽂件
vim /etc/gitlab/gitlab.rb
    gitlab_rails['smtp_enable'] = true
    gitlab_rails['smtp_address'] = "smtp.qq.com"   # SMTP邮箱地址
    gitlab_rails['smtp_port'] = 465
    gitlab_rails['smtp_user_name'] = "1349498580@qq.com" # 你的邮箱
    gitlab_rails['smtp_password'] = "igdfaxi3232id"  # 邮箱密码
    gitlab_rails['smtp_domain'] = "smtp.qq.com"
    gitlab_rails['smtp_authentication'] = "login"
    gitlab_rails['smtp_enable_starttls_auto'] = true
    gitlab_rails['smtp_tls'] = true
    gitlab_rails['smtp_pool'] = false

    gitlab_rails['gitlab_email_from'] = '1349498580@qq.com'
    gitlab_rails['gitlab_email_display_name'] = 'GitLab'
    gitlab_rails['gitlab_email_reply_to'] = 'noreplay@qq.com'
# 2. 使配置生效
gitlab-ctl reconfigure
# 3. 使用测试邮件发送
gitlab-rails console
Notify.test_email('你的邮箱', '邮箱标题', 'Hello World').deliver_now
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

### 3.4 GitLab升级

```text
迁移的整体思路是：
1、备份Gitlab数据文件(/var/opt/gitlab/backups/)及配置文件(/etc/gitlab/gitlab.rb和/etc/gitlab/gitlab-secrets.json)
2、在新服务器上查看Gitlab版本号，确定升级路径
    [官网包下载地址](https://packages.gitlab.com/gitlab/gitlab-ce​)
    [升级向导文档](https://docs.gitlab.com/ee/update/index.html#upgrade-paths)
    [升级向导版本具体路径](https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/?current=15.2.2&auto=true&edition=ce)
    [升级Gitlab官方文档目录](https://docs.gitlab.com/ee/update/plan_your_upgrade.html)
3、某些新版本可能需要更多的依赖包而之前的旧版本并没有安装
4、重启服务
```

```bash
[root@gitlab ~]# gitlab-rake gitlab:backup:create      # 备份Gitlab仓库文件
[root@gitlab ~]# gitlab-rake gitlab:env:info      #查看Gitlab版本号
[root@gitlab ~]# gitlab-ctl stop unicorn      #停止相关数据连接服务
[root@gitlab ~]# gitlab-ctl stop sidekiq
[root@gitlab ~]# gitlab-ctl stop nginx
[root@gitlab ~]# apt-get install -y gitlab-ce=15.4.6-ce.0
[root@gitlab ~]# gitlab-ctl restart
```

#### 3.4.1 安装和初始化均无正常，但在访问域名时报500错误
```text
解决方法：
1、输入以下指令查看数据升级状态
sudo gitlab-rake db:migrate:status
果然发现有一些显示为Down，显示为Up即表示正常同。
2、再执行数据库关系升级
sudo gitlab-rake db:migrate
#迁移完db后往往会有这个问题，需要执行此步骤。
3、清除缓存
gitlab-rake cache:clear
4、再重复重建重启命令，问题解决
gitlab-ctl reconfigure
gitlab-ctl restart
```

### 3.5 GitLab恢复
```text
迁移的整体思路是：
1、将备份生成的备份文件发送到新服务器的相同目录下(/var/opt/gitlab/backups/)
    在老服务器上将备份文件发送至新服务器的相应目录下
2、停止相关服务后使用gitlab-rake gitlab:backup:restore恢复数据库文件
3、复制Gitlab配置文件到/etc/gitlab目录
4、执行重新配置命令后重启服务
```

```bash
[root@gitlab ~]# scp /var/opt/gitlab/backups/1530156812_2018_06_28_10.8.4_gitlab_backup.tar root@10.0.0.6:/var/opt/gitlab/backups/
[root@gitlab ~]# gitlab-ctl stop unicorn      #停止相关数据连接服务
[root@gitlab ~]# gitlab-ctl stop sidekiq
[root@gitlab ~]# gitlab-ctl stop nginx
[root@gitlab-new ~]# chmod 777 /var/opt/gitlab/backups/1530156812_2018_06_28_10.8.4_gitlab_backup.tar
#修改权限，如果是从本服务器恢复可以不修改
[root@gitlab ~]# gitlab-rake gitlab:backup:restore BACKUP=1530156812_2018_06_28_10.8.4	
[root@gitlab ~]# gitlab-ctl reconfigure #根据配置文件重新初始化
#从1530156812_2018_06_28_10.8.4编号备份中恢复
[root@gitlab ~]# gitlab-ctl start #启动gitlab
```

## 4. GitLab维护作命令

```bash
sudo gitlab-ctl status
sudo gitlab-ctl start
sudo gitlab-ctl stop
sudo gitlab-ctl restart # 重启所有 gitlab 组件；
sudo gitlab-ctl reconfigure # 启动服务；
sudo vim /etc/gitlab/gitlab.rb # 修改默认的配置文件；
gitlab-rake gitlab:check SANITIZE=true --trace # 检查gitlab；
sudo gitlab-ctl tail # 查看日志；
```

# ==================================================
## 升级版本
```bash
sudo dpkg -i gitlab-ce_14.5.0-ce.0_amd64.deb
sudo gitlab-ctl reconfigure
sudo gitlab-ctl start
```

## 降低版本
1、停止gitlab服务
```bash
sudo gitlab-ctl stop
```

2、卸载当前版本的gitlab
```bash
sudo gitlab-ctl uninstall
sudo apt remove gitlab-ce
```

## 修改root密码
依次执行如下脚本
```text
cd /opt/gitlab/bin
sudo gitlab-rails console -e  production
user = User.where(id: 1).first
user.password = 'secret_pass'
user.password_confirmation = 'secret_pass'
user.save!
exit 
```

## 实时日志查看
```bash
sudo gitlab-ctl tail
```

```text
参考链接:
https://blog.51cto.com/droptoking/5058134
```
