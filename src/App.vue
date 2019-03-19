<script>
import { mealList, mealTime, timetable, classTime, subjectList } from './data.json'

export default {
  name: 'app',

  data () {
    return {
      meal: {},
      mealList,
      timetable,
      subjectList,
      pending: false
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
      const result = mealTime.findIndex(data => {
        return hour < data
      })
      
      return result === -1 ? mealTime.length - 1 : result
    },
    todayDay () {
      return this.moment().day() - 1
    },
    nextClass () {
      const time = Number(this.moment().format('HHMM'))
      const result = classTime.findIndex(data => {
        return time < data
      })
      
      return result === -1 ? classTime.length - 1 : result
    }
  },

  methods: {
    async getMealData () {
      const moment = this.moment()

      try {
        var mealData = JSON.parse(localStorage.meal)
        if (mealData.date === moment.format('YYYY-MM-DD')) {
          return JSON.parse(localStorage.meal)
        }
      } catch (error) {
        await this.$api.get(`https://dev-api.dimigo.in/dimibobs/${moment.format('YYYYMMDD')}`)
          .then(result => {
            mealData = result.data

            Object.keys(mealData).forEach(key => {
              mealData[key] = mealData[key].replace(/\//gi, ', ')
            })

            localStorage.meal = JSON.stringify(mealData)
          })
      }
      return mealData
    }
  },

  async created() {
    this.pending = true
    await this.getMealData().then(result => {
      this.meal = result
    })
    this.pending = false
  }
}
</script>

<template>
  <div
    id="app"
    class="container"
  >
    <h2
      class="title"
    >
      {{ `${moment().format('MM월 DD일')}의 디미고 1학년 5반!` }}
    </h2>

    <div
      class="timetable"
    >
      <span
        v-for="(data, index) in timetable[todayDay]"
        :class="{
          'subject': true,
          'subject__now': index === nextClass
        }"
        :key="index"
      >
        {{ index + 1 }}
        {{ subjectList[data] }}
      </span>
    </div>

    <div
      :class="{
        'meal': true,
        'meal__now': index === nextMealKind
      }"
      :key="kind"
      v-for="(kind, index) in mealList"
    >
      <div
        :class="{
          'meal__title': true,
          'meal__title__now': index === nextMealKind
        }"
      >
        {{ kind }}
      </div>
      <span
        v-if="pending"
      >
        급식 정보를 불러오는 중 입니다
      </span>
      <span
        v-else
      >
        {{ indexedMeal[index] ? indexedMeal[index] : '급식 정보가 없습니다' }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import url('http://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css');

#app {
  font-family: 'Spoqa Han Sans', 'Spoqa Han Sans KR', 'Sans-serif';
  font-size: 120%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  min-width: 400px;
  width: auto;
}

.container {
  margin: 0 auto;
}

.title {
  font-size: 120%;
  font-weight: 365;
}

.meal {
  color: #606060;
  word-break: keep-all;
  font-weight: 330;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
  
  &__now {
    color: black !important;
    font-size: 125%;
  }

  &__title {
    &__now {
      font-weight: 500;
    }
  }
}

.timetable {
  padding-bottom: 20px;
}

.subject {
  color: #606060;
  word-break: keep-all;
  font-weight: 350;
  font-size: 110%;

  &:not(:last-child) {
    border-right: 1px solid #606060;
  }

  &:not(:first-child) {
    padding-left: 5px;
  }
  
  &__now {
    color: black !important;
    font-weight: 500;
  }
}

</style>
