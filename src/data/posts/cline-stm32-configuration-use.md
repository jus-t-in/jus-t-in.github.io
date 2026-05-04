---
title: '在Clion上开发STM32的配置与使用 '
category: 'Softwares'
date: '2026/5/4 13:18'
modifiedDate: '2026/5/4 13:18'
---

# 在Clion上开发STM32的配置与使用
Clin+CubeMX

## 配置
详见以下网址
https://docs.keysking.com/docs/stm32/getting-started

## 使用

### 1.CubeMX创建工程
1）做些基础配置
![alt text](images/cline-stm32-configuration-use/image1.png)

2）选择芯片型号（我是stm32f407vet6）
![alt text](images/cline-stm32-configuration-use/image2.png)

3）设置debug模式，并设置额外时钟基准（因为在使用rtos时，hal库需要一个systick以外的定时器作为时钟基准.freeRtos会以SysTICk中段作为持中基准，因而会将SISTIC的中断优先级设置的比较低，甚至有时会关闭其中断，这时可能会导致hell库的定时发生错乱）。
![alt text](images/cline-stm32-configuration-use/image3.png)

4）设置灯的GPIO口，按板子原理图选择
![alt text](images/cline-stm32-configuration-use/image4.png)
![alt text](images/cline-stm32-configuration-use/image5.png)

5）FreeRtos配置，在左侧边栏中选择。直接完成移植
![alt text](images/cline-stm32-configuration-use/image6.png)

6）项目设置（project manager）
修改项目名称和工具链后生成代码
![alt text](images/cline-stm32-configuration-use/image7.png)

### 2.Clion中配置
1）clion中打开生成的项目，并配置预设
![alt text](images/cline-stm32-configuration-use/image8.png)

2）在main.c文件中打开文件修改Core/Src/main.c，写个小灯定时闪烁的功能
![alt text](images/cline-stm32-configuration-use/image9.png)

3）用openocd驱动stlink下载文件，因而配置openocd配置
![alt text](images/cline-stm32-configuration-use/image10.png)
stm32f4_stlink-v2.cfg内容如下，根据stlink和芯片版本修改
![alt text](images/cline-stm32-configuration-use/image11.png)

4）连接stlink和板子，运行，小灯闪烁
![alt text](images/cline-stm32-configuration-use/image12.png)
