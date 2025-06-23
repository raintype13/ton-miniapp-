const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
document.getElementById('user-info').textContent = `👤 Welcome, ${user?.first_name || " "}!`;

document.getElementById('connectWallet').onclick = () => {
  alert("🔐 Здесь будет подключение TON Wallet через TonConnect");
};
