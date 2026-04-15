---
title: 'Creo11 安装 creo2urdf'
category: 'Softwares'
date: '2026/4/14 9:15'
modifiedDate: '2026/4/14 9:15'
---

# Creo11 安装 creo2urdf

## 一、安装creo2urdf
https://github.com/mesh-iit/creo2urdf

### 1.下载
下载Releases文件，并解压

### 2.安装插件

1）在creo中，打开【文件】- 【管理会话】- 【选择工作目录】
![alt text](images/creo-install&use-creo2urdf/image1.png)
![alt text](images/creo-install&use-creo2urdf/image2.png)

2）在资源管理器中打开【工作目录】，在下面创建protk.dat空文件
![alt text](images/creo-install&use-creo2urdf/image3.png)

3）用记事本打开它，填入以下内容：
```
name creo2urdf
Startup dll
Allow_stop True
Delay_start False
exec_file \path\to\creo2urdf.dll
text_dir \path\to\creo2urdf\text
END
```
将 \path\to\creo2urdf.dll 和 \path\to\creo2urdf\text 替换为你解压后的实际路径
![alt text](images/creo-install&use-creo2urdf/image4.png)

### 3.重启creo完成安装
![alt text](images/creo-install&use-creo2urdf/image5.png)

## 二、使用
我没成功。。。
后面用的step2urdf.top，先把creo的模型文件另存为stp格式，导入网站，设置base和link相关参数，可预览，最后导出即可。
