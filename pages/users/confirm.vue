<template>
  <v-container>
    <ConfirmForm />
  </v-container>
</template>

<script>
import ConfirmForm from '~/components/auth/ConfirmForm.vue';

export default {
  name: 'ConfirmPage',
  layouts: 'default',
  components: {
    ConfirmForm,
  }
};
</script>