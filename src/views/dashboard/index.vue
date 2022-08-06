<template>
  <div>shouye</div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: '章三', id: 1, pid: 0 },
        { name: '章三三', pid: 1, id: 2 },
        { name: '里斯', id: 3, pid: 0 },
        { name: '里斯斯', id: 4, pid: 3 },
      ],
    }
  },

  created() {
    const tree = this.transListToTree(this.list, 0)
    console.log(tree)
  },

  methods: {
    transListToTree(data, pid) {
      const arr = []
      data.forEach((item) => {
        if (item.pid === pid) {
          const children = this.transListToTree(data, item.id)
          if (children.length) {
            item.children = children
          }
          arr.push(item)
        }
      })

      return arr
    },
  },
}
</script>

<style scoped></style>
