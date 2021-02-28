"use strict";
window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
let expelledStudents = [];
let student;
let filterBy = "all";
let sortBy = "event";
let bloodStatus;
let systemIsHacked = false;

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
  document.querySelector("#search").addEventListener("keyup", function () {
    searchList();
  });
  // readSortingValues();
}

//Update numbers
function updateNumbers() {
  document.querySelector("[data-field=numberGryffindor]").textContent = allStudents.filter((student) => student.house === "Gryffindor").length;
  document.querySelector("[data-field=numberSlytherin]").textContent = allStudents.filter((student) => student.house === "Slytherin").length;
  document.querySelector("[data-field=numberHufflepuff]").textContent = allStudents.filter((student) => student.house === "Hufflepuff").length;
  document.querySelector("[data-field=numberRavenclaw]").textContent = allStudents.filter((student) => student.house === "Ravenclaw").length;
}

//Search input
//Source
function searchList(student) {
  const search = document.querySelector("#search");
  const list = allStudents.filter((student) => student.firstName.toLowerCase().includes(search.value.toLowerCase()) || student.lastName.toLowerCase().includes(search.value.toLowerCase()));
  displayList(list);
}

//LOAD JSON
async function loadJSON() {
  const studentJSON = "https://petlatkea.dk/2021/hogwarts/students.json";
  const bloodJSON = "https://petlatkea.dk/2021/hogwarts/families.json";

  const responseStudent = await fetch(studentJSON);
  const studentData = await responseStudent.json();

  const responseBlood = await fetch(bloodJSON);
  bloodStatus = await responseBlood.json();

  prepareStudentObjects(studentData);
}
//PREPARE STUDENT OBJECT + LETTERS
function prepareStudentObjects(jsonData) {
  jsonData.forEach((studentObject) => {
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
      bloodStatus: "",
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
    //image
    let indexhyphen = student.lastName.indexOf("-");
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";
    if (indexhyphen != -1) {
      const nameBeforeHyphen = student.lastName.substring(0, indexhyphen + 1);
      firstLetterAfterHyphen = student.lastName.substring(indexhyphen + 1, indexhyphen + 2).toUpperCase();
      smallLettersAfterHyphen = student.lastName.substring(indexhyphen + 2);
      student.lastName = nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
    }

    if (student.lastName != null) {
      if (indexhyphen == -1) {
        if (student.firstName == "Padma" || student.firstName == "Parvati") {
          student.photo = student.lastName.toLowerCase() + "_" + student.firstName.substring(0).toLowerCase() + ".png";
        } else {
          student.photo = student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
        }
      } else {
        student.photo = firstLetterAfterHyphen.toLocaleLowerCase() + smallLettersAfterHyphen + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
      }
    } else {
      student.photo = "./images/unknown.svg";
    }

    //house
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //BloodStatus
    student.bloodStatus = findBloodType(student);

    //Not able to remove first name

    //Combining array and adding (pushing) animal into it
    allStudents.push(student);
  });
  buildList();
}

