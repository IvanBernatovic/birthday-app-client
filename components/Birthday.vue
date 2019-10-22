<template>
  <div class="py-2 px-1 -m-1 cursor-pointer hover:bg-gray-300">
    <h1>
      {{ birthday.date | moment('DD.MM.') }} - {{ birthday.name }}
      <span class="font-thin text-gray-600"
        >({{
          birthday.date
            | moment(
              'from',
              new Date(birthday.date).setFullYear(now.getFullYear()),
              true
            )
        }})</span
      >
    </h1>
  </div>
</template>

<script>
export default {
  props: ['birthday', 'now']
}
</script>
