---
layout: post
title:  "如何提高 git 的 clone 速度"
tags: [Git]
date: 2020-01-07 16:35:57 +0800
toc: true
---

在国内，大家一定发现使用git clone的速度实在太慢，仿佛clone的是上个世纪的仓库，如此速度真叫人不能承受。

<!--excerpt-->

### 第一招：改hosts文件

去 [ipip.net](https://tools.ipip.net/ping.php) **ping**一下github的网址，你将得到一些有响应的IP地址，比如`140.82.113.4`，找几个TTL低一点的在自己电脑上试一下能否ping得通，能则按照`IP地址 域名`的格式追加到本机hosts文件的末尾，不能的话我也没办法，Windows上的hosts路径一般在`C:\Windows\System32\drivers\etc\hosts`这里。

以下是我的文件样式
~~~
# GitHub Start
192.30.255.113  github.com
192.30.253.112  github.com
192.30.255.118  gist.github.com
192.30.253.118  gist.github.com
192.30.253.119  gits.github.com
192.30.253.118  gits.github.com
140.82.113.19   gist.github.com
151.101.112.133 assets-cdn.github.com
151.101.184.133 raw.githubusercontent.com
151.101.112.133 gist.githubusercontent.com
151.101.184.133 cloud.githubusercontent.com
151.101.1.194   github.global.ssl.fastly.net
151.101.197.194 github.global.ssl.fastly.net
151.101.77.194  github.global.ssl.fastly.net
# GitHub End
~~~
改完了记得刷一下缓存，让hosts生效。
~~~
ipconfig /flushdns
~~~

第一个办法应该只能提高一点访问速度，clone仓库的时候该慢还是得慢，那么接下来就得从git身上下功夫了。

### 第二招：修改git配置

此方法的前提是你得有爬墙的tizi，俗话说 **手里有梯，心里不慌**，在此基础上，只需修改git的配置文件`.gitconfig`即可愉快的打代码了。Windows里面git的配置文件一般在用户目录里，例如`C:/Users/"Your Name"`,打开`.gitconfig`直接添加如下语句。
~~~
[http]
	proxy = socks5://127.0.0.1:10808
	postBuffer = 524288000
[https]
	proxy = socks5://127.0.0.1:10808
	postBuffer = 524288000
~~~
需要注意的是，tizi必须打开，其中上面的`socks5://127.0.0.1:10808`这两个地方改成自己的格式，比如`socks5://127.0.0.1:1088`或者`https://127.0.0.1:1089`。


反正我经过这么一折腾`git clone`的速度≈带宽。但是如果你没有tizi，那只有使出最后一招**移花接木**，此招式完全符合社会主义价值观，可以说是中国特色社会主义git clone，使用此招完全无后顾之忧。

### 第三招：移花接木

简略来说就是把github的项目fork到[**码云**](https://gitee.com),然后再行以clone大法，速度应该比第二招还要快。

不过本着又不是不能用的基本原则，长期耽溺与第二招不思进取，所以我也不会这移花接木之法…