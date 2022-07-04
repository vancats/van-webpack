
class ArrayQueue {
  constructor() {
    this._list = []
  }
  enqueue(item) {
    this._list.push(item)
  }
  dequeue() {
    return this._list.shift()
  }
}

const QUEUED_STATE = 0 /// 已入队
const PROCESSING_STATE = 1 /// 处理中
const DONE_STATE = 2 /// 处理结束

class AsyncQueueEntry {
  constructor(item, callback) {
    this.item = item
    this.state = QUEUED_STATE
    this.callback = callback
  }
}

class AsyncQueue {
  constructor({ name, parallelism, processor, getKey }) {
    this._name = name
    this._parallelism = parallelism /// 并发数
    this._processor = processor /// 队列的每个条目执行的操作
    this._getKey = getKey /// 返回一个 key 标识每个元素
    this._entries = new Map() /// key: AsyncQueueEntry
    this._queued = new ArrayQueue()
    this._activeTasks = 0 /// 当前处理中的人物
    this._willEnsureProcessing = false /// 是否将要开始处理
    // this.hooks = { beforeAdd: new AsyncSeriesHook(['item']) }
  }
  add = (item, callback) => {
    const key = this._getKey(item)  /// 获取条目对应的 key
    const entry = this._entries.get(key) /// 获取 key 对应的老条目
    if (entry) {
      console.log('已经添加过了哦')
    } else if (entry) {
      /// 如果没有添加过，创建一个新条目
      const newEntry = new AsyncQueueEntry(item, callback)
      this._entries.set(key, newEntry)
      this._queued.enqueue(newEntry)
      if (this._willEnsureProcessing === false) {
        this._willEnsureProcessing = true
        setImmediate(this._ensureProcessing) /// 处理任务
      }
    }
  }

  _ensureProcessing = () => {
    while (this._activeTasks < this._parallelism) {
      const entry = this._queued.dequeue()
      if (entry === undefined) break
      this._activeTasks++
      entry.state = PROCESSING_STATE
      this._startProcessing(entry)
    }
    this._willEnsureProcessing = false
  }

  _startProcessing = (entry) => {
    this._processor(entry.item, (e, r) => {
      this._handleResult(entry, e, r)
    })
  }

  _handleResult = (entry, error, result) => {
    const callback = entry.callback
    entry.state = DONE_STATE
    entry.callback = undefined
    entry.result = result
    entry.error = error
    callback(error, result)
    this._activeTasks--
    if (this._willEnsureProcessing === false) {
      this._willEnsureProcessing = true
      setImmediate(this._ensureProcessing) /// 处理任务
    }
  }
}

module.exports = AsyncQueue
