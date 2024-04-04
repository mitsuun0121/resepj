<template>
  <v-container>
    <LoginForm />
  </v-container>
</template>

<script>
import LoginForm from '~/components/auth/LoginForm.vue';

export default {
  name: 'UsersLoginPage',
  layouts: 'default',

  components: {
    LoginForm,
  },
};
</script>