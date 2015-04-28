(function () {
    var serviceURI = "http://dldev.doclib.net:8980/dlmobileService",
        catalogURI = serviceURI + "/static/mobile/dlmobileService.json",
        resourceName = "dlwfi";
    
    var customer;
    var customerDataSource;
        
    function initialize() {
        var app = new kendo.mobile.Application(document.body, {
                                                   skin: "flat",
                                                   transition: "slide"
                                               });
                
        
        navigator.splashscreen.hide();
    }

    window.loginView = kendo.observable({
                                            submit: function() {
                                                if (!this.username) {
                                                    navigator.notification.alert("Username is required.");
                                                    return;
                                                }
                                                if (!this.password) {
                                                    navigator.notification.alert("Password is required.");
                                                    return;
                                                }
                                                
                                                if (typeof customer == "undefined" || customer === null) {
                                                    customer = new JSDOTransport(serviceURI, catalogURI, resourceName, this.username, this.password);
                                                }
                                                else
                                                {
                                                    customer.loginSession(serviceURI, catalogURI, this.username, this.password);
                                                }
                                                customer.filter = "CustNum > 2100";
                                                
                                                if (typeof customerDataSource == "undefined" || customerDataSource === null) {
                                                    customerDataSource = new kendo.data.DataSource({
                                                                                                       transport: customer.transport,
                                                                                                       schema: {
                                                                                                            model: {
                                                                                                                       id: '_id'
                                                                                                                   }
                                                                                                        },
                                                                                                       error: function (e) {
                                                                                                           console.log('Error: ', e);
                                                                                                       }
                                                                                                   });
                                                }
                                                
                                                $("#customer-list").kendoMobileListView({
                                                    dataSource: customerDataSource,
                                                    template: '<a>#: Name #</a>',
                                                    click: function(e) {
                                                        console.log(e.dataItem);
                                                        window.editView.set("customer", e.dataItem.Name);
                                                        window.editView.set("id", e.dataItem.id);
                                                        $("#edit").data("kendoMobileModalView").open();
                                                    }
                                                });
                                                
            
                                                window.location.href = "#list";
                                                
                                                //customerDataSource.read();
                                            }
                                        });
    
    window.registerView = kendo.observable({
                                               submit: function() {
                                                   if (!this.username) {
                                                       navigator.notification.alert("Username is required.");
                                                       return;
                                                   }   
                                                   if (!this.password) {
                                                       navigator.notification.alert("Password is required.");
                                                       return;
                                                   }
                                                   el.Users.register(this.username, this.password, { Email: this.email },
                                                                     function() {
                                                                         navigator.notification.alert("Your account was successfully created.");
                                                                         window.location.href = "#login";
                                                                     },
                                                                     function() {
                                                                         navigator.notification.alert("Unfortunately we were unable to create your account.");
                                                                     }
                                                       );
                                               }        
                                           });
    
    window.passwordView = kendo.observable({
                                               submit: function() {
                                                   if (!this.email) {
                                                       navigator.notification.alert("Email address is required.");
                                                       return;
                                                   }
                                                   $.ajax({
                                                              type: "POST",
                                                              url: "https://api.everlive.com/v1/" + apiKey + "/Users/resetpassword",
                                                              contentType: "application/json",
                                                              data: JSON.stringify({ Email: this.email }),
                                                              success: function() {
                                                                  navigator.notification.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                                                                  window.location.href = "#login";
                                                              },
                                                              error: function() {
                                                                  navigator.notification.alert("Unfortunately an error occurred resetting your password.");
                                                              }
                                                          });
                                               }
                                           });
        
    window.listView = kendo.observable({
                                           logout: function(event) {
                                               /*
                                               event.preventDefault();
                                               */
                                               try {
                                               customer.logoutSession();
                                                   }
                                               catch (e) {
                                                   console.log("Error: ", e);
                                               }
                                               
                                               
                                               window.loginView.set("username", "");
                                               window.loginView.set("password", "");
                                               var listView = $("#customer-list").data("kendoMobileListView");
                                               listView.destroy();
                                               
                                               
                                               window.location.href = "#login";
                                               
                                           } 
                                       });
    
    window.addView = kendo.observable({
                                          add: function () {
                                              if (!this.customer) {
                                                  navigator.notification.alert("Please provide a customer.");
                                                  return;
                                              }

                                              customerDataSource.add({
                                                                         Name: this.customer
                                                                     });
                                              customerDataSource.one("sync", this.close);
                                              customerDataSource.sync();
                                          },
                                          close: function () {
                                              $("#add").data("kendoMobileModalView").close();
                                              this.customer = "";
                                          }
                                      });

    window.editView = kendo.observable({
                                           getBalance: function () {
                                               var customerRec = customerDataSource.get(this.id);
            
                                               var customerJSDO = customer.jsdo;
                                               customerJSDO.subscribe('afterInvoke', 'GetCustomerBalance', function (jsdo , success , request) {
                                                   var res = request.response;
                                                   if (success) {
                                                       var creditLimit = res._retVal;
                                                       var eTableObj = res.dsCustomer.dsCustomer.ttCustomer;
                                                       this.customer = eTableObj.Balance;
                                                   } else {
                                                       if (res && res._errors && res._errors.length > 0) {
                                                           var lenErrors = res._errors.length;
                                                           for (var idxError = 0; idxError < lenErrors; idxError++) {
                                                               var errorEntry = res._errors[idxError];
                                                               var errorMsg = errorEntry._errorMsg;
                                                               var errorNum = errorEntry._errorNum;
                                                           }
                                                       }
                                                   }
                                               });  

                                               customerJSDO.GetCustomerBalance({ piCustNum : customerRec.CustNum });
                                           },
                                           save: function () {
                                               if (!this.customer) {
                                                   navigator.notification.alert("Please provide a customer.");
                                                   return;
                                               }

                                               var customerRec = customerDataSource.get(this.id);
                                               customerRec.set("Name", this.customer);
                                               customerDataSource.one("sync", this.close);
                                               customerDataSource.sync();
                                           },
                                           delete: function () {
                                               if (!this.customer) {
                                                   navigator.notification.alert("Please provide a customer.");
                                                   return;
                                               }

                                               var customerRec = customerDataSource.get(this.id);
                                               customerDataSource.remove(customerRec);
                                               customerDataSource.one("sync", this.close);
                                               customerDataSource.sync();
                                           },

                                           close: function () {
                                               $("#edit").data("kendoMobileModalView").close();
                                               this.customer = "";
                                           }
                                       });

    document.addEventListener("deviceready", initialize);
}());