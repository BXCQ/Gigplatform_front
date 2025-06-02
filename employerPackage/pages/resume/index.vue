<template>
  <view></view>
</template>

<script>
export default {
  onLoad() {
    // 重定向到新路径
    uni.redirectTo({
      url: '/pages/employer/resume/index'
    })
  }
}
</script> 