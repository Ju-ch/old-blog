---
layout: post
title:  "gclone配置教程"
date: 2020-04-07 22:57:47 +0800
overwrite: 2020-04-08 16:57:17 +0800
cover: /assets/img/gclone/gclone.png
tags: [rclone,gclone,GoogleDrive]
toc: true
---

由于众说周知的原因，GoogleDrive的资源要比国内某些网盘要丰富不少，并且良心的是其不限速无限容量的特征。由此我便成了GoogleDrive的拥趸，惟一遗憾的就是GoogleDrive限制单用户每日复制量不得超过750GB。

<!--excerpt-->

不过其实早就有[AutoRclone][AutoRclone]{:target="_blank"}可以突破750的限制，其原理就是使用Google Cloud Platform创建项目，生成服务账号，再用服务账号来copy，达到750的时候自动切换，以此来日存1000TB。但是这个不是和原版的Rclone一样的操作方式，用起来总感觉别扭。于是就有了Gclone，脱胎于rclone，一键安装，无痛切换。

## Gclone能做什么
简而言之，[Rclone][rclone]{:target="_blank"}能做的[Gclone][Gclone]{:target="_blank"}都能做，当然这是相对于GoogleDrive来说的。
并且在通过`--drive-server-side-across-configs`实现使用GoogleAPI复制资源，不走VPS流量，这在copy团队盘的时候尤其有用。

## 安装Gclone
```bash
# 安装gclone
bash <(wget -qO- https://git.io/gclone.sh)
# View version information
gclone version
# 替换rclone，因为gclone是rclone的增强分支，所以可以兼容rclone
cp /usr/bin/gclone /usr/bin/rclone
```

## 配置Gclone
由于gclone依赖`service_account_file_path`和`service_account_file_path`所以这一节放到后面部分，建议按顺序读。

