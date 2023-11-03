$(document).ready(function () {
  $.getJSON("http://localhost:3000/api/data", function (data) {
    console.log("Data:", data);
    $("#asset-table").html(jsonToTable(data));

    $(".viewDetailsBtn").click(function () {
      $("#myModal").fadeIn();
      $(".modal-content").slideDown();
    });

    $("#closeModalBtn").click(function () {
      $(".modal-content").slideUp();
      $("#myModal").fadeOut();
    });
  });
});

function getCompartmentTable(compartments) {
  let table = `<td class="py-2 px-4 border-b">
    <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50 text-left">
            <tr>
                <th class="py-2 px-4 border-b w-20">Name</th>
                <th class="py-2 px-4 border-b">Goods</th>
                <th class="py-2 px-4 border-b w-20">State</th>
            </tr>
        </thead>
        <tbody>`;
  $.each(compartments, function (index, compartment) {
    let alertIcon = `<div class="group inline-block relative">
    <svg class="w-6 h-6 text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"></path>
    </svg>
    <div class="hidden group-hover:block group-focus:block absolute z-10 w-64 p-2 mt-1 text-md text-white bg-red-600 rounded-lg">
        ${compartment.Alert.AlertDescription}
    </div>
</div>`;
    table += `<tr class="${
      compartment.Alert.HasAlert ? "bg-red-300" : "bg-white"
    }">
                <td class="py-2 px-4 border-b w-20">${compartment.Name}</td>
                <td class="py-2 px-4 border-b">${
                  compartment.Logistic.LogisticType
                }</td>
                <td class="py-2 px-4 border-b w-20 ">${
                  compartment.Alert.HasAlert ? alertIcon : false
                }</td>
            </tr>`;
  });
  table += `</tbody></table></td>`;
  return table;
}

function jsonToTable(data) {
  let row = "";
  $.each(data, function (index, asset) {
    row += `<tr><td class="py-2 px-4 border-b">${asset.AssetId}</td>`;
    row += `<td class="py-2 px-4 border-b">${asset.AssetName}</td>`;
    row += `<td class="py-2 px-4 border-b">${asset.TRUStatus}</td>`;
    row += `<td class="py-2 px-4 border-b">${asset.ControlMode}</td>`;
    row += `${getCompartmentTable(asset.Compartments)}`;
    row += `<td class="py-2 px-4 border-b">
    <a
      href="/3dmodel.html"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >View 3D Model</a>
    <button class="viewDetailsBtn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
    View Details
    </button>
  </td></tr>`;
  });
  return row;
}

$(document).ready(function () {
  // Make an API request to fetch the data
  $.ajax({
    url: "http://localhost:3000/api/data", // Replace with your API endpoint
    method: "GET",
    success: function (data) {
      data.forEach((element) => {
        const comparments = element.Compartments;
        for (let i = 0; i < comparments.length; i++) {
          $("#name").text(comparments[i].Name);
          $("#goods").text(comparments[i].Logistic.LogisticType);
          $("#goodsHealth").text(comparments[i].goodsHealth);
          $("#setTemperature").find("input").val(comparments[i].SetTemprature);
          $("#returnTemperature").text(comparments[i].ReturnTemprature);
          $("#setHumidity").find("input").val(`${comparments[i].SetHumidity}&#176`);
          $("#returnHumidity").text(comparments[i].ReturnHumidity);
        }
      });
    },
    error: function (error) {
      console.log("API request failed: " + error);
    },
  });
});
