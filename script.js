
const connectBtn = document.getElementById("connectBtn");
const userRari = document.getElementById("userRari");
const walletInfo = document.getElementById("walletFerrariInfo");
const ferrariNow = document.getElementById("ferrariNow");
const ferrariX10 = document.getElementById("ferrariX10");
const ferrariX100 = document.getElementById("ferrariX100");
const ferrariX1000 = document.getElementById("ferrariX1000");
const quoteDisplay = document.getElementById("degenQuote");

const ferraris = [
  {
    name: 'Ferrari California T',
    price: 120000,
    image: 'img/1.png',
    description: 'For the degen who hasn’t hit 100x yet but still wants to flex at the roundabout. Classic vibes, alpha look.'
  },
  {
    name: 'Ferrari 458 Italia',
    price: 225000,
    image: 'img/2.png',
    description: 'V8 screams louder than bears in a bull market. Perfect for exit scams with elegance.'
  },
  {
    name: 'Ferrari Roma',
    price: 247000,
    image: 'img/3.png',
    description: 'Smoother than a DAO proposal passed at 3am. Built for staking... romantic dinners and bags.'
  },
  {
    name: 'Ferrari F8 Tributo',
    price: 325000,
    image: 'img/4.png',
    description: 'Twin-turbo beast. Ideal for escaping FUD at warp speed. Airdrops respect with every gear shift.'
  },
  {
    name: 'Ferrari 812 Superfast',
    price: 435000,
    image: 'img/5.png',
    description: 'V12 hits harder than a shitcoin mooning overnight. Sounds like a smart contract going nuclear.'
  },
  {
    name: 'Ferrari SF90 Stradale',
    price: 525000,
    image: 'img/6.png',
    description: 'Nearly 1,000 horses and F1 tech. If this was a token, it’d be listed on Binance as $VRROOOM.'
  },
  {
    name: 'Ferrari LaFerrari',
    price: 3000000,
    image: 'img/7.png',
    description: 'The holy grail of crypto garages. Only for OG whales. If you see it IRL, someone just 1000x’d.'
  }
];


let currentPrice = 0;
let currentMarketCap = 0;

let currentFerrari = 0;

function updateFerrariDisplay() {
  const car = ferraris[currentFerrari];
  document.getElementById("ferrariName").textContent = car.name;
  document.getElementById("ferrariPrice").textContent = "$" + car.price.toLocaleString();
  document.getElementById("ferrariImage").src = car.image;
  document.getElementById("ferrariDescription").textContent = car.description || '';
  updateFerrariCount();
}

function updateFerrariCount() {
  const car = ferraris[currentFerrari];

  // Actualiza el precio en la sección "Market Cap Equivalence"
  document.getElementById("ferrariPriceDisplay").textContent = "$" + car.price.toLocaleString();

  // Calcula la equivalencia
  const count = currentMarketCap / car.price;
  document.getElementById("ferrariCount").textContent = count.toFixed(2);
}

// Botones
document.getElementById("prevBtn").addEventListener("click", () => {
  currentFerrari = (currentFerrari - 1 + ferraris.length) % ferraris.length;
  updateFerrariDisplay();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentFerrari = (currentFerrari + 1) % ferraris.length;
  updateFerrariDisplay();
});

function shortenAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

connectBtn.onclick = async () => {
  if (connectBtn.classList.contains("connected")) {
    if (confirm("Disconnect wallet?")) {
      connectBtn.textContent = "Connect Wallet";
      connectBtn.classList.remove("connected");
      walletInfo.style.display = "none";
    }
    return;
  }

  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const address = accounts[0];
      connectBtn.textContent = shortenAddress(address);
      connectBtn.classList.add("connected");

      const rariContract = new ethers.Contract(
        "0x738dD55C272b0B686382F62DD4a590056839F4F6",
        ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
        provider
      );

      const balance = await rariContract.balanceOf(address);
      const decimals = await rariContract.decimals();
      const formatted = Number(ethers.utils.formatUnits(balance, decimals));

      userRari.textContent = formatted.toFixed(2);
      walletInfo.style.display = "block";

      const car = ferraris[currentFerrari];
      const value = formatted * currentPrice;
      ferrariNow.textContent = (value / car.price).toFixed(2);
      ferrariX10.textContent = ((value * 10) / car.price).toFixed(2);
      ferrariX100.textContent = ((value * 100) / car.price).toFixed(2);
      ferrariX1000.textContent = ((value * 1000) / car.price).toFixed(2);
      quoteDisplay.textContent = getDegenQuote("now");

      document.getElementById("progNow").style.width = Math.min(100, value / car.price * 10) + '%';
      document.getElementById("prog10").style.width = Math.min(100, value * 10 / car.price * 10) + '%';
      document.getElementById("prog100").style.width = Math.min(100, value * 100 / car.price * 10) + '%';
      document.getElementById("prog1000").style.width = Math.min(100, value * 1000 / car.price * 10) + '%';

    } catch (err) {
      alert("Wallet connection error.");
    }
  } else {
    alert("Please install MetaMask");
  }
};

function getDegenQuote(stage) {
  const quotes = {
    now: [
      "Still early… but you already smell like leather seats.",
      "You're not broke, you're pre-viral."
    ]
  };
  const list = quotes[stage] || quotes.now;
  return list[Math.floor(Math.random() * list.length)];
}

async function fetchTokenData() {
  const res = await fetch("https://api.dexscreener.com/tokens/v1/hyperevm/0x738dD55C272b0B686382F62DD4a590056839F4F6");
  const data = await res.json();
  const token = data[0];
  currentPrice = parseFloat(token.priceUsd);
  currentMarketCap = token.marketCap;
  document.getElementById("marketCap").textContent = "$" + currentMarketCap.toLocaleString();
  document.getElementById("ferrariPriceDisplay").textContent = "$" + ferraris[currentFerrari].price.toLocaleString();
  document.getElementById("ferrariCount").textContent = (currentMarketCap / ferraris[0].price).toFixed(2);
  document.getElementById("capProgress").style.width = Math.min(100, (currentMarketCap / ferraris[0].price)) + "%";
}

fetchTokenData();

function updateUserFerrariData() {
  if (walletInfo.style.display === "block") {
    const car = ferraris[currentFerrari];
    const value = parseFloat(userRari.textContent || 0) * currentPrice;

    ferrariNow.textContent = (value / car.price).toFixed(2);
    ferrariX10.textContent = ((value * 10) / car.price).toFixed(2);
    ferrariX100.textContent = ((value * 100) / car.price).toFixed(2);
    ferrariX1000.textContent = ((value * 1000) / car.price).toFixed(2);

    document.getElementById("progNow").style.width = Math.min(100, value / car.price * 10) + '%';
    document.getElementById("prog10").style.width = Math.min(100, value * 10 / car.price * 10) + '%';
    document.getElementById("prog100").style.width = Math.min(100, value * 100 / car.price * 10) + '%';
    document.getElementById("prog1000").style.width = Math.min(100, value * 1000 / car.price * 10) + '%';

    quoteDisplay.textContent = getDegenQuote("now");
  }
}

document.getElementById("prevBtnMobile").onclick = () => document.getElementById("prevBtn").click();
document.getElementById("nextBtnMobile").onclick = () => document.getElementById("nextBtn").click();
