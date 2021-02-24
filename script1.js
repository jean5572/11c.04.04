"use strict";

let allStudents = [];

const studentTemplate = {
  firstName: "-unknown-",
  lastName: "-unknown-",
  middleName: "-unknown-",
  nickName: "",
  photo: "",
  house: "",
};

function init() {
  console.log("DOM Loaded");
  loadJSON();
  //Filter, Sorting and search
  //   readFilterValues();
  //   readSortingValues();
  //   readSearchValues();
}

async function loadJSON() {
  const studentJSON = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(studentJSON);
  const studentData = await response.json();

  prepareStudentObjects(studentData);
}

function prepareStudentObjects(studentData) {
  allStudents = studentData.map(prepareStudentSingleObject);
  displayList(allStudents);
}

function prepareStudentSingleObject(studentObject) {
  const student = Object.create(studentTemplate);
  return student;
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  //Dummypicture "./images/" + name/house + ".png"
  //   clone.querySelector("#profile").src = "./images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  clone.querySelector("[data-field=house]").textContent = student.house;

  //addEventListener so it can click?
  clone.querySelector(".single-student").addEventListener("click", showStudentDetails);

  // append clone to list
  document.querySelector(".table-body").appendChild(clone);
}

function showStudentDetails() {
  console.log("showdetails");
}
