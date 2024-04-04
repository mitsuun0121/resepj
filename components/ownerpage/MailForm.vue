<template>
  <v-container>
    <!-- メール -->
    <v-card-title>
      <v-icon left>mdi-email-arrow-right-outline</v-icon>メール
    </v-card-title>

    <!-- Snackbar コンポーネントを表示 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" bottom>
      <div class="text-center
        text-body-1
        font-weight-bold">
        {{ snackbar.message }}
      </div>
    </v-snackbar>

    <v-row justify="center">
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="mt-5" width="300">
          <v-list>
            <v-list-group :value="false" prepend-icon="mdi-account-circle">
              <template v-slot:activator>
                <v-list-item-title>顧客リスト</v-list-item-title>
              </template>

              <v-list-item v-for="reservation in uniqueReservations" :key="reservation.user.id">
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ reservation.user.name }}
                  </v-list-item-title>
                  <v-list-item-title>
                    {{ reservation.user.email }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-checkbox v-model="checkedUser" :value="reservation.user.email" color="primary"
                    @change="handleFormChange"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="6" lg="6">
        <v-form @submit.prevent="sendEmails">
          <v-textarea height="220" class="mt-5" v-model="message" label="メッセージ" outlined auto-grow counter required
            @input="handleFormChange">
          </v-textarea>

          <div class="text-center">
            <v-btn class="text-body-1
              font-weight-bold" width="120" height="50" rounded type="submit" color="primary" :disabled="!formChanged">
              送信する
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      emailList: '',
      message: '',
      shopName: '',
      pastReservations: [],
      checkedUser: [],
      
      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },

      formChanged: false,
    };
  },

  computed: {
    // 同じユーザーが複数回予約した場合も、一意の要素として扱う
    uniqueReservations() {
      const uniqueIds = [];
      return this.pastReservations.filter(reservation => {
        if (uniqueIds.includes(reservation.user.id)) {
          return false;
        } else {
          uniqueIds.push(reservation.user.id);
          return true;
        }
      });
    },
  },

  mounted() {
    this.fetchReservation();
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // 顧客のチェックとメッセージが入力されたら送信するボタンをアクティブ
    handleFormChange() {
      if (this.checkedUser.length > 0 && this.message.length > 0) {
        this.formChanged = true;
      } else {
        this.formChanged = false;
      }
    },

    // メール送信
    async sendEmails() {
      try {
        // 選択されたユーザーのメールアドレスを this.emailList に追加
        const selectedEmails = this.checkedUser.join(',');
        this.emailList = selectedEmails;

        const response = await this.$axios.post(`${process.env.API_URL}/api/notice-mail`, {
          emailList: this.emailList,
          message: this.message,
          shopName: this.ownerData.shop.name,
        });
        console.log('メールを送信しました', response.data);

        this.showSnackbar({ message: 'メールを送信しました', color: 'primary' });

        // リセット
        this.emailList = '';
        this.message = '';
        this.checkedUser = [];
        this.formChanged = false;

      } catch (error) {
        console.error('メールの送信に失敗しました', error);
      }
    },

    // 日付を "YYYY-MM-DD" 形式に変換
    formatDate(dateString) {
      const date = new Date(dateString);
      const formatDate = date.toISOString().split('T')[0];
      return formatDate;
    },

    // 予約時間の秒を表示しないように設定
    formatTime(timeSlot) {
      return timeSlot.slice(0, 5); // "HH:mm" 形式に整形
    },

    // 予約履歴データを取得
    async fetchReservation() {
      try {
        const ownerResponse = await this.$axios.get(`${process.env.API_URL}/api/owner`);

        // 店舗代表者ID
        const loginOwner = this.$auth.user.id;
        this.owners = ownerResponse.data;
        console.log('全店舗代表者のデータ', this.owners);

        // ログイン中の店舗代表者のデータを取得
        this.ownerData = this.owners.find(owner => owner.id === loginOwner);
        console.log('店舗代表者のデータ', this.ownerData);

        const reservationResponse = await this.$axios.get(`${process.env.API_URL}/api/reservation`);

        if (reservationResponse && reservationResponse.data && Array.isArray(reservationResponse.data)) {

          this.reservations = reservationResponse.data.filter(reservation => reservation.shop_id === loginOwner);
          console.log('予約データ:', this.reservations);

          // 日時順に予約データをソート
          this.reservations = this.reservations.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
          });

          for (const reservation of this.reservations) {
            // 日にちのフォーマットを整形
            reservation.date = this.formatDate(reservation.date);
            // 時間のフォーマットを整形
            reservation.time = this.formatTime(reservation.time);
          }
          // 現在の日時を取得
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 時間は考慮しない
          console.log(today);

          // 予約履歴を取得
          this.pastReservations = this.reservations.filter(reservation => new Date(reservation.date) < today);
          console.log('予約履歴:', this.pastReservations);

          // 来店済のユーザーを取得
          for (const reservation of this.pastReservations) {
            const user = reservation.user;
            console.log('来店済ユーザー:', user);
          }
        }
      } catch (error) {
        console.error('予約データの取得に失敗しました', error)
      }
    },
  }
};
</script>