"use strict";
window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
let expelledStudents = [];
let filterBy = "all";
let sortBy = "event";

function init() {
  console.log("DOM Loaded");
  loadJSON();
  //Filter, Sorting and search
  readAllValues();
  // readFilterValues();
  // readSortingValues();
  //   readSearchValues();
}

function readAllValues() {
  document.querySelector("#filter").onchange = function () {
    selectFilter(this.value);
  };
  document.querySelector("#sort").onchange = function () {
    selectSort(this.value);
  };

  // readSortingValues();
}

async function loadJSON() {
  const studentJSON = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(studentJSON);
  const studentData = await response.json();

  prepareStudentObjects(studentData);
}

function prepareStudentObjects(studentData) {
  studentData.forEach((studentObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array
    //Creating empty template for objects
    const studentTemplate = {
      firstName: "-unknown-",
      lastName: "-unknown-",
      middleName: "-unknown-",
      nickName: "",
      photo: "",
      house: "",
      prefect: false,
      squad: false,
      expelled: false,
    };

    //Defining the splitFullName using split() from JSON
    let fullName = studentObject.fullname.toLowerCase().trim();
    const house = studentObject.house.toLowerCase().trim();
    const splitFullName = fullName.split(" ");
    const firstSpace = fullName.indexOf(" ");
    const lastSpace = fullName.lastIndexOf(" ");
    const firstQ = fullName.indexOf('"');
    const lastQ = fullName.lastIndexOf('"');
    //Creating animal and making animal into an object

    const student = Object.create(studentTemplate);
    let HyphenOrSpace = false;
    let result = "";
    for (let index = 0; index < fullName.length; index++) {
      if (HyphenOrSpace === true) {
        result += fullName[index].toUpperCase();
      } else {
        result += fullName[index];
      }

      if (fullName[index] === "-" || fullName[index] === " " || fullName[index] === '"') {
        HyphenOrSpace = true;
      } else {
        HyphenOrSpace = false;
      }
    }
    fullName = result;
    //defining animal name using split and calling the index we need
    student.firstName = splitFullName[0].substring(0, 1).toUpperCase() + splitFullName[0].substring(1);
    student.lastName = fullName.substring(lastSpace).trim();
    student.middleName = fullName.substring(firstSpace + 1, lastSpace).trim();

    let index = 0;
    if (student.middleName[index] === '"') {
      student.nickName = student.middleName;
      student.middleName = "";
    } else if (student.middleName === "") {
      student.middleName = " ";
    } else {
      student.nickName = " ";
    }
    // student.photo = jsonObject.age;

    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //Not able to remove first name

    //Combining array and adding (pushing) animal into it
    allStudents.push(student);
  });
  displayList(allStudents);
}

//ReadFilterValues
function readFilterValues(event) {
  console.log(event);
  let choosenFilter = event;
  console.log(`Filter value is ${choosenFilter}`);
  // buildList();
  let filteredList = allStudents;
  // let valueFilter = document.querySelector("#filter").value;

  switch (choosenFilter) {
    case "all":
      filteredList = allStudents.filter(isAll);
      break;

    case "gryffindor":
      filteredList = allStudents.filter(isGryffindor);
      break;

    case "slytherin":
      filteredList = allStudents.filter(isSlytherin);
      break;

    case "ravenclaw":
      filteredList = allStudents.filter(isRavenclaw);
      break;

    case "hufflepuff":
      filteredList = allStudents.filter(isHufflepuff);
      break;

    default:
      console.log("ERROR value not found");
      break;
  }
  displayList(filteredList);
}

function selectFilter(event) {
  const filterBy = event;
  // console.log(`User selected ${filterBy}`);
  setFilter(filterBy);
}

function setFilter(filter) {
  filterBy = filter;
  // console.log(`User selected ${filterBy}`);
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;

  if (filterBy === "gryffindor") {
    filteredList = filteredList.filter(isGryffindor);
  } else if (filterBy === "slytherin") {
    filteredList = filteredList.filter(isSlytherin);
  } else if (filterBy === "ravenclaw") {
    filteredList = filteredList.filter(isRavenclaw);
  } else if (filterBy === "hufflepuff") {
    filteredList = filteredList.filter(isHufflepuff);
  } else if (filterBy === "prefect") {
    filteredList = filteredList.filter(isHouseAZ);
  } else if (filterBy === "inqs") {
    filteredList = filteredList.filter(isHouseZA);
  } else if (filterBy === "expelled") {
    filteredList = filteredList.filter(isHouseZA);
  } else if (filterBy === "non") {
    filteredList = filteredList.filter(isHouseZA);
  }

  return filteredList;
}

// FILTER FUNCTIONS
function isAll(student) {
  console.log("all");
  return true;
}
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function selectSort(event) {
  const sortBy = event;
  // console.log(`User selected ${filterBy}`);
  setSort(sortBy);
}

function setSort(sort) {
  sortBy = sort;
  buildList();
}