//BloodStatus
function findBloodType(student) {
  // console.log(bloodStatus);
  // const bloodStatus = student.bloodStatus;
  if (bloodStatus.half.indexOf(student.lastName) != -1) {
    return "Half Blood";
  } else if (bloodStatus.pure.indexOf(student.lastName) != -1) {
    return "Pure Blood";
  } else {
    return "Muggle born";
  }
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
    filteredList = expelledStudents;
  } else if (filterBy === "non") {
    filteredList = filteredList.filter(isStudent);
  }

  //number of student after filter
  // document.querySelector("[data-field=current-students-on-list]").textContent = filteredList.length;
  document.querySelector("[data-field=current-students-on-list]").textContent = filteredList.length;
  document.querySelector("[data-field=currentStudents]").textContent = allStudents.length;
  document.querySelector("[data-field=expelledStudents]").textContent = expelledStudents.length;
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
  updateNumbers();
  // searching();
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
  clone.querySelector("#profile").src = "./images/" + student.photo;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // //PREFECT
  if (student.prefect === true) {
    // console.log("prefect true");
    clone.querySelector("[data-field=prefect]").classList.add("color");
    document.querySelector(".pop").classList.add("color");
  } else {
    clone.querySelector("[data-field=prefect]").classList.remove("color");

    // document.querySelector("#popup #prefectBtn").textContent = `Prefect ${student.nickName}`;
    // console.log("prefect false");
  }

  //click prefect
  clone.querySelector("[data-field=prefect]").onclick = () => {
    clickAddAsPrefect(student);
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
    clickAddAsInqS(student);
  };

  //addEventListener DETAILS

  clone.querySelector("#profile").onclick = () => {
    showStudentDetails(student);
  };

  //EXPELL CLICK
  clone.querySelector("[data-field=expell]").onclick = () => {
    expell(student);
  };

  function clickAddAsPrefect(student) {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      prefectToggle(student);
      // student.prefect = true;
    }
    //update list!
    buildList();
  }

  function clickAddAsInqS(student) {
    if (student.inqS === true) {
      student.inqS = false;
    } else {
      inqSToggle(student);
    }
    //update list!
    buildList();
  }
  // append clone to list
  document.querySelector(".table-body").appendChild(clone);
}

//Not able to filter but array works
function expell(student) {
  if (student.fullName != "Jean Wong") {
    //removes expelled student form allStudents list
    if (student.expelled === false) {
      allStudents.splice(allStudents.indexOf(student), 1);
      student.expelled = true;
      student.prefect = false;
      student.squad = false;
      expelledStudents.push(student);
      console.log("expell");
    } else {
      console.log("already expelled");
    }
  } else {
    console.log("fullname");
    hackedErrorBox();
    // alert(`Sorry bro! Can't expell ${student.firstname} "${student.nickname}" ${student.lastname}! 😝`);
  }

  buildList(expelledStudents);
}

function prefectToggle(student) {
  const prefectsArray = allStudents.filter((student) => {
    return student.prefect === true;
  });
  //See what gender vs. house is already in the prefectsArray and test it against the clicked student
  const prefectType = prefectsArray.some((prefect) => {
    return prefect.gender === student.gender && prefect.house === student.house;
  });
  if (student.prefect === true) {
    student.prefect = false;
  } else if (student.prefect === false) {
    if (prefectType) {
      prefectErrorBox(student);
      student.prefect = false;
    } else {
      student.prefect = true;
    }
  }
  buildList(allStudents);
}

function inqSToggle(student) {
  if (student.house == "Slytherin" || student.bloodStatus == "Pure Blood") {
    if (student.inqS === true) {
      student.inqS = false;
    } else {
      student.inqS = true;
    }
    buildList();
  } else {
    squadErrorBox();
  }
}

//ERROR POPUP
function prefectErrorBox(student) {
  console.log("error box");
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".prompttext").classList.remove("hide");
  document.querySelector(".squadtext").classList.add("hide");
  document.querySelector(".no").textContent = "No";
  document.querySelector(".remove").classList.remove("hide");

  //Show the right name in the dialogue box (the student that should be removed)
  allStudents.forEach((prefectStudent) => {
    if (prefectStudent.prefect == true && prefectStudent.gender == student.gender && prefectStudent.theHouse == student.theHouse) {
      document.querySelector(".removedStudent").textContent = prefectStudent.firstName;
      document.querySelector(".addedStudent").textContent = student.firstName;
    }
    //Eventlister -> remove student when click on remove and add the current student
    document.querySelector(".remove").addEventListener("click", function () {
      if (prefectStudent.gender == student.gender) {
        prefectStudent.prefect = false;
        student.prefect = true;
        buildList();
      }
      document.querySelector(".promptbox").classList.add("hide");
    });

    document.querySelector(".no").addEventListener("click", function () {
      document.querySelector(".promptbox").classList.add("hide");
    });
  });
}

