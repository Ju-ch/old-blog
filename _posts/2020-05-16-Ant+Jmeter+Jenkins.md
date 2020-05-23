---
layout: post
title:  "Ant Jmeter Jenkins 持续集成环境"
subtitle: '快速搭建，一趟成功'
date: 2020-05-16 11:33:46 +0800
overwrite: 2020-05-16 +0800
cover: /assets/img/AntJJ/HEAD.png
tags: [Ant,Jmeter,Jenkins,环境搭建]
toc: true
---

本文旨在快速搭建一个Jenkins持续集成的测试环境，其中用到的资料均以编写时最新的稳定版为主。

<!--excerpt-->

# 安装并配置JDK

先检查一本地有没有JDK，有的话就不用下载了，免得浪费时间。
![image](/assets/img/AntJJ/2020-05-16_0003.png)

可以看到，我本地的一些其他软件自带了JDK，而且应该有三个不同的版本，选择最新的版本设置环境变量就行。如果本地没有现成的JDK，那么建议直接下载最新的长期支持版即可。

Download：<https://openjdk.java.net>

![image](/assets/img/AntJJ/2020-05-16_0004.png)

然后在`path`里面加一行`%JAVA_HOME%\bin`,保存并验证。
![image](/assets/img/AntJJ/2020-05-16_0005.png)

# Jmeter安装配置

## 下载Jmeter 

Download：<https://jmeter.apache.org>

## 配置环境

新建一个变量名`Jmeter`，变量值如下：
![image](/assets/img/AntJJ/2020-05-16_0008.png)

再把变量名加到`path`里。
![image](/assets/img/AntJJ/2020-05-16_0009.png)

Jemter默认保存de是`jtl`格式的文件，需要设置**Jmeter/bin/jmeter.properties**的内容，把`jmeter.save.saveservice.output_format=csv`改为`jmeter.save.saveservice.output_format=xml`

# Ant安装配置
## 下载Ant

Download：<http://ant.apache.org/bindownload.cgi>

## 配置环境
![image](/assets/img/AntJJ/2020-05-16_0011.png)
然后在`path`里面加一行`%ANT%`，保存后打开CMD验证一下。
![image](/assets/img/AntJJ/2020-05-16_0013.png)

从Jmeter的安装目录中找到**apache-jmeter-5.2.1\extras\ant-jmeter-1.1.1.jar**，把这个文件复制到Ant的**lib**目录中。
否则Ant在运行报错说找不到`org.programmerplanet.ant.taskdefs.jmeter.JMeterTask`这个类。

# Jenkins安装配置

## 下载Jenkins
一般情况下，下载的都是`war`格式的包。

Download：<https://www.jenkins.io/download>

## 安装

emmmmm 直接下载到TomCat的工作目录就可以了，啥是安装？

>apache-tomcat-9.0.35/webapps

# Jenkins跑起来

进入TomCat的**bin**目录，运行`startup`

```bash
cd apache-tomcat-9.0.35\bin
startup.bat
```
对自己有信心的话，就不用看CMD的输出信息了，直接打开网址

> http://localhost:8080/\{\{jenkins-2.222.3\}\}

注意这里花括号搞起来的是**webapps**目录里Jenkins的`war`包的文件名
![image](/assets/img/AntJJ/2020-05-16_0014.png)

一般来说，默认的Jenkins插件源在国内都很慢，不用点魔法根本不能玩，对于不会魔法的同学我也要妙招要写出来。
* 找到Jenkins根目录的**hudson.model.UpdateCenter.xml**文件，把源地址改为**http://mirror.xmission.com/jenkins/updates/update-center.json**

* 编辑**Jenkins\updates\default.json**，把所有的`updates.jenkins-ci.org/download`替换为`mirrors.tuna.tsinghua.edu.cn/jenkins`，把`http://www.google.com/`替换为`http://www.baidu.com/`。

然后再去安装插件就超级快了，安装插件的时候也不要闲着，来建一个Jenkins项目目录，结构如下：
```
.
└── JmeterAutoTest //项目根目录
    ├── build.xml //Ant的构建文件
    ├── resultlog //输出结果
    │   ├── html
    │   └── jtl
    └── script //放Jemter的脚本
```

