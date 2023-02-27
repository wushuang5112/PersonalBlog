# Go命令

## go目录结构

```txt
根路径下：
src:源文件
pkg:包文件
bin:可执行文件
```

## 安装依赖
go get

## 打包

go build

```txt
go build
参数有：
-ldflags：用于编译时设置变量值
-o：指定编译生成的目标文件名
-v:编译时显示包名

另外编译预设变量：
GOOS:指定编译生成可执行文件的运行系统，常用的有：windows、linux、darwin
GOARCH:指定编译生成可执行文件的运行系统架构，常用的有：amd64、arm

----
-X:设置包中的变量值
-s:去掉符号表，异常时没有文件名或行号信息
-w:去掉DWARF调试信息
```

```txt
# 示例
GOOS=darwin GOARCH=amd64 go build  -o "targte_exe" -ldflags "-w -s -X main.Env=test -X main.Version=1.0"
```

## 生成库
go install
