---
layout: post
title:  "Win10中PHP的安装及配置"
date: 2020-05-15 12:03:04 +0800 #编写时间 优先级最高 注意时区 +0800
overwrite: 2020-05-15 14:27:24 +0800 #编辑时间 优先级最高 注意时区 +0800
tags: [PHP7,环境搭建]
postPatterns: glamorous
toc: true
---

本文非WAMP集成环境，内容为`Apache`和`PHP`的安装于配置，所有内容以编写播客时的版本为准。

<!--excerpt-->

# 安装Apache

## 下载Apache

首先下载最新版`Apache HTTP Server 2.4.43`：<http://httpd.apache.org/download.cgi>{:target="_blank"}，找到[`Files for Microsoft Windows`](http://httpd.apache.org/docs/current/platform/windows.html#down){:target="_blank"}，选择`ApacheHaus`，根据自己电脑的情况下载不同的二进制文件。

![image](/assets/img/Apache_PHP/2020-05-15_0001.webp)

下载结果为二进制压缩包，直接解压到自己的工作目录就可以，后文中我将以下面这个目录为例。
> C:\Users\Juch\Application

## 解压

如图我解压后的安装目录为**C:\Users\Juch\Application\httpd-2.4.43-o111g-x64-vc15\Apache24**
![image](/assets/img/Apache_PHP/2020-05-15_0002.webp)

## 配置

### 环境变量

由于是二进制文件，所以需要自己添加环境变量。
* 根据个人习惯选择是`用户环境变量`还是`系统环境变量`；
* 把**C:\Users\Juch\Application\httpd-2.4.43-o111g-x64-vc15\Apache24\bin**添加到Path；
* 确定Over；

### 配置文件

Apache的配置文件在安装目录的**conf**目录中
> C:\Users\Juch\Application\httpd-2.4.43-o111g-x64-vc15\Apache24\conf\httpd.conf

编辑`httpd.conf`：
```bash
# 找到 Define SRVROOT 把 SRVROOT 的值修改为Apache的安装目录
Define SRVROOT "C:/Users/Juch/Application/httpd-2.4.43-o111g-x64-vc15/Apache24"
ServerRoot "${SRVROOT}"
```
保存后以管理员身份打开CMD，输入：
```bash
httpd -k install
```
如无错误信息，即代表安装完毕。此时就可以在Windows的服务中看到`Apache24`了。

> C:\WINDOWS\system32>httpd -k install  
> Installing the 'Apache2.4' service  
> The 'Apache2.4' service is successfully installed.  
> Testing httpd.conf....  
> Errors reported here must be corrected before the service can be started. 

![image](/assets/img/Apache_PHP/2020-05-15_0003.webp)

服务启动后，可以使用`httpd`命令启动、停止和重启Apache了
```bash
httpd -k [ start | stop | restart | uninstall ]
```

启动Apache后在浏览器输入`localshost`不出意外就会出现下面的页面，表示配置完成。

![image](/assets/img/Apache_PHP/localhost_index.html.webp)

# 安装PHP

## 下载PHP

下载最新的稳定版**PHP 7.4.6**，<https://www.php.net/downloads.php>{:target="_blank"}，点击`Windows downloads`建议下载线程安全`Thread Safe`版本。

![image](/assets/img/Apache_PHP/2020-05-15_0004.webp)

## 解压

把下载的二进制文件解压到工作目录

![image](/assets/img/Apache_PHP/2020-05-15_0005.webp)

## 配置

### 环境变量

同样的，安装PHP也需要我们自己设置环境变量

* 根据个人习惯选择是`用户环境变量`还是`系统环境变量`；
* 把**C:\Users\Juch\Application\php-7.4.6-Win32-vc15-x64**添加到Path；
* 确定Over；

打开CMD输入`php -v`验证一下是否配置成功，出现php版本信息即代表成功。

### 配置文件

在修改PHP的配置文件之前，首先修改Apache的配置文件，因为PHP要和Web服务配合使用。
修改**C:\Users\Juch\Application\httpd-2.4.43-o111g-x64-vc15\Apache24\conf\httpd.conf**

```bash
# 修改LoadModul的位置
LoadModule php5_module "C:\Users\Juch\Application\php-7.4.6-Win32-vc15-x64\php7apache2_4.dll"
PHPIniDir "C:\Users\Juch\Application\php-7.4.6-Win32-vc15-x64\php.ini"

# 添加支持
AddType application/x-httpd-php .php .html

# 修改首页文件类型
# DirectoryIndex: sets the file that Apache will serve if a directory is requested.
<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>
```

接下来将PHP安装目录中的`php.ini-development`备份一下，重命名为`php.ini`开始修改
```bash
; extension_dir = "./"
# 修改为
extension_dir = "C:\Users\Juch\Application\php-7.4.6-Win32-vc15-x64\ext"

# 根据自己的需求打开扩展
extension=curl
extension=gd2
extension=gmp
extension=imap
extension=mbstring
extension=mysqli
```
记得保存，然后重启Apache服务
```bash
httpd -k restart
```
### 验证

在Apache工作目录**C:\Users\Juch\Application\httpd-2.4.43-o111g-x64-vc15\Apache24\htdocs**新建一个内容为`<?php phpinfo(); ?>`的php文件，命名为`index.php`。

![image](/assets/img/Apache_PHP/2020-05-15_0006.webp)

然后在浏览器进入<http://localhost/index.php>{:target="_blank"},看到如下内容即表示配置成功。

![image](/assets/img/Apache_PHP/2020-05-15_0007.webp)

# 结语

以上PHP环境搭建的记录，均基于当时的软件版本，现实操作中应根据自己电脑的环境进行修改切勿复制粘贴。


[Download Apache](http://httpd.apache.org/download.cgi){:target="_blank"}
{:class="btn btn-blue" style="display:list-item;"}
[Download PHP](https://www.php.net/downloads.php){:target="_blank"}
{:class="btn" style="display:list-item;"}
