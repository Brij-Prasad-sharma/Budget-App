//Lets code


// Budget controller for all the calculations
var BudgetController = function () {


    var Income =  function(obj) {
        this.id = obj.id,
        this.description = obj.description,
        this.value = obj.value
    }

    var Expense = function(obj) {
        this.id = obj.id,
        this.description = obj.description,
        this.value = obj.value,
        this.percentage = obj.percentage;
    }

    Expense.prototype.calculatePercentage = function(income, expense, total) {
        if (income > expense) {
            this.percentage = Math.round((this.value / total) * 100);
        } else {
            this.percentage = -1;
        }
    }

    
    // Storing all the income and expense in data variables
    var data = {
        allItems: {
            income: [],
            expense: []
        },
        total: {
            totalBudget: 0,
            income: 0,
            expense: 0,
            percentage: -1
        }
    }


    // Returning the object to the global scope
    return {

       addItems: function(input) {
            var newItem, id, type, description, value;

            type = input.type;
            description = input.description;
            value = input.value;

            id = data.allItems[type][data.allItems[type].length] > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1: 0;


            if (input.type === 'income') {

                newItem = new Income({id, description, value});

            } else if (type === 'expense') {

                newItem = new Expense({id, description, value});

            }

            data.allItems[type].push(newItem); 
            
            
            return newItem;

       },

       calculateBudget: function() {
            var incomeTotal, expenseTotal;

            incomeTotal = 0;
            expenseTotal = 0;
            
            data.allItems.income.forEach(function (current, index, array) {
                incomeTotal += current.value;
            });

            data.allItems.expense.forEach(function (current, index, array) {
                expenseTotal += current.value;
            });

            data.total.totalBudget = incomeTotal - expenseTotal;
            data.total.income = incomeTotal;
            data.total.expense = expenseTotal;
            if (data.total.income > data.total.expense ) {
                data.total.percentage = Math.round((expenseTotal / incomeTotal) * 100);
            } else {
                data.total.percentage = -1;
            }
    
            
            return {
                totalIncome: data.total.income ,
                totalExpense: data.total.expense ,
                totalBudget: data.total.totalBudget,
                percentage: data.total.percentage 
            }
       },

       deleteItem: function(event) {
            var filedId,id,type;

            filedId = event.split('-');
            id = filedId[1];
            type = filedId[0];

            data.allItems[type].splice(id, 1);
        },

        calculatePer: function() {
            data.allItems.expense.forEach(function(current, index, array) {
                current.calculatePercentage(data.total.income, data.total.expense, data.total.income);
            });

        },

        getPercentage: function() {
            var allPer;

            allPer = data.allItems.expense.map(function(current) {
                if (current.percentage !== -1) {
                    return current.percentage;
                } else {
                    return 0;
                }
            });

            return allPer;
        
        },
    }
}();



