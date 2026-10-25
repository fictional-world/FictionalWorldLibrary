async function handleReaderLogin(email, password) {
  try {
    const result = await loginReader(email, password);

    if (result?.user) {
      window.location.href = "index.html";
    }

    return result;
  } catch (error) {
    alert(error.message || "Login failed.");
    return null;
  }
}

async function handleReaderRegistration(email, password, name) {
  try {
    const result = await registerReader(email, password, name);

    if (result?.user) {
      alert("Registration successful. Please check your email if confirmation is required.");
    } else {
      alert("Registration submitted successfully.");
    }

    return result;
  } catch (error) {
    alert(error.message || "Registration failed.");
    return null;
  }
}

async function handleReaderLogout() {
  try {
    await logoutReader();
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message || "Logout failed.");
  }
}
