<template>
  <div
    id="app"
  >
    <h2>
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
        class="meal__title"
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
#app {
  font-family: sans-serif;
  font-size: 120%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  min-width: 400px;
  width: auto;
}

h2 {
  font-weight: normal;
}

.meal {
  color: #606060;
  word-break: keep-all;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
  
  &__now {
    color: black !important;
    font-size: 125%;
  }

  &__title {
    font-weight: bold;
  }
}

.footer {
  padding-top: 20px;
}
</style>
