---
title: 'FreeRTOS任务切换'
category: 'Softwares'
date: '2026/5/5 11:25'
modifiedDate: '2026/5/5 9:15'
---

# FreeRTOS任务切换
以LED灯和串口输出为例

## 任务实现
参考教程https://www.bilibili.com/video/BV1ErWyziEtw

### 1.并行LED与串口输出
1）ioc文件配置
我的板子和教程不同，原理图上USB转串口接的是USART1，所以在配置时要选USART1（不是教程里的USART2）
![alt text](images/freertos-led-serial/image.png)
![alt text](images/freertos-led-serial/image-1.png)

2）FreeRtos设置
增加一个task，并重命名
![alt text](images/freertos-led-serial/image-2.png)
然后点generate code生成代码。

3）写代码，运行
在代码中找到两个任务函数，修改代码。然后编译运行。
![alt text](images/freertos-led-serial/image-3.png)

4）调试验证
能看到绿色LED间隔一秒闪烁，然后插上usb数据线连接电脑。打开串口调试助手https://serial.baud-dance.com/#/。点击连接串口设备，得到串口输出。
![alt text](images/freertos-led-serial/image-4.png)

### 2.原理
1）寄存器
CPU对数据进行计算时，需要先将数据从内存提取到寄存器中。CPU运算完成后，再由寄存器写回内存。
我们写的程序被编译成一条条机器指令，烧录到Flash中。pc寄存器存储着CPU将要执行命令的Flash地址，就是指向CPU下一步要执行的命令。
![alt text](images/freertos-led-serial/image-5.png)
因此我们可以修改寄存器的状态，让CPU兼顾两个任务的执行。这就是FreeRtos的实现

2）FreeRtos任务栈
![alt text](images/freertos-led-serial/image-6.png)
FreeRtos先为任务A分配时间片，在时间片内cup/寄存器正常执行任务。时间片耗尽，切换到任务B。
在FreeRtos切换任务前，先将当前寄存器的值存储到任务栈，以便后续切换回来时恢复。
FreeRtos先为任务B分配时间片，让PC寄存器指向任务B开头的指令。时间片耗尽，切换到任务A。
此时，FreeRtos将任务栈A中保留的寄存器值全部出栈，给任务A分配时间片，继续执行任务A的后续。循环
![alt text](images/freertos-led-serial/image-7.png)
当然，在实际任务调度时，并不只有回合制切换。还有优先级、就绪、挂起、阻塞等状态。但本质还是将CPU寄存器值保存到任务栈，以及从任务栈恢复寄存器值。



