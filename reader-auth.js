async function handleReaderLogin(email, password) {
  try {
    const result = await loginReader(email, password);

    if (result?.user) {
      window.location.href = "index.html";
    }

    return result;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

async function handleReaderRegistration(email, password, name) {
  try {
    const result = await registerReader(email, password, name);

    alert("Registration submitted. Check your email if confirmation is required.");

    return result;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

async function handleReaderLogout() {
  try {
    await logoutReader();
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}
