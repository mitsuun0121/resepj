<template>
  <v-container>
    <ReviewForm />
  </v-container>
</template>

<script>
import ReviewForm from '~/components/shop/ReviewForm.vue';

export default {
  name: 'ReviewPage',
  layouts: 'default',
  components: {
    ReviewForm,
  }
};
</script>