---
layout: post
title:  "设置 bash 补全忽略大小写"
tags: [bash, Linux]
date: 2020-01-11 12:11:51 +0800
---

通常情况下默认的bash都是使用`bash-completion`进行自动补全的，但是其默认的配置是对大小写敏感的，如要关闭大小写敏感只需修改其配置文件`inputrc`即可。

<!--excerpt-->

首先可能需要先确认一下本机是否安装了`bash-completion`这个工具，因为在最小化安装时可能不会安装这个。
~~~
dpkg -l | grep bash-completion
~~~
如果你能看到类似于 **`ii  bash-completion ··· `** 这丫的信息则说明已经安装过，如果不是或没有，那么需要安装一下。
~~~
#在 Ununtu 中安装
sudo apt install bash-completion
#在 Centos 中安装
yum install bash-completion -y
~~~
确认安装之后只需在其配置文件后面追加一句忽略大小写即可。
~~~
echo 'set completion-ignore-case on' >> /etc/inputrc
~~~
需要注意的是这里修改的是全局的配置，如果只是需要修改某一个用户下的配置，只需要在用户的根目录下新建一个`.inputrc`，然后在这个上面修改即可。

修改完成后或退出登录或重开终端都可使配置生效。