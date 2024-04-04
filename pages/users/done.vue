<template>
  <v-container>
    <DoneForm />
  </v-container>
</template>

<script>
import DoneForm from '~/components/shop/DoneForm.vue';

export default {
  name: 'DonePage',
  layouts: 'default',
  components: {
    DoneForm,
  }
};
</script>