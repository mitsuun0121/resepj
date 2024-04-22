<template>
  <v-container>
    <!-- 店舗情報を編集 -->
    <v-card-title>
      <v-icon left>mdi-home-edit</v-icon>店舗
    </v-card-title>

    <!-- Snackbar コンポーネントを表示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      bottom>
      <div
        class="text-center
        text-body-1
        font-weight-bold">
        {{ snackbar.message }}
      </div>
    </v-snackbar>

    <v-card class="mt-2">
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="8" lg="8">
            <v-form @submit.prevent="editShop" ref="editShopForm">

              <v-card-text>店名</v-card-text>
              <v-text-field
                v-model="owners.shop.name"
                class="mt-n2"
                dense
                outlined
                hint="店名を入力して下さい。"
                persistent-hint
                :rules="shopNameRules"
                required>
              </v-text-field>
              <v-divider></v-divider>

              <v-card-text class="mt-5">店舗画像</v-card-text>
              <v-img
                :aspect-ratio="16 / 10"
                :src="owners.shop.photo_url">
              </v-img>
              <div class="d-flex mb-4">
                <v-img
                  v-for="(image, index) in images"
                  :key="index" :src="image.src" :aspect-ratio="16 / 10"
                  :style="{ width: '20%', cursor: 'pointer', marginBottom: '10px' }"
                  :class="{ selected: image.src === owners.shop.photo_url }"
                  @click="changeImage(image.src)">
                </v-img>
              </div>
              <v-messages
                  class="mt-n5
                  mb-2
                  ml-3"
                  :value="photoMessage"
                  color="gray">
                </v-messages>
              <v-divider></v-divider>

              <v-card-text class="mt-5">地域</v-card-text>
              <v-select
                v-model="owners.shop.area_id"
                class="mt-n2"
                outlined
                dense
                hint="地域を選択して下さい。"
                persistent-hint
                :placeholder="owners.shop.area.name"
                :items="areas">
              </v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">ジャンル</v-card-text>
              <v-select
                v-model="owners.shop.genre_id"
                class="mt-n2"
                outlined
                dense
                hint="ジャンルを選択して下さい。"
                persistent-hint
                :placeholder="owners.shop.genre.name"
                :items="genres">
              </v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">店舗概要</v-card-text>
              <v-textarea
                v-model="owners.shop.description"
                class="mt-n2"
                height="250"
                outlined
                counter
                hint="店舗概要を入力して下さい。"
                persistent-hint
                :rules="shopdescriptionRules"
                required>
              </v-textarea>
            </v-form>

            <!--　店舗内容変更ボタン -->
            <div class="text-center
              mt-12
              pb-8">
              <v-btn
                color="primary"
                min-width="150"
                height="50"
                rounded
                class="text-body-1
                font-weight-bold"
                @click="editShop">
                変更する
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'ShopDetailForm',
  data() {
    return {
      owners: {
        shop: {
          name: '', // ショップ名の初期値を設定
          description: '',
          photo_url: '',
          area_id: '',
          genre_id: '',
          area: {
            name: '',
          },
          genre: {
            name: '',
          },
        },
      },
      images: [
        { src: 'https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/sushi.jpg' },
        { src: 'https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/yakiniku.jpg' },
        { src: 'https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/izakaya.jpg' },
        { src: 'https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/italian.jpg' },
        { src: 'https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/ramen.jpg' },
      ],
      areas: [
        { text: '東京都', value: '1' },
        { text: '大阪府', value: '2' },
        { text: '福岡県', value: '3' },
      ],
      genres: [
        { text: '寿司', value: '1' },
        { text: '焼肉', value: '2' },
        { text: '居酒屋', value: '3' },
        { text: 'イタリアン', value: '4' },
        { text: 'ラーメン', value: '5' },
      ],

      // バリデーション実装
      shopNameRules: [
        v => !!v || '店名を入力して下さい。',
        v => (v && v.length <=  50) || '50文字以下で入力してください。',
      ],

      shopdescriptionRules: [
        v => !!v || '店舗概要を入力して下さい。',
        v => (v && v.length <=  400) || '400文字以下で入力してください。',
      ],

      photoMessage: ['店舗画像を選択してください。'],

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },
    }
  },

  mounted() {
    this.fetchOwnerData();
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // 店舗代表者のデータを取得
    async fetchOwnerData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/owner`);

        // 店舗代表者ID
        const loginOwner = this.$auth.user.id;
        this.owners = response.data;
        console.log('全店舗代表者のデータ', this.owners);

        // ログイン中の店舗代表者のデータを取得
        const ownerData = this.owners.find(owner => owner.id === loginOwner);
        console.log('店舗代表者ID:', loginOwner);
        console.log('ログイン店舗代表者のデータ:', ownerData);
        console.log('店舗代表者のお店:', ownerData.shop.name);
        console.log('店舗代表者のエリア:', ownerData.shop.area.name);
        console.log('店舗代表者のジャンル:', ownerData.shop.genre.name);

        this.owners = ownerData;

      } catch (error) {
        console.error('店舗代表者のデータの取得に失敗しました', error);
      }
    },

    // 画像のURLをowners.shop.photo_urlに設定
    changeImage(src) {
      this.owners.shop.photo_url = src;
      this.formChanged = true;
    },

    // フォームのバリデーション
    editShop() {
      const valid = this.$refs.editShopForm.validate();
      if (valid) {
        this.editShopData();
      } else {
        console.log('バリデーションエラーがあります');
      }
    },

    // 店舗データを編集
    async editShopData() {
      try {
        const id = this.owners.shop.id;
        const response = await this.$axios.put(`${process.env.API_URL}/api/shop/${id}`, {
          name: this.owners.shop.name,
          photo_url: this.owners.shop.photo_url,
          area_id: this.owners.shop.area_id,
          genre_id: this.owners.shop.genre_id,
          description: this.owners.shop.description,
        });

        console.log('店舗データの更新に成功しました', response.data);

        this.showSnackbar({ message: '店舗データの更新に成功しました', color: 'primary' });

        this.fetchOwnerData();

      } catch (error) {
        console.error('店舗データの更新に失敗しました', error);
      }
    },
  }
}
</script>

<style scoped>
.selected {
  border: 2px solid blue;
}
</style>