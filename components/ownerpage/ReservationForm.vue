<template>
  <v-container>
    <!-- 予約の状況と履歴 -->
    <v-card-title>
      <v-icon left>mdi-calendar-month-outline</v-icon>予約
    </v-card-title>

    <v-tabs
      color="primary"
      align-tabs="center"
      >
      <v-tab @click="tab = 1">予約状況</v-tab>
      <v-tab @click="tab = 2">予約履歴</v-tab>
    </v-tabs>
    <v-divider></v-divider>

<!-- 予約状況 -->
    <div v-if="tab === 1">
      <div v-if="!loading">
        <v-data-table
          fixed-header
          height="240px"
          :headers="currentReservationHeaders"
          :items="currentReservations"
          :show-no-data="false"
          hide-default-footer
          mobile-breakpoint="768">
          <template v-slot:item.actions="{ item }"></template>

          <!-- 予約データがない場合 -->
          <template v-slot:no-data>
            <div
              style="color: #E0E0E0;"
              class="text-center
              text-h6
              font-weight-bold
              mt-16">
              現在の予約はありません。
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    
<!-- 予約履歴 -->
    <div v-if="tab === 2">
      <div v-if="!loading">
        <v-data-table
          fixed-header
          height="240px"
          :headers="pastReservationHeaders"
          :items="pastReservations"
          :show-no-data="false"
          hide-default-footer
          mobile-breakpoint="768">
          
          <!-- 予約データがない場合 -->
          <template v-slot:no-data>
            <div
              style="color: #E0E0E0;"
              class="text-center
              text-h6
              font-weight-bold
              mt-16">
              予約履歴はありません。
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ResevationForm',
  data() {
    return {
      currentReservations: [],
      pastReservations: [],
      tab: 1, // デフォルトは予約状況
      loading: true,

      // 予約状況テーブルのヘッダー
      currentReservationHeaders: [
        { text: '氏名', value: 'user.name', sortable: false },
        { text: '日にち', value: 'date', sortable: false },
        { text: '時間', value: 'time', sortable: false },
        { text: '人数', value: 'count', sortable: false, align: 'center' },
      ],
      // 予約履歴テーブルのヘッダー
      pastReservationHeaders: [
        { text: '氏名', value: 'user.name', sortable: false },
        { text: '日にち', value: 'date', sortable: false },
        { text: '時間', value: 'time', sortable: false },
        { text: '人数', value: 'count', sortable: false, align: 'center' },
      ],
    }
  },

  mounted() {
    this.fetchReservation();
  },

  methods: {
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

    // 数値を人数に変換
    formatCount(count) {
      if (count === 1) {
        return '1人';
      } else if (count === 2) {
        return '2人';
      } else if (count === 3) {
        return '3人';
      } else if (count === 4) {
        return '4人';
      } else if (count === 5) {
        return '5人';
      }
    },

    // 予約データを取得
    async fetchReservation() {
      try {
        const ownerResponse = await this.$axios.get(`${process.env.API_URL}/api/owner`);

        // 店舗代表者ID
        const loginOwner = this.$auth.user.id;
        this.owners = ownerResponse.data;
        console.log('店舗代表者のデータ', this.owners);

        // ログイン中の店舗代表者のデータを取得
        const ownerData = this.owners.find(owner => owner.id === loginOwner);
        console.log('店舗代表者のデータ', ownerData);

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
            // 人数のフォーマットを整形
            reservation.count = this.formatCount(reservation.count);
          }
          // 現在の日時を取得
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 時間は考慮しない
          console.log(today);

          // 予約状況を取得
          this.currentReservations = this.reservations.filter(reservation => new Date(reservation.date) >= today);
          console.log('予約状況:', this.currentReservations);

          // 予約履歴を取得
          this.pastReservations = this.reservations.filter(reservation => new Date(reservation.date) < today);
          console.log('予約履歴:', this.pastReservations);

        }
      } catch (error) {
        console.error('予約データの取得に失敗しました', error)
      } finally {
        // ローディング状態を解除
        this.loading = false;
      }
    },
  }
}
</script>