/**
 * 这是一个双向链表
 */
class DoubleLinkedList {
  constructor () {
    this.head = null
    this.tail = null
    this.length = 0
  }
  /**
   * [createNode 创建节点]
   * @param  {[object]}   ele  [节点信息]
   * @param  {[object]}   prev [上一个节点]
   * @param  {[object]} next [下一个节点]
   * @return {[节点类]}      [返回节点]
   */
  createNode (ele, prev, next) {
    return {
      ele: ele,
      prev: prev || null,
      next: next || null
    }
  }
  /**
   * [getNode 获取节点]
   * @param  {[number]} idx [节点位置]
   * @return {[object]}     [返回节点]
   */
  getNode (idx) {
    let l = this.length
    let i = 0
    if (idx > l || idx < 0) {
      console.error('没有这个节点!')
      return false
    } else {
      let n = this.getHead()
      while (n && i < idx) {
        if (n.next) {
          n = n.next
        }
        ++i
      }
      return n
    }
  }
  /**
   * [insert 插入节点]
   * @param  {[number]} idx [插入节点位置]
   * @param  {[object]} ele [节点信息]
   */
  insert (idx, ele) {
    let n = this.getNode(idx)
    if (n === false) {
      throw new Error('您插入的姿势不对!')
    } else if (n === null) {
      this.head = this.createNode(ele)
      this.length += 1
    } else if (typeof n === 'object') {
      if (idx > this.length - 1) {
        let newN = this.createNode(ele, n, n.next)
        n.next = newN
        this.tail = newN
        this.length += 1
      } else {
        n.ele = ele
      }
    } else {
      throw new Error('插入动作发生异常!', typeof n)
    }
  }
  /**
   * [remove 移除节点]
   * @param  {[number]} idx [移除节点位置]
   */
  remove (idx) {
    if (idx || idx === 0) {
      if (idx > this.length - 1 || idx < 0) {
        throw new Error('您拔出的姿势不对!')
      } else {
        let n = this.getNode(idx)
        if (idx === 0) {
          this.head = n.next
          if (this.head) {
            this.head.prev = null
          }
          if (this.length === 1) {
            this.tail = null
            this.length = 0
          } else {
            this.tail = this.head
            this.length--
          }
        } else if (idx === this.length - 1) {
          this.tail = n.prev
          if (this.tail) {
            this.tail.next = null
          }
          if (this.length === 1) {
            this.head = null
            this.length = 0
          } else {
            this.head = this.tail
            this.length--
          }
        } else {
          n.prev.next = n.next
          n.next.prev = n.prev
        }
      }
    } else {
      this.head = null
      this.tail = null
      this.length = 0
    }
  }
  /**
   * [getHead 获取头节点]
   * @return {[object]} [返回节点]
   */
  getHead () {
    return this.head
  }
  /**
   * [getTail 获取尾节点]
   * @return {[object]} [返回节点]
   */
  getTail () {
    return this.tail
  }
}

export default DoubleLinkedList
// Usage

let songList = new DoubleLinkedList()
songList.insert(0, {
  name: '风的季节',
  singer: 'Soler'
})
songList.insert(1, {
  name: '迎着风',
  singer: '蓝波'
})
songList.remove(1)
songList.remove(0)
console.log(songList)
