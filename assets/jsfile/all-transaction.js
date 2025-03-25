import {checkAdminAccess}  from "../js/initial.js"
var rankList = [];
var array = [];
var array_length = 0;
var table_size = 10;
var start_index = 1;
var end_index = 0;
var current_index = 1;
var max_index = 0;
let userNameSpan = document.querySelector("#user-name-span");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log(id);




async function fetchUserData() {
  try {
    // Fetch both data in parallel
    const [data, data1] = await Promise.all([
      $.ajax({
        url: "https://krinik.in/withdraw_amount_get/",
        method: "GET"
      }),
      $.ajax({
        url: "https://krinik.in/payment/",
        method: "GET"
      })
    ]);

    // Check if both requests were successful
    if (data && data.status === "success" && data1) {
      // Combine both data responses into one array
      const combinedData = [...data.data, ...data1.data];

      // Sort combined data by timestamp (assuming it's in "YYYY-MM-DD HH:mm:ss" format)
      combinedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Descending order

      console.log(combinedData);
      rankList = combinedData
      if (rankList.length > 0) {
        array = rankList;
        console.log(array,"plo")
        filterAndDisplay(); // Call the function to filter and display data
      } else {
        console.error("No matching data found for the given ID");
      }
      // Call your filter and display function with sorted data
      filterAndDisplay();
      // Optionally, update your UI with the combined data
      // totaldataleague.innerHTML = combinedData.length;
    } else {
      console.error("Error: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}





fetchUserData();

function filterAndDisplay() {
  filterRankList();
  preLoadCalculations();
  displayIndexButtons();
  displayTableRows();
  highlightIndexButton();
}

function preLoadCalculations(filteredArrayLength) {
  array_length = filteredArrayLength || array.length;
  max_index = Math.ceil(array_length / table_size);
}

$(document).ready(function () {
const $dropdownBtn3 = $('#dropdownBtn3');
const $dropdownContent3 = $('#dropdownContent3');
const $selectedStatus = $('#selectedStatus');
const $arrow = $('#arrowBar'); // Ensure this selector matches your HTML
const $clearStatus = $('#clearStatus');

function toggleDropdown() {
const isExpanded = $dropdownContent3.toggleClass('show').hasClass('show');
$dropdownBtn3.attr('aria-expanded', isExpanded);
}

// Click event for the selected status element to toggle the dropdown
$selectedStatus.on('click', function() {
toggleDropdown();
});

// Click event for the arrow to toggle the dropdown
$arrow.on('click', function() {
toggleDropdown();
});

// Click event for selecting an item from the dropdown
$dropdownContent3.on('click', 'a', function() {
const selectedValue = $(this).data('value');
$selectedStatus.text(selectedValue).data('value', selectedValue);
$dropdownContent3.removeClass('show');

if (selectedValue === 'All Status') {
$arrow.show();
$clearStatus.hide();
} else {
$arrow.hide();
$clearStatus.show();
}
filterRankList(); // Filter based on the selected status
});

// Click event for clearing the selected status
$clearStatus.on('click', function() {
$selectedStatus.text('All Status').data('value', 'All Status');
$arrow.show();
$clearStatus.hide();
$dropdownContent3.removeClass('show'); // Hide the dropdown content
$dropdownBtn3.attr('aria-expanded', 'false'); // Ensure dropdown button is collapsed
filterRankList(); // Filter with the reset status
});

// Click event for closing the dropdown if clicked outside
$(document).on('click', function(event) {
if (!$selectedStatus.is(event.target) && !$selectedStatus.has(event.target).length && !$dropdownContent3.has(event.target).length && !$arrow.is(event.target) && !$clearStatus.is(event.target)) {
$dropdownContent3.removeClass('show');
$dropdownBtn3.attr('aria-expanded', 'false');
}
});



// Initialize Flatpickr
let picker = flatpickr('#rangePicker', {
  mode: 'range',
  dateFormat: 'd-m-Y',
  onClose: function (selectedDates, dateStr, instance) {
    if (!selectedDates || selectedDates.length === 0) {
      instance.clear();
      $('#rangePicker').text('Start & End Date').removeClass('has-dates');
      $('#clearDates').hide();
      $('#calendarIcon').show();
    } else {
      $('#rangePicker').text(selectedDates.map(date => instance.formatDate(date, 'd-m-Y')).join(' - ')).addClass('has-dates');
      $('#clearDates').show();
      $('#calendarIcon').hide();
    }
    filterRankList();
  },
  clickOpens: false,
  allowInput: false
});

$('#rangePicker, #calendarIcon').click(function () {
  if (!$('#rangePicker').hasClass('has-dates')) {
    picker.open();
  }
});

$('#clearDates').click(function () {
  picker.clear();
  $('#rangePicker').text('Start & End Date').removeClass('has-dates');
  $('#clearDates').hide();
  $('#calendarIcon').show();
  filterRankList();
});

function updateAmountFilters() {
const startAmount = $('#startAmountRange').val().trim();
const endAmount = $('#endAmountRange').val().trim();

// Show or hide clear buttons based on input values
if (startAmount !== '' && endAmount === '') {
$('#clearAmountStart').show();
$('#clearAmountEnd').hide();
} else if (startAmount !== '' && endAmount !== '') {
$('#clearAmountStart').show();
$('#clearAmountEnd').show();
} else if (startAmount === '' && endAmount === '') {
$('#clearAmountStart').hide();
$('#clearAmountEnd').hide();
} else if (startAmount === '' && endAmount !== '') {
$('#clearAmountStart').hide();
$('#clearAmountEnd').show();
}

// Always call filterRankList to apply the filter
filterRankList();
}

$('#startAmountRange').on('input', function () {
updateAmountFilters();
});

// Event listeners for the end amount range input
$('#endAmountRange').on('input', function () {
updateAmountFilters();
});

// Event listener for clearing the start amount range
$('#clearAmountStart').click(function () {
$('#startAmountRange').val('');
updateAmountFilters(); // Call the update function to handle the UI changes
});

// Event listener for clearing the end amount range
$('#clearAmountEnd').click(function () {
$('#endAmountRange').val('');
updateAmountFilters(); // Call the update function to handle the UI changes
});

// Initial call to update filters and hide/show clear buttons on page load
updateAmountFilters();
$('#tab_filter_text').on('input', function () {
filterRankList();
});
});


function filterRankList() {
  var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
console.log('Search Text:', tab_filter_text);
var datefilter = $('#rangePicker').text().trim();
const statusFilter = $("#selectedStatus").data('value') || ''; 
  var startDate, endDate;
  var startAmount = parseFloat($('#startAmountRange').val().trim()) || 0;
var endAmount = parseFloat($('#endAmountRange').val().trim()) || Infinity;

if (datefilter !== '' && datefilter !== 'Start & End Date') {
  var dates = datefilter.split(' - ');
  startDate = moment(dates[0], 'D-M-YYYY').startOf('day').toDate();
  endDate = moment(dates[1], 'D-M-YYYY').endOf('day').toDate();
  // console.log('Parsed Start Date:', startDate);
  // console.log('Parsed End Date:', endDate);
}


  var filteredArray = rankList.filter(function (object) {
    var matchesText = true, matchesStatus = true, matchesDate = true, matchesAmount = true;

    if (tab_filter_text !== '') {
      matchesText = (object.paid_amount && object.paid_amount.toString().toLowerCase().includes(tab_filter_text)) ||
      (object.amount_without_tds && object.amount_without_tds.toString().toLowerCase().includes(tab_filter_text)) ||
      (object.user_data.mobile_no && object.user_data.mobile_no.toString().toLowerCase().includes(tab_filter_text))
    }

    if (statusFilter !== 'All Status') {
      let status = null;
    
      // Determine status based on payment_status and withdraw_status
      if (object.payment_status) {
        const paymentStatus = object.payment_status.toLowerCase();
        if (paymentStatus === "approved") {
          status = "Approved";
        } else if (paymentStatus === "pending") {
          status = "Pending";
        } else if (paymentStatus === "rejected") {
          status = "Rejected";
        }
      }
    
      if (object.withdraw_status) {
        const withdrawStatus = object.withdraw_status.toLowerCase();
        if (withdrawStatus === "approved") {
          status = "Approved"; // Prioritize Approved if any are approved
        } else if (withdrawStatus === "pending" && status !== "Approved") {
          status = "Pending"; // Set to Pending if no Approved found
        } else if (withdrawStatus === "rejected" && !status) {
          status = "Rejected"; // Set to Rejected only if status is null
        }
      }
    
      // Compare determined status with the filter
      matchesStatus = (status === statusFilter);
    }
    




    // if (startDate && endDate) {
    //   matchesDate = (moment(object.start_league_date, 'DD/MM/YYYY').toDate() >= startDate &&
    //     moment(object.end_league_date, 'DD/MM/YYYY').toDate() <= endDate);
    // }
    if (startDate && endDate) {
    const objectDate = moment(object.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
    matchesDate = (objectDate >= startDate && objectDate <= endDate);
    // console.log('Object Date:', objectDate, 'Matches Date:', matchesDate);
  }

  // Filter based on amount range
  if (!isNaN(object.paid_amount) || !isNaN(object.amount_without_tds)) {
    const paidAmount = parseFloat(object.paid_amount); // Parse paid_amount
    const amountWithoutTDS = parseFloat(object.amount_without_tds); // Parse amount_without_tds
    
    // Compare both amounts to the range (using paidAmount or amountWithoutTDS as needed)
    matchesAmount = (paidAmount >= startAmount && paidAmount <= endAmount) || (amountWithoutTDS >= startAmount && amountWithoutTDS <= endAmount);

    console.log('Paid Amount:', paidAmount, 'Amount Without TDS:', amountWithoutTDS, 'Matches Amount:', matchesAmount);
} else {
    console.log('Invalid or missing amounts for object:', object);
}



  return matchesText && matchesStatus && matchesDate && matchesAmount;
  });

  array = filteredArray;
  preLoadCalculations();
  current_index = 1;
  displayIndexButtons();
  highlightIndexButton()
  displayTableRows();
}

function getStatus(status) {
if (status === "success" || status === "Success") {
  return `<span class="material-symbols-outlined" style="color:green">check_circle</span>`;
} else if (status === "fail" || status === "Fail") {
  return `<span class="material-symbols-outlined" style="color:red">error</span>`;
} else if (status === "pending" || status === "Pending") {
  return `<span class="material-symbols-outlined" style="color:#fbde08">schedule</span>`;
} else {
  return "unknown";
}
}
window.getStatus = getStatus
window.prev = prev
window.next = next
window.indexPagination = indexPagination
function displayIndexButtons() {
  $(".index_buttons ul").empty();

  if (array_length <= table_size) {
    // If there are 10 or fewer items, do not show pagination
    return;
  }

  if (current_index > 1) {
    $(".index_buttons ul").append('<li><button class="paginate_button page-item previous" onclick="prev()">Previous</button></li>');
  }

  const show_page = getElidedPageRange(current_index, max_index);

  show_page.forEach(i => {
    if (i === current_index) {
      $(".index_buttons ul").append('<li><button class="paginate_button page-item active">' + i + '</button></li>');
    } else if (i === "...") {
      $(".index_buttons ul").append('<li><button class="paginate_button page-item">...</button></li>');
    } else {
      $(".index_buttons ul").append('<li><button class="paginate_button page-item" onclick="indexPagination(' + i + ')">' + i + '</button></li>');
    }
  });

  if (current_index < max_index) {
    $(".index_buttons ul").append('<li><button class="paginate_button page-item next" onclick="next()">Next</button></li>');
  }

  highlightIndexButton();
}


function getElidedPageRange(current, total) {
  const delta = 1;
  const range = [];
  const left = current - delta;
  const right = current + delta + 1;
  let last = 0;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i < right)) {
      if (last + 1 !== i) {
        range.push("...");
      }
      range.push(i);
      last = i;
    }
  }

  return range;
}

function highlightIndexButton() {
  start_index = (current_index - 1) * table_size + 1;
  end_index = Math.min(start_index + table_size - 1, array_length);
  $("#datatable_info").text("Showing " + start_index + " to " + end_index + " of " + array_length + " items");
  $(".index_buttons ul a").removeClass("active");
  $('.index_buttons ul a').each(function () {
    if ($(this).text() == current_index) {
      $(this).addClass("active");
    }
  });
  displayTableRows();
}
function prev() {
  if (current_index > 1) {
    current_index--;
    displayIndexButtons();
    highlightIndexButton();
  }
}

function next() {
  if (current_index < max_index) {
    current_index++;
    displayIndexButtons();
    highlightIndexButton();
  }
}

function indexPagination(index) {
  current_index = index;
  displayIndexButtons();
  highlightIndexButton();
}



function displayTableRows() {
  $("table tbody").empty();
  var tab_start = start_index - 1;
  var tab_end = end_index;

  if (array.length === 0) {
    $("#noDataFound").show();
    $("#pagination").hide();
    $("#table-scrolling").css("overflow-x", "hidden"); // Add this line
    return;
  } else {
    $("#noDataFound").hide();
    $("#pagination").show();
    $("#table-scrolling").css("overflow-x", "auto"); // Add this line
  }

  for (var i = tab_start; i < tab_end; i++) {
    var showdata = array[i];
    // var status = getStatus(showdata["payment_status"]);

    var tr = $("<tr></tr>");

    var noCell = $("<td></td>").text(i + 1);
    // var poolNameCell = $("<td colspan='3'></td>").text(showdata.pool["pool_name"] || "");
    // var poolTypeCell = $("<td colspan='3'> </td>").text(showdata.pool["pool_type"] || "");
    // var userNameCell = $("<td colspan='3'> </td>").text(showdata.user_data["user_id"] || "");
    var mobileCell = $("<td colspan='3'> </td>").text(showdata.user_data["mobile_no"] || "");
    var debitAmount = showdata.amount_with_tds ? "Debit" : null
    var creditAmount = showdata.paid_amount  ? "Credit" : null
    var amountCell = $("<td colspan='3'> </td>"); // Initialize amountCell

    if(debitAmount === "Debit"){
    var credit_debitCell = $("<td colspan='2'> </td>").text("Debit" || "");
    amountCell.html(`<span style="color: red;font-weight:600">&#x2212;${showdata["amount_without_tds"] || ""}</span>`)

    }else if(creditAmount === "Credit"){
    var credit_debitCell = $("<td colspan='2'> </td>").text("Credit" || "");
    amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${showdata["paid_amount"] || ""}</span>`)
  }else{
    var credit_debitCell = $("<td colspan='2'> </td>").text("Null" || "");

    }

    // var transactionId = $("<td colspan='3'> </td>").text(showdata["order_id"] || "");
    // var credit_debitCell = $("<td colspan='2'> </td>").text("Credit" || "");

    // if (credit_debitCell === "credit" || credit_debitCell.text === "Credit") {
    //   amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${showdata["paid_amount"] || ""}</span>`);
    // } 
    var statusCell = $("<td colspan='2'></td>")
    // .text(showdata["payment_status"]);
    // var statusCell = $("<td colspan='2'></td>").text(showdata["withdraw_status"]);

    if (showdata["payment_status"] === "approved" || showdata["payment_status"] === "Approved" || showdata["withdraw_status"] === "approved" || showdata["withdraw_status"] === "Approved") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:green">check_circle</span>`);
    } else if (showdata["payment_status"] === "rejected" || showdata["payment_status"]=== "rejected"  || showdata["withdraw_status"] === "rejected" || showdata["withdraw_status"] === "Rejected") {
      statusCell.html(` <span class="material-symbols-outlined" style="color:red">error</span>`);
    }else if (showdata["payment_status"] === "pending" || showdata["payment_status"]=== "Pending"  || showdata["withdraw_status"] === "pending" || showdata["withdraw_status"] === "Pending") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:#fbde08">schedule</span>`);
    }

    var dateCell = $("<td colspan='2'></td>").text(moment(showdata["timestamp"], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss'));

    // var viewCell = $("<td></td>").html(
    //   // '<span class="sortable" onclick="window.location.href=\'view-league-details.html\'"><i class="far fa-eye"></i></span>'
    //     '<span class="sortable" onclick="viewLeagueDetails(\'' + showdata["league_name"] + '\')"><i class="far fa-eye"></i></span>'
    // );
    // var editCell = $("<td></td>").html(
    //   '<span class="sortable" onclick="handleEdit(' + showdata["id"] + ')"><i class="far fa-edit"></i></span>'
    // );
    // var deleteCell = $("<td></td>").html(
    //   '<span class="sortable" onclick="handleDelete(' + showdata["id"] + ')"><i class="far fa-trash-alt"></i></span>'
    // );
   
    tr.append(noCell)
      // .append(poolNameCell)
      // .append(poolTypeCell)
      // .append(userNameCell)
      .append(mobileCell)
      // .append(transactionId)
      .append(credit_debitCell)
      .append(amountCell)
      .append(statusCell)
      .append(dateCell)
    // .append(deleteCell);

    // if (credit_debitCell === "credit" || credit_debitCell === "Credit") {

    // }

    $("table tbody").append(tr);
  }

}
const table = document.getElementById('tech-companies-1');
// const downloadBtn = document.getElementById('download-btn');

// downloadBtn.addEventListener('click', () => {
// const workbook = XLSX.utils.table_to_book(table, { sheet: 'League Data' });
// const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
// const url = URL.createObjectURL(data);
// const a = document.createElement('a');
// a.href = url;
// a.download = 'all_transaction_data.xlsx';
// a.click();

// URL.revokeObjectURL(url);
// a.remove();
// });



const downloadBtn = document.getElementById('download-btn');

// downloadBtn.addEventListener('click', () => {
//     // Ensure the full data array is used, not just the paginated display
//     if (array.length === 0) {
//         alert("No data available to download.");
//         return;
//     }

//     // Create a new table element dynamically in memory
//     const tempTable = document.createElement("table");
//     const thead = document.createElement("thead");
//     const tbody = document.createElement("tbody");

//     // Add the table header
//     const headerRow = `
//         <tr>
//             <th>No.</th>
//             <th>League Full Name</th>
//             <th>League Short Name</th>
           
//             <th>Start & End Date</th>
//             <th>Status</th>
            
//         </tr>`;
//     thead.innerHTML = headerRow;

//     // Add table rows from the full data array
//     array.forEach((showdata, index) => {
//         const status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);

//         const row = `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${showdata["league_name"] || ""}</td>
//                 <td>${showdata["short_league_name"] || ""}</td>
               
//                 <td>${(showdata["start_league_date"] || "") + " - " + (showdata["end_league_date"] || "")}</td>
//                 <td>${status}</td>
               
//             </tr>`;
//         tbody.innerHTML += row;
//     });

//     // Append the thead and tbody to the tempTable
//     tempTable.appendChild(thead);
//     tempTable.appendChild(tbody);

//     // Use XLSX to export the complete table with some formatting
//     const workbook = XLSX.utils.table_to_book(tempTable, { sheet: "All Transaction Data" });

//     // Apply some basic formatting
//     const sheet = workbook.Sheets['All Transaction Data'];
//     const range = XLSX.utils.decode_range(sheet['!ref']); // Get sheet range

//     // Adjust column widths for better readability
//     sheet['!cols'] = [
//         { wch: 5 }, // No.
//         { wch: 20 }, // League Full Name
//         { wch: 15 }, // League Short Name
//         // { wch: 30 }, // Logo (URL)
//         { wch: 25 }, // Start & End Date
//         { wch: 15 }, // Status
      
//     ];

//     // Export as an Excel file
//     XLSX.writeFile(workbook, "all_transaction_data.xlsx");
// });

// downloadBtn.addEventListener("click", () => {
//   // Prepare the data for Excel
//   const excelData = array.map((object, index) => {
//     const matchDetails = object.user_data.mobile_no || "N/A"; // Fallback for missing match names
//     var amountCell = $("<td colspan='3'> </td>"); // Initialize amountCell
//     var debitAmount = object.amount_with_tds ? "Debit" : null
//     var creditAmount = object.paid_amount  ? "Credit" : null

//     if(debitAmount === "Debit"){
//     var credit_debitCell = $("<td colspan='2'> </td>").text("Debit" || "");
//     amountCell.html(`<span style="color: red;font-weight:600">&#x2212;${object["amount_without_tds"] || ""}</span>`)

//     }else if(creditAmount === "Credit"){
//     var credit_debitCell = $("<td colspan='2'> </td>").text("Credit" || "");
//     amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${object["paid_amount"] || ""}</span>`)
//   }else{
//     var credit_debitCell = $("<td colspan='2'> </td>").text("Null" || "");

//     }
//     var statusCell = $("<td colspan='2'></td>")
//     // .text(showdata["payment_status"]);
//     // var statusCell = $("<td colspan='2'></td>").text(showdata["withdraw_status"]);

//     if (object["payment_status"] === "approved" || object["payment_status"] === "Approved" || object["withdraw_status"] === "approved" || object["withdraw_status"] === "Approved") {
//       statusCell.html(`<span class="material-symbols-outlined" style="color:green">Approved</span>`);
//     } else if (object["payment_status"] === "rejected" || object["payment_status"]=== "rejected"  || object["withdraw_status"] === "rejected" || object["withdraw_status"] === "Rejected") {
//       statusCell.html(` <span class="material-symbols-outlined" style="color:red">Rejected</span>`);
//     }else if (object["payment_status"] === "pending" || object["payment_status"]=== "Pending"  || object["withdraw_status"] === "pending" || object["withdraw_status"] === "Pending") {
//       statusCell.html(`<span class="material-symbols-outlined" style="color:#fbde08">Pending</span>`);
//     }
//     // const totalPlayers =
//     //   (object.select_player_A?.length || 0) + (object.select_player_B?.length || 0); // Safe calculation of total players
//     // const status = getStatus(object.match_start_date, object.match_end_status); // Get match status
//     // const fantasyStart = object.match_start_date || "N/A"; // Fallback for missing dates
//     const dateCell1 = moment(object["timestamp"], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss')
//     // Return structured data for each row
//     return {
//       No: index + 1,                        // Row number
//       "Mobile No": matchDetails,           // Match display name
//       "Credit/Debit": credit_debitCell,        // Match start date
//       "Amount": amountCell,        // Total players
//       Status: statusCell || "Unknown",
//       "Date & Time" : dateCell1,          // Match status
//     };
//   });

//   // Create a worksheet from the JSON data
//   const worksheet = XLSX.utils.json_to_sheet(excelData);

//   // Adjust column widths for better spacing
//   const columnWidths = [
//     { wpx: 50 },  // No (narrow column)
//     { wpx: 250 }, // Match Name (wide column for full names)
//     { wpx: 150 }, // Fantasy Start (medium column for date/time)
//     { wpx: 100 }, // Total Players (narrow column)
//     { wpx: 150 }, // Status (medium column)
//   ];
//   worksheet["!cols"] = columnWidths; // Apply column widths

//   // Create a new workbook and append the worksheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Match Data");

//   // Write the workbook to a file and trigger the download
//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   const data = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   // Create a download link and trigger the download
//   const url = URL.createObjectURL(data);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "display_match_data.xlsx";
//   a.click();

//   // Clean up the created object URL and remove the link element
//   URL.revokeObjectURL(url);
//   a.remove();
// });

// downloadBtn.addEventListener("click", () => {
//   // Prepare the data for Excel
//   const excelData = array.map((object, index) => {
//     const matchDetails = object.user_data?.mobile_no || "N/A"; // Fallback for missing match names
//     let amountCell = $("<td colspan='3'> </td>"); // Initialize amountCell
//     let debitAmount = object.amount_with_tds ? "Debit" : null;
//     let creditAmount = object.paid_amount ? "Credit" : null;

//     let credit_debitCell = $("<td colspan='2'> </td>").text("Null");

//     // Handle Debit or Credit Amount
//     if (debitAmount === "Debit") {
//       credit_debitCell.text("Debit");
//       amountCell.html(`<span style="color: red;font-weight:600">&#x2212;${object["amount_without_tds"] || ""}</span>`);
//     } else if (creditAmount === "Credit") {
//       credit_debitCell.text("Credit");
//       amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${object["paid_amount"] || ""}</span>`);
//     }

//     // Handle Status cell
//     const statusCell = $("<td colspan='2'></td>");
//     const status = object["payment_status"]?.toLowerCase() || object["withdraw_status"]?.toLowerCase() || "null";

//     if (status === "approved") {
//       statusCell.html(`<span class="material-symbols-outlined" style="color:green">Approved</span>`);
//     } else if (status === "rejected") {
//       statusCell.html(`<span class="material-symbols-outlined" style="color:red">Rejected</span>`);
//     } else if (status === "pending") {
//       statusCell.html(`<span class="material-symbols-outlined" style="color:#fbde08">Pending</span>`);
//     }

//     // Format the timestamp
//     const dateCell1 = moment(object["timestamp"], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');

//     // Return structured data for each row
//     return {
//       No: index + 1,                        // Row number
//       "Mobile No": matchDetails,           // Match display name
//       "Credit/Debit": credit_debitCell[0].outerHTML,  // Credit/Debit cell
//       "Amount": amountCell[0].outerHTML,    // Amount cell
//       Status: statusCell[0].outerHTML,      // Status cell
//       "Date & Time": dateCell1,             // Date & Time
//     };
//   });

//   // Create a worksheet from the JSON data
//   const worksheet = XLSX.utils.json_to_sheet(excelData);

//   // Adjust column widths for better spacing
//   const columnWidths = [
//     { wpx: 50 },  // No (narrow column)
//     { wpx: 250 }, // Mobile No (wide column for full names)
//     { wpx: 150 }, // Credit/Debit (medium column)
//     { wpx: 100 }, // Amount (narrow column)
//     { wpx: 150 }, // Status (medium column)
//     { wpx: 150 }, // Date & Time (medium column)
//   ];
//   worksheet["!cols"] = columnWidths; // Apply column widths

//   // Create a new workbook and append the worksheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Match Data");

//   // Write the workbook to a file and trigger the download
//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   const data = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   // Create a download link and trigger the download
//   const url = URL.createObjectURL(data);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "display_match_data.xlsx";
//   a.click();

//   // Clean up the created object URL and remove the link element
//   URL.revokeObjectURL(url);
//   a.remove();
// });

downloadBtn.addEventListener("click", () => {
  // Prepare the data for Excel
  const excelData = array.map((object, index) => {
    const matchDetails = object.user_data?.mobile_no || "N/A"; // Fallback for missing match names
    let amountCell = $("<td colspan='3'> </td>"); // Initialize amountCell
    let debitAmount = object.amount_with_tds ? "Debit" : null;
    let creditAmount = object.paid_amount ? "Credit" : null;
    const formattedMobileNo = matchDetails.toString();
    let credit_debitCell = $("<td colspan='2'> </td>").text("Null");

    // Handle Debit or Credit Amount
    if (debitAmount === "Debit") {
      credit_debitCell.text("Debit");
      amountCell.html(`<span style="color: red;font-weight:600">&#x2212;${object["amount_without_tds"] || ""}</span>`);
    } else if (creditAmount === "Credit") {
      credit_debitCell.text("Credit");
      amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${object["paid_amount"] || ""}</span>`);
    }

    // Handle Status cell
    const statusCell = $("<td colspan='2'></td>");
    const status = object["payment_status"]?.toLowerCase() || object["withdraw_status"]?.toLowerCase() || "null";

    if (status === "approved") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:green">Approved</span>`);
    } else if (status === "rejected") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:red">Rejected</span>`);
    } else if (status === "pending") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:#fbde08">Pending</span>`);
    }

    // Extract the text content from HTML elements (not HTML tags)
    const creditDebitText = credit_debitCell.text();
    const amountText = amountCell.text();
    const statusText = statusCell.text();

    // Format the timestamp
    const dateCell1 = moment(object["timestamp"], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');

    // Return structured data for each row
    return {
      No: index + 1,                        // Row number
      "Mobile No": `${formattedMobileNo}`,           // Match display name
      "Credit/Debit": creditDebitText,    // Credit/Debit text
      "Amount": amountText,               // Amount text
      Status: statusText,                 // Status text
      "Date & Time": dateCell1,           // Date & Time
    };
  });

  // Create a worksheet from the JSON data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Adjust column widths for better spacing
  const columnWidths = [
    { wpx: 50 },  // No (narrow column)
    { wpx: 250 }, // Mobile No (wide column for full names)
    { wpx: 150 }, // Credit/Debit (medium column)
    { wpx: 100 }, // Amount (narrow column)
    { wpx: 150 }, // Status (medium column)
    { wpx: 150 }, // Date & Time (medium column)
  ];
  worksheet["!cols"] = columnWidths; // Apply column widths

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Match Data");

  // Write the workbook to a file and trigger the download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "display_match_data.xlsx";
  a.click();

  // Clean up the created object URL and remove the link element
  URL.revokeObjectURL(url);
  a.remove();
});



window.onload = checkAdminAccess();
