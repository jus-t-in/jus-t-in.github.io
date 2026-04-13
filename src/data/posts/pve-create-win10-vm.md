---
title: 'PVE 创建 Windows 10 虚拟机'
category: 'Linux'
date: '2025/12/09 23:14'
modifiedDate: '2026/03/15 09:45'
---

# PVE 创建 Windows 10 虚拟机

## 一、下载模板
下载连接：https://cloud.189.cn/t/3ueUZvbaqIZf（访问码：908v）

## 二、上传模板
上传模板到PVE主机

### 1.下载WinSCP
![alt text](/images/pve-create-win10-vm/image1.png)

### 2.连接PVE主机
![alt text](/images/pve-create-win10-vm/image2.png)

### 3.上传模板文件
把模板上传到/var/lib/vz/dump目录下
![alt text](/images/pve-create-win10-vm/image3.png)

## 三、模板还原到win10系统

### 1.手动配置参数
通过浏览器进入到PVE的web管理后台,点击PVE节点下的local(pve),点击备份,选择刚才上传的系统还原,覆盖设置部分按照电脑配置及使用需求做调整,也可以保持默认,点击还原,等待出现TASK OK 即表示成功
![alt text](/images/pve-create-win10-vm/image4.png)

### 2.进系统安装
初次开机进入的不是系统最后部署页面，而是选择键盘布局的页面。
这个问题直接在右侧找到关机按钮的下拉菜单，选择重置一次即可