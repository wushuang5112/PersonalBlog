# Java语言命令

## Maven操作

```txt
// 删除target目录下的内容
mvn clean
// 编译main目录的源代码
mvn clean compile
// 编译main和test目录的源代码，并按照pom的定义打包
mvn clean package
// 编译main和test目录的源代码，按照pom的定义打包，并发布到本地仓库
mvn clean install
// 编译main和test目录的源代码，按照pom的定义打包，并发布到本地和远程仓库
mvn clean deploy
mvn package
mvn install
```