其中`build.xml`内容如下：
```xml
<?xml version="1.0" encoding="utf-8"?>
<project name="pc" default="all" basedir="\JmeterAutoTest">
    <tstamp>
        <format property="time" pattern="yyyyMMddhhmm" />
    </tstamp>
    <!-- 改成自己本地的 Jmeter 目录-->
    <property name="jmeter.home" value="\Services\apache-jmeter-5.2.1" />
    <!-- jmeter生成jtl格式的结果报告的路径-->
    <property name="jmeter.result.jtl.dir" value="\JmeterAutoTest\resultlog\jtl" />
    <!-- jmeter生成html格式的结果报告的路径-->
    <property name="jmeter.result.html.dir" value="\JmeterAutoTest\resultlog\html" />
    <!-- 生成的报告的前缀 -->
    <property name="ReportName" value="TestReport" />
    <property name="jmeter.result.jtlName" value="${jmeter.result.jtl.dir}/${ReportName}${time}.jtl" />
    <property name="jmeter.result.htmlName" value="${jmeter.result.html.dir}/${ReportName}${time}.html" />
    <!-- 接收测试报告的邮箱 -->
    <property name="mail_from" value="support@juchiahau.com" />
    <property name="mail_to" value="juch@juchiahau.com" />
    <target name="all">
        <antcall target="test" />
        <antcall target="report" />
		<antcall target="send" />
    </target>
    <target name="test">
        <taskdef name="jmeter" classname="org.programmerplanet.ant.taskdefs.jmeter.JMeterTask" />
        <jmeter jmeterhome="${jmeter.home}" resultlog="${jmeter.result.jtlName}">
            <!-- 声明要运行的脚本。"*.jmx"指包含此目录下的所有jmeter脚本 -->
            <testplans dir="\JmeterAutoTest\script" />
        </jmeter>
    </target>

    <path id="xslt.classpath">
        <fileset dir="${jmeter.home}/lib" includes="xalan*.jar"/>
        <fileset dir="${jmeter.home}/lib" includes="serializer*.jar"/>
    </path>

    <target name="report">
        <xslt
	    classpathref="xslt.classpath"
            force="true"
	    in="${jmeter.result.jtlName}" 
	    out="${jmeter.result.htmlName}" 
	    style="${jmeter.home}/extras/jmeter-results-detail-report_21.xsl">
            <param name="dateReport" expression="${time}"/>
	</xslt>
        <!-- 因为上面生成报告的时候，不会将相关的图片也一起拷贝至目标目录，所以，需要手动拷贝 -->
        <copy todir="${jmeter.result.html.dir}">
            <fileset dir="${jmeter.home}/extras">
                <include name="collapse.png" />
                <include name="expand.png" />
            </fileset>
        </copy>
    </target>
    <!-- 发送邮件 -->
	<target name="send" >
        <!-- 填写你发送邮件的邮箱的STMP信息 -->
        <mail mailhost="smtp.office365.com" mailport="25" subject="Test Report!" messagemimetype="text/html" user="support@juchiahau.com" password="****************" >
        <from address="${mail_from}"/>
        <to address="${mail_to}"/>
        <message>This email was sent automatically by ANT. Please check the automation test report. Thank you!</message>
		<attachments> 
			<fileset dir="${jmeter.result.html.dir}">
				<include name="${ReportName}${time}.html"/>
			</fileset>
		</attachments>
		</mail>
    </target>
</project>
```

项目目录配置好后估计Jenkins也初始化完成了。

来 Create new jobs 吧！

![image](/assets/img/AntJJ/2020-05-16_0015.png)

# 附录

## TomCat

![image](/assets/img/AntJJ/tomcat.png)
获得猫咪：<http://tomcat.apache.org>

## Download List

[Download JDK](https://openjdk.java.net){:target="_blank"}
{:class="btn btn-warning" style="display:list-item;"}
[Download Jmeter](https://jmeter.apache.org){:target="_blank"}
{:class="btn btn-blue" style="display:list-item;"}
[Download Ant](http://ant.apache.org/bindownload.cgi){:target="_blank"}
{:class="btn btn-danger" style="display:list-item;"}
[Download Jenkins](https://www.jenkins.io/download){:target="_blank"}
{:class="btn" style="display:list-item;"}
