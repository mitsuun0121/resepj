<template>
  <v-container>
  <!-- 新規店舗作成 -->
    <v-card-title>
      <v-icon left>mdi-home-plus</v-icon>店舗
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

    <v-divider></v-divider>

    <!-- csvファイルをインポート -->
    <template>
      <div>
        <input
          type="file"
          accept=".csv"
          @change="handleFileUpload">
      </div>
    </template>

    <v-card class="mt-6">
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="8" lg="8">
            <v-form @submit.prevent="createShop" ref="createShopForm">

              <v-card-text>店名</v-card-text>
              <v-text-field
                v-model="name"
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
                :src="photo_url">
              </v-img>
              <v-divider></v-divider>

              <v-card-text class="mt-5">地域</v-card-text>
              <v-select
                v-model="area"
                class="mt-n2"
                outlined
                dense
                hint="地域を選択して下さい。"
                persistent-hint
                :placeholder="area"
                :items="areas"
                :rules="shopAreaRules"
                required>
              </v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">ジャンル</v-card-text>
              <v-select
                v-model="genre"
                class="mt-n2"
                outlined
                dense
                hint="ジャンルを選択して下さい。"
                persistent-hint
                :placeholder="genre"
                :items="genres"
                :rules="shopGenreRules"
                required>
              </v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">店舗概要</v-card-text>
              <v-textarea
                v-model="description"
                class="mt-n2"
                height="250"
                outlined
                counter
                hint="店舗概要を入力して下さい。"
                persistent-hint
                :rules="shopDescriptionRules"
                required>
              </v-textarea>
            </v-form>

            <!--　店舗作成ボタン -->
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
                @click="createShop">
                作成する
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
  name: 'ShopForm',
  data() {
    return {
      name: '', // ショップ名の初期値を設定
      description: '',
      photo_url: '',
      area: '',
      genre: '',

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

      shopAreaRules: [
        v => !!v || '地域を選択して下さい。',
      ],

      shopGenreRules: [
        v => !!v || 'ジャンルを選択して下さい。',
      ],

      shopDescriptionRules: [
        v => !!v || '店舗概要を入力して下さい。',
        v => (v && v.length <=  400) || '400文字以下で入力してください。',
      ],

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },
    }
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // CSVファイルの読み込み
    handleFileUpload(event) {
      // ファイルを取得
      const file = event.target.files[0];
      // FileReaderオブジェクトを作成
      const reader = new FileReader();

      // CSVデータを読み込むコールバック関数
      reader.onload = () => {
        // 読み込まれたファイルデータの文字列を取得
        const csvData = reader.result;
        // 解析してデータを抽出
        this.parseCSV(csvData);
      };
        // ファイルをテキスト形式で読み込む
      reader.readAsText(file);
    },

    // CSV形式のテキストデータを解析
    parseCSV(csvData) {
      // 改行文字で分割して、各行を要素とする配列linesを作成
      const lines = csvData.split(/\r?\n/);
      const shops = [];

      // 空の行はスキップする
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
          continue;
        }
        // CSVデータの各行をカンマで分割
        const [name, area, genre, description, photo_url] = line.split(',');

        // 画像URLから拡張子を取得
        const extension = photo_url.split('.').pop().toLowerCase();

        // jpeg, png以外の拡張子の場合はエラーメッセージ
        if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
          this.showSnackbar({ message: '画像ファイルの拡張子が jpeg または png 形式ではありません', color: 'error' });
          return;
        }

        // 店舗情報オブジェクトをshops配列に追加
        shops.push({ name, area, genre, description, photo_url });
      }

      // shops配列の最初の要素を変数に代入
      if (shops.length > 0) {
        this.name = shops[0].name;
        this.area = shops[0].area;
        this.genre = shops[0].genre;
        this.description = shops[0].description;
        this.photo_url = shops[0].photo_url;
      }
      console.log(shops);
    },

    // 地域を数値に変換
    areaToNumber(area) {
      const areaMap = {
        '東京都': 1,
        '大阪府': 2,
        '福岡県': 3
      };
      return areaMap[area] || null; // デフォルトの値を返す
    },

    // ジャンルを数値に変換
    genreToNumber(genre) {
      const genreMap = {
        '寿司': 1,
        '焼肉': 2,
        '居酒屋': 3,
        'イタリアン': 4,
        'ラーメン': 5
      };
      return genreMap[genre] || null; // デフォルトの値を返す
    },

    // フォームのバリデーション
    createShop() {
    const valid = this.$refs.createShopForm.validate();
      if (valid) {
        this.createShopData();
      } else {
        console.log('バリデーションエラーがあります');
      }
    },

    // 新規店舗作成
    async createShopData() {
      try {
        const response = await this.$axios.post(`${process.env.API_URL}/api/shop`, {
          name: this.name,
          area_id: this.areaToNumber(this.area),
          genre_id: this.genreToNumber(this.genre),
          description: this.description,
          photo_url: this.photo_url
        });

        console.log('新しい店舗が作成されました', response.data);

        this.showSnackbar({ message: '新しい店舗が作成されました', color: 'primary' });

        // リロード
        location.reload();

      } catch (error) {
        console.error('新しい店舗の作成に失敗しました', error);
      }
    },
  },
}
</script>