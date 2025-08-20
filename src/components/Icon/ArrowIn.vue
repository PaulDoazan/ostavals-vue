<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="103.013" height="127.955" viewBox="0 0 103.013 127.955">
    <g id="Group_51" data-name="Group 51" transform="translate(0 0)">
      <path id="Path_138" data-name="Path 138"
        d="M60.829,0V0H38.667v8.43H60.829V119.525H38.667v8.43H69.261v-8.43h0V8.432h0V0h0V0Z"
        transform="translate(33.752 0)" fill="#040405" />
      <path id="Path_139" data-name="Path 139"
        d="M40.414,22.117,64.035,45.74H0v8.428H64L40.412,77.753l5.961,5.963,33.78-33.78v0L46.374,16.157Z"
        transform="translate(0 14.104)" fill="#040405" />
    </g>
  </svg>
</template>

<script setup lang="ts">
// Props for customization
interface Props {
  width?: string | number
  height?: string | number
  class?: string
}

withDefaults(defineProps<Props>(), {
  width: '103.013',
  height: '127.955'
})
</script>