let IP;


window.addEventListener('load', function () {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
        .then(data => {
            IP = data.ip;
            const displayIP = document.getElementById('ip-display');
            const ipAddressElement = document.createElement('span');
            ipAddressElement.innerText = `${IP}`;
            displayIP.appendChild(ipAddressElement);
            console.log(`${IP}`);
      })
      .catch(error => console.error('Error fetching IP address:', error));
});
  
const getDataBtn = document.getElementById("get-data-btn");
let lat;
let long;
let city;
let region;
let organisation;
let host = window.location.hostname;
let pincode;
let timezone;

getDataBtn.addEventListener("click", () => {
    console.log(`${IP}`);
    fetch(`https://ipinfo.io/${IP}/geo?token=31a8144f916b40`)
        .then(response => response.json())
        .then(data => {
            //console.log(data.loc);
            const location = data.loc.split(",");
           // console.log(location);
             lat = location[0];
            long = location[1];
            console.log(long);
            city = data.city;
            region = data.region;
            organisation = data.org;
            pincode = data.postal;
            timezone = data.timezone;

            displayAPIData(lat,long,city,region,organisation,pincode,timezone);
        })
        .catch(error => console.error('Error fetching data:', error));
})



function displayAPIData(lat,long,city,region,organisation,pincode,timezone) {
    getDataBtn.style.display = "none"; 

    const latElement = document.createElement("span");
    latElement.innerText = `Lat: ${lat}`;
    latElement.classList.add("display-items");
    latElement.classList.add("col-md-4");

    const longElement = document.createElement("span");
    longElement.innerText = `Long: ${long}`;
    longElement.classList.add("display-items");
    longElement.classList.add("col-md-4");

    const cityElement = document.createElement("span");
    cityElement.innerText = `City: ${city}`;
    cityElement.classList.add("display-items");
    cityElement.classList.add("col-md-4");

    const regionElement = document.createElement("span");
    regionElement.innerText = `Region: ${region}`;
    regionElement.classList.add("display-items");
    regionElement.classList.add("col-md-4");

    const orgElement = document.createElement("span");
    orgElement.innerText = `Organisation: ${organisation}`;
    orgElement.classList.add("display-items");
    orgElement.classList.add("col-md-4");

    const hostElement = document.createElement("span");
    hostElement.innerText = `Hostname: ${host}`;
    hostElement.classList.add("display-items");
    hostElement.classList.add("col-md-4");

    const row1 = document.querySelector(".row1");
    const row2 = document.querySelector(".row2");
    row1.appendChild(latElement);
    row1.appendChild(cityElement);
    row1.appendChild(orgElement);

    row2.appendChild(longElement);
    row2.appendChild(regionElement);
    row2.appendChild(hostElement);

    const mapContainer = document.querySelector(".map-container");
    const mapURL = `https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`
    const mapIframe = document.createElement('iframe');
    mapIframe.setAttribute('src', mapURL);
    mapIframe.setAttribute('width', '100%');
    mapIframe.setAttribute('height', '400');
    mapIframe.setAttribute('frameborder', '0');
    mapIframe.setAttribute('style', 'border:0');
    mapIframe.setAttribute('allowfullscreen', '');

    mapContainer.appendChild(mapIframe);

    const timezoneDate = new Date().toLocaleString("en-US", { timeZone: timezone });
    console.log(typeof timezoneDate);
    console.log(timezoneDate);
    const date = new Date(timezoneDate).toLocaleDateString("en-US");
    const time = new Date(timezoneDate).toLocaleTimeString("en-US");
    console.log(time);
    console.log(date);

    const timeContainer = document.querySelector(".time-container");
    timeContainer.innerHTML = `<span>Time Zone: ${timezone}</span>
    <span>Date and Time: ${date} , ${time}</span>
    <span>Pincode: ${pincode}</span>
    <span id="message">Message:</span>`


    dipslayPostal(pincode);

}
let requiredData;
function dipslayPostal(pincode) {
   
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(response => response.json())
        .then(data => {
            const messageSpan = document.getElementById("message");
            messageSpan.innerHTML += `<span id="custom">${data[0].Message}</span>`;

            const postOffices = data[0].PostOffice;

             requiredData = postOffices.map(postOffice => {
                return {
                    name: postOffice.Name,
                    branchType: postOffice.BranchType,
                    deliveryStatus: postOffice.DeliveryStatus,
                    district: postOffice.District,
                    division: postOffice.Division
                };
            });
           console.log(requiredData);
           displayPostOffice(requiredData);
        })
        .catch(error => console.error('Error fetching api:', error));
   
}

const resultsContainer = document.querySelector(".results-container");
function displayPostOffice(requiredData) {
    const inputContainer = document.querySelector(".input-container");
    inputContainer.style.display = "flex";
   
for (let i = 0; i < requiredData.length; i++) {
  const resultDiv = document.createElement("div");
  resultDiv.classList.add("result");

  const nameSpan = document.createElement("span");
    nameSpan.innerText = `Name: ${requiredData[i].name}`;
    nameSpan.classList.add("result-item")

  const branchTypeSpan = document.createElement("span");
    branchTypeSpan.innerText = `Branch Type: ${requiredData[i].branchType}`;
    branchTypeSpan.classList.add("result-item")

  const deliveryStatusSpan = document.createElement("span");
    deliveryStatusSpan.innerText = `Delivery Status: ${requiredData[i].deliveryStatus}`;
    deliveryStatusSpan.classList.add("result-item")

  const districtSpan = document.createElement("span");
    districtSpan.innerText = `District: ${requiredData[i].district}`;
    districtSpan.classList.add("result-item")

  const divisionSpan = document.createElement("span");
    divisionSpan.innerText = `Division: ${requiredData[i].division}`;
    divisionSpan.classList.add("result-item")

  resultDiv.appendChild(nameSpan);
  resultDiv.appendChild(branchTypeSpan);
  resultDiv.appendChild(deliveryStatusSpan);
  resultDiv.appendChild(districtSpan);
  resultDiv.appendChild(divisionSpan);

  resultsContainer.appendChild(resultDiv);
}
    
}

function searchPostalOffices(searchTerm) {
    resultsContainer.innerHTML = ``;
    const filteredData = requiredData.filter(postOffice => {
      const nameMatch = postOffice.name.toLowerCase().includes(searchTerm.toLowerCase());
      const branchTypeMatch = postOffice.branchType.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || branchTypeMatch;
    });
    displayPostOffice(filteredData);
  }
  
