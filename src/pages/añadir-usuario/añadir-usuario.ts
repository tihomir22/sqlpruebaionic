import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-añadir-usuario',
  templateUrl: 'añadir-usuario.html'
})
export class AñadirUsuarioPage {



   /**
    * @name form
    * @type {FormGroup}
    * @public
    * @description     Define FormGroup property for managing form validation / data retrieval
    */
   public form                   : FormGroup;




   /**
    * @name technologyName
    * @type {Any}
    * @public
    * @description     Model for managing technologyName field
    */
   public technologyName         : any;




   /**
    * @name technologyDescription
    * @type {Any}
    * @public
    * @description     Model for managing technologyDescription field
    */
   public technologyDescription  : any;




   /**
    * @name isEdited
    * @type {Boolean}
    * @public
    * @description     Flag to be used for checking whether we are adding/editing an entry
    */
   public isEdited               : boolean = false;




   /**
    * @name hideForm
    * @type {Boolean}
    * @public
    * @description     Flag to hide the form upon successful completion of remote operation
    */
   public hideForm               : boolean = false;




   /**
    * @name pageTitle
    * @type {String}
    * @public
    * @description     Property to help set the page title
    */
   public pageTitle              : string;




   /**
    * @name recordID
    * @type {String}
    * @public
    * @description     Property to store the recordID for when an existing entry is being edited
    */
   public recordID               : any      = null;




   /**
    * @name baseURI
    * @type {String}
    * @public
    * @description     Remote URI for retrieving data from and sending data to
    */
   private baseURI               : string  = "http://dembow.gearhostpreview.com/";




   // Initialise module classes
   constructor(public navCtrl    : NavController,
               public http       : HttpClient,
               public NP         : NavParams,
               public fb         : FormBuilder,
               public toastCtrl  : ToastController)
   {

      // Create form builder validation rules
      this.form = fb.group({
         "name"                  : ["", Validators.required],
         "description"           : ["", Validators.required]
      });
   }




   /**
    * Triggered when template view is about to be entered
    * Determine whether we adding or editing a record
    * based on any supplied navigation parameters
    *
    * @public
    * @method ionViewWillEnter
    * @return {None}
    */
   ionViewWillEnter() : void
   {
      this.resetFields();

      if(this.NP.get("record"))
      {
         this.isEdited      = true;
         this.selectEntry(this.NP.get("record"));
         this.pageTitle     = 'Ver equipo';
      }
      else
      {
         this.isEdited      = false;
         this.pageTitle     = 'Crear equipo';
      }
   }




   /**
    * Assign the navigation retrieved data to properties
    * used as models on the page's HTML form
    *
    * @public
    * @method selectEntry
    * @param item 		{any} 			Navigation data
    * @return {None}
    */
   selectEntry(item : any) : void
   {
      this.technologyName        = item.name;
      this.technologyDescription = item.description;
      this.recordID              = item.id;
   }




   /**
    * Save a new record that has been added to the page's HTML form
    * Use angular's http post method to submit the record data
    *
    * @public
    * @method createEntry
    * @param name 			{String} 			Name value from form field
    * @param description 	{String} 			Description value from form field
    * @return {None}
    */
   createEntry(name : string, description : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "create", "name" : name, "description" : description },
          url       : any      	= this.baseURI + "manage-data.php";

      this.http.post(url, JSON.stringify(options), headers)
      
      .subscribe((data : any) =>
      {
         // If the request was successful notify the user
         this.hideForm   = true;
         this.sendNotification(`Felicidades el equipo: ${name} fue creado exitosamente`);
      },
      (error : any) =>
      {
         this.sendNotification('Algo fue mal!' + JSON.stringify(options));
      });
   }




   /**
    * Update an existing record that has been edited in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method updateEntry
    * @param name 			{String} 			Name value from form field
    * @param description 	{String} 			Description value from form field
    * @return {None}
    */
   updateEntry(name : string, description : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "update", "name" : name, "description" : description, "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         this.hideForm  =  true;
         this.sendNotification(`Felicidades el equipo: ${name} fue actualizado exitosamente`);
      },
      (error : any) =>
      {
         this.sendNotification('Algo fue mal!');
      });
   }




   /**
    * Remove an existing record that has been selected in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method deleteEntry
    * @return {None}
    */
   deleteEntry() : void
   {
      let name      : string 	= this.form.controls["name"].value,
          headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "delete", "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         this.hideForm     = true;
         this.sendNotification(`Congratulations the technology: ${name} was successfully deleted`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
   }




   /**
    * Handle data submitted from the page's HTML form
    * Determine whether we are adding a new record or amending an
    * existing record
    *
    * @public
    * @method saveEntry
    * @return {None}
    */
   saveEntry() : void
   {
      let name          : string = this.form.controls["name"].value,
          description   : string    = this.form.controls["description"].value;

      if(this.isEdited)
      {
         this.updateEntry(name, description);
      }
      else
      {
         this.createEntry(name, description);
      }
   }




   /**
    * Clear values in the page's HTML form fields
    *
    * @public
    * @method resetFields
    * @return {None}
    */
   resetFields() : void
   {
      this.technologyName           = "";
      this.technologyDescription    = "";
   }




   /**
    * Manage notifying the user of the outcome of remote operations
    *
    * @public
    * @method sendNotification
    * @param message 	{String} 			Message to be displayed in the notification
    * @return {None}
    */
   sendNotification(message : string)  : void
   {
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }



}