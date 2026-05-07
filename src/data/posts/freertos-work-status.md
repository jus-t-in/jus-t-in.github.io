---
title: 'FreeRTOS任务状态'
category: 'Softwares'
date: '2026/05/6 18:48'
modifiedDate: '2026/05/6 21:15'
---

# FreeRTOS任务状态
www.bilibili.com/video/BV1xM1KB3EXr
## 1.任务状态切换
### 1、ready2running
任务从就绪态（readdy）开始，被分配时间片，状态改变为运行态（running）。
![alt text](images/freertos-work-status/image.png)

### 2、阻塞态（blocked）
为了应对延时函数/数据等待时，CPU空耗的问题，引入阻塞态。
当running任务执行到了osDlay函数进行延时，任务会将自己设置为blocked（即使时间片未耗尽）。调度器为下一个ready任务分配时间片变为running，blocked任务则不会被分配时间片。直到osDely的延时结束，blocked任务被设置为ready。进入循环。
![alt text](images/freertos-work-status/image-1.png)
HAL_delay会一直占用Cpu，比较是否到达延时时间。
![alt text](images/freertos-work-status/image-2.png)
osDlay会让任务进入blocked等待，让出cpu资源。

### 3、挂起态（suspended）
一个任务后续不需要运行，即可进入suspended状态，不在参与任务调度。
用osThreadSuspend和osThreadResume切换
![alt text](images/freertos-work-status/image-3.png)

## 2.断点调试

### 1、设置断点debug
在各个任务中设置断点。
![alt text](images/freertos-work-status/image-4.png)
运行后选择“freertos对象”，即可看到任务信息
![alt text](images/freertos-work-status/image-5.png)
此处LED任务不是ready，因为freertos会把代表正在运行任务的指针变量（psCurrentTCB）指向优先级最大的任务，以便启动时直接执行。

### 2、LED任务
然后继续运行。IDEL任务是空闲任务，在没有ready任务时，freertos会调用它整理资源。
Tmr Svr是定时器任务，用来处理freertos的软件定时器。
![alt text](images/freertos-work-status/image-6.png)

### 3、串口任务
继续运行，LED任务进入delayed（Clion的rtos调试器，把有超时时间的blocked成为delayed。实际上就是blocked），可以看到小灯熄灭。
![alt text](images/freertos-work-status/image-7.png)

### 4、clion与freertos官方对照
clion中无等待对象的Blocked是suspended，有等待对象的blocked就是blocked。
![alt text](images/freertos-work-status/image-8.png)
![alt text](images/freertos-work-status/image-9.png)

后续自己打断点调试体会

## 3.补充
debug时的clion提醒
![alt text](images/freertos-work-status/image-10.png)
在cubeMX中配置即可,双击clion中的ioc文件，在cubeMX中打开
![alt text](images/freertos-work-status/image-11.png)
主要打开以下两项即可修复
![alt text](images/freertos-work-status/image-12.png)
![alt text](images/freertos-work-status/image-13.png)

