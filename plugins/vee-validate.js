import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json';
import { required, email, min, max } from 'vee-validate/dist/rules';

// 日本語を設定
localize('ja', ja);

extend('required', {
    ...required,
    message: '{_field_}を入力して下さい',
});

extend('email', {
    ...email,
    message: '有効な{_field_}を入力して下さい',
});

extend('min', {
    ...min,
    message: '{length}文字以上で入力して下さい',
});

extend('max', {
    ...max,
    message: '{length}文字以下で入力して下さい',
});

extend('alphanumeric', {
    validate: value => /[a-zA-Z]/.test(value) && /[0-9]/.test(value),
    message: '半角英数字を組み合わせて入力して下さい',
});



// ルールチェック用のコンポーネント
Vue.component('ValidationProvider', ValidationProvider);
// フォーム全体のバリデーション用のコンポーネント
Vue.component('ValidationObserver', ValidationObserver);