// UI controller for interacting with DOM
var UIController = function() {

    //variables for storing all the selectors name
    var documentSelectors = {
        totalBudget: '.center-div-budget',
        totalIncome: '.total-income',
        totalExpense: '.total-expense',
        totalExpensePercetage: '.total-expense-percentage',
        inputType: '.input-type',
        inputDescription: '.description',
        inputValue: '.value',
        inputButton: '.input-button',
        incomeList: '.income-list',
        expenseList: '.expense-list',
        expensePercentage: '.expense-percentage',
        container: '.container'
    }


    return {
        DomSelectors: documentSelectors,

        getInputData: function() {

            var type, description, value;
    
            type = document.querySelector(documentSelectors.inputType).value;
            description= document.querySelector(documentSelectors.inputDescription).value;
            value = parseFloat(document.querySelector(documentSelectors.inputValue).value);
    
            return {
                type: type,
                description: description,
                value: value
            }
        },

        displayData: function(input, type) {
            var html;

            if (type === 'income') {

                html = `<div class="income-item blue-color" id="income-${input.id}">
                            <div class="income-item-left">
                                <span class="income-description">${input.description}</span>
                                <span class="income-value">${input.value}</span>
                            </div>
                            <div class="income-item-right">
                                <button class="income-close-btn blue-color"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>`;
            document.querySelector(documentSelectors.incomeList).insertAdjacentHTML('beforeend', html);

            } else if (type === 'expense') {

                html = `<div class="expense-item red-color" id="expense-${input.id}">
                            <div class="expense-item-left">
                                <div class="expense-description">${input.description}</div>
                                <span class="expense-value">${input.value}</span>
                                <span class="expense-percentage">${input.percentage}</span>
                            </div>
                            <div class="expense-item-right">
                                <button class="expense-close-btn red-color"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div> `;
            
            document.querySelector(documentSelectors.expenseList).insertAdjacentHTML('beforeend', html);
    
            }

        },

        displayBudget: function(budget) {
            document.querySelector(documentSelectors.totalBudget).textContent = budget.totalBudget;
            document.querySelector(documentSelectors.totalIncome).textContent = budget.totalIncome;
            document.querySelector(documentSelectors.totalExpense).textContent = budget.totalExpense;
            document.querySelector(documentSelectors.totalExpensePercetage).textContent = (budget.percentage) > 0 ? budget.percentage  + '%' : '--';
        },

        updateUI: function () {
            document.querySelector(documentSelectors.inputType).classList.toggle('red');
            document.querySelector(documentSelectors.inputDescription).classList.toggle('red');
            document.querySelector(documentSelectors.inputValue).classList.toggle('red');
            document.querySelector(documentSelectors.inputButton).firstChild.classList.toggle('red-color');
        },

       removingItem: function(filedId) {
           var el;

           el = document.querySelector('#'+filedId);

           el.remove(el);
       },

       updatingPercentage: function(per) {
           var filedsArr;

           filedsArr = document.querySelectorAll(documentSelectors.expensePercentage);   
           
           for(var i= 0; i < per.length; i++) {
               if (per[i] > 0) {
                    filedsArr[i].textContent = per[i] + '%';
               } else {
                    filedsArr[i].textContent = '--';
               }
           }
       },

        clearFields: function() {
            var fields, filedsArray;
            
            fields = document.querySelectorAll(documentSelectors.inputDescription + ',' + documentSelectors.inputValue);

            filedsArray = Array.prototype.slice.call(fields);

            filedsArray.forEach(function (current, index, array) {
                current.value = '';
            });
        }
    }
}();




// Main controller for other task
var Controller = function(BudgetCtrl, UICtrl) {

    var documentSelectors = UICtrl.DomSelectors;


    var updaingBudget = function() {
        var budget;
        //1. Calculate the Budget
        budget = BudgetCtrl.calculateBudget();


        //2. Display the budget in UI
        UICtrl.displayBudget(budget);
    };


    var updatingPercentage = function() {
        var percentage;
        //1. calculate budget in every item
        BudgetCtrl.calculatePer();

        //2. get percentage 
        percentage = BudgetCtrl.getPercentage();

        //3. Update percentage in UI
        UICtrl.updatingPercentage(percentage);

    }


    var addingItem = function(input) {
        var input, addedData;

        // 1. get the data from input fields
        input = UICtrl.getInputData();

        // 2. Validating the inputs
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 3. Adding the items    
            addedData = BudgetCtrl.addItems(input);

            // 4. Clearing the fileds
            UICtrl.clearFields();


            //5. Calculate and display the Budget
            updaingBudget();


            //6. Display the data in UI
            UICtrl.displayData(addedData, input.type);


            // 7. Updating percentage on every expense
            updatingPercentage();

        }
    }

    //setting up the event listeners
    var settingListeners = function() {

        document.querySelector(documentSelectors.inputButton).addEventListener('click', function() {
               
            // 1 . adding the item
            addingItem();
            
        });

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13) {
                addingItem();
            }

        });  

        document.querySelector(documentSelectors.inputType).addEventListener('change', function() {

            // 1. calling the UI update method
            UICtrl.updateUI();

        });

        document.querySelector(documentSelectors.container).addEventListener('click', function(event) {
            var fieldId;
            // 1. calling the delete Method

            fieldId = event.target.parentNode.parentNode.parentNode.id;

            if(fieldId) {
                //1. Delteing the item
                BudgetCtrl.deleteItem(fieldId);

                // 2. Updating the budget
                updaingBudget();
                

                //3. removing the item from UI
                UICtrl.removingItem(fieldId);


                //4. UpdatePercentage in every expense
                updatingPercentage();
            }

        });

    }


    return {
        init: function() {
            console.log('Application has started');
            settingListeners();
            UICtrl.displayBudget({
                totalIncome: 0,
                totalExpense: 0,
                totalBudget: 0,
                percentage: -1 
            });
        }
    }

}(BudgetController, UIController);

// calling the controller init function for initialization
Controller.init();