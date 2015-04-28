/*
globals $, _, pt.alerts.alert, pt*/

( function ( pt ) {

    "use strict";

    pt.formgenerator = {

        //Form properties (defaults)
        element: "#form-container",
        title: "Complete the form below",
        actionUrl: "http://httpbin.org/post",
        actionMethod: "post",
        submitButtonText: "Submit Form",

        //Form objects
        form: null,
        formEl: null,
        formName: null,
        schema: {},
        fields: {},
        options: {},

        //Main method to generate the form, use data fields from the json object
        generate: function ( dataFields ) {

            this.parseDataFields( dataFields );

            this.setOptions();

            this.render();

        },
        //Parse data fields to create the schema and fields
        parseDataFields: function ( dataFields ) {
            var me = this;

            if ( !dataFields ) {
                return;
            }

            //Reset schema and fields
            me.schema = me.fields = {};

            //Init with default properties
            me.schema.title = me.title;
            me.schema.type = "object";
            me.schema.properties = {};

            _.each( dataFields, function ( dataField ) {

                me.fields[dataField.id] = me.parseMetaField( dataField );
                me.schema.properties[dataField.id] = me.parseSchemaForField( dataField );

            } );

        },
        parseMetaField: function ( dataField ) {

            var metaField = {};
            metaField.placeholder = dataField.label;

            switch ( dataField.type ) {
                case "integer":
                    metaField.type = "integer";
                    break;
                case "decimal":
                    metaField.type = "number";
                    break;
                case "string":
                    metaField.type = "text";
                    break;
                case "date":
                    metaField.type = "date";
                    break;
                case "logical":
                    metaField.type = "checkbox";
                    metaField.label = dataField.label;
                    break;
                case "select list":
                    metaField.type = "select";
                    metaField.label = dataField.label;
                    if ( metaField.req ) {
                        metaField.removeDefaultNone = metaField.req;
                    }
                    break;
                default:
                    metaField.type = "text";

            }

            return metaField;

        },
        parseSchemaForField: function ( dataField ) {

            var fieldSchema = {};

            if ( fieldSchema.req ) {
                fieldSchema.required = dataField.req;
            }


            switch ( dataField.type ) {
                case "integer":
                    fieldSchema.type = "integer";
                    break;
                case "decimal":
                    fieldSchema.type = "number";
                    break;
                case "string":
                    fieldSchema.type = "string";
                    break;
                case "date":
                    fieldSchema.type = "date";
                    break;
                case "boolean":
                    fieldSchema.type = "boolean";
                    break;
                case "select list":
                    fieldSchema.type = "string";

                    if ( dataField.opt ) {
                        fieldSchema.enum = dataField.opt;
                    }

                default:
                    fieldSchema.type = "string";

            }

            return fieldSchema;

        },
        setOptions: function () {
            var me = this;

            me.options = {
                "form": {
                    "attributes": {
                        "action": me.actionUrl,
                        "method": me.actionMethod
                    },
                    "buttons": {
                        "submit": {
                            "title": me.submitButtonText,
                            "click": function () {
                                me.submitButtonClick( this );
                            }
                        }
                    }
                },
                "fields": me.fields
            };
        },
        render: function () {
            var me = this;

            if ( me.form ) {
                //TODO: use destory on alpaca form
            me.formEl.empty();
            }

            //Render the form in the container
            me.formEl = $( me.element ).alpaca( {
                "schema": me.schema,
                "options": me.options,
                "view": {
                    "parent": "web-create",
                    "templates": {
                        "container": "#containerTemplate",
                        "container-object": "#containerObjectTemplate",
                        "control": "#controlTemplate"
                    }
                },
                "postRender": function ( control ) {
                    me.form = control;

                    //Override the UI elements
                    me.overrideElements();

                }
            } );


        },
        overrideElements: function () {

            //Set submit button as a kendo button
            $( "button", this.element ).kendoMobileButton();
            $( "input[type='checkbox']", this.element ).kendoMobileSwitch();
            $( "select", this.element ).kendoDropDownList();
        },
        parseFormData: function ( data ) {
            var result = [],
                valKeys = _.keys( data );

            _.forEach( valKeys, function ( field, i ) {

                var item = {};
                item.fieldid = field;
                item.fieldvalue = data[field];

                result[i] = item;
            } );

            return result;
        },
        resetForm: function () {
            $( "form", this.element )[0].reset();

            $( "input[type='checkbox']", this.element ).each( function ( index ) {
                $( this ).data( "kendoMobileSwitch" ).refresh();
            } );

            //Set focus on the first element
            var firstEl = $( "form :input:text:visible:not(input[class*=filter]):first", this.element );
            if ( firstEl.length > 0 ) {
                this.focus( firstEl );
            }

        },
        /**
         * This is a hack to make text input focus work in Android/PhoneGap
         * where calling el.focus() doesn't actually have the blinking cursor
         * effect.
         * @param {Zepto} $el A zepto element.
         */
        focus: function ( $el ) {
            var el = $el.get( 0 );
            el.focus();
            el.setSelectionRange && el.setSelectionRange( 0, 0 );

        },
        submitButtonClick: function ( sender ) {
            var me = this,
                val = sender.getValue();

            var jsonData = {
                app: me.formName,
                data: me.parseFormData( val )
            };

            if ( sender.isValid( true ) ) {

                //Show loading
                pt.alerts.showLoading();

                //Submit the form entries to the datastore 
                pt.datastore.submitForm( jsonData ).then( function () {
                    pt.alerts.hideLoading();
                    pt.alerts.alert( pt.config.messages.submitFormTitle, pt.config.messages.submitFormSuccess );
                    me.resetForm();
                } ).catch( function ( error ) {
                    pt.alerts.hideLoading();
                    pt.alerts.alert( pt.config.messages.submitFormTitle, pt.config.messages.submitFormError );
                } );

            } else {
                pt.alerts.alert( pt.config.messages.submitFormTitle, pt.config.messages.submitFormError );

            }
        }
    };

}( pt ) );