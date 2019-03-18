<template>
  <div
    id="app"
  >
    <h2
      class="title"
    >
      {{ `${moment().format('MM월 DD일')}의 디미밥` }}
    </h2>
    <div
      :class="{
        'meal': true,
        'meal__now': index === nextMealKind
      }"
      :key="kind"
      v-for="(kind, index) in list"
    >
      <div
        :class="{
          'meal__title': true,
          'meal__title__now': index === nextMealKind
        }"
      >
        {{ kind }}
      </div>
      {{ indexedMeal[index] ? indexedMeal[index] : '급식 정보가 없습니다' }}
    </div>
  </div>
</template>

<script>
import { list } from './data.json'

export default {
  name: 'app',

  data () {
    return {
      meal: {},
      list
    }
  },

  computed: {
    indexedMeal () {
      return [this.meal.breakfast,
        this.meal.lunch,
        this.meal.dinner]
    },
    nextMealKind () {
      const hour = Number(this.moment().format('HH'))
      if (hour < 8) return 0
      else if (hour < 14) return 1
      else return 2
    }
  },

  async created() {
    const date = this.moment().format('YYYYMMDD')
    await this.$api.get(`https://dev-api.dimigo.in/dimibobs/${date}`)
      .then(result => {
        this.meal = result.data
      })
    Object.keys(this.meal).forEach(key => {
      this.meal[key] = this.meal[key].replace(/\//gi, ', ')
    })
  }
}
</script>

<style lang="scss">
@import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css);

#app {
  font-family: 'Spoqa Han Sans', 'Spoqa Han Sans KR', 'Sans-serif';
  font-size: 120%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  min-width: 400px;
  width: auto;
}

.title {
  font-weight: 400;
}

.meal {
  color: #606060;
  word-break: keep-all;
  font-weight: 350;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  
  &__now {
    color: black !important;
    font-size: 125%;
  }

  &__title {
    
    &__now {
      font-weight: 400;
    }
  }
}

.footer {
  padding-top: 20px;
}
</style>
