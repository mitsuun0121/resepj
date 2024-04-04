<template>
  <v-container>
    <RegisterForm />
  </v-container>
</template>

<script>
import RegisterForm from '~/components/auth/RegisterForm.vue';

export default {
  name: 'RegisterPage',
  layouts: 'default',
  components: {
    RegisterForm,
  }
};
</script>