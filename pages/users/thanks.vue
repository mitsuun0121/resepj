<template>
  <v-container>
    <ThanksForm />
  </v-container>
</template>

<script>
import ThanksForm from '~/components/auth/ThanksForm.vue';

export default {
  name: 'ThanksPage',
  layouts: 'default',
  components: {
    ThanksForm,
  }
};
</script>