//ERROR SQUAD
function squadErrorBox() {
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".no").textContent = "OK";
  document.querySelector(".remove").classList.add("hide");
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".prompttext").classList.add("hide");
  document.querySelector(".squadtext").classList.remove("hide");
  document.querySelector(".no").addEventListener("click", function () {
    document.querySelector(".promptbox").classList.add("hide");
  });
}

//SHOW DETAILS OF STUDENT = POPUP
function showStudentDetails(student) {
  // console.log("click");
  themeUpdate(student);

  popup.style.display = "block";
  popup.querySelector(".student-firstname").textContent = `Firstname: ` + student.firstName;
  popup.querySelector(".student-middlename").textContent = `Middlename: ` + student.middleName;
  popup.querySelector(".student-lastname").textContent = `Lastname: ` + student.lastName;
  popup.querySelector(".student-bloodstatus").textContent = `Blood Status: ` + student.bloodStatus;
  document.querySelector("#popup-profile").src = "./images/" + student.photo;
  document.querySelector("#popup-house").src = "./house/" + student.house.toLowerCase() + ".svg";
  //CLOSE POPUP // document.querySelector("#js-makeInqS").addEventListener("click", checkForSquad);
  document.querySelector("#close").addEventListener("click", () => (popup.style.display = "none"));
}
//ThemeUpdate not fully functional
function themeUpdate(student) {
  document.querySelector(".popup_article").classList.remove("gryffindor", "hufflepuff", "slytherin", "ravenclaw");
  if (student.house === "Gryffindor") {
    console.log("gryffindor");
    document.querySelector(".popup_article").classList.add("gryffindor");
    // console.log("themeupdate");
  } else if (student.house === "Slytherin") {
    console.log("slytherin");
    document.querySelector(".popup_article").classList.add("slytherin");
  } else if (student.house === "Hufflepuff") {
    console.log("hufflepuff");
    document.querySelector(".popup_article").classList.add("hufflepuff");
  } else if (student.house === "Ravenclaw") {
    console.log("ravenclaw");
    document.querySelector(".popup_article").classList.add("ravenclaw");
  }
}

// function checkForSquad(student) {
//   console.log("checkSquad");
//   // if(student.)
// }

//HACK THE SYSYTEM
function hackTheSystem() {
  console.log("hackTheSystem");
  systemIsHacked = true;
  // randomColor();
  youveBeenHacked();
  backgroundHacked();
  messWithBloodstatus();
  insertLisa();
  buildList(allStudents);
}
function backgroundHacked() {
  document.querySelector("body").classList.add("hackedColor");
}

//Error box for expelling hacker
function hackedErrorBox() {
  document.querySelector(".noBox").classList.remove("hide");
  document.querySelector(".hackButton").addEventListener("click", function () {
    document.querySelector(".noBox").classList.add("hide");
  });
}

//HACK CSS
function youveBeenHacked() {
  setTimeout(() => {
    document.querySelector(".hacked").textContent = "YOU'VE";
  }, 500);
  setTimeout(() => {
    document.querySelector(".hacked2").textContent = "BEEN";
  }, 1000);
  setTimeout(() => {
    document.querySelector(".hacked3").textContent = "HACKED";
  }, 1500);
}

//HACK MESS WITH BLOOD
function messWithBloodstatus() {
  allStudents.forEach((student) => {
    if (student.bloodStatus === "Muggle") {
      student.bloodStatus = "Pure Blood";
    } else if (student.bloodStatus === "Half Blood") {
      student.bloodStatus = "Pure Blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodStatus = "Muggle";
      } else if (bloodNumber === 1) {
        student.bloodStatus = "Half blood";
      } else {
        student.bloodStatus = "Pure blood";
      }
    }
  });
}

function insertLisa() {
  allStudents.splice(1, 0, {
    fullName: "Jean Wong",
    firstName: "Jean",
    middelName: "",
    nickName: "Ching Chong",
    lastName: "Wong",
    photo: "./images/unknown.svg",
    house: "Hufflepuff",
    prefect: false,
    inqS: false,
    expelled: false,
    gender: "girl",
  });
}
