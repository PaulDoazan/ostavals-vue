<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="79.832" height="80.026" viewBox="0 0 79.832 80.026">
    <path id="Path_101" data-name="Path 101"
      d="M76.723,111.548A40.013,40.013,0,1,0,36.807,71.534a39.965,39.965,0,0,0,39.916,40.013"
      transform="translate(-36.807 -31.522)" fill="#fff" />
    <path id="Path_102" data-name="Path 102"
      d="M94.675,60.923a20.189,20.189,0,0,0-14.353-5.882H60.8l2.779-2.958a2.99,2.99,0,0,0-4.349-4.105L49.4,58.435l9.824,10.458a2.99,2.99,0,0,0,4.349-4.105L60.8,61.828H80.321a13.338,13.338,0,0,1,13.5,13.459,13.7,13.7,0,0,1-13.5,13.851c-7.361,0-12.877-8.684-12.932-8.772a3.388,3.388,0,0,0-5.751,3.583c.3.489,7.532,11.976,18.683,11.976A20.481,20.481,0,0,0,100.6,75.287a20.11,20.11,0,0,0-5.921-14.364"
      transform="translate(-36.793 -31.467)" :fill="arrowColor" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  arrowColor?: string
}

withDefaults(defineProps<Props>(), {
  arrowColor: '#c83e29' // Default red color
})
</script>