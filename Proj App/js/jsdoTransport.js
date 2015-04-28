var JSDOTransport = kendo.Class.extend({
   
    init: function (serviceURI, catalogURI, resourceName, username, password) {
        
        if (typeof this.session == "undefined" || this.session === null) {
    
            this.session = this._createSession(serviceURI, catalogURI, username, password);
        }
        else {
            this.session = this.loginSession(serviceURI, catalogURI, username, password);
        }
        
        if (typeof this.jsdo == "undefined" || this.jsdo === null) {
            this.jsdo = new progress.data.JSDO({ name: resourceName });
        }
        
        
        this.filter = '';
        
        this.transport = {
            read: $.proxy(this._read, this),
            create: $.proxy(this._create, this),            
            update: $.proxy(this._update, this),
            destroy: $.proxy(this._destroy, this)
        }
    },
    
    _createSession: function (serviceURI, catalogURI, username, password) {
                
        this.session = new progress.data.Session();
        this.session.authenticationModel = progress.data.Session.AUTH_TYPE_FORM;
        
        return this.loginSession(serviceURI, catalogURI, username, password);        
        
    },
    
    loginSession: function (serviceURI, catalogURI, username, password) {
        
            
            this.session.login(serviceURI, username, password, "/static/auth/login.html");
            if (this.session.loginResult === progress.data.Session.LOGIN_SUCCESS) {
                console.log('LOGIN SUCCESS');
                this.session.addCatalog(catalogURI);
            
                return this.session;
            }
            else
            {
                console.log('LOGIN ERROR');
                return null;
            }
    },
    
    logoutSession: function () {
        if (typeof this.session == "undefined" || this.session === null) {    
            
        }
        else {
                this.session.logout();
        }
    },
    
    
    _read: function (options) {
        var jsdo = this.jsdo;
        var filter = this.filter;
        
        jsdo.subscribe("AfterFill", function callback(jsdo, success, request) {
                           jsdo.unsubscribe("AfterFill", callback, jsdo);
                           if (success)
                               options.success(jsdo.getData());
                           else
                               options.error(request.xhr, request.xhr.status, request.exception);
                       }, jsdo);
        jsdo.fill(filter);
    },
    
    _create: function (options) {
        var jsdo = this.jsdo;
        var jsrecord = jsdo.add(options.data);
        
        jsdo.subscribe("AfterSaveChanges", function callback(jsdo, success, request) {
                           jsdo.unsubscribe("AfterSaveChanges", callback, jsdo);
                           var data;
                           if (success) {
                               if (request.batch && request.batch.operations instanceof Array && request.batch.operations.length == 1) {
                                   data = request.batch.operations[0].jsrecord.data;
                               }
                               options.success(data);
                           }
                           else
                               options.error(request.xhr, request.xhr.status, request.exception);
                       }, jsdo);
        jsdo.saveChanges();        
    },
    
    _update: function (options) {
        var jsdo = this.jsdo;
        var jsrecord = jsdo.findById(options.data._id);
        
        try {
            jsdo.assign(options.data);
        } catch (e) {
            options.error(null, null, e);
        }
        
        jsdo.subscribe("AfterSaveChanges", function callback(jsdo, success, request) {
                           jsdo.unsubscribe("AfterSaveChange", callback, jsdo);
                           var data;
                           if (success) {
                               if (request.batch && request.batch.operations instanceof Array && request.batch.operations.length == 1) {
                                   data = request.batch.operations[0].jsrecord.data;
                               }
                               options.success(data);
                           }
                           else
                               options.error(request.xhr, request.xhr.status, request.exception);
                       }, jsdo);
        jsdo.saveChanges();
    },
    
    _destroy: function (options) {
        var jsdo = this.jsdo;
        var jsrecord = jsdo.findById(options.data._id);
        
        try {
            jsdo.remove();
        } catch (e) {
            options.error(null, null, e);
        }
        
        jsdo.subscribe("AfterSaveChanges", function callback(jsdo, success, request) {
                           jsdo.unsubscribe("AfterSaveChange", callback, jsdo);
                           var data;
                           if (success) {
                               options.success([]);
                           }
                           else
                               options.error(request.xhr, request.xhr.status, request.exception);
                       }, jsdo);
        jsdo.saveChanges();
        
    }
    
});