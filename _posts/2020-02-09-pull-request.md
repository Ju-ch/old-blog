---
layout: post
title:  "在pull request的时候提交指定commit的方法"
date: 2020-02-09 +0800 #编写时间 优先级最高 注意时区 +0800
tags: [Git]
toc: true
---

介绍一下每次**pull request**时指定某个commit的操作。

<!--excerpt-->

### 获取于源仓库的联系

首先需要创建远程仓库，指向源仓库
~~~ bash
git remote add upstream git@github.com:userName/test.git
~~~

并且从该仓库拉取代码
~~~ bash
git fetch upstream
~~~

### 在本地创建专用的分支

进入到这个仓库，并且新建一个分支专门来进行**pull request**
~~~ bash
#切换分支
git checkout upstream/master

#新建分支
git checkout -b <new-branch-name>
~~~

上面两步合在一起就是
~~~ bash
git checkout -b <new-branch-name> upstream/master
~~~

### 使用cherry-pick

然后用cherry-pick选择commit，后面的一串就是你需要**pull request**的**commit id**
~~~ bash
git cherry-pick <commit-id>
~~~

如果**当前这个commit**和源仓库有冲突可以撤销commit进行修改后再提交
~~~ bash
git reset --soft HEAD^
~~~

而如果只是想要改一下commit的信息只要运行下面这行代码就行了
~~~ bash
git commit --amend
~~~

### 提交到远程仓库并`pull request`

一切准备妥当之后就可以把这个专用的分支提交到远程仓库了
~~~ bash
git push origin <new-branch-name>
~~~

然后去到[github.com](https://github.com){:target="_blank"}中的的自己的仓库中去，找到branch

![image.webp](https://i.loli.net/2020/02/09/m7XsAuF4TYHoWM9.webp){:class="post-image"}

然后找到我们之前创建的分支，然后把它pull request即可

![image.webp](https://i.loli.net/2020/02/09/2uPBjQ1mYLqJKax.webp){:class="post-image"}
