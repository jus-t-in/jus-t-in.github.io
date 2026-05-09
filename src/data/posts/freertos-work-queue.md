---
title: 'FreeRTOS队列'
category: 'Softwares'
date: '2026/05/8 19:19'
modifiedDate: '2026/05/9 21:24'
---

# FreeRTOS队列
www.bilibili.com/video/BV1vT2CB8EN4
队列就是一条数据运输的管道，有的任务在一头向队列里塞数据，有的任务在另一头从队列里取数据。

## 1.项目设计
### 1、任务一：按键检测
检测按键按下并计数

### 2、任务二：数据处理任务
数据处理（用一秒延时代替）；串口发送：按键次数和数据处理次数

## 2.创建项目
### 1、为每个外设单独生成.c/.h文件
main函数中，创建任务的代码会不见。取而代之的是MX_FREERTOS_Init()。
![alt text](images/freertos-work-queue/image.png)

### 2、设置debug模式，并设置额外时钟基准
解释见（https://jus-t-in.github.io/#/post/cline-stm32-configuration-use）
![alt text](images/freertos-work-queue/image-1.png)

### 3、设置按键k0的GPIO为输入
![alt text](images/freertos-work-queue/image-2.png)![alt text](images/freertos-work-queue/image-3.png)

### 4、启动串口、输出信息
![alt text](images/freertos-work-queue/image-4.png)![alt text](images/freertos-work-queue/image-5.png)

### 5、freertos任务设置
![alt text](images/freertos-work-queue/image-6.png)

### 6、创建任务函数的变化
![alt text](images/freertos-work-queue/image-7.png)
创建任务的函数在此函数内部，此外还有任务属性结构体、任务函数都在其中。
![alt text](images/freertos-work-queue/image-8.png)

### 7、写代码
![alt text](images/freertos-work-queue/image-9.png)
![alt text](images/freertos-work-queue/image-10.png)
![alt text](images/freertos-work-queue/image-11.png)

### 8、编译下载调试
间隔一秒以上按一次，同时增加；
![alt text](images/freertos-work-queue/image-12.png)
很多坑，但没明白怎么解决的。一直没输出来着，然后重启电脑后好了？？？
此外注意下ST_Link的配置文件、烧录完成连接串口时多插拔几次，记得选串口设备。

### 9、代码bug
事件丢失：一秒内按多次，按键次数增加，计算一秒一加。事件重复：长按时，按键次数不增加，计算次数一秒一加。
![alt text](images/freertos-work-queue/image-13.png)
通过队列Queue解决

## 3.队列Queue

### 1、bug解决
生产者通过队列传输数据，消费者逐一接收数据，就不会出现数据重复的情况。
![alt text](images/freertos-work-queue/image-14.png)
在消费者处理数据时，传输的数据存储在队列里，也不会出现数据丢失的问题。
![alt text](images/freertos-work-queue/image-15.png)
注意：队列的长度依旧有限，还是可能存在溢出的现象。

### 2、特性
使用队列后，消费者不需要像全局变量一样，实时检测变量状态。而是将自己置于阻塞态，不占用运行资源。当队列传来数据时，freertos会把消费者唤醒到就绪态。
![alt text](images/freertos-work-queue/image-16.png)

### 3、代码实现
#### 配置队列
CubeMX中设置队列参数，然后生成代码
![alt text](images/freertos-work-queue/image-17.png)
在创建任务代码前增加了创建队列代码
![alt text](images/freertos-work-queue/image-18.png)
BtnQueueHandle：队列的操纵句柄

#### 修改代码
删掉全局变量，在任务函数中修改
![alt text](images/freertos-work-queue/image-20.png)
![alt text](images/freertos-work-queue/image-21.png)
osMessageQueuePut第四个变量（osMessageQueueGet同理）
![alt text](images/freertos-work-queue/image-19.png)
第二个变量是要传递的指针


