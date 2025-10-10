<template>
    <button class="add-post-btn" @click="$emit('click')">
        +
    </button>    
</template>

<style scoped lang="sass">
.add-post-btn
  position: fixed
  bottom: 2rem
  right: 2rem
  width: 4.5rem
  height: 4.5rem
  border-radius: 50%
  background-color: var(--fondo-azul)
  color: #fff
  font-size: 2.5rem
  border: none
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  transition: background-color 0.3s ease

  &:hover
    background-color: #5a8dee
</style>