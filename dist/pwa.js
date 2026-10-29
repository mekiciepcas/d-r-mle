const installButton = document.createElement('button');
installButton.type = 'button';
installButton.className = 'secondary pwa-install';
installButton.textContent = 'Uygulamayı telefona yükle';
installButton.hidden = true;

const installHelp = document.createElement('p');
installHelp.className = 'pwa-install-help';
installHelp.textContent = 'iPhone: Paylaş → Ana Ekrana Ekle. Android: tarayıcı menüsü → Uygulamayı yükle.';

const dialogBody = document.querySelector('#dialog-body');
const nativeApp = window.Capacitor?.isNativePlatform() === true;

if (dialogBody && !isStandalone() && !nativeApp) {
  dialogBody.append(installButton, installHelp);
}

let installPrompt = null;

function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function showInstallButton(visible) {
  installButton.hidden = !visible;
}

async function installApp() {
  if (!installPrompt) return;

  const prompt = installPrompt;
  installPrompt = null;
  showInstallButton(false);
  await prompt.prompt();
  await prompt.userChoice;
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  showInstallButton(true);
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  showInstallButton(false);
});

installButton.addEventListener('click', () => {
  installApp().catch(error => console.error('Uygulama yükleme penceresi açılamadı.', error));
});

window.addEventListener('online', () => {
  const toast = document.querySelector('#toast');
  if (toast) {
    toast.textContent = 'İnternet bağlantısı yeniden kuruldu.';
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3000);
  }
});

window.addEventListener('offline', () => {
  const toast = document.querySelector('#toast');
  if (toast) {
    toast.textContent = 'Çevrimdışısın. Daha önce açtıysan oyuna devam edebilirsin.';
    toast.classList.add('show');
  }
});

if (!nativeApp && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Çevrimdışı oyun desteği kaydedilemedi.', error);
    });
  });
}
