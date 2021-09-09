const display = document.getElementById('result-display');

function DumbWaysJos(num) {
  var disc = 0.211;
  var count = disc * num;

  if ((disc * num) >= 20000) {
    count = 20000;
  }else{
    count = disc * num;
  }

  var discPrice = num - count;
  var costReturn = num - discPrice;

  var output;

  if (num <= 50000) {
    alert("Minimal Input 50,000");
    output = `0`;
  }else{
    output = `
        <div>
          <div>Total bayar: Rp. ${discPrice}</div>
          <div>Diskon: Rp. ${count}</div>
          <div>Kembalian: Rp. ${costReturn}</div>
        </div>
      `;
  }

  return display.innerHTML = output;
}

function DumbWaysMantap(num) {
  var disc = 0.300;
  var count = disc * num;

  if ((disc * num) >= 40000) {
    count = 40000;
  }else{
    count = disc * num;
  }

  var discPrice = num - count;
  var costReturn = num - discPrice;

  var output;

  if (num <= 80000) {
    alert("Minimal Input 80,000");
    output = `0`;
  }else{
    output = `
        <div>
          <div>Total bayar: Rp. ${discPrice}</div>
          <div>Diskon: Rp. ${count}</div>
          <div>Kembalian: Rp. ${costReturn}</div>
        </div>
      `;
  }

  return display.innerHTML = output;
}

function hitungVoucher(type) {
	var a = Number(document.getElementById("input-1").value),
	result;

	switch(type) {
		case 'DumbWaysJos':
		result = DumbWaysJos(a);
		break;
		case 'DumbWaysMantap':
		result = DumbWaysMantap(a);
		break;
		default:
		alert("Terjadi kesalahan, silahkan coba lagi");
		break;
	}
}