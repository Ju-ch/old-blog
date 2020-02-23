---
layout: post
title:  "如何在Ubuntu 18.04上安装MySQL"
date: 2020-02-19 +0800 
cover: '/assets/img/head-MySQL.jpg'
tags: [MySQL,Ubuntu]
toc: true
---

[MySQL](https://www.mysql.com){:target="_blank"}是一个开源数据库管理系统,通常作为流行的LAMP的部分安装。它使用关系数据库和SQL(结构化查询语言)来管理其数据。

<!--excerpt-->

<!-- [url](URL){:target="_blank"}
![image](URL){:class="post-image"  height="256px"} -->

安装过程很简单:更新软件包索引,安装`msql-server`软件包,然后运行附带的安全脚本。
~~~ bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
~~~

## Step - 1 安装MySQL

在Ubuntu 18.04上，默认情况下，APT软件包存储库中仅包含最新版本的MySQL。在撰写本文时，这是`mysql-server-5.7`。

在安装任何软件之前都应该有一个良好的习惯，更新包的索引。
~~~ bash
sudo apt update
~~~
然后安装默认软件包：
~~~ bash
sudo apt install mysql-server
~~~
这将安装MySQL，但不会提示您设置密码或进行任何其他配置更改。因为这会使您的MySQL安装不安全，所以我们接下来将解决此问题。

## Step - 2 配置 MySQL

对于全新安装，您需要运行随附的安全脚本。这会更改一些不太安全的默认选项，例如远程**root**登录和样本用户。

运行安全脚本：
~~~ bash
sudo mysql_secure_installation
~~~
这将引导您完成一系列提示，在其中您可以对MySQL安装的安全性选项进行一些更改。第一个提示将询问您是否要设置验证密码插件，该插件可用于测试MySQL密码的强度。无论您选择什么，下一个提示都是为MySQL根用户设置密码。

从那里，您可以按Y，然后按Enter以接受所有后续问题的默认设置。这将删除一些匿名用户和测试数据库，禁用远程**root**登录，并加载这些新规则，以便MySQL立即尊重您所做的更改。

要初始化MySQL数据目录，对于5.7之前的版本，应使用**mysql_install_db**，而对于5.7及更高版本，应使用`mysqld --initialize`。但是，如果按照[步骤1](#step---1-安装mysql)所述从Debian发行版中安装了MySQL，则数据目录将自动初始化；否则，将自动初始化数据目录。您无需做任何事情。如果仍然尝试运行该命令，则会看到以下错误：
``` output
mysqld: Can't create directory '/var/lib/mysql/' (Errcode: 17 - File exists)
. . .
2020-01-23T11:48:00.572066Z 0 [ERROR] Aborting
```
请注意，即使您已为MySQL根用户设置了密码，但在连接到MySQL Shell时，该用户仍未配置为使用密码进行身份验证。如果需要，您可以按照[步骤3](#step---3-可选调整用户身份验证和特权)调整此设置。

## Step - 3 （可选）调整用户身份验证和特权

在运行MySQL 5.7（及更高版本）的Ubuntu系统中，默认情况下，MySQL根用户设置为使用`auth_socket`插件而不是使用密码进行身份验证。在许多情况下，这可以提高安全性和可用性，但是当您需要允许外部程序（例如phpMyAdmin）访问用户时，也会使事情复杂化。

为了使用密码以**root**用户身份连接到MySQL，您需要将其身份验证方法从`auth_socket`切换到`mysql_native_password`。为此，请从终端打开MySQL提示符：
``` bash
sudo mysql
```
接下来，使用以下命令检查每个MySQL用户帐户使用的身份验证方法：
``` sql
SELECT user,authentication_string,plugin,host FROM mysql.user;
```
``` output
+------------------+-------------------------------------------+-----------------------+-----------+
| user             | authentication_string                     | plugin                | host      |
+------------------+-------------------------------------------+-----------------------+-----------+
| root             |                                           | auth_socket           | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian-sys-maint | *CC744277A401A7D25BE1CA89AFF17BF607F876FF | mysql_native_password | localhost |
+------------------+-------------------------------------------+-----------------------+-----------+
4 rows in set (0.00 sec)
```

在此示例中，您可以看到**root**用户实际上使用`auth_socket`插件进行了身份验证。要将根帐户配置为使用密码进行身份验证，请运行以下`ALTER USER`命令。确保将密码更改为您选择的强密码，并注意此命令将更改您在[步骤2](#step---2-配置-mysql)中设置的**root**密码：
``` sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
然后，运行`FLUSH PRIVILEGES`，告诉服务器重新加载授权表并使新的更改生效：
``` sql
FLUSH PRIVILEGES;
```
再次检查每个用户使用的身份验证方法，以确认**root**不再使用`auth_socket`插件进行身份验证：
``` sql
SELECT user,authentication_string,plugin,host FROM mysql.user;
```
``` output
+------------------+-------------------------------------------+-----------------------+-----------+
| user             | authentication_string                     | plugin                | host      |
+------------------+-------------------------------------------+-----------------------+-----------+
| root             | *3636DACC8616D997782ADD0839F92C1571D6D78F | mysql_native_password | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian-sys-maint | *CC744277A401A7D25BE1CA89AFF17BF607F876FF | mysql_native_password | localhost |
+------------------+-------------------------------------------+-----------------------+-----------+
4 rows in set (0.00 sec)
```
您可以在此示例输出中看到，MySQL根用户现在使用密码进行了身份验证。一旦在自己的服务器上确认了这一点，就可以退出MySQL Shell：
``` sql
exit;
```
另外，有些人可能会发现它更适合他们的工作流程，以便与专门的用户连接到MySQL。要创建这样的用户，请再次打开MySQL Shell：
``` bash
sudo mysql
```
注意：如果您如前几节所述为root启用了密码认证，则将需要使用其他命令来访问MySQL Shell。以下内容将以常规用户权限运行您的MySQL客户端，并且您将仅通过身份验证在数据库中获得管理员权限：
``` bash
mysql -u root -p
```
从那里，创建一个新用户并为其设置一个强密码：
``` sql
CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';
```
然后，为新用户授予适当的特权。例如，您可以使用以下命令向数据库内的所有表授予用户特权，以及添加，更改和删除用户特权的能力：
``` sql
GRANT ALL PRIVILEGES ON *.* TO 'sammy'@'localhost' WITH GRANT OPTION;
```
请注意，此时，您无需再次运行`FLUSH PRIVILEGES`命令。仅当您使用`INSERT`，`UPDATE`或`DELETE`之类的语句修改授权表时，才需要此命令。因为您创建了一个新用户，所以无需修改现有用户，因此此处不需要`FLUSH PRIVILEGES`。

接下来，退出MySQL shell：
``` sql
exit;
```
最后，让我们测试一下MySQL的安装。

## Step - 4 测试 MySQL

无论您如何安装，MySQL都应该已经开始自动运行。要对此进行测试，请检查其状态。
``` bash
systemctl status mysql.service
```
您将看到类似于以下的输出：
``` output
● mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: en
   Active: active (running) since Wed 2018-04-23 21:21:25 UTC; 30min ago
 Main PID: 3754 (mysqld)
    Tasks: 28
   Memory: 142.3M
      CPU: 1.994s
   CGroup: /system.slice/mysql.service
           └─3754 /usr/sbin/mysqld
```
如果MySQL未运行，则可以使用`sudo systemctl start mysql`启动它。

要进行其他检查，可以尝试使用`mysqladmin`工具连接到数据库，该工具是允许您运行管理命令的客户端。例如，此命令说要以root用户身份（`-u root`）连接到MySQL，提示输入密码（`-p`），然后返回版本。
``` bash
sudo mysqladmin -p -u root version
```
您应该看到类似于以下的输出：
``` output
mysqladmin  Ver 8.42 Distrib 5.7.21, for Linux on x86_64
Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Server version      5.7.21-1ubuntu1
Protocol version    10
Connection      Localhost via UNIX socket
UNIX socket     /var/run/mysqld/mysqld.sock
Uptime:         30 min 54 sec

Threads: 1  Questions: 12  Slow queries: 0  Opens: 115  Flush tables: 1  Open tables: 34  Queries per second avg: 0.006
```
这意味着MySQL已启动并正在运行。

