let web3;

window.addEventListener("load", async function () {
  const connectButton = document.getElementById("connectButton");
  const logoutButton = document.getElementById("logoutButton");
  const balanceDisplay = document.getElementById("balance");
  const networkDisplay = document.getElementById("network");
  const nonceDisplay = document.getElementById("nonce");

  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
  }

  connectButton.addEventListener("click", async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      connectButton.style.display = "none";
      logoutButton.style.display = "inline";
      getAccountDetails(account);
    } catch (error) {
      document.getElementById("metaMaskModal").style.display = "block";
      console.error("Error connecting to MetaMask:", error);
    }
  });

  logoutButton.addEventListener("click", () => {
    resetAppUserData();
    updateUIForDisconnectedState();
    console.log("Wallet disconnected successfully.");
  });

  document
    .querySelector(".close-button")
    .addEventListener("click", function () {
      document.getElementById("metaMaskModal").style.display = "none";
    });

  function resetAppUserData() {
    document.getElementById("balance").innerText = "Account Balance: ";
    document.getElementById("network").innerText = "";
    document.getElementById("nonce").innerText = "";
  }

  function updateUIForDisconnectedState() {
    connectButton.style.display = "inline";
    logoutButton.style.display = "none";
  }
});

async function getAccountDetails(account) {
  const balance = await web3.eth.getBalance(account);
  document.getElementById(
    "balance"
  ).innerText = `Account Balance: ${web3.utils.fromWei(balance, "ether")} ETH`;

  // Use net.getId() to get the network ID and then map it to a network name
  const networkId = await web3.eth.net.getId();
  const networkName = getNetworkNameById(networkId);
  document.getElementById("network").innerText = `Network: ${networkName}`;

  const nonce = await web3.eth.getTransactionCount(account);
  document.getElementById("nonce").innerText = `Transaction Count: ${nonce}`;
}

// Utility function to map network ID to network name
function getNetworkNameById(networkId) {
  const networkNames = {
    1: "Mainnet",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    42: "Kovan",
  };
  return networkNames[networkId] || "Unknown";
}
