import fetch from "node-fetch";

async function test() {
  const url = "https://zeldvorik.ru/apiv3/stream.php?id=103586779843954288&detailPath=the-cursed-of-satan-temptation-WvjzClzqE7";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Referer": "https://zeldvorik.ru/"
    }
  });
  const data = await res.json();

  if (data.downloads && data.downloads.length > 0) {
    const downloadUrl = data.downloads[0].url;
    console.log("Testing download URL:", downloadUrl);
    
    // Test 1: With Referer
    const dlRes1 = await fetch(downloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://zeldvorik.ru/"
      }
    });
    console.log("Test 1 status (with Referer):", dlRes1.status);

    // Test 2: Without Referer
    const dlRes2 = await fetch(downloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    console.log("Test 2 status (without Referer):", dlRes2.status);
  }
}

test();
