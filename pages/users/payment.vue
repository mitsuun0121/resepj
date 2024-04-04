<template>
  <v-container>
    <PaymentForm />
  </v-container>
</template>

<script>
import PaymentForm from '~/components/shop/PaymentForm.vue';

export default {
  name: 'PaymentPage',
  layouts: 'default',
  components: {
    PaymentForm,
  }
};
</script>