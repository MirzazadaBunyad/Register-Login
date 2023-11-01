const selectElement = document.getElementById("countrySelect");

function isPasswordSecure(password) {
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const title = document.querySelector(".title");
  const selectElement = document.getElementById("countrySelect");

  title.innerHTML = "Registration";

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("mobile_code").value;
    const password = document.getElementById("password-field").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match!";
    } else if (!isPasswordSecure(password)) {
      message.innerHTML =
        "<ul><li>At least one uppercase letter</li><li>At least one lowercase letter</li><li>At least one digit</li></ul>";
    } else {
      const user = {
        name: name,
        username: username,
        email: email,
        phoneNumber: selectElement.value + phoneNumber,
        password: password,
      };

      const user_id = Date.now();
      localStorage.setItem(`user_${user_id}`, JSON.stringify(user));
      message.textContent = "Registration successful!";
      registerForm.style.display = "none";
      loginForm.style.display = "block";
      title.innerHTML = "Login";
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let foundUser = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("user_")) {
        const storedUser = JSON.parse(localStorage.getItem(key));
        if (email === storedUser.email && password === storedUser.password) {
          foundUser = storedUser;
          break;
        }
      }
    }
    if (foundUser) {
      message.textContent = "Login successful!";
    } else {
      message.textContent =
        "Login failed. Please check your email and password.";
    }
  });
});

const countryData = fetch("/countrycodes.json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("No data");
    }
  })
  .then((data) => {
    data.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.dial_code;
      option.text = `${country.code} ${country.dial_code}`;
      selectElement.appendChild(option);
    });
  })
  .catch((error) => {
    console.log(error);
  });
