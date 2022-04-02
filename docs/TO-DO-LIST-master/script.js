// TASK CONTROLLER
var taskController = (function () {
  var Unchecked = function (id, description, time, value) {
    this.id = id;
    this.description = description;
    this.time = time;
    this.value = 1;
    this.percentage = -1;
  };

  var Checked = function (id, description, time, value) {
    this.id = id;
    this.description = description;
    this.time = time;
    this.value = 1;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    task: 0,
  };

  return {
    addItem: function (type, des, time) {
      var newItem;
      // ID = last ID + 1

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on inc or exp type
      if (type === "exp") {
        newItem = new Unchecked(ID, des, time);
      } else if (type === "inc") {
        newItem = new Checked(ID, des, time);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateTasks: function () {
      // calculate total checked and unchecked
      calculateTotal("exp");
      calculateTotal("inc");

      // Calculate the task: checked - unchecked
      data.task = data.totals.exp + data.totals.inc;
    },

    AddToChecked: function (type, id) {
      var i, obj;
      i = 0;
      var match = data.allItems[type];
      while (i < match.length) {
        if (match[i].id === id) obj = match[i];
        i++;
      }

      desc = obj.description;
      time = obj.time;
      return this.addItem("inc", desc, time);
    },

    getTasks: function () {
      return {
        task: data.task,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    getData: function () {
      return data.allItems;
    },
    restoreData: function () {
      storage = JSON.parse(localStorage.getItem("tasks"));
      if (storage) {
        return (data.allItems = storage);
      }
    },
    sendData: function () {
      var match;
      match = data.allItems;

      return match;
    },
    testing: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    checkedContainer: ".checked__list",
    uncheckedContainer: ".unchecked__list",
    taskLabel: ".task__value",
    checkedLabel: ".task__checked--value",
    uncheckedLabel: ".task__unchecked--value",
    percentageLabel: ".task__unchecked--percentage",
    container: ".container",
    uncheckedPercLabel: ".item__percentage",
    dateLabel: ".task__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      var time = new Date().toISOString().slice(0, 10);
      return {
        type: "exp", // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        time: time,

        // value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
      console.log(description);
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create HtML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.checkedContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%time%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times-circle"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.uncheckedContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__delete"><button class="item__check--btn"><i class="fas fa-check-circle"></i></button></div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%time%</div> <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times-circle"></i></button></div></div></div>';
      }

      // Replace the place holder with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%time%", obj.time, type);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields;

      fields = document.querySelectorAll(DOMstrings.inputDescription);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    displayTasks: function (obj) {
      var type;
      obj.task > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.taskLabel).textContent = obj.task;
      document.querySelector(DOMstrings.checkedLabel).textContent =
        obj.totalInc;
      document.querySelector(DOMstrings.uncheckedLabel).textContent =
        obj.totalExp;
    },

    displayMonth: function () {
      var now, year, month;
      now = new Date();
      // var christmas = new Date(2016, 11, 25)
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },
    getDOMStrings: function () {
      return DOMstrings;
    },
  };
})();

// Main Controller
// GLOBAL APP CONTROLLER
var controller = (function (taskCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlAddToChecked);
  };

  var updateTasks = function () {
    //1. Calculate the task
    taskCtrl.calculateTasks();
    //2. Return the task
    var task = taskCtrl.getTasks();
    //3. Display the task on the UI
    UICtrl.displayTasks(task);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1. Get the filled input data
    input = UIController.getInput();

    if (input.description !== "") {
      //2. Add the item to the task controller
      newItem = taskCtrl.addItem(input.type, input.description, input.time);
      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();
      //5 . Calculate and update task
      updateTasks();
      persistTasks();
    } else {
      try {
        var val, input;
        match = taskCtrl.sendData();
        //2. loop through the data sent
        Object.keys(match).forEach((element) => {
          if (element) {
            // Determine if a task is present
            val = match[element];
            val.forEach((el) => {
              //3. Add the item to the UI
              UICtrl.addListItem(el, element);
              //5 . Calculate and update task
              updateTasks();
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete the itm from the data structure
      taskCtrl.deleteItem(type, ID);
      persistTasks();
      //2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3. Update and show the new task
      updateTasks();
    }
  };

  var ctrlAddToChecked = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // Move item in data structure
      checkedItem = taskCtrl.AddToChecked(type, ID);
      // Move Item in UI
      UICtrl.addListItem(checkedItem, "inc");

      //1. Delete the item from the data structure
      taskCtrl.deleteItem(type, ID);
      //2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3. Update and show the new task
      updateTasks();
      persistTasks();

      //4. Calculate and update percentages
      //  updatePercentages();
    }
  };
  function persistTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskCtrl.getData()));
  }
  function readStorage() {
    window.addEventListener("load", () => {
      taskCtrl.restoreData();
      ctrlAddItem();
      updateTasks();
    });
  }
  return {
    init: function () {
      console.log("Application has started.");
      setupEventListeners();
      UICtrl.displayMonth();
      // UICtrl.displayTasks({
      //   task: 0,
      //   totalInc: 0,
      //   totalExp: 0,
      //   percentage: -1,
      // });
      readStorage();
    },
  };
})(taskController, UIController);

controller.init();
