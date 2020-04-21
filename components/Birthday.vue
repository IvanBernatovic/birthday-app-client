<template>
  <div class="py-2 px-1 -m-1 cursor-pointer hover:bg-gray-300">
    <p>
      <span class="text-purple-900 mr-2">{{ birthday.date | moment('DD.MM.') }}</span> {{ birthday.name }}
      <span class="md:font-thin text-gray-600"
        >(turns {{
          birthday.date
            | moment(
              'from',
              new Date(birthday.date).setFullYear(now.getFullYear()),
              true
            )
        }})</span
      >
    </p>
  </div>
</template>

<script>
export default {
  props: ['birthday', 'now']
}
</script>