//SORTLIST
function sortList(sortedList) {
  // let sortedList = allStudents;

  if (sortBy === "firstnameA-Z") {
    sortedList = sortedList.sort(isFirstnameAZ);
  } else if (sortBy === "firstnameZ-A") {
    sortedList = sortedList.sort(isFirstnameZA);
  } else if (sortBy === "lastnameA-Z") {
    sortedList = sortedList.sort(isLastnameAZ);
  } else if (sortBy === "lastnameZ-A") {
    sortedList = sortedList.sort(isLastnameZA);
  } else if (sortBy === "houseA-Z") {
    sortedList = sortedList.sort(isHouseAZ);
  } else if (sortBy === "houseZ-A") {
    sortedList = sortedList.sort(isHouseZA);
  }

  return sortedList;
}

function readSortingValues(event) {
  let choosenFilter = event;
  console.log(`Filter value is ${choosenFilter}`);
  // buildList();
  let sortingList = allStudents;

  switch (choosenFilter) {
    case "all":
      sortingList = allStudents.sort(isAllSort);
      break;
    case "firstnameA-Z":
      sortingList = allStudents.sort(isFirstnameAZ);
      break;

    case "firstnameZ-A":
      sortingList = allStudents.sort(isFirstnameZA);
      break;

    case "lastnameA-Z":
      sortingList = allStudents.sort(isLastnameAZ);
      break;

    case "lastnameZ-A":
      sortingList = allStudents.sort(isLastnameZA);
      break;

    case "houseA-Z":
      sortingList = allStudents.sort(isHouseAZ);
      break;

    case "houseZ-A":
      sortingList = allStudents.sort(isHouseZA);
      break;

    default:
      console.log("ERROR value not found");
      break;
  }
  displayList(sortingList);
}

// FILTER FUNCTIONS
function isAllSort(student) {
  return allStudents;
}
function isFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return -1;
  } else {
    return 1;
  }
}
function isFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return 1;
  } else {
    return -1;
  }
}
function isLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return -1;
  } else {
    return 1;
  }
}
function isLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return 1;
  } else {
    return -1;
  }
}
function isHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}
function isHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}
// function buildList() {
//   let currentList = filterList(allStudents);
//   currentList = sortList(currentList);

//   displayList(currentList);
// }

// function filterList(currentList) {
//   // Not working
//   // let choosenFilter = document.querySelector("#filter").value;
//   switch (choosenFilter) {
//     case "all":
//       filteredList = allStudents.filter(isAll);
//       break;

//     case "gryffindor":
//       filteredList = filteredList.filter(isGryffindor);
//       break;

//     case "slytherin":
//       filteredList = allStudents.filter(isSlytherin);
//       break;

//     case "ravenclaw":
//       filteredList = allStudents.filter(isRavenclaw);
//       break;

//     case "hufflepuf":
//       filteredList = allStudents.filter(isHufflepuf);
//       break;

//     default:
//       console.log("ERROR value not found");
//       break;
//   }
// }

// --------------ORIGINAL DISPLAYLIST--------------------
// function displayList(list) {
//   // clear the list
//   document.querySelector("#list tbody").innerHTML = "";
//   if (list.length === 34) {
//     allStudents.forEach(displayStudent);
//   } else {
//     list.forEach(displayStudent);
//   }
//   // build a new list
//   console.log(list);
// }

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

function displayList(student) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  student.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("#profile").src = "./images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  clone.querySelector("[data-field=house]").textContent = student.house;
  //Why doesn't it register click?

  clone.querySelector("[data-field=prefect]").onclick = () => {
    clickAddAsPrefect();
  };
  //PREFECT
  if (student.prefect === true) {
    // console.log("prefect true");
    clone.querySelector("[data-field=prefect]").classList.add("color");
  } else {
    clone.querySelector("[data-field=prefect]").classList.remove("color");
    // console.log("prefect false");
  }

  //addEventListener so it can click?
  clone.querySelector("#profile").onclick = () => {
    showStudentDetails(student);
  };

  function clickAddAsPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      student.prefect = true;
    }
    //update list!
  }
  // append clone to list
  document.querySelector(".table-body").appendChild(clone);
}

function showStudentDetails(student) {
  // console.log("click");
  popup.style.display = "block";
  popup.querySelector(".student-firstname").textContent = `Firstname: ` + student.firstName;
  popup.querySelector(".student-middlename").textContent = `Middlename: ` + student.middleName;
  popup.querySelector(".student-lastname").textContent = `Lastname: ` + student.lastName;
  document.querySelector("#popup-profile").src = "./images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  document.querySelector("#popup-house").src = "./house/" + student.house.toLowerCase() + ".svg";
  document.querySelector("#js-makeInqS").addEventListener("click", checkForSquad);
}

document.querySelector("#close").addEventListener("click", () => (popup.style.display = "none"));

function checkForSquad(student) {
  console.log("checkSquad");
  // if(student.)
}
