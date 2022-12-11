## 通过页面植入代码进行调试

```js
import { onBeforeUnmount, onUnmounted, onBeforeMount, onUpdated } from 'vue'

let loadLabel = 'load'
onBeforeMount(() => {
    console.log('onBeforeMount: ', new Date())
    console.time(loadLabel)
})

onUpdated(() => {
    console.log('onUpdated: ', new Date())
    console.timeEnd(loadLabel)
})

let unloadLabel = 'unload'
onBeforeUnmount(() => {
    console.log('onBeforeUnmount: ', new Date())
    console.time(unloadLabel)
})

onUnmounted(() => {
    console.log('onUnmounted: ', new Date())
    console.timeEnd(unloadLabel)
})
```

## vite调试模式

```js
vite --debug
```