[👉🏻直达配置](#继续配置gclone)
{:style="text-indent: 0;font-size: 20px;text-align: center;"}

## 怎么使用Gclone
你得准备Google账号、Google Shared Drive （团队盘）、Python3环境，至于这些怎么安排就不赘述了。
由于单独使用[Gclone][Gclone]{:target="_blank"}是不能实现自动切换账号的，所以需要先配置一下[AutoRclone][AutoRclone]{:target="_blank"}，因为[Gclone][Gclone]{:target="_blank"}是需要依赖[AutoRclone][AutoRclone]{:target="_blank"}生成出来的Service Accounts账号的。

### 第一步：安装[AutoRclone][AutoRclone]
```bash
git clone https://github.com/xyou365/AutoRclone && cd AutoRclone && pip3 install -r requirements.txt
```

### 第二步：生成Service Accounts账号
这个要合理安排，因为每个谷歌账号的项目数是有限制的（25个），不要全部用光了，也要注意看文档，不要把已有的服务账号覆盖了🧐。
首先要打开[Google Drive API][DriveAPI]{:target="_blank"}，点击**Enable the Drive API**然后将其生成的**credentials.json**保存到[AutoRclone][AutoRclone]{:target="_blank"}的根目录。
>In resulting dialog click DOWNLOAD CLIENT CONFIGURATION and save the file credentials.json to your working directory.

![Google Drive API](/assets/img/gclone/20200407162911.png){:class="post-image"  height="256px"}

---
现在开始知识点①🖋
{:style="text-indent: 0;font-size: 30px;text-align: center;"}

1，首先确保当前处在AutoRclone根目录，如果你从来没有在Google Cloud Platform创建过项目，可以直接运行
```bash
# 新建6个项目
# 每个项目默认100个Service Accounts（然后你就有600个sa账号了，每天可copy大约439.453125TB的文件）
python3 gen_sa_accounts.py --quick-setup 6
```
2，如果你曾经使用过Google Cloud Platform，并且还有项目在使用中，这需要特别说明；

2.1，在已有的项目之外，新的项目中创建Service Accounts
```bash
# 在已有项目之外，新建6个项目
python3 gen_sa_accounts.py --quick-setup 6 --new-only
```
2.2，覆盖已有的项目，**使用此命令需慎重**
```bash
# 这会覆盖已有的项目的Service Accounts，至于覆盖的是哪些，我也不知道😂，所以要慎重
python3 gen_sa_accounts.py --quick-setup -6
```

知识点①结束🖋
{:style="text-indent: 0;font-size: 30px;text-align: center;"}

---

运行以上任意一个命令都会得到一串返回信息，类似于
![](/assets/img/gclone/20200408162455.png){:class="post-image"}
复制链接后打开，有可能会提示不安全，未经过验证等信息，直接进入，不必理会。然后就可以授权了，直接点允许，最终会获得授权码，贴到终端即可。
注意，如果提示
![](/assets/img/gclone/20200408151101.png){:class="post-image"}
打开提示信息给出的链接，选择启用**Service Usage API**，启用之后再回到终端摁个回车即可。
![](/assets/img/gclone/20200408151008.png){:class="post-image"}
如果顺利运行，可以在*accounts*这个文件夹下面看到你生成的`项目数*100`个json的文件。

### 第三步：将sa账号加入团队盘
由于团队盘最多只能添加600个账号，所以使用[Google Groups][gg]进行管理，既方便又可靠。
>Official limits to the members of Team Drive (Limit for individuals and groups directly added as members is 600).

先来获取[sa][sa]账号对应的[email][sa]，在chrome商店下载[“EmailDrop - 轻松提取电邮”](https://chrome.google.com/webstore/detail/emaildrop-extract-emails/peilgijmhiocdmdeglhiljipigamfbjh)就能提取到页面里的Email了，一个项目有100个sa的邮箱，通常一页只显示50个。

![search Email](/assets/img/gclone/20200407172105.png){:class="post-image"  height="256px"}

一次可以获取一个项目（100个sa账号）的email，保存起来再说。

![get Email](/assets/img/gclone/20200407173057.png){:class="post-image"  width="512px"}

然后在[Groups][gg]新建一个群组，名称什么的随意，主要是新建群组，其实已有的群组也可以。

![New Groups](/assets/img/gclone/20200407171509.png){:class="post-image"  height="256px"}

再把sa账号对应的email地址加到群组里就可以了，不过普通用户一次只能添加10个账号到群组，一天只能添加100个。那么600个sa要分6天来添加，所以要把sa账号的分组做好，避免时间久了混乱。

![Add Email](/assets/img/gclone/20200407175345.png){:class="post-image"  height="256px"}

----

如果你的Google账号是G Suite账号而不是个人账号的话，可以使用`add_to_google_group.py`批量导入，节省时间。

群组必须创建在组织中才能调用API不然，出错都不知道为什么。
![在组织中新建群组](/assets/img/gclone/20200408170306.png){:class="post-image"  height="256px"}

然后再按照官方文档打开[Directory API](https://developers.google.com/admin-sdk/directory/v1/quickstart/python),这里面生成的`credentials.json`要放到**credentials**文件夹里面，而不是AutoRclone的根目录，虽然同名，但是作用不一样，根目录的credentials.json用来创建sa账号，这里的credentials.json这是用来把sa添加进Groups。
![获取Directory API](/assets/img/gclone/20200408151837.png){:class="post-image"  height="256px"}
```bash
python3 add_to_google_group.py -g GroupsName@yourdomain.com
```
有的时候一次跑完可能会漏掉一点，所以上面的命令可以多运行几遍。
![add_to_google_group](/assets/img/gclone/20200408171200.png){:class="post-image"  height="256px"}

**假设现在你已经把sa全部添加到群组**，可以把群组账号添加到团队盘了

先得到群组电子邮件地址，就是新建群组时设置的，可以安装下图方法找到。
![Group 关于](/assets/img/gclone/20200407180818.png){:class="post-image"  height="256px"}

![search groups email](/assets/img/gclone/20200407180625.png){:class="post-image"  height="256px"}

添加进团队盘，相关权限按需设置即可，比如我默认给的是“内容管理员”。

![team drive](/assets/img/gclone/20200407181011.png){:class="post-image"  height="256px"}

## 继续配置Gclone
完成上述操作后，我们既获得了批量的sa账号，同时也使sa账号有了操作GoogleDrive的权限。

这时就可以来配置Gclone
```bash
# 直接修改rclone配置文件即可
vim ~/.config/rclone/rclone.conf

# 尾部追加如下语句
[gc]
type = drive  
scope = drive  
service_account_file = /root/accounts/1.json # /AutoRclone/accounts/ 中的随意一个json文件，要填绝对路径
service_account_file_path = /root/accounts/ # /AutoRclone/accounts/ 的绝对路径
# 以上四句是必须的
root_folder_id = root
# 可以忽略，也可以把“root”设置为sa对其有权限的GoogldDrive的目录的id
```

** 注意，复制可以，但是得改一改

除了手动写配置文件，还可以自动new一个
```bash
# 打开rclone配置
rclone config
# 选择新建一个remote，具体步骤忽略，只需要在设置Client的时候写好路径就可以
```
![new rclone config](/assets/img/gclone/20200407222224.png){:class="post-image"  height="256px"}


更可以进阶地，设置gclone的**client_id**等，以下是我的gclone配置
```bash
[gc]
type = drive
client_id = 1072********jtk9.apps.googleusercontent.com
client_secret = g87C********QO_a
scope = drive
token = {"access_token":"ya29*****2dQ","token_type":"Bearer","refresh_token":"1//0e*****Qla0","expiry":"2020-03-21T17:18:24.309427971+08:00"}
service_account_file = /home/****/****/AutoRclone/accounts/135*********0b15.json
service_account_file_path = /home/****/000TEMP/AutoRclone/accounts/
root_folder_id = 0ALH*********9PVA
```

## 使用Gclone
至此大功告成，可以打包`/AutoRclone/accounts`和`rclone.conf`随身携带使用了。

简单使用：复制
```bash
gclone copy gc:{源id} gc:{目标id} --drive-server-side-across-configs -P
# 一下copy一个盘，岂不是很爽？
```
如果你跟我一样设置了`root_folder_id`，那么连目标目录的id都可以不用写
```bash
gclone copy gc:{源id} gc:/ --drive-server-side-across-configs -P
```
** `gc:{id}`后面还可以加路径，如gc:{id}/videos；

** 注：想要资源练练手的可以直接留言或者发邮件给我。

## 附录
本文链接一览
- [AutoRclone][AutoRclone]{:target="_blank"}
- [Rclone][rclone]{:target="_blank"}
- [Gclone][Gclone]{:target="_blank"}
- [Drive API][DriveAPI]{:target="_blank"}
- [Directory API](https://developers.google.com/admin-sdk/directory/v1/quickstart/python){:target="_blank"}
- [Google Groups][gg]{:target="_blank"}
- [Service Accounts][sa]{:target="_blank"}

[AutoRclone]:https://github.com/xyou365/AutoRclone/
[Gclone]:https://github.com/donwa/gclone/
[DriveAPI]:https://developers.google.com/drive/api/v3/quickstart/python/
[gg]:https://groups.google.com/
[sa]:https://console.cloud.google.com/iam-admin/serviceaccounts/
[rclone]:https://rclone.org/docs/
