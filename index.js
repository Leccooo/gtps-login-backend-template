<script>
  document.addEventListener('DOMContentLoaded', () => {
    const serverSelect = document.getElementById('serverSelect');
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    function updateFormAction() {
      const selected = serverSelect.value;
      let actionURL = '';

      switch (selected) {
        case 'main': // Atlantis
          actionURL = 'http://188.166.243.218:5000/player/growid/login/validate';
          break;
        case 'test': // Dream PS (ubah IP jika punya)
          actionURL = 'http://127.0.0.1:5000/player/growid/login/validate';
          break;
        case 'dev': // Development
          actionURL = 'http://34.122.252.255:5000/player/growid/login/validate';
          break;
        default:
          actionURL = '/player/growid/login/validate';
      }

      loginForm.setAttribute('action', actionURL);
    }

    // Jalankan saat pertama kali halaman dimuat
    updateFormAction();

    // Ubah form action jika pilihan server berubah
    serverSelect.addEventListener('change', updateFormAction);

    // Validasi dan kirim form login
    loginButton.addEventListener('click', function (event) {
      event.preventDefault();
      const uName = document.getElementById('loginGrowId').value;
      const uPass = document.getElementById('loginPassword').value;

      if (!uName || !uPass) {
        showError('Username or Password is empty');
        return;
      } else if (uName.length < 3 || uPass.length < 3) {
        showError('Username or Password must be at least 3 characters long');
        return;
      }

      document.getElementById('formType').value = 'log';
      localStorage.setItem('growId', uName);
      loginForm.submit();
    });

    // Tombol register
    registerButton.addEventListener('click', function () {
      document.getElementById('loginGrowId').value = '';
      document.getElementById('loginPassword').value = '';
      document.getElementById('formType').value = 'register';
      loginForm.submit();
    });

    // Toggle show/hide password
    document.getElementById('toggleLogPassword').addEventListener('click', function () {
      const field = document.getElementById('loginPassword');
      const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
      field.setAttribute('type', type);
      this.innerHTML = type === 'text'
        ? '<i class="fas fa-eye-slash"></i>'
        : '<i class="fas fa-eye"></i>';
    });

    // Tampilkan error
    function showError(message) {
      const errorDiv = document.getElementById('errorDiv');
      const errorMessage = document.getElementById('errorMessage');
      errorDiv.classList.remove('hidden');
      errorMessage.innerText = message;
    }
  });
</script>
