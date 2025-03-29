<script setup lang="ts">
import { ref, computed } from 'vue'

const MATERNITY_CAPITAL = 524527.9 // Материнский капитал

// Состояние формы
const propertyValue = ref(334000)
const initialPayment = ref(33734)
const loanTerm = ref(20)
const selectedRate = ref('base')
const isBankCustomer = ref(false)
const useMaternityCapital = ref(false)

// Базовые ставки
const rates = {
  base: 4.9,
  military: 0.4,
  noDownPayment: 5.7,
}

// Вычисляемые значения
const interestRate = computed(() => {
  let rate = rates[selectedRate.value as keyof typeof rates]
  if (isBankCustomer.value) {
    rate -= 0.5
  }
  return Math.max(rate, 0.1)
})

const loanAmount = computed(() => {
  let amount = propertyValue.value - initialPayment.value
  if (useMaternityCapital.value) {
    amount -= MATERNITY_CAPITAL
  }
  return Math.max(amount, 0)
})

const monthlyPayment = computed(() => {
  const monthlyRate = interestRate.value / 12 / 100
  const numberOfPayments = loanTerm.value * 12
  return loanAmount.value * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments)))
})

const minInitialPayment = computed(() => {
  return propertyValue.value * 0.101
})

// Методы
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

const handleApproval = () => {
  const result: Record<string, any> = {
    interest_rate: interestRate.value,
    loan_amount: loanAmount.value,
    bank_customer: isBankCustomer.value,
    loan_term: loanTerm.value,
  }

  if (useMaternityCapital.value) {
    result.maternity_capital = MATERNITY_CAPITAL
    result.personal_funds = initialPayment.value
  } else {
    result.initial_payment = initialPayment.value
  }

  console.log(result)
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl mb-2 font-semibold text-text-primary">Ипотечный калькулятор</h1>
    <p class="mb-8">Узнайте примерный платёж, ставку и другие предварительные условия по ипотеке</p>

    <div class="grid grid-cols-[1fr_400px] gap-8">
      <div>
        <!-- Цели кредита -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3">Цели кредита</h2>

          <select name="" id="" class="select">
            <option value="apartmentSecondary">Квартира на вторичном рынке</option>
            <option value="buyHouse">Купить дом</option>
            <option value="buildHouse">Построить дом</option>
            <option value="buyLand">Купить землю или дачный дом</option>
            <option value="refinancing">Рефинансирование</option>
            <option value="garage">Гараж, машино-место или кладовая</option>
            <option value="cashHousing">Наличные под залог жилья</option>
            <option value="commercialEstate">Коммерческая недвижимость</option>
          </select>
        </div>

        <!-- Тарифы -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3">Тарифные предложения</h2>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input type="radio" v-model="selectedRate" value="base" class="radio" />
              <span>Базовая ставка (от 4,9%)</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" v-model="selectedRate" value="military" class="radio" />
              <span>Военная ипотека (от 0,4%)</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" v-model="selectedRate" value="noDownPayment" class="radio" />
              <span>Без первоначального взноса (от 5,7%)</span>
            </label>
          </div>
        </div>

        <!-- Зарплатный клиент -->
        <div class="mb-6">
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="isBankCustomer" class="checkbox" />
            <span>Получаю зарплату на Сбер (-0,5%)</span>
          </label>
        </div>

        <!-- Стоимость недвижимости -->
        <div class="mb-6">
          <label class="block mb-2">
            Стоимость недвижимости
            <input type="number" v-model.number="propertyValue" min="334000" max="100000000" class="input-field" />
          </label>
          <input type="range" v-model.number="propertyValue" min="334000" max="100000000" step="1000" class="slider" />
        </div>

        <!-- Первоначальный взнос -->
        <div class="mb-6">
          <label class="block mb-2">
            Первоначальный взнос
            <input type="number" v-model.number="initialPayment" :min="minInitialPayment" :max="propertyValue" class="input-field" />
          </label>
          <input type="range" v-model.number="initialPayment" :min="minInitialPayment" :max="propertyValue" step="1000" class="slider" />
        </div>

        <!-- Материнский капитал -->
        <div class="mb-6">
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="useMaternityCapital" class="checkbox" />
            <span>Использовать материнский капитал</span>
          </label>
        </div>

        <!-- Срок кредита -->
        <div class="mb-6">
          <label class="block mb-2">
            Срок кредита (лет)
            <input type="number" v-model.number="loanTerm" min="1" max="30" class="input-field" />
          </label>
          <input type="range" v-model.number="loanTerm" min="1" max="30" class="slider" />
        </div>
      </div>

      <div>
        <!-- Результаты расчета -->
        <div class="bg-input-bg p-6 rounded-lg mb-6">
          <h2 class="text-lg font-semibold mb-4">Результаты расчета</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-text-secondary">Процентная ставка</p>
              <p class="text-2xl font-bold text-text-primary">{{ interestRate.toFixed(1) }}%</p>
            </div>
            <div>
              <p class="text-text-secondary">Сумма кредита</p>
              <p class="text-2xl font-bold text-text-primary">{{ formatCurrency(loanAmount) }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-text-secondary">Ежемесячный платеж</p>
              <p class="text-2xl font-bold text-text-primary">{{ formatCurrency(monthlyPayment) }}</p>
            </div>
          </div>
        </div>

        <!-- Кнопка получения одобрения -->
        <button
          @click="handleApproval"
          class="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold transition-all hover:bg-primary-hover"
        >
          Получить одобрение
        </button>
      </div>
    </div>
  </div>
</template>
