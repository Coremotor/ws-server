// export const reorder = (queue, startIndex, endIndex) => {
//     const newQueue = Array.from(queue)
//     const [removed] = newQueue.splice(startIndex, 1)
//     newQueue.splice(endIndex, 0, removed)
//     return newQueue
// }

export const genQueue = (count) => {
    const q = []
    for (let i = 0; i < count; i++) {
        q.push({
            id: 'id' + i,
            catalogNumber: 1111 + i,
            songTitle: 'Song Title' + i,
            singer: 'Singer' + i,
            order: 'Order ID' + i,
            nnl: true,
            duration: '2:50',
        })
    }
    return q
}


export class Queue {
    constructor(queue) {
        this.queue = queue
    }
    getQueue() {
        return this.queue
    }
    setQueue(queue) {
        this.queue = queue
    }
    reorder(startIndex, endIndex) {
        const newQueue = Array.from(this.queue)
        const [removed] = newQueue.splice(startIndex, 1)
        newQueue.splice(endIndex, 0, removed)
        this.setQueue(newQueue)
    }
    remove(id) {
        const newQueue = this.queue.filter(((song) => song.id !== id))
        this.setQueue(newQueue)
    }
}
