var budgetcontroller = (function()
{
   var Expense= function(id,description,value)
   {
     this.id=id;
     this.description=description;
     this.value=value;
     this.percentage=-1;  
   };
   Expense.prototype.calcpercentage=function(totalincome)
   {
       if(totalincome>0)
       {
        this.percentage=Math.round((this.value/totalincome)*100);
       }
       else
       {
           this.percentage=-1;
       }
       
   };
   Expense.prototype.getpercentage=function()
   {
    return this.percentage;
   };

   var Income = function(id,description,value)
   {
     this.id=id;
     this.description=description;
     this.value=value;  
   };
   var calculatetotal=function(type)
   {
       var sum=0;
       data.allitems[type].forEach(function(cur)
       {
           sum=sum+cur.value;

       });
       data.totals[type]=sum;

   };
   var data={
       allitems:{
           exp:[],
           inc:[]
       },
       totals:{
           exp: 0,
           inc: 0
       },
       budget:0,
       percentage:-1
   };
   return{
       additem:function(type, des,val)
       {
           var newitem,ID;
           if(data.allitems[type].length>0)
           {
            ID=data.allitems[type][data.allitems[type].length-1].id+1;
           }
           else
           {
               ID=0;
           }
           
           if(type==='exp')
           {
               newitem= new Expense(ID,des,val);

           }
           else if(type==='inc')
           {
            newitem= new Income(ID,des,val);
           }
           data.allitems[type].push(newitem);
           return newitem;
       },
       deleteitem: function(type,id)
       {
           var ids,index;
           ids=data.allitems[type].map(function(current)
           {
               return current.id;

           });
           index=ids.indexOf(id);
           if(index !== -1)
           {
                data.allitems[type].splice(index,1);
           }



       },
       calculatebudget:function()
       {
        calculatetotal('exp');
        calculatetotal('inc');
        data.budget=data.totals.inc-data.totals.exp;
        if(data.totals.inc>0)
        {
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }
        else
        {
            data.percentage= -1;
        }
     

       },
       calculatepercentages:function()
       {
        data.allitems.exp.forEach(function(cur)
        {
            cur.calcpercentage(data.totals.inc);
        });
    },
        getpercentages:function()
        {
            var allperc=data.allitems.exp.map(function(cur)
            {
                return cur.getpercentage();
            });
            return allperc;
        },

       
       getbudget:function()
       {
           return{
               budget:data.budget,
               totalinc:data.totals.inc,
               totalexp:data.totals.exp,
               percentage:data.percentage

           }


       },
       testing: function()
       {
           console.log(data);
       }
   };
})();





var uicontroller = (function()
{
    var dom={
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',
        budgetlabel:'.budget__value',
        incomelabel:'.budget__income--value',
        expanselabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container',
        expensesperclabel:'.item__percentage',
        datelabel:'.budget__title--month',
        inputbtn:'.add__btn'

    };
    var formatnumber=function(num,type)
    {
        var numsplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);
        numsplit=num.split('.');
        int=numsplit[0];
        if(int.length>3)
        {
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        dec=numsplit[1];
        return (type=== 'exp'? '-' :'+')+' '+int+'.'+dec;

    };
    var nodelistforeach=function(list,callback)
    {
        for(var i=0;i<list.length;i++)
        {
            callback(list[i],i);
        }

    };
    return{
        getinput:function()
        {
            return{
                type:document.querySelector(dom.type).value,
                description:document.querySelector(dom.description).value,
                value: parseFloat(document.querySelector(dom.value).value)


            };
        },
        addlistitem: function(obj, type)
        {
            var html,newhtml,element;
            if(type==='inc')
            {
                element=dom.incomecontainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp')
            {
                element=dom.expensecontainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newhtml= html.replace('%id%', obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatnumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },
        deletelistitem:function(selectorid)
        {
            document.getElementById(selectorid).parentNode.removeChild(document.getElementById(selectorid));

        },
        clearfields: function()
        {
            var fields,fieldsarr;
             fields=document.querySelectorAll(dom.description+ ','+ dom.value);
             fieldsarr=Array.prototype.slice.call(fields);
             fieldsarr.forEach(function(c,i,a)
             {
                 c.value="";

             });
             fieldsarr[0].focus();
        },
        displaybudget: function(obj)
        {   
            var type;
            obj.budget>0? type='inc':type='exp';
            document.querySelector(dom.budgetlabel).textContent=formatnumber(obj.budget,type);
            document.querySelector(dom.incomelabel).textContent=formatnumber(obj.totalinc,'inc');
            document.querySelector(dom.expanselabel).textContent=formatnumber(obj.totalexp,'exp');
            if(obj.percentage>0)
            {
                document.querySelector(dom.percentagelabel).textContent=obj.percentage+'%';
            }
            else
            {
                document.querySelector(dom.percentagelabel).textContent='---';
            }
           
        },
        displaypercentages:function(percentages)
        {
            var fields=document.querySelectorAll(dom.expensesperclabel);
           
            nodelistforeach(fields,function(current,index)
            {
                if(percentages[index]>0)
                {
                    current.textContent=percentages[index]+'%';
                }
                else
                {
                    current.textContent='---';
                }
                

            });

        },
        displaymonth:function()
        {
            var now,year,month,months;
            var now=new Date();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(dom.datelabel).textContent=months[month]+' '+year;
        },
        changetype:function()
        {
            var fields=document.querySelectorAll(dom.type+','+dom.description+','+dom.value);
            nodelistforeach(fields,function(cur)
            {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(dom.inputbtn).classList.toggle('red');
        },
      
        getdom:function()
        {
            return dom;
        }
    };


})();




var appcontroller = (function(budgetctrl,uictrl)
{
    var setupeventlisteners= function()
    {
        var d=uictrl.getdom();
        
    document.querySelector('.add__btn').addEventListener('click', function()
    {
        additem();
       

    });
    document.addEventListener('keypress',function(event)
    {
        if(event.keyCode===13 || event.which===13 )
        {
            additem();
           
        }
    });
    document.querySelector(d.container).addEventListener('click', ctrldeleteitem)
    document.querySelector(d.type).addEventListener('change', uictrl.changetype);
    };
    var updatebudget=function()
    {
        budgetctrl.calculatebudget();
        var budget= budgetctrl.getbudget();
       uictrl.displaybudget(budget);

    };
    var updatepercentages=function()
    {
        budgetctrl.calculatepercentages();
        var percentages= budgetctrl.getpercentages();
        uictrl.displaypercentages(percentages);

    };
    var additem=function()
    {
        var input,newitem;
        input= uictrl.getinput();
        if(input.description!=="" && !isNaN(input.value) && input.value>0)
        {
            newitem=budgetctrl.additem(input.type,input.description,input.value);
            uictrl.addlistitem(newitem, input.type);
            uictrl.clearfields();
            updatebudget();
            updatepercentages();
        }
    };
    var ctrldeleteitem=function(event)
    {
        var itemid,splitid,type,id;
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid)
        {
            splitid=itemid.split('-');
            type=splitid[0];
            id=parseInt(splitid[1]);
            budgetctrl.deleteitem(type,id);
            uictrl.deletelistitem(itemid);
            updatebudget();
            updatepercentages();


            
        }
    };
    return{
        init: function()
        {
            uictrl.displaymonth();
            uictrl.displaybudget({
                budget:0,
                totalinc:0,
                totalexp:0,
                percentage:-1
 

            });
            setupeventlisteners();
        }
    }



})(budgetcontroller,uicontroller);
 
appcontroller.init();