# npm script

## 并行&串行执行
并行: &
串行: &&
执行成功后不再执行: ||
管道: |

## 预先执行&完成后执行
### 在install script之前执行: npm preinstall   -- npm pre-*
### 在install script之后执行: npm postinstall  -- npm post-*

## 顺序执行或并行执行
- npm-run-all
- npm-run-all 综合性命令（可顺序可并行）
- run-s 简写，等价于 npm-run-all -s 顺序(sequentially)运行 npm-scripts
- run-p 简写，等价于 npm-run-all -p 并行(parallel)运行 npm-scripts
```json
{
    "script": {
    "n_1": "node ./build/1.js",
    "n_2": "node ./build/2.js",
    "n_3": "node ./build/3.js",
    "test": "npm-run-all -p n_1 n_2 -s n_3",
    }
}
```

## Monorepo架构
### lucas-scripts
