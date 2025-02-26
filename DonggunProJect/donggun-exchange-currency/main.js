document.getElementById("calculate").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  const fromCurrency = document.getElementById("from-currency").value;
  const toCurrency = document.getElementById("to-currency").value;

  console.log(`Amount: ${amount}, From: ${fromCurrency}, To: ${toCurrency}`);

  if (amount === "") {
    alert("Please enter an amount");
    return;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    console.log("API Response:", response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("API Data:", data);

    const rate = data.rates[toCurrency];
    const result = amount * rate;

    document.getElementById(
      "result"
    ).textContent = `${amount} ${fromCurrency} = ${result.toFixed(
      2
    )} ${toCurrency}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    alert("Error fetching exchange rate");
  }
});
