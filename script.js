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
//LOAD JSON
async function loadJSON() {
  const studentJSON = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(studentJSON);
  const studentData = await response.json();

  prepareStudentObjects(studentData);
}
//PREPARE STUDENT OBJECT + LETTERS
function prepareStudentObjects(studentData) {
  studentData.forEach((studentObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array
    //Creating empty template for objects
    const studentTemplate = {
      firstName: "-unknown-",
      lastName: "-unknown-",
      middleName: "-unknown-",
      gender: "",
      nickName: "",
      photo: "",
      house: "",
      prefect: false,
      inqS: false,
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
    student.gender = studentObject.gender;
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
  buildList();
}
//SELECT FILTER FROM EVENT
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

//FILTER LIST
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
    filteredList = filteredList.filter(isPrefect);
  } else if (filterBy === "inqs") {
    filteredList = filteredList.filter(isInqS);
  } else if (filterBy === "expelled") {
    filteredList = filteredList.filter(isExpelled);
  } else if (filterBy === "non") {
    filteredList = filteredList.filter(isStudent);
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
function isPrefect(student) {
  return student.prefect === true;
}
function isInqS(student) {
  return student.inqS === true;
}
function isExpelled(student) {
  return student.expelled === true;
}
function isStudent(student) {
  return student.expelled === false;
}

//SELECT FILTER FROM EVENT
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

// SORTING FUNCTIONS
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

//BUILD LIST = REFRESH LIST
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

//DISPLAY LIST WITH STUDENTS
function displayList(student) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  student.forEach(displayStudent);
}

//DISPLAY SINGLE STUDENT FOREACH ABOVE
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

  //PREFECT
  if (student.prefect === true) {
    // console.log("prefect true");
    clone.querySelector("[data-field=prefect]").classList.add("color");
  } else {
    clone.querySelector("[data-field=prefect]").classList.remove("color");
    // console.log("prefect false");
  }

  //click prefect
  clone.querySelector("[data-field=prefect]").onclick = () => {
    clickAddAsPrefect();
  };

  //INQ SQUAD
  if (student.inqS === true) {
    // console.log("inqS true");
    clone.querySelector("[data-field=inqs]").classList.add("color");
  } else {
    clone.querySelector("[data-field=inqs]").classList.remove("color");
    // console.log("inqS false");
  }

  //click inqS
  clone.querySelector("[data-field=inqs]").onclick = () => {
    clickAddAsInqS();
  };

  //addEventListener so it can click?
  clone.querySelector("#profile").onclick = () => {
    showStudentDetails(student);
  };

  function clickAddAsPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      checkPrefect(student);
      // student.prefect = true;
    }
    //update list!
    buildList();
  }

  function clickAddAsInqS() {
    if (student.inqS === true) {
      student.inqS = false;
    } else {
      student.inqS = true;
    }
    //update list!
    buildList();
  }

  // append clone to list
  document.querySelector(".table-body").appendChild(clone);
}

function checkPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects.filter((student) => student.house === selectedStudent.house).shift();

  //if there is another of the same type
  if (other !== undefined) {
    console.log(`there can only be one prefect of each gender`);
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log(`there can only be two prefects`);
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  console.log(`there are ${numberOfPrefects} prefects`);
  //just for testing
  makePrefect(selectedStudent);

  function removeOther(other) {
    //ask the user to ignore or remove 'other'
    document.querySelector("#remove-other").classList.remove("hide");
    document.querySelector("#remove-other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove-other #remove-other-button").addEventListener("click", clickRemoveOther);

    document.querySelector("#remove-other [data-field=other-prefect]").textContent = other.firstName;

    function closeDialog() {
      document.querySelector("#remove-other").classList.add("hide");
      document.querySelector("#remove-other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove-other #remove-other-button").removeEventListener("click", clickRemoveOther);
    }

    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removeAorB(prefectA, prefectB) {
    //ask the user to ignore or remove a or b
    document.querySelector("#remove-aorb").classList.remove("hide");
    document.querySelector("#remove-aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove-aorb #remove-a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove-aorb #remove-b").addEventListener("click", clickRemoveB);

    //Show names on the buttons
    document.querySelector("#remove-aorb [data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("#remove-aorb [data-field=prefectB]").textContent = prefectB.firstName;

    //if user ignore do nothing
    function closeDialog() {
      document.querySelector("#remove-aorb").classList.add("hide");
      document.querySelector("#remove-aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove-aorb #remove-a").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove-aorb #remove-b").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if remove a
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    // else if remove b
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

//SHOW DETAILS OF STUDENT = POPUP
function showStudentDetails(student) {
  // console.log("click");
  popup.style.display = "block";
  popup.querySelector(".student-firstname").textContent = `Firstname: ` + student.firstName;
  popup.querySelector(".student-middlename").textContent = `Middlename: ` + student.middleName;
  popup.querySelector(".student-lastname").textContent = `Lastname: ` + student.lastName;
  document.querySelector("#popup-profile").src = "./images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  document.querySelector("#popup-house").src = "./house/" + student.house.toLowerCase() + ".svg";
  // document.querySelector("#js-makeInqS").addEventListener("click", checkForSquad);

  //CLOSE POPUP
  document.querySelector("#close").addEventListener("click", () => (popup.style.display = "none"));
}

function checkForSquad(student) {
  console.log("checkSquad");
  // if(student.)
}
