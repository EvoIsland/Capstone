<template>
  <nav class="navbar">
    <div class="logo-section">
      <img src="/images/logokimal.svg" alt="Logo" class="logo-img" />
    </div>
    <ul class="nav-links">
      <li><a href="#">FORO</a></li>
      <li><a href="#">Quienes Somos</a></li>
      <li><a href="#">Contactanos</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100vw;
  background: linear-gradient(90deg, #19c37d 0%, #00796b 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px 0 30px;
  height: 90px;
  font-family: 'Quicksand', Arial, sans-serif;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 60px;
  margin-right: 12px;
}

.nav-links {
  display: flex;
  gap: 60px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #b2ff59;
}
</style>