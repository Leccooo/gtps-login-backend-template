<script>
  const serverSelect = document.getElementById('serverSelect');
  const loginForm = document.getElementById('loginForm');

  function updateFormAction() {
    const selected = serverSelect.value;

    switch (selected) {
      case 'main': // Atlantis
        loginForm.action = 'http://188.166.243.218:5000/player/growid/login/validate';
        break;
      case 'test': // Dream PS (ganti sesuai IP kamu jika ada)
        loginForm.action = 'http://your-test-server.com/player/growid/login/validate';
        break;
      case 'dev': // Development
        loginForm.action = 'http://34.122.252.255:5000/player/growid/login/validate';
        break;
      default:
        loginForm.action = '/player/growid/login/validate';
    }
  }

  // Jalankan saat pertama kali halaman dibuka
  updateFormAction();

  // Ubah action jika user mengganti pilihan server
  serverSelect.addEventListener('change', updateFormAction);
</script>
