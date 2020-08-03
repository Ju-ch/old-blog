---
layout: post
title:  "使用Microsoft Power Automate 创建自动化的邮件流"
subtitle: '关注重要事项，自动完成其余工作'
date: 2020-06-05 20:39:55 +0800
overwrite: 2020-06-05 20:39:55 +0800
tags: [Flow,PowerAutomate]
toc: True
---

想必大家工作中都有不少的邮件需要处理，而涉及工作的部分邮件多是套用模板或者自动生成的，面对几乎千篇一律的邮件，如何快速处理，是一门技巧，也是工作的艺术。

<!--excerpt-->

如果你使用过IFTTT那么对Microsoft Flow一定不会陌生，它既有类似于IFTTT的强大和灵活架构，亦继承了微软多年的企业级服务的基因，在团队协作、与企业内部应用集成以及安全性等方面有一些自己的特点。

首先登入👉🏻[Flow](https://asia.flow.microsoft.com)

![Flow Index](/assets/img/email_flow/2020-06-05_0004.webp)

里面有超级多的模板可以直接使用，但是本篇文章的需求是自动回复有特定关键字的邮件。

```bash
# 需求：
# 我在Google Drive上分析了许多古典音乐方面的内容，后来共享人数太多，为了避免权限混乱，我把所有资源备份到了Team Drive，现在叫Shared Drive。
# 但是由于原有资源的共享链接传播太广，导致即使在备份了一年之后的今天也仍然有人去申请这个资源的权限。

# 旧的处理办法：
# 刚开始我是通过申请资源的邮件的主题关键字进行贴标签，有空的时候统一回复，由于没有固定的时间，偶尔也会一个月回一次。
```

现在我的处理办法是使用Flow自动回复邮件，经过一个多月的实际使用发现，使用Flow自动回复申请邮件，基本可以在收信后的一分钟内复信给申请的邮箱地址，几乎是刚申请完就收到答复的邮件。

## 步骤一：新建自动化流

如图所示，新建一个空白的自动化流，流名称以见名知义为标准，流的触发器搜索关键字`gmail`，只有一个选项。

![New Folw](/assets/img/email_flow/2020-06-05_0005.webp)

这里一般需要授权Flow访问Gmail的权限，在Flow里称之为**连接器**，这里不演示如何操作。

## 步骤二：设置触发器

根据我在Gmail中定义的分类规则，所有Google Drive的申请邮件都在`Category/Forums`分类中，根据实际情况填写即可。

![触发器](/assets/img/email_flow/2020-06-05_0006.webp)

## 步骤三：发送电子邮件

新增一个步骤，仍然搜索关键字`gmail`，选择`发送电子邮件`这个操作。

![image](/assets/img/email_flow/2020-06-05_0007.webp)

如何在众多的邮件中定义收件人？

经过分析后，我发现这类邮件有的是以申请人邮箱发送的，而有的是通过`drive-shares-noreply@google.com`发送的，所以不能直接用现成的API直接获取发件人的Email地址。但是在正文中确实明确写了申请人的Email的，此时可以使用表达式把Email切割出来，`Ctrl`+`Shift`+`Space`激活表达式面板，我的规则切割如下。

```bash
substring(triggerBody()?['Snippet'],0,indexOf(triggerBody()?['Snippet'],'申请使用'))
# 邮件的正文开头就是 “test@gmail.com申请使用以下文件夹...” 这个格式的，所以我把“申请使用”前面的字符串剪过来就可以用了
```

主题可以写个模板，替换关键字就行了，我这里是使用表达式把收到的邮件的主题关键字剪了过来，用法与获取发件人地址类似。

然后是正文的编写，也是固定的模板，再加上**申请时间**和**申请内容**这两个个性化的关键字。

```bash
# 获取并格式化接收邮件时间的表达式
convertFromUtc(replace(triggerBody()?['DateTimeReceived'], '+00:00', '.0000000Z'), 'China Standard Time', 'yyyy年M月d日HH:mm:ss')
```

最后一个*substring*和前两个一样，都是通过切割字符串来获取我们想要的信息。

## 效果

到这里，一个自动化的流就写好了，点击保存，新的自动化流在第一次保存的时候一般要测试一下，那么我就不测试了（万一有啥问题就打脸了(*/ω＼*)）。

其实这个工作流我已经运行了两个多月将近70天了，不过一般数据保护条例(GDPR)规定，保留运行日志的时间不得超过 28 天。

![日志](/assets/img/email_flow/2020-06-05_0008.webp)

下面这个就是我从发件箱看到的内容

![发件箱](/assets/img/email_flow/2020-06-05_0009.webp)


更多表达式的文档在这里：[https://docs.microsoft.com](https://docs.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference)
