async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/proxy?action=detail&detailPath=boyfriend-on-demand-o8i5BtEywa1");
    const data = await res.json();
    console.log(data.data.playerUrl);
  } catch (e) {
    console.error(e);
  }
}
test();
