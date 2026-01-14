<script setup lang="ts"></script>

<template>
  <!-- <img src="/logo.png" alt="Логотип школы" className="logo" /> -->

  <h1>ШКОЛА НОВИЧКА</h1>

  <p class="mb-3 text-center">
    Ура!!! Теперь ты с нами!<br /><br />
    Советуем ознакомиться с накопленным нами опытом.
  </p>

  <el-button @click="$router.push('/intro')">Добро пожаловать</el-button>
</template>
