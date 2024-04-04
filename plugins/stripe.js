import Vue from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

Vue.prototype.$stripe = stripePromise;
