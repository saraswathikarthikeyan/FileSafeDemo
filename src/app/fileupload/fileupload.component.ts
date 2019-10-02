import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadserviceService } from '../services/uploadservice.service';
import { fromEvent, Observable, Subscription, } from 'rxjs';
import { AutologoutService } from '../services/autologout.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  uploadFG: FormGroup;
  errorMessage: string;
  show: true;
  subscription: Subscription;

  //To retrieve the input file control 
  @ViewChild('uploadfile', { static: false }) uUpload: ElementRef;

  
  fileSave: any;
  cacheM: Map<string, File> = new Map<string, File>();//to store the upload file info
  showText: any;

  constructor(private uploadFB: FormBuilder, private uploadService: UploadserviceService, 
    private autoLogout :AutologoutService) {
  }

  ngOnInit() {

    //Creates the form
    this.createUploadForm();

    //get the form control
    const form = document.getElementById('uploadForm');

    //retrieving uploaded file details from session storage during page Refersh.
    let cacheSessionName = JSON.stringify(sessionStorage.getItem('token'));
    if(sessionStorage.getItem(cacheSessionName) !== "") {
      this.cacheM =   new Map(JSON.parse(sessionStorage.getItem(cacheSessionName)));
    }

    //Created Observable and subscribed for form submit event
    this.subscription = fromEvent(form, 'submit').subscribe((event) => {

      //On form submit the file deails is save to Map(filename, file)
      if (this.fileSave) {
        this.cacheM.set(this.fileSave.name, this.fileSave);
        //this.cacheM.forEach((key, value) => { console.log('key:' + key, 'value:' + value) });
        this.fileSave ="";

        //Stores the Map in Session 
        if(this.cacheM.size>0) {
          sessionStorage.setItem(JSON.stringify(sessionStorage.getItem('token')), 
            JSON.stringify(Array.from(this.cacheM.entries())));
          }
      }

    });

  }

  //Creates the upload form
  createUploadForm(): void {
    this.uploadFG = this.uploadFB.group({
      uploadfile: ['', [Validators.required]]
    });
  }

  //On file change stores the file
  onFileChange(event):void {  
    if (event.target.files.length > 0) {
      this.fileSave = event.target.files[0];//sets the file value to the upload form/uploadfile model
      this.uploadFG.get('uploadfile').setValue(this.fileSave);
      //console.log('test', this.fileSave);
    }
  }


  onUploadSubmit():void {

    if (this.uploadFG.valid) {

      //resets the logout timer.
      this.autoLogout.reset();

      this.errorMessage ="";

      //appends the file to the form data to send trhough http post
      const formData = new FormData();
      formData.append('file', this.uploadFG.get('uploadfile').value);
      
      //code to send file to backend
     /* let response = this.uploadService.upload(formData).subscribe(result => console.log(result),
      errMess => { this.errorMessage= <any>errMess;} );*/

      //resets the value of the control
      this.uploadFG.reset(
        { uploadfile: [' '] }
      );
      this.uUpload.nativeElement.value = null;

    }
    else {
      this.errorMessage = "Incorrect file type!";
    }
  }

}
